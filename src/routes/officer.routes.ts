import { Router } from "express";
import { OfficerController } from "../controllers/officer.controller";
import { Logger } from "../utils/logger";
import { validateRequest } from "../middlewares/auth.middleware";
import {
  CreateOfficerDto,
  UpdateOfficerDto,
  RegisterFingerprintDto,
} from "../lib/types/DTOs/officer.dto";

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

officerRouter.get("/", officerController.getAllOfficers);
officerRouter.get("/:id", officerController.getOfficerById);
officerRouter.get(
  "/unique-code/:uniqueCode",
  officerController.getOfficerByUniqueCode
);

officerRouter.post(
  "/",
  validateRequest(CreateOfficerDto),
  officerController.createOfficer
);

officerRouter.patch(
  "/:id",
  validateRequest(UpdateOfficerDto),
  officerController.updateOfficer
);

officerRouter.post(
  "/:id/fingerprint",
  validateRequest(RegisterFingerprintDto),
  officerController.registerFingerprint
);

officerRouter.delete("/:id", officerController.deleteOfficer);
