import { IAttendance } from "../interfaces";
import { AttendanceRepository } from "../repositories/attendance.repository";
import { OfficerRepository } from "../repositories/officer.repository";
import { MeetingRepository } from "../repositories/meeting.repository";
import { CustomError } from "../utils/custom.error";
import { Logger } from "../utils/logger";
import { AttendanceStatus, AttendanceType, UserType, Months } from "../enums";

export class AttendanceService {
  private attendanceRepository: AttendanceRepository;
  private officerRepository: OfficerRepository;
  private meetingRepository: MeetingRepository;
  private logger: Logger;

  constructor() {
    this.attendanceRepository = new AttendanceRepository();
    this.officerRepository = new OfficerRepository();
    this.meetingRepository = new MeetingRepository();
    this.logger = new Logger("AttendanceService");
  }

  async checkInByUniqueCode(
    meetingId: string,
    uniqueCode: string
  ): Promise<IAttendance> {
    try {
      this.logger.info("Check-in by unique code", { meetingId, uniqueCode });

      const meeting = await this.meetingRepository.findById(meetingId);
      if (!meeting) {
        throw new CustomError("Meeting not found", 404);
      }

      const officer = await this.officerRepository.findOne({
        uniqueCode,
        isDeleted: false,
      });
      if (!officer) {
        throw new CustomError("Officer not found with this unique code", 404);
      }

      const existingAttendance = await this.attendanceRepository.findOne({
        meetingId,
        userId: officer._id.toString(),
        isDeleted: false,
      });

      if (existingAttendance) {
        throw new CustomError("Already checked in for this meeting", 400);
      }

      const now = new Date();
      const monthName = now
        .toLocaleString("default", {
          month: "long",
        })
        .toUpperCase() as Months;

      const attendance = await this.attendanceRepository.create({
        meetingId,
        userId: officer._id.toString(),
        userType: UserType.OFFICER,
        attendanceType: AttendanceType.UNIQUE_CODE,
        meetingDate: meeting.date,
        checkInTime: now,
        month: monthName,
        verified: true,
        status: AttendanceStatus.PRESENT,
      });

      this.logger.info("Check-in successful", {
        attendanceId: attendance._id,
        officerId: officer._id,
      });

      return attendance;
    } catch (error: any) {
      this.logger.error("Check-in failed", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async checkInByFingerprint(
    meetingId: string,
    fingerprint: string
  ): Promise<IAttendance> {
    try {
      this.logger.info("Check-in by fingerprint", { meetingId });

      const meeting = await this.meetingRepository.findById(meetingId);
      if (!meeting) {
        throw new CustomError("Meeting not found", 404);
      }

      const officer = await this.officerRepository.findOne({
        fingerprint,
        isDeleted: false,
      });
      if (!officer) {
        throw new CustomError("Officer not found with this fingerprint", 404);
      }

      const existingAttendance = await this.attendanceRepository.findOne({
        meetingId,
        userId: officer._id.toString(),
        isDeleted: false,
      });

      if (existingAttendance) {
        throw new CustomError("Already checked in for this meeting", 400);
      }

      const now = new Date();
      const monthName = now
        .toLocaleString("default", {
          month: "long",
        })
        .toUpperCase() as Months;

      const attendance = await this.attendanceRepository.create({
        meetingId,
        userId: officer._id.toString(),
        userType: UserType.OFFICER,
        attendanceType: AttendanceType.FINGERPRINT,
        meetingDate: meeting.date,
        checkInTime: now,
        month: monthName,
        verified: true,
        status: AttendanceStatus.PRESENT,
      });

      this.logger.info("Check-in by fingerprint successful", {
        attendanceId: attendance._id,
        officerId: officer._id,
      });

      return attendance;
    } catch (error: any) {
      this.logger.error("Check-in by fingerprint failed", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async checkOut(attendanceId: string): Promise<IAttendance> {
    try {
      this.logger.info("Check-out", { attendanceId });

      const attendance = await this.attendanceRepository.checkOut(attendanceId);
      if (!attendance) {
        throw new CustomError("Attendance record not found", 404);
      }

      this.logger.info("Check-out successful", { attendanceId });
      return attendance;
    } catch (error: any) {
      this.logger.error("Check-out failed", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async getAttendanceByMeeting(meetingId: string): Promise<IAttendance[]> {
    try {
      this.logger.info("Fetching attendance by meeting", { meetingId });
      const attendances = await this.attendanceRepository.findByMeeting(
        meetingId
      );
      this.logger.info("Attendance records fetched successfully", {
        count: attendances.length,
      });
      return attendances;
    } catch (error: any) {
      this.logger.error("Failed to fetch attendance", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async getMeetingStats(meetingId: string) {
    try {
      this.logger.info("Fetching meeting statistics", { meetingId });
      const stats = await this.attendanceRepository.getMeetingStats(meetingId);

      const formattedStats = {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
      };

      stats.forEach((stat: any) => {
        formattedStats[stat._id.toLowerCase() as keyof typeof formattedStats] =
          stat.count;
      });

      this.logger.info("Meeting statistics fetched successfully", {
        meetingId,
      });
      return formattedStats;
    } catch (error: any) {
      this.logger.error("Failed to fetch meeting statistics", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async markAbsent(
    meetingId: string,
    officerId: string,
    remarks?: string
  ): Promise<IAttendance> {
    try {
      this.logger.info("Marking officer as absent", { meetingId, officerId });

      const meeting = await this.meetingRepository.findById(meetingId);
      if (!meeting) {
        throw new CustomError("Meeting not found", 404);
      }

      const now = new Date();
      const monthName = now
        .toLocaleString("default", {
          month: "long",
        })
        .toUpperCase() as Months;

      const attendance = await this.attendanceRepository.create({
        meetingId,
        userId: officerId,
        userType: UserType.OFFICER,
        attendanceType: AttendanceType.UNIQUE_CODE,
        meetingDate: meeting.date,
        checkInTime: now,
        month: monthName,
        verified: true,
        status: AttendanceStatus.ABSENT,
        remarks: remarks || "Did not attend meeting",
      });

      this.logger.info("Officer marked as absent", {
        attendanceId: attendance._id,
      });
      return attendance;
    } catch (error: any) {
      this.logger.error("Failed to mark officer as absent", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async getOfficerAttendanceHistory(
    officerId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<IAttendance[]> {
    try {
      this.logger.info("Fetching officer attendance history", {
        officerId,
        startDate,
        endDate,
      });

      const query: any = {
        userId: officerId,
        isDeleted: false,
      };

      if (startDate || endDate) {
        query.meetingDate = {};
        if (startDate) query.meetingDate.$gte = startDate;
        if (endDate) query.meetingDate.$lte = endDate;
      }

      const attendances = await this.attendanceRepository.find(query);

      this.logger.info("Officer attendance history fetched successfully", {
        officerId,
        count: attendances.length,
      });
      return attendances;
    } catch (error: any) {
      this.logger.error(
        "Failed to fetch officer attendance history",
        error.stack,
        {
          error: error.message,
        }
      );
      throw error;
    }
  }

  async getOfficersAbsentForThreeMonths(): Promise<any[]> {
    try {
      this.logger.info("Fetching officers absent for three months");

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const allOfficers = await this.officerRepository.find({
        isDeleted: false,
      });

      const officersAbsentForThreeMonths = [];

      for (const officer of allOfficers) {
        const attendances = await this.attendanceRepository.find({
          userId: officer._id.toString(),
          meetingDate: { $gte: threeMonthsAgo },
          status: AttendanceStatus.PRESENT,
          isDeleted: false,
        } as any);

        if (attendances.length === 0) {
          officersAbsentForThreeMonths.push({
            officer,
            lastAttendance: await this.getLastAttendance(
              officer._id.toString()
            ),
          });
        }
      }

      this.logger.info(
        "Officers absent for three months fetched successfully",
        {
          count: officersAbsentForThreeMonths.length,
        }
      );

      return officersAbsentForThreeMonths;
    } catch (error: any) {
      this.logger.error(
        "Failed to fetch officers absent for three months",
        error.stack,
        {
          error: error.message,
        }
      );
      throw error;
    }
  }

  private async getLastAttendance(
    officerId: string
  ): Promise<IAttendance | null> {
    const attendances = await this.attendanceRepository.find({
      userId: officerId,
      isDeleted: false,
    } as any);

    return attendances.length > 0
      ? attendances.sort(
          (a, b) =>
            new Date(b.meetingDate).getTime() -
            new Date(a.meetingDate).getTime()
        )[0]
      : null;
  }
}
