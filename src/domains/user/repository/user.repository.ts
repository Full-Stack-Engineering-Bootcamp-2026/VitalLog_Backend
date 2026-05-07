import { User } from "../entity/user.entity";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../db/data-source";
import { Service } from "typedi";
@Service()
export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    const users = await this.repository.find();

    return users;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { id },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { email },
    });

    return user;
  }

  async findByResetToken(token: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: {
        resetToken: token,
      },
    });

    return user;
  }

  async create(data: Partial<User>): Promise<User> {
    const item = this.repository.create(data);

    const user = await this.repository.save(item);

    return user;
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    await this.repository.update(id, {
      ...data,
      updatedAt: new Date(),
    });

    return await this.findById(id);
  }

  async deactivate(id: number): Promise<number> {
    const result = await this.repository.update(id, {
      isActive: false,
      updatedAt: new Date(),
    });

    return result.affected ?? 0;
  }

  async reactivate(id: number): Promise<number> {
    const result = await this.repository.update(id, {
      isActive: true,
      updatedAt: new Date(),
    });

    return result.affected ?? 0;
  }
}
