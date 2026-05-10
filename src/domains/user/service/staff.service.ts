import { Service } from "typedi";
import { StaffRepository } from "../repository/staff.repository";

import {
  GetStaffMembersRequestDto,
  GetStaffMembersResponseDto,
} from "../dto/staff.dto";
import { StaffMemberDashboardResponseDto } from "../dto/staff.dto";
import { FlagRepository } from "../../flag/repository/flag.repository";
import { VitalService } from "../../vital/service/vital.service";
import { StreakService } from "../../streak/service/streak.service";
import { NotFoundException } from "../../../common/exceptions";
@Service()
export class StaffService {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly flagRepository: FlagRepository,
    private readonly streakService: StreakService,
    private readonly vitalService: VitalService,
  ) {}

  public async getActiveMembers(
    query: GetStaffMembersRequestDto,
  ): Promise<GetStaffMembersResponseDto> {
    const page = query.page;
    const limit = query.limit;

    const [members, total] = await this.staffRepository.findActiveMembers({
      page,
      limit,
      search: query.search,
    });

    return {
      members: members.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        isActive: member.isActive,
        createdAt: member.createdAt,

        profile: member.profile
          ? {
              age: member.profile.age || null,
              gender: member.profile.gender || null,
              height: member.profile.height || null,
              weight: member.profile.weight || null,
              profileImageUrl: member.profile.profileImageUrl || null,
            }
          : null,
      })),

      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getMemberDashboard(
    memberId: number,
    page: number,
    limit: number,
  ): Promise<StaffMemberDashboardResponseDto> {
    const member = await this.staffRepository.findMemberById(memberId);

    if (!member) {
      throw new NotFoundException("Member not found");
    }

    const vitals = await this.vitalService.getVitalsByUserId(
      memberId,
      page,
      limit,
    );

    const streak = await this.streakService.getStreak(memberId);

    const activeFlags =
      await this.flagRepository.findOpenFlagsByUserId(memberId);

    return {
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        isActive: member.isActive,
      },

      profile: member.profile
        ? {
            age: member.profile.age || null,
            gender: member.profile.gender || null,
            height: member.profile.height || null,
            weight: member.profile.weight || null,
            medicalConditions: member.profile.medicalConditions || null,
            fitnessGoal: member.profile.fitnessGoal || null,
            profileImageUrl: member.profile.profileImageUrl || null,
          }
        : null,

      vitals,

      streak,

      activeFlags: activeFlags.map((flag) => ({
        id: flag.id,
        reason: flag.reason,
        category: flag.category || null,
        severity: flag.severity,
        source: flag.source,
        createdAt: flag.createdAt,
      })),
    };
  }
}
