import "reflect-metadata";
import express, { Express, Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Container } from "typedi";
import { AppDataSource } from "./db/data-source";

//Load env variables before any other imports
dotenv.config();
class Application {
  public app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;

    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.get("/api/v1/test", (req, res) => {
      res.send("API is working");
    });
  }

  public async start(): Promise<void> {
    try {
      await AppDataSource.initialize();

      this.app.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
      });
    } catch (error) {
      console.error("Database connection error:", error);
      process.exit(1);
    }
  }
}

const application = new Application();
application.start();

export default application.app;
