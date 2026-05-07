import { Router } from "express";
import { Service } from "typedi";
import { VitalController } from "../controller/vital.controller";
import { asyncHandler } from "../../../common/utils/async-handler";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { validate } from "../../../common/middleware/validate.middleware";
import {
  createVitalSchema,
  updateVitalSchema,
} from "../validator/vital.validator";
import { ROLES } from "../../../common/constants/roles.constants";

@Service()
export class VitalRoutes {
  public router: Router;

  constructor(private readonly controller: VitalController) {
    this.router = Router();
    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }

  private addRoutes(): void {
    // POST /api/vitals
    this.router.post(
      "/",
      authenticate,
      requireRole(ROLES.MEMBER),
      validate(createVitalSchema),
      asyncHandler(this.controller.createVital.bind(this.controller)),
    );

    // GET /api/vitals
    this.router.get(
      "/",
      authenticate,
      requireRole(ROLES.MEMBER),
      asyncHandler(this.controller.getMyVitals.bind(this.controller)),
    );

    // PATCH /api/vitals/:id
    this.router.patch(
      "/:id",
      authenticate,
      requireRole(ROLES.MEMBER),
      validate(updateVitalSchema),
      asyncHandler(this.controller.updateVital.bind(this.controller)),
    );

    // DELETE /api/vitals/:id
    this.router.delete(
      "/:id",
      authenticate,
      requireRole(ROLES.MEMBER),
      asyncHandler(this.controller.deleteVital.bind(this.controller)),
    );
  }
}
