"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const environment_1 = require("./configs/environment");
const middlewares_1 = require("./middlewares");
const database_1 = require("./configs/database");
const logger_1 = require("./utils/logger");
const routes_1 = require("./routes");
const scheduler_service_1 = require("./services/scheduler.service");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./configs/swagger");
class App {
    app;
    logger = new logger_1.Logger("App");
    schedulerService;
    constructor() {
        this.app = (0, express_1.default)();
        this.schedulerService = new scheduler_service_1.SchedulerService();
    }
    static async create() {
        const instance = new App();
        instance.setupMiddleware();
        await instance.initializeDatabase();
        instance.setupRoutes();
        instance.setupErrorHandling();
        instance.startScheduler();
        return instance;
    }
    setupMiddleware() {
        middlewares_1.Middleware.setup(this.app);
        this.app.use(express_1.default.json({ limit: "10kb" }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
    }
    async initializeDatabase() {
        try {
            await database_1.Database.connect();
            this.logger.info("Application initialized successfully");
        }
        catch (error) {
            console.error("MongoDB connection error:", error);
            this.logger.error("MongoDB connection error:", error?.stack, {
                uri: environment_1.environmentConfig.DATABASE.MONGODB_URI,
                error: error?.message,
            });
            throw error;
        }
    }
    setupRoutes() {
        const apiPrefix = `/${environment_1.environmentConfig.API_VERSION}`;
        // Swagger Documentation
        this.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
            customCss: ".swagger-ui .topbar { display: none }",
            customSiteTitle: "Tajneed OYO API Docs",
        }));
        // Swagger JSON
        this.app.get("/api-docs.json", (req, res) => {
            res.setHeader("Content-Type", "application/json");
            res.send(swagger_1.swaggerSpec);
        });
        this.app.use(`${apiPrefix}/offices`, routes_1.officeRouter);
        this.app.use(`${apiPrefix}/officers`, routes_1.officerRouter);
        this.app.use(`${apiPrefix}/meetings`, routes_1.meetingRouter);
        this.app.use(`${apiPrefix}/attendance`, routes_1.attendanceRouter);
        this.app.get("/health", async (req, res) => {
            const dbHealthy = await database_1.Database.healthCheck();
            const status = dbHealthy ? 200 : 503;
            res.status(status).json({
                status: dbHealthy ? "success" : "error",
                message: dbHealthy ? "Server is running" : "Database disconnected",
                database: dbHealthy ? "connected" : "disconnected",
                timestamp: new Date().toISOString(),
            });
        });
    }
    setupErrorHandling() {
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        });
    }
    startScheduler() {
        try {
            this.schedulerService.start();
            this.logger.info("Scheduler service started successfully");
        }
        catch (error) {
            this.logger.error("Failed to start scheduler service", error.stack, {
                error: error.message,
            });
        }
    }
}
exports.App = App;
