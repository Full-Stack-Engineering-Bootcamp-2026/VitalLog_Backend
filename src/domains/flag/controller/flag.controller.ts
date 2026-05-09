import { Request, Response } from "express";
import { Service } from "typedi";
import { FlagService } from "../service/flag.service";
import { CreateManualFlagRequestDto } from "../dto/flag.dto";
import { generateResponse } from "../../../common/utils/response.util";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { ResolveFlagRequestDto } from "../dto/flag.dto";
import { GetFlagsRequestDto } from "../dto/flag.dto";
@Service()
export class FlagController {
  constructor(private readonly service: FlagService) {}

  public async createManualFlag(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data = await this.service.createManualFlag(
      req.body as CreateManualFlagRequestDto,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: "Flag created successfully",
      data,
    });
  }

  public async resolveFlag(req: Request, res: Response): Promise<Response> {
    const data = await this.service.resolveFlag(
      Number(req.params.id),
      req.user!.id,
      req.body as ResolveFlagRequestDto,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Flag resolved successfully",
      data,
    });
  }

  public async getFlags(req: Request, res: Response): Promise<Response> {
    const data = await this.service.getFlags({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      status: req.query.status as GetFlagsRequestDto["status"],
    });

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Flags fetched successfully",
      data,
    });
  }
}
