import { App } from "./app";
import dotenv from "dotenv";
import { environmentConfig } from "./configs/environment";

dotenv.config();

const app = new App().app;

const server = app.listen(environmentConfig.PORT, () => {
  console.log(`Server is running on port ${environmentConfig.PORT}`);
  console.log(`Environment: ${environmentConfig.NODE_ENV}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
