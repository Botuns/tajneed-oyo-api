"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
// import { environmentConfig } from "../environment";
const logger_1 = require("../utils/logger");
const environment_1 = require("../configs/environment");
class Middleware {
    static logger = new logger_1.Logger("Middleware");
    /**
     * Setup all middleware
     */
    static setup(app) {
        // Security middleware
        app.use((0, cors_1.default)({
            origin: "http://localhost:3001",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            credentials: true,
        }));
        app.use((0, helmet_1.default)());
        app.use((0, express_mongo_sanitize_1.default)());
        app.use(this.rateLimiter());
        // Performance middleware
        app.use((0, compression_1.default)());
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
    static rateLimiter() {
        return (0, express_rate_limit_1.default)({
            windowMs: environment_1.environmentConfig.SECURITY.RATE_LIMIT_WINDOW_MS,
            max: environment_1.environmentConfig.SECURITY.RATE_LIMIT_MAX,
            message: "Too many requests from this IP, please try again later.",
        });
    }
    /**
     * Request logging middleware
     */
    static requestLogger(req, res, next) {
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
    static errorHandler(err, req, res, next) {
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
            ...(environment_1.environmentConfig.NODE_ENV === "development" && { stack: err.stack }),
        });
    }
    /**
     * Health check endpoint
     */
    static healthCheck(req, res) {
        res.status(200).json({
            status: "success",
            message: "Server is healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    }
}
exports.Middleware = Middleware;
