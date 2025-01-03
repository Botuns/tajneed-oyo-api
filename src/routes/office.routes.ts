import { Router } from "express";
import { OfficeController } from "../controllers/office.controller";

import { Logger } from "../utils/logger";
import { AddOfficerToOfficeDto, CreateOfficeDto, UpdateOfficeDto } from "../lib/types/DTOs";

export const officeRouter = Router();
const officeController = new OfficeController();
const logger = new Logger("OfficeRoutes");

officeRouter.use(isAuthenticated);

officeRouter.use((req, res, next) => {
  logger.info("Incoming office route request", {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
  });
  next();
});

officeRouter.get("/", officeController.getAllOffices);
officeRouter.get("/:id", officeController.getOfficeById);

officeRouter.post(
  "/",
  isAdmin,
  validateRequest(CreateOfficeDto),
  officeController.createOffice
);
officeRouter.patch(
  "/:id",
  isAdmin,
  validateRequest(UpdateOfficeDto),
  officeController.updateOffice
);
officeRouter.delete("/:id", isAdmin, officeController.deleteOffice);
officeRouter.post(
  "/:id/officers",
  isAdmin,
  validateRequest(AddOfficerToOfficeDto),
  officeController.addOfficerToOffice
);
