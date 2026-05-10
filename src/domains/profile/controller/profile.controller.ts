import { Request, Response } from "express";
import { Service } from "typedi";

import { ProfileService } from "../service/profile.service";
import { generateResponse } from "../../../common/utils/response.util";
import { HttpStatus } from "../../../common/constants/http-status.constants";

@Service()
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  public async getProfile(req: Request, res: Response): Promise<Response> {
    const data = await this.service.getProfile(req.user!.id);

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Profile fetched successfully",
      data,
    });
  }

  public async updateProfile(req: Request, res: Response): Promise<Response> {
    const data = await this.service.updateProfile(req.user!.id, req.body);

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Profile updated successfully",
      data,
    });
  }

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
