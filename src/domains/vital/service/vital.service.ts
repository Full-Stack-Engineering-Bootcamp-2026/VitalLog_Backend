import { Service } from "typedi";
import { VitalRepository } from "../repository/vital.repository";
import { FlagService } from "../../flag/service/flag.service";
import { UpdateVitalRequestDto } from "../dto/vital.dto";
import { NotFoundException } from "../../../common/exceptions/not-found.exception";
import {
  CreateVitalRequestDto,
  VitalQueryDto,
  VitalResponseDto,
  PaginatedVitalsResponseDto,
} from "../dto/vital.dto";
import {
  VITAL_TYPE,
  VITAL_RANGES,
  RANGE_STATUS,
  RangeStatusType,
} from "../../../common/constants/vital.constant";
import { BadRequestException } from "../../../common/exceptions/bad-request.exception";
import { Vital } from "../entity/vital.entity";
import { User } from "../../user/entity/user.entity";

@Service()
export class VitalService {
  constructor(
    private readonly vitalRepository: VitalRepository,
    private readonly flagService: FlagService,
  ) {}

  private formatDate(date: string): string {
    return new Date(date).toISOString().split("T")[0];
  }
  //Create Vitals
  public async createVital(
    //takes full user object not just id, as createSystemFlag() will need full user
    user: User,
    data: CreateVitalRequestDto,
  ): Promise<VitalResponseDto> {
    // 1. Duplicate check
    const duplicate = await this.vitalRepository.findDuplicate(
      user.id,
      data.vitalType,
      data.loggedDate,
    );

    if (duplicate) {
      throw new BadRequestException(
        `You have already logged ${data.vitalType} for ${data.loggedDate}.`,
      );
    }

    // 2. Calculate status
    const status = this.calculateVitalStatus(data);

    // 3. Resolve unit
    const unit = this.resolveUnit(data.vitalType);

    // 4. Save vital
    const vital = await this.vitalRepository.create({
      vitalType: data.vitalType,
      value: data.value,
      systolicValue: data.systolicValue,
      diastolicValue: data.diastolicValue,
      unit,
      status,
      loggedDate: this.formatDate(data.loggedDate),
      user,
    });

    // 5. If WARNING or CRITICAL → create system flag
    if (status !== RANGE_STATUS.NORMAL) {
      await this.flagService.createSystemFlag(user, vital, status);
    }

    return this.toResponseDto(vital);
  }

  // Get My Vitals

