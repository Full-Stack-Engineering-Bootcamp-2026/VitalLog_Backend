import { Request, Response } from "express";
import { Service } from "typedi";
import { FlagService } from "../service/flag.service";
import { CreateManualFlagRequestDto } from "../dto/flag.dto";
import { generateResponse } from "../../../common/utils/response.util";
import { HttpStatus } from "../../../common/constants/http-status.constants";

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
}
