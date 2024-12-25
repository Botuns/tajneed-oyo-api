import mongoose from "mongoose";
import { environmentConfig } from "./environment";
import { Logger } from "../utils/logger";

export class Database {
  private static logger = new Logger("Database");

  /**
   * Initialize database connection
   */
  public static async connect(): Promise<void> {
    try {
      mongoose.set("strictQuery", true);

      await mongoose.connect(
        environmentConfig.DATABASE.MONGODB_URI,
        environmentConfig.DATABASE.OPTIONS
      );

      this.setupMongooseEventListeners();
      console.log("Connected to MongoDB successfully");

      this.logger.info("Connected to MongoDB successfully");
    } catch (error: any) {
      console.log("MongoDB connection error:", error);
      this.logger.error("MongoDB connection error:", error?.stack, {
        uri: environmentConfig.DATABASE.MONGODB_URI,
        error: error?.message,
      });
      process.exit(1);
    }
  }

  /**
   * Close database connection
   */
  public static async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.logger.info("Disconnected from MongoDB");
    } catch (error: any) {
      this.logger.error("Error disconnecting from MongoDB:", error?.stack);
      process.exit(1);
    }
  }

  /**
   * Setup mongoose event listeners for monitoring
   */
  private static setupMongooseEventListeners(): void {
    mongoose.connection.on("disconnected", () => {
      this.logger.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      this.logger.info("MongoDB reconnected");
    });

    mongoose.connection.on("error", (error) => {
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
  public static async healthCheck(): Promise<boolean> {
    try {
      const state = mongoose.connection.readyState;
      return state === 1; // 1 = connected
    } catch (error: any) {
      this.logger.error("Database health check failed:", error?.stack);
      return false;
    }
  }
}
