import { Request, Response, NextFunction } from "express";
import { AuthErrorMessages } from "../constants/auth-error-messages.constants";
import { HttpStatus } from "../constants/http-status.constants";
import { getAccessDeniedMessage } from "../constants/auth-error-messages.constants";

import { RoleType } from "../constants/roles.constants";

export const requireRole = (role: RoleType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: AuthErrorMessages.AUTHENTICATION_REQUIRED,
        error: AuthErrorMessages.UNAUTHORIZED,
      });

      return;
    }

    if (req.user.role !== role) {
      res.status(HttpStatus.FORBIDDEN).json({
        status: HttpStatus.FORBIDDEN,
        message: getAccessDeniedMessage([role]),
        error: AuthErrorMessages.FORBIDDEN,
      });

      return;
    }

    next();
  };
};

export const requireAnyRole = (...roles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: AuthErrorMessages.AUTHENTICATION_REQUIRED,
        error: AuthErrorMessages.UNAUTHORIZED,
      });

      return;
    }

    const hasRole = roles.includes(req.user.role);

    if (!hasRole) {
      res.status(HttpStatus.FORBIDDEN).json({
        status: HttpStatus.FORBIDDEN,
        message: getAccessDeniedMessage(roles),
        error: AuthErrorMessages.FORBIDDEN,
      });

      return;
    }

    next();
  };
};
