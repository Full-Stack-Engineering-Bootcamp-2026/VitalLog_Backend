import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { HttpStatus } from "../constants/http-status.constants";
import { AuthErrorMessages } from "../constants/auth-error-messages.constants";
import { RoleType } from "../constants/roles.constants";
import { AppDataSource } from "../../db/data-source";
import { User } from "../../domains/user/entity/user.entity";
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: AuthErrorMessages.AUTH_TOKEN_REQUIRED,
      });

      return;
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: AuthErrorMessages.INVALID_AUTH_HEADER_FORMAT,
      });

      return;
    }

    const token = parts[1];

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    let payload: {
      id: number;
      email: string;
      role: RoleType;
    };

    try {
      payload = jwt.verify(token, secret) as typeof payload;
    } catch {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: AuthErrorMessages.INVALID_TOKEN,
      });

      return;
    }
    //must change pass check
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: payload.id },
    });
    //check user exist
    if (!user) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: AuthErrorMessages.INVALID_TOKEN,
      });

      return;
    }
    const allowedRoutes = ["/force-reset-password", "/logout"];

    if (user.mustChangePassword === true && !allowedRoutes.includes(req.path)) {
      res.status(HttpStatus.FORBIDDEN).json({
        status: HttpStatus.FORBIDDEN,
        message: "Password reset required",
      });

      return;
    }

    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: AuthErrorMessages.AUTHENTICATION_ERROR_OCCURRED,
    });
  }
};
