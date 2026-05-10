import { IAttendance, IGuest, IOfficer } from "../interfaces";
import { AttendanceRepository } from "../repositories/attendance.repository";
import { OfficerRepository } from "../repositories/officer.repository";
import { MeetingRepository } from "../repositories/meeting.repository";
import { GuestRepository } from "../repositories/guest.repository";
import { CustomError } from "../utils/custom.error";
import { Logger } from "../utils/logger";
import {
  AttendanceStatus,
  AttendanceType,
  UserType,
  Months,
  DILA_QAID_POSITION,
  AttendanceRole,
  AuxiliaryType,
} from "../enums";

interface CheckInGuestInput {
  meetingId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  auxiliary: AuxiliaryType;
  state: string;
  purpose: string;
}

type RoleBuckets<T> = Record<AttendanceRole, T>;

export class AttendanceService {
  private attendanceRepository: AttendanceRepository;
  private officerRepository: OfficerRepository;
  private meetingRepository: MeetingRepository;
  private guestRepository: GuestRepository;
  private logger: Logger;

  constructor() {
    this.attendanceRepository = new AttendanceRepository();
    this.officerRepository = new OfficerRepository();
    this.meetingRepository = new MeetingRepository();
    this.guestRepository = new GuestRepository();
    this.logger = new Logger("AttendanceService");
  }

  private currentMonth(): Months {
    return new Date()
      .toLocaleString("default", { month: "long" })
      .toUpperCase() as Months;
  }

  private classifyOfficer(officer: IOfficer): AttendanceRole {
    if (officer.isMulk) return AttendanceRole.MULK;
    if (officer.position === DILA_QAID_POSITION) return AttendanceRole.DILA_QAID;
    return AttendanceRole.OFFICER;
  }

