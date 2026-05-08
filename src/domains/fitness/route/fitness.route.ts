import { Router } from "express";
import { Service } from "typedi";
import { FitnessController } from "../controller/fitness.controller";
import { asyncHandler } from "../../../common/utils/async-handler";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { validate } from "../../../common/middleware/validate.middleware";
import {
  createFitnessLogSchema,
  updateFitnessLogSchema,
} from "../validator/fitness.validator";
import { ROLES } from "../../../common/constants/roles.constants";

@Service()
export class FitnessRoutes {
  public router: Router;
  constructor(private readonly controller: FitnessController) {
    this.router = Router();
    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }

  private addRoutes(): void {
    // POST /api/v1/fitness
    this.router.post(
      "/",
      authenticate,
      requireRole(ROLES.MEMBER),
      validate(createFitnessLogSchema),
      asyncHandler(this.controller.createLog.bind(this.controller)),
    );

    // GET /api/v1/fitness
    this.router.get(
      "/",
      authenticate,
      requireRole(ROLES.MEMBER),
      asyncHandler(this.controller.getMyLogs.bind(this.controller)),
    );
    // PATCH /api/v1/fitness/:id
    this.router.patch(
      "/:id",
      authenticate,
      requireRole(ROLES.MEMBER),
      validate(updateFitnessLogSchema),
      asyncHandler(this.controller.updateLog.bind(this.controller)),
    );
    // DELETE /api/v1/fitness/:id
    this.router.delete(
      "/:id",
      authenticate,
      requireRole(ROLES.MEMBER),
      asyncHandler(this.controller.deleteLog.bind(this.controller)),
    );
  }
}
