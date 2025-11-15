import express, { Application } from "express";
import { environmentConfig } from "./configs/environment";
import { Middleware } from "./middlewares";
import { Database } from "./configs/database";
import { Logger } from "./utils/logger";
import {
  officeRouter,
  officerRouter,
  meetingRouter,
  attendanceRouter,
} from "./routes";
import { SchedulerService } from "./services/scheduler.service";

export class App {
  public app: Application;
  private logger = new Logger("App");
  private schedulerService: SchedulerService;

  constructor() {
    this.app = express();
    this.schedulerService = new SchedulerService();
    this.setupMiddleware();
    this.setupDatabase();
    this.setupRoutes();
    this.setupErrorHandling();
    this.startScheduler();
  }

  private setupMiddleware(): void {
    Middleware.setup(this.app);

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
    const apiPrefix = `/${environmentConfig.API_VERSION}`;

    this.app.use(`${apiPrefix}/offices`, officeRouter);
    this.app.use(`${apiPrefix}/officers`, officerRouter);
    this.app.use(`${apiPrefix}/meetings`, meetingRouter);
    this.app.use(`${apiPrefix}/attendance`, attendanceRouter);

    this.app.get("/health", (req, res) => {
      res.status(200).json({
        status: "success",
        message: "Server is running",
        timestamp: new Date().toISOString(),
      });
    });
  }

  private setupErrorHandling(): void {
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

  private startScheduler(): void {
    try {
      this.schedulerService.start();
      this.logger.info("Scheduler service started successfully");
    } catch (error: any) {
      this.logger.error("Failed to start scheduler service", error.stack, {
        error: error.message,
      });
    }
  }
}
