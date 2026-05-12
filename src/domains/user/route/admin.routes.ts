import { requireAnyRole } from "./../../../common/middleware/authorize.middleware";
import { Router } from "express";
import { Service } from "typedi";
import { AdminController } from "../controller/admin.controller";
import { asyncHandler } from "../../../common/utils/async-handler";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { validate } from "../../../common/middleware/validate.middleware";
import { ROLES } from "../../../common/constants/roles.constants";
import { createStaffSchema } from "../validator/admin.vaidation";

@Service()
export class AdminRoutes {
  public router: Router;

  constructor(private readonly controller: AdminController) {
    this.router = Router();

    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }
  //autorization needed
  private addRoutes(): void {
    this.router.post(
      "/staff",
      authenticate,
      requireRole(ROLES.ADMIN),
      validate(createStaffSchema),
      asyncHandler(this.controller.createStaff.bind(this.controller)),
    );

    this.router.get(
      "/registrations",
      authenticate,
      requireAnyRole(ROLES.ADMIN, ROLES.STAFF),
      asyncHandler(this.controller.getRegistrationTrend.bind(this.controller)),
    );

    this.router.get(
      "/flagged-vitals-distribution",
      authenticate,
      requireAnyRole(ROLES.ADMIN, ROLES.STAFF),
      asyncHandler(
        this.controller.getFlaggedVitalsDistribution.bind(this.controller),
      ),
    );
  }
}
