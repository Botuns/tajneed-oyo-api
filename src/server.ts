import { App } from "./app";
import dotenv from "dotenv";
import { environmentConfig } from "./configs/environment";

dotenv.config();

let server: ReturnType<typeof import("express").application.listen>;

async function startServer(): Promise<void> {
  try {
    const appInstance = await App.create();
    server = appInstance.app.listen(environmentConfig.PORT, () => {
      console.log(`Server is running on port ${environmentConfig.PORT}`);
      console.log(`Environment: ${environmentConfig.NODE_ENV}`);
    });
  } catch (error: any) {
    console.error("Failed to start server:", error?.message || error);
    process.exit(1);
  }
}

process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

startServer();
