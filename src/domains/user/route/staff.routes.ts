import { Router } from "express";
import { Service } from "typedi";

import { StaffController } from "../controller/staff.controller";

import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { requireAnyRole } from "../../../common/middleware/authorize.middleware";
import { validate } from "../../../common/middleware/validate.middleware";
import { asyncHandler } from "../../../common/utils/async-handler";

import { ROLES } from "../../../common/constants/roles.constants";
import { getStaffMembersSchema } from "../validator/staff.validation";
@Service()
export class StaffRoutes {
  public router: Router;

  constructor(private readonly controller: StaffController) {
    this.router = Router();
    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }
  //get mebers
  private addRoutes(): void {
    this.router.get(
      "/members",
      authenticate,
      requireAnyRole(ROLES.STAFF, ROLES.ADMIN),
      validate(getStaffMembersSchema),
      asyncHandler(this.controller.getActiveMembers.bind(this.controller)),
    );

    this.router.get(
      "/members/:id/dashboard",
      authenticate,
      requireAnyRole(ROLES.STAFF, ROLES.ADMIN),
      asyncHandler(this.controller.getMemberDashboard.bind(this.controller)),
    );
  }
}
