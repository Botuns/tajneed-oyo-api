import { Router } from "express";
import { OfficerController } from "../controllers/officer.controller";
import { Logger } from "../utils/logger";
import path from "path";
import { validateRequest } from "../middlewares/auth.middleware";
import { CreateOfficerDto } from "../lib/types/DTOs/officer.dto";

export const officerRouter = Router();
const officerController = new OfficerController();
const logger = new Logger("OfficerRoutes");

officerRouter.use((req, res, next) => {
  logger.info("Incoming officer route request", {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
  });
  next();
});

officerRouter.post(
  "/",
  validateRequest(CreateOfficerDto),
  officerController.createOfficer
);
// officerRouter.get("/", officerController.getAllOfficers);