  public async getMyVitals(
    userId: number,
    query: VitalQueryDto,
  ): Promise<PaginatedVitalsResponseDto> {
    const page = parseInt(query.page ?? "1", 10);
    const limit = parseInt(query.limit ?? "10", 10);

    const [vitals, total] = await this.vitalRepository.findAllByUser(userId, {
      vitalType: query.vitalType,
      from: query.from,
      to: query.to,
      page,
      limit,
    });

    return {
      data: vitals.map(this.toResponseDto),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async updateVital(
    user: User,
    vitalId: number,
    data: UpdateVitalRequestDto,
  ): Promise<VitalResponseDto> {
    // 1. Find vital — must belong to this user
    const vital = await this.vitalRepository.findByUserAndId(user.id, vitalId);

    if (!vital) {
      throw new NotFoundException("Vital entry not found.");
    }

    // 2. Merge new values with existing values
    const mergedData: CreateVitalRequestDto = {
      vitalType: vital.vitalType,
      loggedDate: vital.loggedDate,
      value: data.value ?? vital.value,
      systolicValue: data.systolicValue ?? vital.systolicValue,
      diastolicValue: data.diastolicValue ?? vital.diastolicValue,
    };

    // 3. Recalculate status with merged values
    const status = this.calculateVitalStatus(mergedData);

    // 4. Update vital
    const updated = await this.vitalRepository.update(vitalId, {
      value: mergedData.value,
      systolicValue: mergedData.systolicValue,
      diastolicValue: mergedData.diastolicValue,
      status,
    });

    // 5. If WARNING or CRITICAL → create system flag
    if (status !== RANGE_STATUS.NORMAL) {
      await this.flagService.createSystemFlag(user, updated, status);
    }

    return this.toResponseDto(updated);
  }

  public async deleteVital(userId: number, vitalId: number): Promise<void> {
    const vital = await this.vitalRepository.findByUserAndId(userId, vitalId);

    if (!vital) {
      throw new NotFoundException("Vital entry not found.");
    }

    await this.vitalRepository.delete(vitalId);
  }

  // Private: Calculate Status
  private calculateVitalStatus(data: CreateVitalRequestDto): RangeStatusType {
    switch (data.vitalType) {
      case VITAL_TYPE.BLOOD_PRESSURE:
        return this.assessBloodPressure(
          data.systolicValue!,
          data.diastolicValue!,
        );

      case VITAL_TYPE.HEART_RATE:
        return this.assessSingleValue(
          data.value!,
          VITAL_RANGES[VITAL_TYPE.HEART_RATE],
        );

      case VITAL_TYPE.BLOOD_GLUCOSE:
        return this.assessSingleValue(
          data.value!,
          VITAL_RANGES[VITAL_TYPE.BLOOD_GLUCOSE],
        );

      case VITAL_TYPE.WEIGHT:
        return this.assessSingleValue(
          data.value!,
          VITAL_RANGES[VITAL_TYPE.WEIGHT],
        );

      case VITAL_TYPE.SLEEP:
        return this.assessSingleValue(
          data.value!,
          VITAL_RANGES[VITAL_TYPE.SLEEP],
        );

      default:
        return RANGE_STATUS.NORMAL;
    }
  }

  // Private: Assess Single Value

  private assessSingleValue(
    value: number,
    ranges: {
      normal: { min: number; max: number };
      borderline: { min: number; max: number };
      critical: { min: number; max: number };
    },
  ): RangeStatusType {
    if (value >= ranges.normal.min && value <= ranges.normal.max) {
      return RANGE_STATUS.NORMAL;
    }

    if (value >= ranges.borderline.min && value <= ranges.borderline.max) {
      return RANGE_STATUS.WARNING;
    }

    if (value >= ranges.critical.min && value <= ranges.critical.max) {
      return RANGE_STATUS.CRITICAL;
    }

    // Beyond critical band
    return RANGE_STATUS.CRITICAL;
  }

  // Private: Assess Blood Pressure

  private assessBloodPressure(
    systolic: number,
    diastolic: number,
  ): RangeStatusType {
    const systolicStatus = this.assessSingleValue(
      systolic,
      VITAL_RANGES[VITAL_TYPE.BLOOD_PRESSURE].systolic,
    );

    const diastolicStatus = this.assessSingleValue(
      diastolic,
      VITAL_RANGES[VITAL_TYPE.BLOOD_PRESSURE].diastolic,
    );

    // Take the worse of the two
    const rank: Record<RangeStatusType, number> = {
      [RANGE_STATUS.NORMAL]: 0,
      [RANGE_STATUS.WARNING]: 1,
      [RANGE_STATUS.CRITICAL]: 2,
    };

    return rank[systolicStatus] >= rank[diastolicStatus]
      ? systolicStatus
      : diastolicStatus;
  }

  // Private: Resolve Unit

  private resolveUnit(vitalType: string): string {
    const units: Record<string, string> = {
      [VITAL_TYPE.HEART_RATE]: "bpm",
      [VITAL_TYPE.BLOOD_PRESSURE]: "mmHg",
      [VITAL_TYPE.BLOOD_GLUCOSE]: "mg/dL",
      [VITAL_TYPE.WEIGHT]: "kg",
      [VITAL_TYPE.SLEEP]: "hours",
    };
    return units[vitalType];
  }

  //  Private: Mapper

  private toResponseDto(vital: Vital): VitalResponseDto {
    return {
      id: vital.id,
      vitalType: vital.vitalType,
      value: vital.value,
      systolicValue: vital.systolicValue,
      diastolicValue: vital.diastolicValue,
      unit: vital.unit,
      status: vital.status,
      loggedDate: vital.loggedDate,
      createdAt: vital.createdAt,
      updatedAt: vital.updatedAt,
    };
  }
}
