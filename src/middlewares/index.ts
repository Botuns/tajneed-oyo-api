import cors from "cors";
import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
// import { environmentConfig } from "../environment";
import { Logger } from "../utils/logger";
import { environmentConfig } from "../configs/environment";

export class Middleware {
  private static logger = new Logger("Middleware");

  /**
   * Setup all middleware
   */
  public static setup(app: any): void {
    // Security middleware
    app.use(
      cors({
        origin: [
          "http://localhost:3000",
          "http://localhost:3001",
          /\.vercel\.app$/,
        ],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
      })
    );
    app.use(helmet());
    app.use(mongoSanitize());
    app.use(this.rateLimiter());

    // Performance middleware
    app.use(compression());

    // Logging middleware
    app.use(this.requestLogger);

    // Error handling
    app.use(this.errorHandler);

    // Health check
    app.get("/health", this.healthCheck);
  }

  /**
   * Rate limiting middleware
   */
  private static rateLimiter() {
    return rateLimit({
      windowMs: environmentConfig.SECURITY.RATE_LIMIT_WINDOW_MS,
      max: environmentConfig.SECURITY.RATE_LIMIT_MAX,
      message: "Too many requests from this IP, please try again later.",
    });
  }

  /**
   * Request logging middleware
   */
  private static requestLogger(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      Middleware.logger.info({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get("user-agent"),
        ip: req.ip,
      });
    });
    next();
  }

  /**
   * Global error handling middleware
   */
  private static errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    Middleware.logger.error({
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : "Internal Server Error";

    res.status(statusCode).json({
      status: "error",
      message,
      ...(environmentConfig.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  /**
   * Health check endpoint
   */
  private static healthCheck(req: Request, res: Response): void {
    res.status(200).json({
      status: "success",
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
}
