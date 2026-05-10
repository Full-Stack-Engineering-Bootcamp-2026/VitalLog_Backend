import { Service } from "typedi";
import { AppDataSource } from "../../../db/data-source";
import { User } from "../../user/entity/user.entity";
import { ROLES } from "../../../common/constants/roles.constants";

@Service()
export class StaffRepository {
  private readonly repo = AppDataSource.getRepository(User);

  public async findActiveMembers(filters: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<[User[], number]> {
    const qb = this.repo
      .createQueryBuilder("user") //query to get user data with profile data
      .leftJoinAndSelect("user.profile", "profile")
      .where("user.role = :role", { role: ROLES.MEMBER }) //role member
      .andWhere("user.isActive = :isActive", { isActive: true }) //active true
      .orderBy("user.createdAt", "DESC");

    if (filters.search) {
      qb.andWhere("(user.name LIKE :search OR user.email LIKE :search)", {
        search: `%${filters.search}%`,
      });
    }

    const offset = (filters.page - 1) * filters.limit;
    qb.skip(offset).take(filters.limit);
    return await qb.getManyAndCount();
  }
}
