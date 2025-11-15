import { Request, Response } from "express";
import { Logger } from "../utils/logger";
import { ApiResponse, ResponseStatus } from "../utils/api.response";
import { MeetingService } from "../services/meeting.service";

export class MeetingController {
  private meetingService: MeetingService;
  private logger: Logger;

  constructor() {
    this.meetingService = new MeetingService();
    this.logger = new Logger("MeetingController");
  }

  createMeeting = async (req: Request, res: Response): Promise<void> => {
    try {
      this.logger.info("Received create meeting request", { dto: req.body });

      const meeting = await this.meetingService.createMeeting(req.body);

      res
        .status(201)
        .json(ApiResponse.success(meeting, "Meeting created successfully"));
    } catch (error: any) {
      this.logger.error("Create meeting request failed", error.stack, {
        error: error.message,
      });

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  getAllMeetings = async (req: Request, res: Response): Promise<void> => {
    try {
      this.logger.info("Received get all meetings request");

      const meetings = await this.meetingService.getAllMeetings();

      res
        .status(200)
        .json(ApiResponse.success(meetings, "Meetings retrieved successfully"));
    } catch (error: any) {
      this.logger.error("Get all meetings request failed", error.stack, {
        error: error.message,
      });

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  getMeetingById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      this.logger.info("Received get meeting by ID request", { meetingId: id });

      const meeting = await this.meetingService.getMeetingById(id);

      res
        .status(200)
        .json(ApiResponse.success(meeting, "Meeting retrieved successfully"));
    } catch (error: any) {
      this.logger.error("Get meeting by ID request failed", error.stack, {
        meetingId: req.params.id,
        error: error.message,
      });

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error("Meeting not found", [], ResponseStatus.ERROR)
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  getUpcomingMeetings = async (req: Request, res: Response): Promise<void> => {
    try {
      this.logger.info("Received get upcoming meetings request");

      const meetings = await this.meetingService.getUpcomingMeetings();

      res
        .status(200)
        .json(
          ApiResponse.success(
            meetings,
            "Upcoming meetings retrieved successfully"
          )
        );
    } catch (error: any) {
      this.logger.error("Get upcoming meetings request failed", error.stack, {
        error: error.message,
      });

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  updateMeeting = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      this.logger.info("Received update meeting request", {
        meetingId: id,
        updates: req.body,
      });

      const meeting = await this.meetingService.updateMeeting(id, req.body);

      res
        .status(200)
        .json(ApiResponse.success(meeting, "Meeting updated successfully"));
    } catch (error: any) {
      this.logger.error("Update meeting request failed", error.stack, {
        meetingId: req.params.id,
        error: error.message,
      });

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error("Meeting not found", [], ResponseStatus.ERROR)
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  deleteMeeting = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      this.logger.info("Received delete meeting request", { meetingId: id });

      await this.meetingService.deleteMeeting(id);

      res
        .status(200)
        .json(ApiResponse.success(null, "Meeting deleted successfully"));
    } catch (error: any) {
      this.logger.error("Delete meeting request failed", error.stack, {
        meetingId: req.params.id,
        error: error.message,
      });

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error("Meeting not found", [], ResponseStatus.ERROR)
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  updateMeetingStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      this.logger.info("Received update meeting status request", {
        meetingId: id,
        status,
      });

      const meeting = await this.meetingService.updateMeetingStatus(id, status);

      res
        .status(200)
        .json(
          ApiResponse.success(meeting, "Meeting status updated successfully")
        );
    } catch (error: any) {
      this.logger.error("Update meeting status request failed", error.stack, {
        meetingId: req.params.id,
        error: error.message,
      });

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error("Meeting not found", [], ResponseStatus.ERROR)
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  addExpectedAttendees = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { officerIds } = req.body;

      this.logger.info("Received add expected attendees request", {
        meetingId: id,
        officerIds,
      });

      const meeting = await this.meetingService.addExpectedAttendees(
        id,
        officerIds
      );

      res
        .status(200)
        .json(
          ApiResponse.success(meeting, "Expected attendees added successfully")
        );
    } catch (error: any) {
      this.logger.error("Add expected attendees request failed", error.stack, {
        meetingId: req.params.id,
        error: error.message,
      });

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error("Meeting not found", [], ResponseStatus.ERROR)
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  createMonthlyMeeting = async (req: Request, res: Response): Promise<void> => {
    try {
      const { organizerId } = req.body;

      this.logger.info("Received create monthly meeting request", {
        organizerId,
      });

      const meeting = await this.meetingService.createMonthlyMeeting(
        organizerId
      );

      res
        .status(201)
        .json(
          ApiResponse.success(meeting, "Monthly meeting created successfully")
        );
    } catch (error: any) {
      this.logger.error("Create monthly meeting request failed", error.stack, {
        error: error.message,
      });

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };
}
