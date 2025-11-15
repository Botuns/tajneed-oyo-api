import { Router } from "express";
import { MeetingController } from "../controllers/meeting.controller";
import { Logger } from "../utils/logger";
import {
  CreateMeetingDto,
  UpdateMeetingDto,
  UpdateMeetingStatusDto,
  AddExpectedAttendeesDto,
  CreateMonthlyMeetingDto,
} from "../lib/types/DTOs";
import {
  isAdmin,
  isAuthenticated,
  validateRequest,
} from "../middlewares/auth.middleware";

export const meetingRouter = Router();
const meetingController = new MeetingController();
const logger = new Logger("MeetingRoutes");

meetingRouter.use((req, res, next) => {
  logger.info("Incoming meeting route request", {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
  });
  next();
});

meetingRouter.get("/", meetingController.getAllMeetings);
meetingRouter.get("/upcoming", meetingController.getUpcomingMeetings);
meetingRouter.get("/:id", meetingController.getMeetingById);

meetingRouter.post(
  "/",
  validateRequest(CreateMeetingDto),
  meetingController.createMeeting
);

meetingRouter.post(
  "/monthly",
  validateRequest(CreateMonthlyMeetingDto),
  meetingController.createMonthlyMeeting
);

meetingRouter.patch(
  "/:id",
  validateRequest(UpdateMeetingDto),
  meetingController.updateMeeting
);

meetingRouter.patch(
  "/:id/status",
  validateRequest(UpdateMeetingStatusDto),
  meetingController.updateMeetingStatus
);

meetingRouter.post(
  "/:id/attendees",
  validateRequest(AddExpectedAttendeesDto),
  meetingController.addExpectedAttendees
);

meetingRouter.delete("/:id", meetingController.deleteMeeting);
