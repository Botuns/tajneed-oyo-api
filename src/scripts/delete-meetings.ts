import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { Meeting } from "../models/meeting.model";

async function deleteMeetings() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully");

    // Get count before deletion
    const countBefore = await Meeting.countDocuments({});
    console.log(`Found ${countBefore} meetings in database`);

    // Delete all meetings (hard delete)
    console.log("Deleting all meetings...");
    const deleteResult = await Meeting.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} meetings`);

    console.log("\nMeetings cleanup completed successfully!");
    console.log("You can now create new meetings from the application.");
  } catch (error) {
    console.error("Error deleting meetings:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the delete function
deleteMeetings();
