"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
const environment_1 = require("./configs/environment");
dotenv_1.default.config();
let server;
async function startServer() {
    try {
        const appInstance = await app_1.App.create();
        server = appInstance.app.listen(environment_1.environmentConfig.PORT, () => {
            console.log(`Server is running on port ${environment_1.environmentConfig.PORT}`);
            console.log(`Environment: ${environment_1.environmentConfig.NODE_ENV}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error?.message || error);
        process.exit(1);
    }
}
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(err.name, err.message);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
startServer();
