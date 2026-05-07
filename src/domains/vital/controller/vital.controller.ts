import { Service } from "typedi";
import { Request, Response } from "express";
import { VitalService } from "../service/vital.service";
import {
  CreateVitalRequestDto,
  UpdateVitalRequestDto,
  VitalQueryDto,
} from "../dto/vital.dto";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { generateResponse } from "../../../common/utils/response.util";

@Service()
export class VitalController {
  constructor(private readonly service: VitalService) {}

  public async create(req: Request, res: Response): Promise<Response> {
    const data = await this.service.create(
      req.user!.id,
      req.body as CreateVitalRequestDto,
    );
    return generateResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: "Vital logged successfully.",
      data,
    });
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    const data = await this.service.findAll(
      req.user!.id,
      req.query as VitalQueryDto,
    );
    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      data,
    });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const data = await this.service.update(
      req.user!.id,
      parseInt(req.params.id, 10),
      req.body as UpdateVitalRequestDto,
    );
    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Vital updated successfully.",
      data,
    });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    await this.service.delete(req.user!.id, parseInt(req.params.id, 10));
    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Vital deleted successfully.",
    });
  }
}
