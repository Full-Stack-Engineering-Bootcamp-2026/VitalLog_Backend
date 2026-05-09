import { Service } from "typedi";
import { AppDataSource } from "../../../db/data-source";
import { Flag } from "../entity/flag.entity";

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
}
