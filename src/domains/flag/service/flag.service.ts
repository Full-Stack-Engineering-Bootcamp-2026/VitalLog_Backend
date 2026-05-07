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

@Service()
export class FlagService {
  constructor(private readonly flagRepository: FlagRepository) {}

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
}
