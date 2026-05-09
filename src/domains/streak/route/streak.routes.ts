import { Router } from "express"
import { Service } from "typedi"
import { Container } from "typedi"
import { asyncHandler } from "../../../common/utils/async-handler"
import { authenticate } from "../../../common/middleware/authenticate.middleware"
import { requireRole } from "../../../common/middleware/authorize.middleware"
import { StreakService } from "../service/streak.service"
import { generateResponse } from "../../../common/utils/response.util"
import { HttpStatus } from "../../../common/constants/http-status.constants"
import { ROLES } from "../../../common/constants/roles.constants"
import { Request, Response } from "express"

@Service()
export class StreakRoutes {
  public router: Router
  constructor() {
    this.router = Router()
    this.addRoutes()
  }
  public getRoutes(): Router {
    return this.router
  }
  private addRoutes(): void {
    this.router.get(
      "/",
      authenticate,
      requireRole(ROLES.MEMBER),
      asyncHandler(async (req: Request, res: Response) => {
        const streakService = Container.get(StreakService)
        const data = await streakService.getStreak(req.user!.id)
        return generateResponse(res, {
          statusCode: HttpStatus.OK,
          message: "Streak fetched successfully.",
          data,
        })
      }),
    )
  }
}