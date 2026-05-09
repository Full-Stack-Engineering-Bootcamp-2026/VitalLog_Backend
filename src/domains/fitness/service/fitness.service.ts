import { Service } from "typedi";
import { FitnessRepository } from "../repository/fitness.repository";
import {
  CreateFitnessLogRequestDto,
  UpdateFitnessLogRequestDto,
  FitnessQueryDto,
  FitnessLogResponseDto,
  PaginatedFitnessLogsResponseDto,
} from "../dto/fitness.dto";
import { NotFoundException } from "../../../common/exceptions/not-found.exception";
import { FitnessLog } from "../entity/fitness.entity";
import { User } from "../../user/entity/user.entity";

@Service()
export class FitnessService {
  constructor(private readonly fitnessRepository: FitnessRepository) {}

  public async createLog(
    user: User,
    data: CreateFitnessLogRequestDto,
  ): Promise<FitnessLogResponseDto> {
    const log = await this.fitnessRepository.create({
      activityType: data.activityType,
      duration: data.duration,
      caloriesBurned: data.caloriesBurned,
      date: this.formatDate(data.date),
      notes: data.notes,
      user,
    });

    return this.toResponseDto(log);
  }

  public async getMyLogs(
    userId: number,
    query: FitnessQueryDto,
  ): Promise<PaginatedFitnessLogsResponseDto> {
    const page = parseInt(query.page ?? "1", 10);
    const limit = parseInt(query.limit ?? "10", 10);

    const [logs, total] = await this.fitnessRepository.findAllByUser(userId, {
      activityType: query.activityType,
      from: query.from,
      to: query.to,
      page,
      limit,
    });

    return {
      data: logs.map((log) => this.toResponseDto(log)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async updateLog(
    userId: number,
    logId: number,
    data: UpdateFitnessLogRequestDto,
  ): Promise<FitnessLogResponseDto> {
    const log = await this.fitnessRepository.findByUserAndId(userId, logId);

    if (!log) {
      throw new NotFoundException("Fitness log not found.");
    }

    const updated = await this.fitnessRepository.update(logId, {
      activityType: data.activityType ?? log.activityType,
      duration: data.duration ?? log.duration,
      caloriesBurned: data.caloriesBurned ?? log.caloriesBurned,
      date: data.date ? this.formatDate(data.date) : log.date,
      notes: data.notes ?? log.notes,
    });
    return this.toResponseDto(updated);
  }

  public async deleteLog(userId: number, logId: number): Promise<void> {
    const log = await this.fitnessRepository.findByUserAndId(userId, logId);

    if (!log) {
      throw new NotFoundException("Fitness log not found.");
    }
    await this.fitnessRepository.delete(logId);
  }

  private formatDate(date: string): string {
    return new Date(date).toISOString().split("T")[0];
  }

  private toResponseDto(log: FitnessLog): FitnessLogResponseDto {
    return {
      id: log.id,
      activityType: log.activityType,
      duration: log.duration,
      caloriesBurned: log.caloriesBurned,
      date: log.date,
      notes: log.notes,
      createdAt: log.createdAt,
    };
  }
}
