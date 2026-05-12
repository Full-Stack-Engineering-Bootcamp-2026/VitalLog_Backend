import { Service } from "typedi";

import { AppDataSource } from "../../../db/data-source";
import { User } from "../../user/entity/user.entity";
import { ROLES } from "../../../common/constants/roles.constants";
import { Flag } from "../../flag/entity/flag.entity";
@Service()
export class AdminDashboardRepository {
  private readonly userRepo = AppDataSource.getRepository(User);
  private readonly flagRepo = AppDataSource.getRepository(Flag);

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

  //joined flags table with vitals table
  public async getFlaggedVitalsDistribution(): Promise<
    { vitalType: string; count: string }[]
  > {
    return await this.flagRepo
      .createQueryBuilder("flag")
      .leftJoin("flag.sourceVital", "vital") //flag.sourceVitalId = vital.id
      .select("vital.vitalType", "vitalType") //join coz we required vital type which isnt in flags table
      .addSelect("COUNT(flag.id)", "count")
      .where("flag.sourceVital IS NOT NULL")
      .groupBy("vital.vitalType")
      .orderBy("count", "DESC")
      .limit(5) //we want top 5
      .getRawMany();
  }

  public async getAllStaff(): Promise<User[]> {
    return await this.repo.find({
      where: {
        role: ROLES.STAFF,
        isActive: true, // only active staff (kinda filter )
      },
      order: { createdAt: "DESC" },
    });
  }
}