  private async checkInOfficer(
    meetingId: string,
    officer: IOfficer,
    attendanceType: AttendanceType
  ): Promise<IAttendance> {
    const meeting = await this.meetingRepository.findById(meetingId);
    if (!meeting) {
      throw new CustomError("Meeting not found", 404);
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
    const attendance = await this.attendanceRepository.create({
      meetingId,
      userId: officer._id.toString(),
      userType: UserType.OFFICER,
      attendanceType,
      meetingDate: meeting.date,
      checkInTime: now,
      month: this.currentMonth(),
      verified: true,
      status: AttendanceStatus.PRESENT,
    });

    return attendance;
  }

  async checkInByUniqueCode(
    meetingId: string,
    uniqueCode: string
  ): Promise<IAttendance> {
    try {
      this.logger.info("Check-in by unique code", { meetingId, uniqueCode });

      const officer = await this.officerRepository.findOne({
        uniqueCode,
        isDeleted: false,
      });
      if (!officer) {
        throw new CustomError("Officer not found with this unique code", 404);
      }

      const attendance = await this.checkInOfficer(
        meetingId,
        officer,
        AttendanceType.UNIQUE_CODE
      );

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

      const officer = await this.officerRepository.findOne({
        fingerprint,
        isDeleted: false,
      });
      if (!officer) {
        throw new CustomError("Officer not found with this fingerprint", 404);
      }

      const attendance = await this.checkInOfficer(
        meetingId,
        officer,
        AttendanceType.FINGERPRINT
      );

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

  async checkInMulkByUniqueCode(
    meetingId: string,
    uniqueCode: string
  ): Promise<IAttendance> {
    try {
      this.logger.info("Mulk check-in by unique code", { meetingId });

      const officer = await this.officerRepository.findOne({
        uniqueCode,
        isDeleted: false,
      });
      if (!officer) {
        throw new CustomError("No mulk member found with this unique code", 404);
      }
      if (!officer.isMulk) {
        throw new CustomError(
          "This code belongs to an officer, not a mulk member",
          400
        );
      }

      const attendance = await this.checkInOfficer(
        meetingId,
        officer,
        AttendanceType.UNIQUE_CODE
      );
      this.logger.info("Mulk check-in successful", {
        attendanceId: attendance._id,
        officerId: officer._id,
      });
      return attendance;
    } catch (error: any) {
      this.logger.error("Mulk check-in failed", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async checkInMulkByFingerprint(
    meetingId: string,
    fingerprint: string
  ): Promise<IAttendance> {
    try {
      this.logger.info("Mulk check-in by fingerprint", { meetingId });

      const officer = await this.officerRepository.findOne({
        fingerprint,
        isDeleted: false,
      });
      if (!officer) {
        throw new CustomError("No mulk member found with this fingerprint", 404);
      }
      if (!officer.isMulk) {
        throw new CustomError(
          "This fingerprint belongs to an officer, not a mulk member",
          400
        );
      }

      const attendance = await this.checkInOfficer(
        meetingId,
        officer,
        AttendanceType.FINGERPRINT
      );
      this.logger.info("Mulk check-in by fingerprint successful", {
        attendanceId: attendance._id,
        officerId: officer._id,
      });
      return attendance;
    } catch (error: any) {
      this.logger.error("Mulk check-in by fingerprint failed", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async checkInGuest(input: CheckInGuestInput): Promise<IAttendance> {
    try {
      this.logger.info("Guest walk-in check-in", {
        meetingId: input.meetingId,
        phone: input.phoneNumber,
      });

      const meeting = await this.meetingRepository.findById(input.meetingId);
      if (!meeting) {
        throw new CustomError("Meeting not found", 404);
      }

      let guest: IGuest | null = await this.guestRepository.findByPhone(
        input.phoneNumber
      );
      if (!guest) {
        guest = await this.guestRepository.create({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          auxiliary: input.auxiliary,
          state: input.state,
          purpose: input.purpose,
        });
      }

      const existingAttendance = await this.attendanceRepository.findOne({
        meetingId: input.meetingId,
        userId: guest._id.toString(),
        isDeleted: false,
      });
      if (existingAttendance) {
        throw new CustomError(
          "This guest has already checked in for this meeting",
          400
        );
      }

      const now = new Date();
      const attendance = await this.attendanceRepository.create({
        meetingId: input.meetingId,
        userId: guest._id.toString(),
        userType: UserType.GUEST,
        attendanceType: AttendanceType.GUEST_DETAILS,
        meetingDate: meeting.date,
        checkInTime: now,
        month: this.currentMonth(),
        verified: true,
        status: AttendanceStatus.PRESENT,
      });

      this.logger.info("Guest check-in successful", {
        attendanceId: attendance._id,
        guestId: guest._id,
      });
      return attendance;
    } catch (error: any) {
      this.logger.error("Guest check-in failed", error.stack, {
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

      const officer = await this.officerRepository.findById(officerId);
      if (!officer || officer.isDeleted) {
        throw new CustomError("Officer not found", 404);
      }

      const existing = await this.attendanceRepository.findOne({
        meetingId,
        userId: officerId,
        isDeleted: false,
      });
      if (existing) {
        if (existing.status === AttendanceStatus.PRESENT) {
          throw new CustomError(
            "Officer has already checked in as PRESENT for this meeting",
            400
          );
        }
        throw new CustomError(
          "Officer has already been marked for this meeting",
          400
        );
      }

      const attendance = await this.attendanceRepository.create({
        meetingId,
        userId: officerId,
        userType: UserType.OFFICER,
        attendanceType: AttendanceType.UNIQUE_CODE,
        meetingDate: meeting.date,
        checkInTime: new Date(),
        month: this.currentMonth(),
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

  async getMeetingBreakdown(meetingId: string) {
    try {
      this.logger.info("Fetching meeting breakdown", { meetingId });

      const meeting = await this.meetingRepository.findById(meetingId);
      if (!meeting) {
        throw new CustomError("Meeting not found", 404);
      }

      const records = await this.attendanceRepository.findByMeeting(meetingId);

      const buckets: RoleBuckets<IAttendance[]> = {
        [AttendanceRole.OFFICER]: [],
        [AttendanceRole.DILA_QAID]: [],
        [AttendanceRole.MULK]: [],
        [AttendanceRole.GUEST]: [],
      };

      for (const record of records) {
        if (record.userType === UserType.GUEST) {
          buckets[AttendanceRole.GUEST].push(record);
          continue;
        }
        const officer = record.userId as unknown as IOfficer | null;
        if (!officer) continue;
        buckets[this.classifyOfficer(officer)].push(record);
      }

      return {
        officers: buckets[AttendanceRole.OFFICER],
        dilaQaids: buckets[AttendanceRole.DILA_QAID],
        mulk: buckets[AttendanceRole.MULK],
        guests: buckets[AttendanceRole.GUEST],
      };
    } catch (error: any) {
      this.logger.error("Failed to fetch meeting breakdown", error.stack, {
        error: error.message,
      });
      throw error;
    }
  }

  async getMeetingStatsBreakdown(meetingId: string) {
    try {
      this.logger.info("Fetching meeting stats breakdown", { meetingId });

      const meeting = await this.meetingRepository.findById(meetingId);
      if (!meeting) {
        throw new CustomError("Meeting not found", 404);
      }

      const records = await this.attendanceRepository.findByMeeting(meetingId);

      const emptyCounts = () => ({
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        total: 0,
      });

      const byRole: Record<AttendanceRole, ReturnType<typeof emptyCounts>> = {
        [AttendanceRole.OFFICER]: emptyCounts(),
        [AttendanceRole.DILA_QAID]: emptyCounts(),
        [AttendanceRole.MULK]: emptyCounts(),
        [AttendanceRole.GUEST]: emptyCounts(),
      };
      const totals = emptyCounts();

      for (const record of records) {
        let role: AttendanceRole;
        if (record.userType === UserType.GUEST) {
          role = AttendanceRole.GUEST;
        } else {
          const officer = record.userId as unknown as IOfficer | null;
          if (!officer) continue;
          role = this.classifyOfficer(officer);
        }

        const key = record.status.toLowerCase() as keyof ReturnType<
          typeof emptyCounts
        >;
        if (key in byRole[role]) {
          byRole[role][key] += 1;
          byRole[role].total += 1;
          totals[key] += 1;
          totals.total += 1;
        }
      }

      return {
        officers: byRole[AttendanceRole.OFFICER],
        dilaQaids: byRole[AttendanceRole.DILA_QAID],
        mulk: byRole[AttendanceRole.MULK],
        guests: byRole[AttendanceRole.GUEST],
        totals,
      };
    } catch (error: any) {
      this.logger.error("Failed to fetch meeting stats breakdown", error.stack, {
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
