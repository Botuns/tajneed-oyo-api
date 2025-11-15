import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { Logger } from "../utils/logger";
import {
  CheckInByUniqueCodeDto,
  CheckInByFingerprintDto,
  MarkAbsentDto,
} from "../lib/types/DTOs";
import { validateRequest } from "../middlewares/auth.middleware";

export const attendanceRouter = Router();
const attendanceController = new AttendanceController();
const logger = new Logger("AttendanceRoutes");

attendanceRouter.use((req, res, next) => {
  logger.info("Incoming attendance route request", {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
  });
  next();
});

attendanceRouter.post(
  "/checkin/unique-code",
  validateRequest(CheckInByUniqueCodeDto),
  attendanceController.checkInByUniqueCode
);

attendanceRouter.post(
  "/checkin/fingerprint",
  validateRequest(CheckInByFingerprintDto),
  attendanceController.checkInByFingerprint
);

attendanceRouter.patch("/:id/checkout", attendanceController.checkOut);

attendanceRouter.get(
  "/meeting/:meetingId",
  attendanceController.getAttendanceByMeeting
);

attendanceRouter.get(
  "/meeting/:meetingId/stats",
  attendanceController.getMeetingStats
);

attendanceRouter.post(
  "/mark-absent",
  validateRequest(MarkAbsentDto),
  attendanceController.markAbsent
);

attendanceRouter.get(
  "/officer/:officerId/history",
  attendanceController.getOfficerAttendanceHistory
);

attendanceRouter.get(
  "/absent/three-months",
  attendanceController.getOfficersAbsentForThreeMonths
);
