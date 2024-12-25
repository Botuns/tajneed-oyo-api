import winston, { Logger as WinstonLogger, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { environmentConfig } from "../configs/environment";

export class Logger {
  private logger: WinstonLogger;
  private context?: string;

  constructor(context?: string) {
    this.context = context;
    this.logger = this.createLogger();
  }

  private createLogger(): WinstonLogger {
    const { combine, timestamp, printf, colorize, errors } = format;

    const logFormat = printf(
      ({ level, message, timestamp, context, trace, ...meta }) => {
        const contextString = context ? `[${context}] ` : "";
        const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
        const traceString = trace ? `\nStack Trace: ${trace}` : "";

        return `${timestamp} ${level}: ${contextString}${message} ${metaString}${traceString}`;
      }
    );

    const dailyRotateTransport = new DailyRotateFile({
      filename: `${environmentConfig.LOGGING.LOG_PATH}/%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: `${environmentConfig.LOGGING.MAX_FILES}d`,
      level: environmentConfig.LOGGING.LEVEL,
    });

    const errorRotateTransport = new DailyRotateFile({
      filename: `${environmentConfig.LOGGING.LOG_PATH}/error-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: `${environmentConfig.LOGGING.MAX_FILES}d`,
      level: "error",
    });

    // Console transport with colors for development
    const consoleTransport = new winston.transports.Console({
      format: combine(colorize(), logFormat),
    });

    return winston.createLogger({
      level: environmentConfig.LOGGING.LEVEL,
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        logFormat
      ),
      defaultMeta: { context: this.context },
      transports: [
        consoleTransport,
        dailyRotateTransport,
        errorRotateTransport,
      ],
    });
  }

  // Log methods with type support for metadata
  public info(message: any, meta: object = {}): void {
    this.logger.info(message, meta);
  }

  public error(message: any, trace?: string, meta: object = {}): void {
    this.logger.error(message, { trace, ...meta });
  }

  public warn(message: any, meta: object = {}): void {
    this.logger.warn(message, meta);
  }

  public debug(message: any, meta: object = {}): void {
    this.logger.debug(message, meta);
  }

  public verbose(message: any, meta: object = {}): void {
    this.logger.verbose(message, meta);
  }

  // Log HTTP request details
  public logRequest(req: any, res: any, responseTime: number): void {
    const meta = {
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get("user-agent"),
      ip: req.ip,
      userId: req.user?.id,
    };

    this.info("HTTP Request completed", meta);
  }

  // Log unhandled exceptions and rejections
  public static handleUncaughtErrors(): void {
    const logger = new Logger("UncaughtErrors");

    process.on("uncaughtException", (error: Error) => {
      logger.error("Uncaught Exception", error.stack, {
        name: error.name,
        message: error.message,
      });
      process.exit(1);
    });

    process.on("unhandledRejection", (reason: any) => {
      logger.error("Unhandled Rejection", reason?.stack, {
        name: reason?.name,
        message: reason?.message,
      });
      process.exit(1);
    });
  }

  // Create custom child logger with additional context
  public createChildLogger(childContext: string): Logger {
    return new Logger(`${this.context}:${childContext}`);
  }
}

// Create global logger instance
export const globalLogger = new Logger("Global");

// Example utility method for performance logging
export const logPerformance = async (
  name: string,
  fn: () => Promise<any>
): Promise<any> => {
  const logger = new Logger("Performance");
  const start = process.hrtime();

  try {
    const result = await fn();
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    logger.info(`Performance measurement for ${name}`, {
      name,
      duration: `${duration.toFixed(2)}ms`,
    });

    return result;
  } catch (error: any) {
    logger.error(`Error in ${name}`, error?.stack, {
      name,
      error: error?.message,
    });
    throw error;
  }
};
