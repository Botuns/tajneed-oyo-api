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
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./configs/swagger";

export class App {
  public app: Application;
  private logger = new Logger("App");
  private schedulerService: SchedulerService;

  private constructor() {
    this.app = express();
    this.schedulerService = new SchedulerService();
  }

  public static async create(): Promise<App> {
    const instance = new App();
    instance.setupMiddleware();
    await instance.initializeDatabase();
    instance.setupRoutes();
    instance.setupErrorHandling();
    instance.startScheduler();
    return instance;
  }

  private setupMiddleware(): void {
    Middleware.setup(this.app);

    this.app.use(express.json({ limit: "10kb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10kb" }));
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await Database.connect();
      this.logger.info("Application initialized successfully");
    } catch (error: any) {
      console.error("MongoDB connection error:", error);
      this.logger.error("MongoDB connection error:", error?.stack, {
        uri: environmentConfig.DATABASE.MONGODB_URI,
        error: error?.message,
      });
      throw error;
    }
  }

  private setupRoutes(): void {
    const apiPrefix = `/${environmentConfig.API_VERSION}`;

    // Swagger Documentation
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Tajneed OYO API Docs",
      })
    );

    // Swagger JSON
    this.app.get("/api-docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });

    this.app.use(`${apiPrefix}/offices`, officeRouter);
    this.app.use(`${apiPrefix}/officers`, officerRouter);
    this.app.use(`${apiPrefix}/meetings`, meetingRouter);
    this.app.use(`${apiPrefix}/attendance`, attendanceRouter);

    this.app.get("/health", async (req, res) => {
      const dbHealthy = await Database.healthCheck();
      const status = dbHealthy ? 200 : 503;
      res.status(status).json({
        status: dbHealthy ? "success" : "error",
        message: dbHealthy ? "Server is running" : "Database disconnected",
        database: dbHealthy ? "connected" : "disconnected",
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
