import { Request, Response } from "express";
import { Service } from "typedi";

import { StaffService } from "../service/staff.service";
import { GetStaffMembersRequestDto } from "../dto/staff.dto";

import { generateResponse } from "../../../common/utils/response.util";
import { HttpStatus } from "../../../common/constants/http-status.constants";

@Service()
export class StaffController {
  constructor(private readonly service: StaffService) {}

  public async getActiveMembers(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data = await this.service.getActiveMembers({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      search: req.query.search as GetStaffMembersRequestDto["search"],
    });

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Active members fetched successfully",
      data,
    });
  }
}
