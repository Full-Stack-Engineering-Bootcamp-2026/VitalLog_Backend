import { Request, Response } from "express";
import { Service } from "typedi";
import { VitalService } from "../service/vital.service";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { SuccessMessages } from "../../../common/constants/success-messages.constants";
import { generateResponse } from "../../../common/utils/response.util";
import {
  VitalCreateDto,
  VitalUpdateDto,
  VitalQueryDto,
} from "../dto/vital.dto";

@Service()
export class VitalController {
  constructor(private readonly service: VitalService) {}

  public async getMyVitals(req: Request, res: Response): Promise<Response> {
    const data = await this.service.getMyVitals(
      req.user.id,
      req.query as VitalQueryDto,
    );
    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      data,
    });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const data = await this.service.create(
      req.user.id,
      req.body as VitalCreateDto,
    );
    return generateResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: SuccessMessages.CREATED,
      data,
    });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const data = await this.service.update(
      req.user.id,
      parseInt(req.params.id, 10),
      req.body as VitalUpdateDto,
    );
    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: SuccessMessages.UPDATED,
      data,
    });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    await this.service.delete(req.user.id, parseInt(req.params.id, 10));
    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: SuccessMessages.DELETED,
    });
  }
}
