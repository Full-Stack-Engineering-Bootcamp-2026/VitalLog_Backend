import { Service } from "typedi";
import { Request, Response } from "express";
import { VitalService } from "../service/vital.service";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { generateResponse } from "../../../common/utils/response.util";
import { UserRepository } from "../../user/repository/user.repository";
import { NotFoundException } from "../../../common/exceptions/not-found.exception";
import { BadRequestException } from "../../../common/exceptions/bad-request.exception";
import { queryVitalSchema } from "../validator/vital.validator";
import {
  CreateVitalRequestDto,
  UpdateVitalRequestDto,
  VitalQueryDto,
} from "../dto/vital.dto";

@Service()
export class VitalController {
  constructor(
    private readonly vitalService: VitalService,
    private readonly userRepository: UserRepository,
  ) {}

  // POST /api/vitals
  public async createVital(req: Request, res: Response): Promise<Response> {
    const user = await this.userRepository.findById(req.user!.id);

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const data = await this.vitalService.createVital(
      user,
      req.body as CreateVitalRequestDto,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: "Vital logged successfully.",
      data,
    });
  }

  // GET /api/vitals
  public async getMyVitals(req: Request, res: Response): Promise<Response> {
    const { error, value } = queryVitalSchema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new BadRequestException(
        error.details.map((d) => d.message).join(", "),
      );
    }

    const data = await this.vitalService.getMyVitals(
      req.user!.id,
      value as VitalQueryDto,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Vitals fetched successfully.",
      data,
    });
  }

  // PUT /api/vitals/:id
  public async updateVital(req: Request, res: Response): Promise<Response> {
    const user = await this.userRepository.findById(req.user!.id);

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const data = await this.vitalService.updateVital(
      user,
      parseInt(req.params.id as string, 10),
      req.body as UpdateVitalRequestDto,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Vital updated successfully.",
      data,
    });
  }
}
