import { Service } from "typedi";
import { StaffRepository } from "../repository/staff.repository";

import {
  GetStaffMembersRequestDto,
  GetStaffMembersResponseDto,
} from "../dto/staff.dto";

@Service()
export class StaffService {
  constructor(private readonly staffRepository: StaffRepository) {}

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
}
