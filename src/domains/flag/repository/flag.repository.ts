import { Service } from "typedi";
import { AppDataSource } from "../../../db/data-source";
import { Flag } from "../entity/flag.entity";

@Service()
export class FlagRepository {
  private readonly repo = AppDataSource.getRepository(Flag);

  public async create(data: Partial<Flag>): Promise<Flag> {
    const flag = this.repo.create(data);
    return this.repo.save(flag);
  }
}
