import { Router } from "express";
import { Service } from "typedi";
import { asyncHandler } from "../../../common/utils/async-handler";
import { AuthController } from "../controller/auth.controller";
import { registerSchema } from "../validator/auth.validation";
import { loginSchema } from "../validator/auth.validation";
import { validate } from "../../../common/middleware/validate.middleware";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { changePasswordSchema } from "../validator/auth.validation";
import { forceResetPasswordSchema } from "../validator/auth.validation";
@Service()
export class AuthRoutes {
  public router: Router;

  constructor(private readonly controller: AuthController) {
    this.router = Router();
    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }

  private addRoutes(): void {
    this.router.post(
      //public route
      "/register",
      validate(registerSchema),
      asyncHandler(this.controller.register.bind(this.controller)),
    );

    this.router.post(
      //public route
      "/login",
      validate(loginSchema),
      asyncHandler(this.controller.login.bind(this.controller)),
    );

    this.router.patch(
      //login needed
      "/change-password",
      authenticate,
      validate(changePasswordSchema),
      asyncHandler(this.controller.changePassword.bind(this.controller)),
    );

    this.router.patch(
      "/force-reset-password",
      authenticate,
      validate(forceResetPasswordSchema),
      asyncHandler(this.controller.forceResetPassword.bind(this.controller)),
    );

    this.router.get(
      "/me",
      authenticate,
      asyncHandler(this.controller.me.bind(this.controller)),
    );
  }
}
