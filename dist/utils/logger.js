"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPerformance = exports.globalLogger = exports.Logger = void 0;
const winston_1 = __importStar(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const environment_1 = require("../configs/environment");
class Logger {
    logger;
    context;
    constructor(context) {
        this.context = context;
        this.logger = this.createLogger();
    }
    createLogger() {
        const { combine, timestamp, printf, colorize, errors } = winston_1.format;
        const logFormat = printf(({ level, message, timestamp, context, trace, ...meta }) => {
            const contextString = context ? `[${context}] ` : "";
            const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
            const traceString = trace ? `\nStack Trace: ${trace}` : "";
            return `${timestamp} ${level}: ${contextString}${message} ${metaString}${traceString}`;
        });
        const dailyRotateTransport = new winston_daily_rotate_file_1.default({
            filename: `${environment_1.environmentConfig.LOGGING.LOG_PATH}/%DATE%.log`,
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: `${environment_1.environmentConfig.LOGGING.MAX_FILES}d`,
            level: environment_1.environmentConfig.LOGGING.LEVEL,
        });
        const errorRotateTransport = new winston_daily_rotate_file_1.default({
            filename: `${environment_1.environmentConfig.LOGGING.LOG_PATH}/error-%DATE%.log`,
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: `${environment_1.environmentConfig.LOGGING.MAX_FILES}d`,
            level: "error",
        });
        // Console transport with colors for development
        const consoleTransport = new winston_1.default.transports.Console({
            format: combine(colorize(), logFormat),
        });
        return winston_1.default.createLogger({
            level: environment_1.environmentConfig.LOGGING.LEVEL,
            format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), logFormat),
            defaultMeta: { context: this.context },
            transports: [
                consoleTransport,
                dailyRotateTransport,
                errorRotateTransport,
            ],
        });
    }
    // Log methods with type support for metadata
    info(message, meta = {}) {
        this.logger.info(message, meta);
    }
    error(message, trace, meta = {}) {
        this.logger.error(message, { trace, ...meta });
    }
    warn(message, meta = {}) {
        this.logger.warn(message, meta);
    }
    debug(message, meta = {}) {
        this.logger.debug(message, meta);
    }
    verbose(message, meta = {}) {
        this.logger.verbose(message, meta);
    }
    // Log HTTP request details
    logRequest(req, res, responseTime) {
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
    static handleUncaughtErrors() {
        const logger = new Logger("UncaughtErrors");
        process.on("uncaughtException", (error) => {
            logger.error("Uncaught Exception", error.stack, {
                name: error.name,
                message: error.message,
            });
            process.exit(1);
        });
        process.on("unhandledRejection", (reason) => {
            logger.error("Unhandled Rejection", reason?.stack, {
                name: reason?.name,
                message: reason?.message,
            });
            process.exit(1);
        });
    }
    // Create custom child logger with additional context
    createChildLogger(childContext) {
        return new Logger(`${this.context}:${childContext}`);
    }
}
exports.Logger = Logger;
// Create global logger instance
exports.globalLogger = new Logger("Global");
// Example utility method for performance logging
const logPerformance = async (name, fn) => {
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
    }
    catch (error) {
        logger.error(`Error in ${name}`, error?.stack, {
            name,
            error: error?.message,
        });
        throw error;
    }
};
exports.logPerformance = logPerformance;
