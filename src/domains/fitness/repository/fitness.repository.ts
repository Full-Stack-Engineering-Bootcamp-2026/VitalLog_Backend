import { Service } from "typedi";
import { AppDataSource } from "../../../db/data-source";
import { FitnessLog } from "../entity/fitness.entity";

@Service()
export class FitnessRepository {
  private readonly repo = AppDataSource.getRepository(FitnessLog);

  public async create(data: Partial<FitnessLog>): Promise<FitnessLog> {
    const log = this.repo.create(data);
    return this.repo.save(log);
  }

  public async findByUserAndId(
    userId: number,
    logId: number,
  ): Promise<FitnessLog | null> {
    return this.repo.findOne({
      where: {
        id: logId,
        user: { id: userId },
      },
    });
  }

  public async findAllByUser(
    userId: number,
    filters: {
      activityType?: string;
      from?: string;
      to?: string;
      page: number;
      limit: number;
    },
  ): Promise<[FitnessLog[], number]> {
    const qb = this.repo
      .createQueryBuilder("log")
      .where("log.userId = :userId", { userId })
      .orderBy("log.date", "DESC")
      .addOrderBy("log.createdAt", "DESC");
    if (filters.activityType) {
      qb.andWhere("log.activityType = :activityType", {
        activityType: filters.activityType,
      });
    }
    if (filters.from) {
      qb.andWhere("log.date >= :from", { from: filters.from });
    }
    if (filters.to) {
      qb.andWhere("log.date <= :to", { to: filters.to });
    }
    const offset = (filters.page - 1) * filters.limit;
    qb.skip(offset).take(filters.limit);

    return qb.getManyAndCount();
  }
  public async update(
    id: number,
    data: Partial<FitnessLog>,
  ): Promise<FitnessLog> {
    await this.repo.update(id, data);
    return this.repo.findOneOrFail({ where: { id } });
  }
  public async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
