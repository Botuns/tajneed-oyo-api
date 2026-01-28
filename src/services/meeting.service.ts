import { IMeeting } from "../interfaces";
import { MeetingRepository } from "../repositories/meeting.repository";
import { CustomError } from "../utils/custom.error";
import { Logger } from "../utils/logger";
import { MeetingStatus } from "../enums";
import { OfficeRepository } from "../repositories/office.repository";
import { AttendanceRepository } from "../repositories/attendance.repository";
import { OfficerRepository } from "../repositories";

export class MeetingService {
  private meetingRepository: MeetingRepository;
  private officeRepository: OfficeRepository;
  private attendanceRepository: AttendanceRepository;
  private officerRepository: OfficerRepository;
  private logger: Logger;

  constructor() {
    this.meetingRepository = new MeetingRepository();
    this.officeRepository = new OfficeRepository();
    this.attendanceRepository = new AttendanceRepository();
    this.officerRepository = new OfficerRepository();
    this.logger = new Logger("MeetingService");
  }

  async createMeeting(meetingData: Partial<IMeeting>): Promise<IMeeting> {
    try {
      this.logger.info("Creating new meeting", { title: meetingData.title });

      const meeting = await this.meetingRepository.create({
        ...meetingData,
        status: MeetingStatus.SCHEDULED,
      });

      this.logger.info("Meeting created successfully", {
        meetingId: meeting._id,
      });
      return meeting;
    } catch (error: any) {
      this.logger.error("Meeting creation failed", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async getAllMeetings(): Promise<IMeeting[]> {
    try {
      this.logger.info("Fetching all meetings");
      const meetings = await this.meetingRepository.findAll();
      this.logger.info("Meetings fetched successfully", {
        count: meetings.length,
      });
      return meetings;
    } catch (error: any) {
      this.logger.error("Failed to fetch meetings", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async getMeetingById(id: string): Promise<IMeeting> {
    try {
      this.logger.info("Fetching meeting by ID", { meetingId: id });
      const meeting = await this.meetingRepository.findById(id);
      if (!meeting) {
        this.logger.warn("Meeting not found", { meetingId: id });
        throw new CustomError("Meeting not found", 404);
      }

      // Enrich meeting details with the list of officers who have checked in.
      const checkedInAttendances =
        await this.attendanceRepository.findCheckedInOfficersByMeeting(id);

      const officerIds = Array.from(
        new Set(checkedInAttendances.map((a: any) => String(a.userId))),
      );

      const officers = officerIds.length
        ? await this.officerRepository.find({
            _id: { $in: officerIds } as any,
            isDeleted: false,
          } as any)
        : [];

      const officersById = new Map(
        (officers as any[]).map((o) => [String(o._id), o]),
      );

      const checkedInOfficers = checkedInAttendances
        .map((attendance: any) => {
          const officer = officersById.get(String(attendance.userId));
          if (!officer) return null;
          return {
            id: officer.id ?? String(officer._id),
            name: `${officer.firstName ?? ""} ${officer.lastName ?? ""}`.trim(),
            email: officer.email,
          };
        })
        .filter(Boolean);

      this.logger.info("Meeting fetched successfully", {
        meetingId: id,
        checkedInOfficers: checkedInOfficers.length,
      });

      return {
        ...(meeting.toObject ? meeting.toObject() : (meeting as any)),
        checkedInOfficers,
        totalCheckedIn: checkedInOfficers.length,
      } as any;
    } catch (error: any) {
      this.logger.error("Failed to fetch meeting", error.stack, {
        meetingId: id,
        error: error.message,
      });
      throw error;
    }
  }

  async getUpcomingMeetings(): Promise<IMeeting[]> {
    try {
      this.logger.info("Fetching upcoming meetings");
      const meetings = await this.meetingRepository.findUpcomingMeetings();
      this.logger.info("Upcoming meetings fetched successfully", {
        count: meetings.length,
      });
      return meetings;
    } catch (error: any) {
      this.logger.error("Failed to fetch upcoming meetings", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async updateMeeting(
    id: string,
    updateData: Partial<IMeeting>,
  ): Promise<IMeeting> {
    try {
      this.logger.info("Updating meeting", { meetingId: id, updateData });
      const meeting = await this.meetingRepository.update(id, updateData);
      if (!meeting) {
        this.logger.warn("Meeting not found for update", { meetingId: id });
        throw new CustomError("Meeting not found", 404);
      }
      this.logger.info("Meeting updated successfully", { meetingId: id });
      return meeting;
    } catch (error: any) {
      this.logger.error("Failed to update meeting", error.stack, {
        meetingId: id,
        error: error.message,
      });
      throw error;
    }
  }

  async deleteMeeting(id: string): Promise<void> {
    try {
      this.logger.info("Deleting meeting", { meetingId: id });
      const result = await this.meetingRepository.delete(id);
      if (!result) {
        this.logger.warn("Meeting not found for deletion", { meetingId: id });
        throw new CustomError("Meeting not found", 404);
      }
      this.logger.info("Meeting deleted successfully", { meetingId: id });
    } catch (error: any) {
      this.logger.error("Failed to delete meeting", error.stack, {
        meetingId: id,
        error: error.message,
      });
      throw error;
    }
  }

  async updateMeetingStatus(
    id: string,
    status: MeetingStatus,
  ): Promise<IMeeting> {
    try {
      this.logger.info("Updating meeting status", { meetingId: id, status });
      const meeting = await this.meetingRepository.updateStatus(id, status);
      if (!meeting) {
        this.logger.warn("Meeting not found for status update", {
          meetingId: id,
        });
        throw new CustomError("Meeting not found", 404);
      }
      this.logger.info("Meeting status updated successfully", {
        meetingId: id,
      });
      return meeting;
    } catch (error: any) {
      this.logger.error("Failed to update meeting status", error.stack, {
        meetingId: id,
        error: error.message,
      });
      throw error;
    }
  }

  async addExpectedAttendees(
    meetingId: string,
    officerIds: string[],
  ): Promise<IMeeting> {
    try {
      this.logger.info("Adding expected attendees to meeting", {
        meetingId,
        officerIds,
      });
      const meeting = await this.meetingRepository.addExpectedAttendees(
        meetingId,
        officerIds,
      );
      if (!meeting) {
        this.logger.warn("Meeting not found while adding attendees", {
          meetingId,
        });
        throw new CustomError("Meeting not found", 404);
      }
      this.logger.info("Expected attendees added successfully", { meetingId });
      return meeting;
    } catch (error: any) {
      this.logger.error("Failed to add expected attendees", error.stack, {
        meetingId,
        error: error.message,
      });
      throw error;
    }
  }

  getSecondSaturdayOfMonth(year: number, month: number): Date {
    let date = new Date(year, month, 1);
    let saturdayCount = 0;

    while (saturdayCount < 2) {
      if (date.getDay() === 6) {
        saturdayCount++;
      }
      if (saturdayCount < 2) {
        date.setDate(date.getDate() + 1);
      }
    }

    return date;
  }

  async createMonthlyMeeting(organizerId: string): Promise<IMeeting> {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      const meetingDate = this.getSecondSaturdayOfMonth(
        currentYear,
        currentMonth,
      );

      const existingMeeting = await this.meetingRepository.findOne({
        date: {
          $gte: new Date(meetingDate.setHours(0, 0, 0, 0)),
          $lt: new Date(meetingDate.setHours(23, 59, 59, 999)),
        },
      } as any);

      if (existingMeeting) {
        this.logger.info("Monthly meeting already exists", {
          date: meetingDate,
        });
        return existingMeeting;
      }

      const offices = await this.officeRepository.findAll();
      const allOfficerIds = offices.flatMap((office) =>
        office.officers.map((officer) => officer.toString()),
      );

      const startTime = new Date(meetingDate);
      startTime.setHours(10, 0, 0, 0);

      const endTime = new Date(meetingDate);
      endTime.setHours(12, 0, 0, 0);

      const meeting = await this.createMeeting({
        title: `Monthly Ilaqa Meeting - ${meetingDate.toLocaleDateString(
          "en-US",
          { month: "long", year: "numeric" },
        )}`,
        description:
          "Monthly Ilaqa meeting held on the second Saturday of the month",
        date: meetingDate,
        startTime,
        endTime,
        location: "Ilaqa Office",
        organizer: organizerId,
        expectedAttendees: allOfficerIds,
        status: MeetingStatus.SCHEDULED,
      });

      this.logger.info("Monthly meeting created successfully", {
        meetingId: meeting._id,
        date: meetingDate,
      });

      return meeting;
    } catch (error: any) {
      this.logger.error("Failed to create monthly meeting", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }
}
