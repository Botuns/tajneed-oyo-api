import { Request, Response } from "express";
import { Logger } from "../utils/logger";
import { ApiResponse, ResponseStatus } from "../utils/api.response";
import { AttendanceService } from "../services/attendance.service";

export class AttendanceController {
  private attendanceService: AttendanceService;
  private logger: Logger;

  constructor() {
    this.attendanceService = new AttendanceService();
    this.logger = new Logger("AttendanceController");
  }

  checkInByUniqueCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { meetingId, uniqueCode } = req.body;

      this.logger.info("Received check-in by unique code request", {
        meetingId,
        uniqueCode,
      });

      const attendance = await this.attendanceService.checkInByUniqueCode(
        meetingId,
        uniqueCode
      );

      res
        .status(201)
        .json(ApiResponse.success(attendance, "Check-in successful"));
    } catch (error: any) {
      this.logger.error("Check-in by unique code failed", error.stack, {
        error: error.message,
      });

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  checkInByFingerprint = async (req: Request, res: Response): Promise<void> => {
    try {
      const { meetingId, fingerprint } = req.body;

      this.logger.info("Received check-in by fingerprint request", {
        meetingId,
      });

      const attendance = await this.attendanceService.checkInByFingerprint(
        meetingId,
        fingerprint
      );

      res
        .status(201)
        .json(
          ApiResponse.success(attendance, "Check-in by fingerprint successful")
        );
    } catch (error: any) {
      this.logger.error("Check-in by fingerprint failed", error.stack, {
        error: error.message,
      });

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  checkOut = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      this.logger.info("Received check-out request", { attendanceId: id });

      const attendance = await this.attendanceService.checkOut(id);

      res
        .status(200)
        .json(ApiResponse.success(attendance, "Check-out successful"));
    } catch (error: any) {
      this.logger.error("Check-out failed", error.stack, {
        error: error.message,
      });

      if (error.statusCode === 404) {
        res
          .status(404)
          .json(
            ApiResponse.error(
              "Attendance record not found",
              [],
              ResponseStatus.ERROR
            )
          );
        return;
      }

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  getAttendanceByMeeting = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { meetingId } = req.params;

      this.logger.info("Received get attendance by meeting request", {
        meetingId,
      });

      const attendances = await this.attendanceService.getAttendanceByMeeting(
        meetingId
      );

      res
        .status(200)
        .json(
          ApiResponse.success(
            attendances,
            "Attendance records retrieved successfully"
          )
        );
    } catch (error: any) {
      this.logger.error("Get attendance by meeting failed", error.stack, {
        error: error.message,
      });

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  getMeetingStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { meetingId } = req.params;

      this.logger.info("Received get meeting stats request", { meetingId });

      const stats = await this.attendanceService.getMeetingStats(meetingId);

      res
        .status(200)
        .json(
          ApiResponse.success(
            stats,
            "Meeting statistics retrieved successfully"
          )
        );
    } catch (error: any) {
      this.logger.error("Get meeting stats failed", error.stack, {
        error: error.message,
      });

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  markAbsent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { meetingId, officerId, remarks } = req.body;

      this.logger.info("Received mark absent request", {
        meetingId,
        officerId,
      });

      const attendance = await this.attendanceService.markAbsent(
        meetingId,
        officerId,
        remarks
      );

      res
        .status(201)
        .json(
          ApiResponse.success(
            attendance,
            "Officer marked as absent successfully"
          )
        );
    } catch (error: any) {
      this.logger.error("Mark absent failed", error.stack, {
        error: error.message,
      });

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  getOfficerAttendanceHistory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { officerId } = req.params;
      const { startDate, endDate } = req.query;

      this.logger.info("Received get officer attendance history request", {
        officerId,
        startDate,
        endDate,
      });

      const attendances =
        await this.attendanceService.getOfficerAttendanceHistory(
          officerId,
          startDate ? new Date(startDate as string) : undefined,
          endDate ? new Date(endDate as string) : undefined
        );

      res
        .status(200)
        .json(
          ApiResponse.success(
            attendances,
            "Officer attendance history retrieved successfully"
          )
        );
    } catch (error: any) {
      this.logger.error("Get officer attendance history failed", error.stack, {
        error: error.message,
      });

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };

  getOfficersAbsentForThreeMonths = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      this.logger.info("Received get officers absent for three months request");

      const officers =
        await this.attendanceService.getOfficersAbsentForThreeMonths();

      res
        .status(200)
        .json(
          ApiResponse.success(
            officers,
            "Officers absent for three months retrieved successfully"
          )
        );
    } catch (error: any) {
      this.logger.error(
        "Get officers absent for three months failed",
        error.stack,
        {
          error: error.message,
        }
      );

      res
        .status(error.statusCode || 500)
        .json(ApiResponse.error(error.message));
    }
  };
}
