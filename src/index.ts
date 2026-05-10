import "reflect-metadata";

import express, { Express, Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Container } from "typedi";

dotenv.config();

import { AppDataSource } from "./db/data-source";

import {
  errorHandler,
  notFoundHandler,
} from "./common/middleware/error-handler.middleware";

import { AuthRoutes } from "./domains/user/route/auth.routes";
import { AdminRoutes } from "./domains/user/route/admin.routes";
import { VitalRoutes } from "./domains/vital/route/vital.routes";
import { FitnessRoutes } from "./domains/fitness/route/fitness.route";
import { StreakRoutes } from "./domains/streak/route/streak.routes";
import { FlagRoutes } from "./domains/flag/route/flag.routes";
import { ProfileRoutes } from "./domains/profile/route/profile.routes";
import { StorageService } from "./common/services/storage.service";
import { StaffRoutes } from "./domains/user/route/staff.routes";
class Application {
  public app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "3000", 10);

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    const allowedOrigins = (
      process.env.ALLOWED_ORIGINS || "http://localhost:5174"
    ).split(",");

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`CORS: origin '${origin}' is not allowed`));
          }
        },
        credentials: true,
      }),
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    console.log("Middleware initialized");
  }

  private initializeRoutes(): void {
    const v1Router = Router();

    v1Router.get("/test", (req, res) => {
      res.send("API working");
    });

    const authRoutes = Container.get(AuthRoutes);
    const adminRoutes = Container.get(AdminRoutes);
    const vitalRoutes = Container.get(VitalRoutes);
    const fitnessRoutes = Container.get(FitnessRoutes);
    const streakRoutes = Container.get(StreakRoutes);

    const flagRoutes = Container.get(FlagRoutes);
    const profileRoutes = Container.get(ProfileRoutes);
    const staffRoutes = Container.get(StaffRoutes);
    v1Router.use("/auth", authRoutes.getRoutes());
    v1Router.use("/admin", adminRoutes.getRoutes());
    v1Router.use("/vitals", vitalRoutes.getRoutes());
    v1Router.use("/fitness", fitnessRoutes.getRoutes());
    v1Router.use("/streak", streakRoutes.getRoutes());
    v1Router.use("/flag", flagRoutes.getRoutes());
    v1Router.use("/profile", profileRoutes.getRoutes());
    v1Router.use("/staff", staffRoutes.getRoutes());
    this.app.use("/api/v1", v1Router);

    console.log("Routes initialized");
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);

    this.app.use(errorHandler);

    console.log("Error handling initialized");
  }

  public async start(): Promise<void> {
    try {
      await AppDataSource.initialize();
      console.log("Database connected");

      const storageService = Container.get(StorageService);
      await storageService.checkConnection();
      console.log("Storage connected");

      this.app.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
      });
    } catch (error) {
      console.error("Startup error", error);
      process.exit(1);
    }
  }
}

const application = new Application();

application.start(); //db connected ,server start listening on port

export default application.app;
