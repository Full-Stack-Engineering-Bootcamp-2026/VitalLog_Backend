import { Request, Response } from "express";
import { Service } from "typedi";

import { AdminService } from "../service/admin.service";

import { CreateStaffRequestDto } from "../dto/admin.dto";

import { generateResponse } from "../../../common/utils/response.util";

import { HttpStatus } from "../../../common/constants/http-status.constants";

@Service()
export class AdminController {
  constructor(private readonly service: AdminService) {}

  public async createStaff(req: Request, res: Response): Promise<Response> {
    const data = await this.service.createStaff(
      req.body as CreateStaffRequestDto,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: "Staff created successfully",
      data,
    });
  }
  public async getRegistrationTrend(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data = await this.service.getRegistrationTrend();

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Registration trend fetched successfully",
      data,
    });
  }
}
