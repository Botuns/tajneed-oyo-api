"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("./environment");
const logger_1 = require("../utils/logger");
class Database {
    static logger = new logger_1.Logger("Database");
    /**
     * Initialize database connection
     */
    static async connect() {
        try {
            mongoose_1.default.set("strictQuery", true);
            await mongoose_1.default.connect(environment_1.environmentConfig.DATABASE.MONGODB_URI, environment_1.environmentConfig.DATABASE.OPTIONS);
            this.setupMongooseEventListeners();
            console.log("Connected to MongoDB successfully");
            this.logger.info("Connected to MongoDB successfully");
        }
        catch (error) {
            console.log("MongoDB connection error:", error);
            this.logger.error("MongoDB connection error:", error?.stack, {
                uri: environment_1.environmentConfig.DATABASE.MONGODB_URI,
                error: error?.message,
            });
            process.exit(1);
        }
    }
    /**
     * Close database connection
     */
    static async disconnect() {
        try {
            await mongoose_1.default.disconnect();
            this.logger.info("Disconnected from MongoDB");
        }
        catch (error) {
            this.logger.error("Error disconnecting from MongoDB:", error?.stack);
            process.exit(1);
        }
    }
    /**
     * Setup mongoose event listeners for monitoring
     */
    static setupMongooseEventListeners() {
        mongoose_1.default.connection.on("disconnected", () => {
            this.logger.warn("MongoDB disconnected");
        });
        mongoose_1.default.connection.on("reconnected", () => {
            this.logger.info("MongoDB reconnected");
        });
        mongoose_1.default.connection.on("error", (error) => {
            this.logger.error("MongoDB error:", error?.stack, {
                error: error?.message,
            });
        });
        // Handle process termination
        process.on("SIGINT", async () => {
            await this.disconnect();
            process.exit(0);
        });
    }
    /**
     * Check database connection status
     */
    static async healthCheck() {
        try {
            const state = mongoose_1.default.connection.readyState;
            return state === 1; // 1 = connected
        }
        catch (error) {
            this.logger.error("Database health check failed:", error?.stack);
            return false;
        }
    }
}
exports.Database = Database;
