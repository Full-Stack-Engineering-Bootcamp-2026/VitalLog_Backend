import { Service } from "typedi";
import { StreakRepository } from "../repository/streak.repository";

@Service()
export class StreakService {
  constructor(private readonly streakRepository: StreakRepository) {}

  public async updateStreak(userId: number): Promise<void> {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const streak = await this.streakRepository.findByUserId(userId);

    // first time logging — create streak record
    if (!streak) {
      await this.streakRepository.create(userId);
      return;
    }
    // already logged today — no update needed
    if (streak.lastLoggedDate === today) {
      return;
    }
    // consecutive day — increment streak
    if (streak.lastLoggedDate === yesterdayStr) {
      const newCurrent = streak.currentStreak + 1;

      await this.streakRepository.update(streak.id, {
        currentStreak: newCurrent,
        longestStreak: Math.max(newCurrent, streak.longestStreak),
        lastLoggedDate: today,
      });
      return;
    }
    // streak broken — reset to 1
    await this.streakRepository.update(streak.id, {
      currentStreak: 1,
      lastLoggedDate: today,
    });
  }

  public async getStreak(userId: number): Promise<{
    currentStreak: number;
    longestStreak: number;
    lastLoggedDate: string | null;
  }> {
    const streak = await this.streakRepository.findByUserId(userId);
    if (!streak) {
      return { currentStreak: 0, longestStreak: 0, lastLoggedDate: null };
    }
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastLoggedDate: streak.lastLoggedDate ?? null,
    };
  }
}
