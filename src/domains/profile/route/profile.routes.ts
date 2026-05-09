import { Router } from "express";
import { Service } from "typedi";

import { ProfileController } from "../controller/profile.controller";

import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { asyncHandler } from "../../../common/utils/async-handler";
import { upload } from "../../../common/middleware/upload.middleware";

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
    this.router.post(
      "/image",
      authenticate,
      upload.single("image"),
      asyncHandler(this.controller.uploadProfileImage.bind(this.controller)),
    );
  } //upload.single because only one progile image otherwise upload.array()
}
