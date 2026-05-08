import { Service } from "typedi";
import { Request, Response } from "express";
import { FitnessService } from "../service/fitness.service";
import {
  CreateFitnessLogRequestDto,
  UpdateFitnessLogRequestDto,
  FitnessQueryDto,
} from "../dto/fitness.dto";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { generateResponse } from "../../../common/utils/response.util";
import { UserRepository } from "../../user/repository/user.repository";
import { NotFoundException } from "../../../common/exceptions/not-found.exception";
import { BadRequestException } from "../../../common/exceptions/bad-request.exception";
import { fitnessQuerySchema } from "../validator/fitness.validator";

@Service()
export class FitnessController {
  constructor(
    private readonly fitnessService: FitnessService,
    private readonly userRepository: UserRepository,
  ) {}

  public async createLog(req: Request, res: Response): Promise<Response> {
    const user = await this.userRepository.findById(req.user!.id);

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const data = await this.fitnessService.createLog(
      user,
      req.body as CreateFitnessLogRequestDto,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: "Fitness log created successfully.",
      data,
    });
  }

  public async getMyLogs(req: Request, res: Response): Promise<Response> {
    const { error, value } = fitnessQuerySchema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new BadRequestException(
        error.details.map((d) => d.message).join(", "),
      );
    }

    const data = await this.fitnessService.getMyLogs(
      req.user!.id,
      value as FitnessQueryDto,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Fitness logs fetched successfully.",
      data,
    });
  }

  public async updateLog(req: Request, res: Response): Promise<Response> {
    const data = await this.fitnessService.updateLog(
      req.user!.id,
      parseInt(req.params.id as string, 10),
      req.body as UpdateFitnessLogRequestDto,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Fitness log updated successfully.",
      data,
    });
  }

  public async deleteLog(req: Request, res: Response): Promise<Response> {
    await this.fitnessService.deleteLog(
      req.user!.id,
      parseInt(req.params.id as string, 10),
    );

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Fitness log deleted successfully.",
    });
  }
}