import { Service } from "typedi";
import { Request, Response } from "express";
import { AuthService } from "../service/auth.service";

import { RegisterRequestDto, LoginRequestDto } from "../dto/auth.dto";

import { HttpStatus } from "../../../common/constants/http-status.constants";

import { generateResponse } from "../../../common/utils/response.util";

@Service()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  public async register(req: Request, res: Response): Promise<Response> {
    const data = await this.service.register(req.body as RegisterRequestDto);

    return generateResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: "Registration successful",
      data,
    });
  }

  public async login(req: Request, res: Response): Promise<Response> {
    const data = await this.service.login(req.body as LoginRequestDto);

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Login successful",
      data,
    });
  }
}
