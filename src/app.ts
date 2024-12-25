import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import { environmentConfig } from "./configs/environment";
import { Middleware } from "./middlewares";
import { Database } from "./configs/database";
import { Logger } from "./utils/logger";

export class App {
  public app: Application;
  private logger = new Logger("App");

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupDatabase();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    Middleware.setup(this.app);

    // Basic parsing middleware
    this.app.use(express.json({ limit: "10kb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10kb" }));
  }

  private async setupDatabase(): Promise<void> {
    try {
      await Database.connect();
      this.logger.info("Application initialized successfully");
    } catch (error: any) {
      console.error("MongoDB connection error:", error);
      this.logger.error("MongoDB connection error:", error?.stack, {
        uri: environmentConfig.DATABASE.MONGODB_URI,
        error: error?.message,
      });
      process.exit(1);
    }
  }

  private setupRoutes(): void {
    // Import and use your route files here
    // Example:
    // this.app.use(`${environment.API.PREFIX}/users`, userRoutes);
    // this.app.use(`${environment.API.PREFIX}/products`, productRoutes);
  }

  private setupErrorHandling(): void {
    // Global error handling middleware
    this.app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        console.error(err.stack);
        res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }
    );
  }
}
