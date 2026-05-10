import { UserRepository } from "./../../user/repository/user.repository";
import { Service } from "typedi";
import { FlagRepository } from "../repository/flag.repository";
import { Vital } from "../../vital/entity/vital.entity";
import { User } from "../../user/entity/user.entity";
import {
  FLAG_SOURCE,
  FLAG_STATUS,
  FLAG_SEVERITY,
  FlagSeverityType,
} from "../../../common/constants/flag.constant";
import {
  RANGE_STATUS,
  RangeStatusType,
} from "../../../common/constants/vital.constant";
import { NotFoundException } from "../../../common/exceptions";
import { CreateManualFlagRequestDto } from "../dto/flag.dto";
import { VitalRepository } from "../../vital/repository/vital.repository";
import { CreateFlagResponseDto } from "../dto/flag.dto";
import { ResolveFlagRequestDto, ResolveFlagResponseDto } from "../dto/flag.dto";
import { GetFlagsRequestDto } from "../dto/flag.dto";
import { GetFlagsResponseDto } from "../dto/flag.dto";
@Service()
export class FlagService {
  constructor(
    private readonly flagRepository: FlagRepository,
    private readonly userRepository: UserRepository,
    private readonly vitalRepository: VitalRepository,
  ) {}

  public async createSystemFlag(
    user: User,
    vital: Vital,
    status: RangeStatusType,
  ): Promise<void> {
    const severity = this.mapStatusToSeverity(status);
    const reason = this.generateReason(vital, status);

    await this.flagRepository.create({
      source: FLAG_SOURCE.SYSTEM,
      reason,
      category: vital.vitalType,
      severity,
      status: FLAG_STATUS.OPEN,
      user,
      sourceVital: vital,
    });
  }

  private mapStatusToSeverity(status: RangeStatusType): FlagSeverityType {
    const map: Record<string, FlagSeverityType> = {
      [RANGE_STATUS.WARNING]: FLAG_SEVERITY.MEDIUM,
      [RANGE_STATUS.CRITICAL]: FLAG_SEVERITY.HIGH,
    };
    return map[status];
  }

  private generateReason(vital: Vital, status: RangeStatusType): string {
    if (vital.systolicValue && vital.diastolicValue) {
      return `Blood pressure reading of ${vital.systolicValue}/${vital.diastolicValue} mmHg is ${status.toLowerCase()}.`;
    }
    return `${vital.vitalType.replace(/_/g, " ")} reading of ${vital.value} ${vital.unit ?? ""} is ${status.toLowerCase()}.`;
  }

  //create manual flag
  public async createManualFlag(
    data: CreateManualFlagRequestDto,
  ): Promise<CreateFlagResponseDto> {
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    let sourceVital = null;
    if (data.sourceVitalId) {
      sourceVital = await this.vitalRepository.findById(data.sourceVitalId);
    }
    if (data.sourceVitalId && !sourceVital) {
      throw new NotFoundException("Source vital not found");
    }
    const flag = await this.flagRepository.create({
      source: FLAG_SOURCE.MANUAL,
      reason: data.reason,
      category: data.category,
      severity: data.severity,
      status: FLAG_STATUS.OPEN,
      user,
      sourceVital: sourceVital || undefined,
    });

    return {
      id: flag.id,
      source: flag.source,
      reason: flag.reason,
      category: flag.category || null,
      severity: flag.severity,
      status: flag.status,
      resolutionNote: flag.resolutionNote || null,
      resolvedAt: flag.resolvedAt || null,
      createdAt: flag.createdAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      sourceVital: sourceVital //source vital present then return or null
        ? {
            id: sourceVital.id,
            vitalType: sourceVital.vitalType,
            value: sourceVital.value || null,
            systolicValue: sourceVital.systolicValue || null,
            diastolicValue: sourceVital.diastolicValue || null,
            unit: sourceVital.unit || null,
            status: sourceVital.status,
            loggedDate: sourceVital.loggedDate,
          }
        : null,
    };
  }

  //resolve flag(flag id,staff id,note)
  public async resolveFlag(
    flagId: number,
    staffId: number,
    data: ResolveFlagRequestDto,
  ): Promise<ResolveFlagResponseDto> {
    const flag = await this.flagRepository.findById(flagId);

    if (!flag) {
      throw new NotFoundException("Flag not found");
    }
    const staff = await this.userRepository.findById(staffId);

    if (!staff) {
      throw new NotFoundException("Staff not found");
    }
    const updatedFlag = await this.flagRepository.update(flagId, {
      status: FLAG_STATUS.RESOLVED,
      resolutionNote: data.resolutionNote,
      resolvedAt: new Date(),
      resolvedBy: staff,
    });
    //return flag id ,staff info,resolve status,note
    return {
      id: updatedFlag.id,
      status: updatedFlag.status,
      resolutionNote: updatedFlag.resolutionNote || "",
      resolvedAt: updatedFlag.resolvedAt as Date,
      resolvedBy: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
      },
    };
  }

  public async getFlags(
    query: GetFlagsRequestDto,
  ): Promise<GetFlagsResponseDto> {
    const page = query.page;
    const limit = query.limit;
    const status = query.status;
    const [flags, total] = await this.flagRepository.findAllPaginated({
      page,
      limit,
      status,
      search: query.search,
    });

    return {
      flags: flags.map((flag) => ({
        id: flag.id,
        source: flag.source,
        reason: flag.reason,
        category: flag.category || null,
        severity: flag.severity,
        status: flag.status,
        createdAt: flag.createdAt,
        resolvedAt: flag.resolvedAt || null,

        user: {
          id: flag.user.id,
          name: flag.user.name,
          email: flag.user.email,
        },

        resolvedBy: flag.resolvedBy
          ? {
              id: flag.resolvedBy.id,
              name: flag.resolvedBy.name,
              email: flag.resolvedBy.email,
            }
          : null,
      })),

      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
