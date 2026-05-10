import { Router } from "express";
import { Service } from "typedi";

import { ProfileController } from "../controller/profile.controller";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { asyncHandler } from "../../../common/utils/async-handler";
import { upload } from "../../../common/middleware/upload.middleware";
import { validate } from "../../../common/middleware/validate.middleware";
import { updateProfileSchema } from "../validator/profile.validator";

@Service()
export class ProfileRoutes {
  public router: Router;

  constructor(private readonly controller: ProfileController) {
    this.router = Router();
    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }

  private addRoutes(): void {
    this.router.get(
      "/",
      authenticate,
      asyncHandler(this.controller.getProfile.bind(this.controller)),
    );

    this.router.patch(
      "/",
      authenticate,
      asyncHandler(this.controller.updateProfile.bind(this.controller)),
    );

    this.router.post(
      "/image",
      authenticate,
      upload.single("image"),
      asyncHandler(this.controller.uploadProfileImage.bind(this.controller)),
    );

    this.router.patch(
      "/",
      authenticate,
      validate(updateProfileSchema),
      asyncHandler(this.controller.updateProfile.bind(this.controller)),
    );
  }
}
