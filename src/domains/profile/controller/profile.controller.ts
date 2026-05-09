import { Request, Response } from "express";
import { Service } from "typedi";

import { ProfileService } from "../service/profile.service";

import { generateResponse } from "../../../common/utils/response.util";
import { HttpStatus } from "../../../common/constants/http-status.constants";

@Service()
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  public async uploadProfileImage(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data = await this.service.uploadProfileImage(req.user!.id, req.file);

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Profile image uploaded successfully",
      data,
    });
  }
}
