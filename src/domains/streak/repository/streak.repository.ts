import { Service } from "typedi";
import { AppDataSource } from "../../../db/data-source";
import { Streak } from "../entity/streak.entity";

@Service()
export class StreakRepository {
  private readonly repo = AppDataSource.getRepository(Streak);
  public async findByUserId(userId: number): Promise<Streak | null> {
    return this.repo.findOne({
      where: { user: { id: userId } },
    });
  }
  public async create(userId: number): Promise<Streak> {
    const streak = this.repo.create({
      currentStreak: 1,
      longestStreak: 1,
      lastLoggedDate: new Date().toISOString().split("T")[0],
      user: { id: userId } as never,
    });
    return this.repo.save(streak);
  }

  public async update(id: number, data: Partial<Streak>): Promise<void> {
    await this.repo.update(id, data);
  }
}
