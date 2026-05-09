import { Service } from "typedi";

import { AppDataSource } from "../../../db/data-source";

import { Profile } from "../entity/profile.entity";

@Service()
export class ProfileRepository {
  private readonly repo = AppDataSource.getRepository(Profile);

  // find profile by user id
  public async findByUserId(userId: number): Promise<Profile | null> {
    return await this.repo.findOne({
      where: {
        user: { id: userId },
      },
      relations: ["user"],
    });
  }

  // create profile
  public async create(data: Partial<Profile>): Promise<Profile> {
    const profile = this.repo.create(data);

    return await this.repo.save(profile);
  }

  // update profile
  public async updateByUserId(
    userId: number,
    data: Partial<Profile>,
  ): Promise<Profile> {
    const profile = await this.findByUserId(userId);

    if (!profile) {
      throw new Error("Profile not found");
    }
    await this.repo.update(profile.id, data);
    return await this.repo.findOneOrFail({
      where: {
        id: profile.id,
      },

      relations: ["user"],
    });
  }
}
