import { Service } from "typedi";

import { AppDataSource } from "../../../db/data-source";
import { User } from "../../user/entity/user.entity";
import { ROLES } from "../../../common/constants/roles.constants";

@Service()
export class AdminDashboardRepository {
  private readonly repo = AppDataSource.getRepository(User);

  public async getMemberRegistrationsLast30Days(): Promise<
    { date: string; count: string }[]
  > {
    return await this.repo
      .createQueryBuilder("user")
      .select("DATE(user.createdAt)", "date")
      .addSelect("COUNT(user.id)", "count")
      .where("user.role = :role", { role: ROLES.MEMBER })
      .andWhere("user.createdAt >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)") //30days interval
      .groupBy("DATE(user.createdAt)") //group memebers by date
      .orderBy("date", "ASC")
      .getRawMany();
  }
}
