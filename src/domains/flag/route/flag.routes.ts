import { Router } from "express";
import { Service } from "typedi";
import { FlagController } from "../controller/flag.controller";
import { asyncHandler } from "../../../common/utils/async-handler";
import { validate } from "../../../common/middleware/validate.middleware";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { ROLES } from "../../../common/constants/roles.constants";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { createManualFlagSchema } from "../validator/flag.validator";
@Service()
export class FlagRoutes {
  public router: Router;

  constructor(private readonly controller: FlagController) {
    this.router = Router();
    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }

  private addRoutes(): void {
    this.router.post(
      "/add-flag",
      authenticate,
      requireRole(ROLES.STAFF),
      validate(createManualFlagSchema),
      asyncHandler(this.controller.createManualFlag.bind(this.controller)),
    );
  }
}
