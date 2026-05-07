import { Service } from "typedi";
import { AppDataSource } from "../../../db/data-source";
import { Vital } from "../entity/vital.entity";
import { VitalTypeValue } from "../../../common/constants/vital.constant";

@Service()
export class VitalRepository {
  private readonly repo = AppDataSource.getRepository(Vital);

  public async findById(id: number): Promise<Vital | null> {
    return this.repo.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  public async findByUserAndId(
    userId: number,
    id: number,
  ): Promise<Vital | null> {
    return this.repo.findOne({
      where: { id, user: { id: userId } },
    });
  }

  public async findDuplicate(
    userId: number,
    vitalType: VitalTypeValue,
    loggedDate: string,
  ): Promise<Vital | null> {
    return this.repo.findOne({
      where: {
        user: { id: userId },
        vitalType,
        loggedDate,
      },
    });
  }

  public async findAllByUser(
    userId: number,
    filters: {
      vitalType?: VitalTypeValue;
      from?: string;
      to?: string;
      page: number;
      limit: number;
    },
  ): Promise<[Vital[], number]> {
    const qb = this.repo
      .createQueryBuilder("vital")
      .where("vital.userId = :userId", { userId })
      .orderBy("vital.loggedDate", "DESC")
      .addOrderBy("vital.createdAt", "DESC");

    if (filters.vitalType) {
      qb.andWhere("vital.vitalType = :vitalType", {
        vitalType: filters.vitalType,
      });
    }

    if (filters.from) {
      qb.andWhere("vital.loggedDate >= :from", { from: filters.from });
    }

    if (filters.to) {
      qb.andWhere("vital.loggedDate <= :to", { to: filters.to });
    }

    const offset = (filters.page - 1) * filters.limit;
    qb.skip(offset).take(filters.limit);

    return qb.getManyAndCount();
  }

  public async create(data: Partial<Vital>): Promise<Vital> {
    const vital = this.repo.create(data);
    return this.repo.save(vital);
  }

  public async update(id: number, data: Partial<Vital>): Promise<Vital> {
    await this.repo.update(id, data);
    return this.repo.findOneOrFail({ where: { id } });
  }

  public async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}