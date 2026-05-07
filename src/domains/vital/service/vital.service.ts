import { Service } from "typedi";
import { VitalRepository } from "../repository/vital.repository";
import { FlagRepository } from "../../flag/repository/flag.repository";
import {
  CreateVitalRequestDto,
  UpdateVitalRequestDto,
  VitalQueryDto,
  VitalResponseDto,
  PaginatedVitalsResponseDto,
} from "../dto/vital.dto";
import { assessVital, resolveUnit } from "../helper/vital-range.helper";
import {
  RANGE_STATUS,
  VITAL_TYPE,
} from "../../../common/constants/vital.constant";
import {
  FLAG_SOURCE,
  FLAG_STATUS,
} from "../../../common/constants/flag.constant";
import { NotFoundException } from "../../../common/exceptions/not-found.exception";
import { BadRequestException } from "../../../common/exceptions/bad-request.exception";
import { ForbiddenException } from "../../../common/exceptions/forbidden.exception";
import { Vital } from "../entity/vital.entity";

@Service()
export class VitalService {
  constructor(
    private readonly vitalRepository: VitalRepository,
    private readonly flagRepository: FlagRepository,
  ) {}

  // Create 

  public async create(
    userId: number,
    data: CreateVitalRequestDto,
  ): Promise<VitalResponseDto> {
    // Duplicate check: same user + vitalType + date
    const duplicate = await this.vitalRepository.findDuplicate(
      userId,
      data.vitalType,
      data.loggedDate,
    );

    if (duplicate) {
      throw new BadRequestException(
        `You have already logged ${data.vitalType} for ${data.loggedDate}.`,
      );
    }

    // Assess status and severity
    const { status, severity } = assessVital(
      data.vitalType,
      data.value,
      data.systolicValue,
      data.diastolicValue,
    );

    const unit = resolveUnit(data.vitalType);

    // Save vital
    const vital = await this.vitalRepository.create({
      vitalType: data.vitalType,
      value: data.value,
      systolicValue: data.systolicValue,
      diastolicValue: data.diastolicValue,
      unit,
      status,
      loggedDate: data.loggedDate,
      user: { id: userId } as never,
    });

    // Auto-create system flag if WARNING or CRITICAL
    if (status !== RANGE_STATUS.NORMAL && severity !== null) {
      await this.flagRepository.create({
        source: FLAG_SOURCE.SYSTEM,
        reason: buildFlagReason(data.vitalType, status, data),
        category: data.vitalType,
        severity,
        status: FLAG_STATUS.OPEN,
        user: { id: userId } as never,
        sourceVital: { id: vital.id } as never,
      });
    }

    return toVitalResponseDto(vital);
  }

  //  Get All (member's own) 

  public async findAll(
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
      data: vitals.map(toVitalResponseDto),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Update 
  public async update(
    userId: number,
    vitalId: number,
    data: UpdateVitalRequestDto,
  ): Promise<VitalResponseDto> {
    const vital = await this.vitalRepository.findByUserAndId(userId, vitalId);

    if (!vital) {
      throw new NotFoundException("Vital entry not found.");
    }

    // Only owner can update
    if (vital.user.id !== userId) {
      throw new ForbiddenException("You do not have access to this vital.");
    }

    // Recalculate with merged values
    const newValue = data.value ?? vital.value;
    const newSystolicValue = data.systolicValue ?? vital.systolicValue;
    const newDiastolicValue = data.diastolicValue ?? vital.diastolicValue;

    const { status, severity } = assessVital(
      vital.vitalType,
      newValue,
      newSystolicValue,
      newDiastolicValue,
    );

    const updated = await this.vitalRepository.update(vitalId, {
      value: newValue,
      systolicValue: newSystolicValue,
      diastolicValue: newDiastolicValue,
      status,
    });

    // Sync system flag based on new status
    await this.syncSystemFlag(
      userId,
      vitalId,
      vital.vitalType,
      status,
      severity,
      {
        value: newValue,
        systolicValue: newSystolicValue,
        diastolicValue: newDiastolicValue,
      },
    );

    return toVitalResponseDto(updated);
  }

  // Delete
  public async delete(userId: number, vitalId: number): Promise<void> {
    const vital = await this.vitalRepository.findByUserAndId(userId, vitalId);

    if (!vital) {
      throw new NotFoundException("Vital entry not found.");
    }

    if (vital.user.id !== userId) {
      throw new ForbiddenException("You do not have access to this vital.");
    }

    await this.vitalRepository.delete(vitalId);
    // FK ON DELETE SET NULL handles sourceVitalId in flags automatically
  }

  //  Private: sync system flag on update

  private async syncSystemFlag(
    userId: number,
    vitalId: number,
    vitalType: string,
    status: string,
    severity: string | null,
    values: { value?: number; systolicValue?: number; diastolicValue?: number },
  ): Promise<void> {
    const existingFlag =
      await this.flagRepository.findOpenSystemFlagByVital(vitalId);

    if (status === RANGE_STATUS.NORMAL) {
      // If vital is now normal, resolve any existing system flag
      if (existingFlag) {
        await this.flagRepository.update(existingFlag.id, {
          status: FLAG_STATUS.RESOLVED,
          resolutionNote: "Auto-resolved: vital returned to normal range.",
          resolvedAt: new Date(),
        });
      }
      return;
    }

    // Status is WARNING or CRITICAL
    if (existingFlag) {
      // Update existing flag severity if changed
      await this.flagRepository.update(existingFlag.id, {
        severity: severity as never,
        reason: buildFlagReason(vitalType as never, status as never, values),
      });
    } else {
      // Create new flag
      await this.flagRepository.create({
        source: FLAG_SOURCE.SYSTEM,
        reason: buildFlagReason(vitalType as never, status as never, values),
        category: vitalType,
        severity: severity as never,
        status: FLAG_STATUS.OPEN,
        user: { id: userId } as never,
        sourceVital: { id: vitalId } as never,
      });
    }
  }
}

//  Mappers 

function toVitalResponseDto(vital: Vital): VitalResponseDto {
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

function buildFlagReason(
  vitalType: string,
  status: string,
  values: { value?: number; systolicValue?: number; diastolicValue?: number },
): string {
  if (vitalType === VITAL_TYPE.BLOOD_PRESSURE) {
    return `Blood pressure reading (${values.systolicValue}/${values.diastolicValue} mmHg) is ${status.toLowerCase()}.`;
  }
  return `${vitalType.replace(/_/g, " ")} reading of ${values.value} is ${status.toLowerCase()}.`;
}
