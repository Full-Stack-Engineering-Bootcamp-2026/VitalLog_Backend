import { Service } from "typedi";
import { Request, Response } from "express";
import { AuthService } from "../service/auth.service";

import { RegisterRequestDto, LoginRequestDto } from "../dto/auth.dto";

import { HttpStatus } from "../../../common/constants/http-status.constants";

import { generateResponse } from "../../../common/utils/response.util";
import { ChangePasswordRequestDto } from "../dto/auth.dto";
import { ForceResetPasswordRequestDto } from "../dto/auth.dto";
import { ForgotPasswordRequestDto } from "../dto/auth.dto";
import { ResetPasswordRequestDto } from "../dto/auth.dto";
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

  public async changePassword(req: Request, res: Response): Promise<Response> {
    await this.service.changePassword(
      req.user!.id,
      req.body as ChangePasswordRequestDto,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Password changed successfully",
    });
  }

  public async forceResetPassword(
    req: Request,
    res: Response,
  ): Promise<Response> {
    await this.service.forceResetPassword(
      req.user!.id,
      req.body as ForceResetPasswordRequestDto,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Password reset successfully",
    });
  }

  public async me(req: Request, res: Response): Promise<Response> {
    const data = await this.service.me(req.user!.id);

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      data,
    });
  }

  public async forgotPassword(req: Request, res: Response): Promise<Response> {
    await this.service.forgotPassword(req.body as ForgotPasswordRequestDto);

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "A reset link is sent on email",
    });
  }

  public async resetPassword(req: Request, res: Response): Promise<Response> {
    await this.service.resetPassword(req.body as ResetPasswordRequestDto);

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Password reset successfully",
    });
  }
}
