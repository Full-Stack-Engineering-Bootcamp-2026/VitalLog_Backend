import { Service } from "typedi";
import { AppDataSource } from "../../../db/data-source";
import { Flag } from "../entity/flag.entity";
import { FlagStatusType } from "../../../common/constants/flag.constant";
@Service()
export class FlagRepository {
  private readonly repo = AppDataSource.getRepository(Flag);

  public async create(data: Partial<Flag>): Promise<Flag> {
    const flag = this.repo.create(data);
    return await this.repo.save(flag);
  }

  public async findById(id: number): Promise<Flag | null> {
    //returns flag obj or null
    return this.repo.findOne({
      where: { id },
      relations: ["user", "resolvedBy", "sourceVital"],
    });
  }

  public async update(id: number, data: Partial<Flag>): Promise<Flag> {
    await this.repo.update(id, data);
    //returns flag obj
    return await this.repo.findOneOrFail({
      where: { id },
      relations: ["user", "resolvedBy", "sourceVital"],
    });
  }
  //take page ,limit,status=>OPEN/RESOLVED & return current page data $ total cnt
  public async findAllPaginated(filters: {
    page: number;
    limit: number;
    status?: FlagStatusType;
    search?: string;
  }): Promise<[Flag[], number]> {
    const qb = this.repo
      .createQueryBuilder("flag") //SELECT * FROM flags flag
      .leftJoinAndSelect("flag.user", "user")
      .leftJoinAndSelect("flag.resolvedBy", "resolvedBy")
      .leftJoinAndSelect("flag.sourceVital", "sourceVital")
      .orderBy("flag.createdAt", "DESC"); //ORDER BY createdAt DESC

    if (filters.status) {
      //WHERE flag.status = 'OPEN'
      qb.andWhere("flag.status = :status", {
        status: filters.status,
      });
    }
    if (filters.search) {
      qb.andWhere(
        "(user.name LIKE :search OR user.email LIKE :search OR flag.reason LIKE :search)",
        {
          search: `%${filters.search}%`,
        },
      );
    }

    const offset = (filters.page - 1) * filters.limit;
    qb.skip(offset).take(filters.limit); //LIMIT OFFSET
    return await qb.getManyAndCount(); //getMany=>only rows , getCount=>cnt
  }
}
