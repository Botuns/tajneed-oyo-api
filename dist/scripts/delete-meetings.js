"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env.local") });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
const meeting_model_1 = require("../models/meeting.model");
async function deleteMeetings() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI environment variable is not set");
        }
        console.log("Connecting to MongoDB...");
        await mongoose_1.default.connect(mongoUri);
        console.log("Connected to MongoDB successfully");
        // Get count before deletion
        const countBefore = await meeting_model_1.Meeting.countDocuments({});
        console.log(`Found ${countBefore} meetings in database`);
        // Delete all meetings (hard delete)
        console.log("Deleting all meetings...");
        const deleteResult = await meeting_model_1.Meeting.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} meetings`);
        console.log("\nMeetings cleanup completed successfully!");
        console.log("You can now create new meetings from the application.");
    }
    catch (error) {
        console.error("Error deleting meetings:", error);
        process.exit(1);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log("Disconnected from MongoDB");
    }
}
// Run the delete function
deleteMeetings();
