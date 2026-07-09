import mongoose from "mongoose";
import { AttendanceStatus, UserType } from "../enums";
import { IAttendance } from "../interfaces";
import { Attendance } from "../models/attendance.model";
import { Officer } from "../models/officer.model";
import { Guest } from "../models/guest.model";
import { BaseRepository } from "./base/BaseRepository";

export class AttendanceRepository extends BaseRepository<IAttendance> {
  constructor() {
    super(Attendance);
  }

  async findByMeeting(meetingId: string): Promise<IAttendance[]> {
    return await this.model.find({
      meetingId,
      isDeleted: false,
    });
  }

  /**
   * Same as findByMeeting, but with `userId` resolved to the referenced
   * Officer or Guest document. We populate manually instead of using
   * `.populate("userId")`: the attendance schema uses `refPath: "userType"`,
   * but the userType enum values ("OFFICER"/"GUEST") don't match the
   * registered model names ("Officer"/"Guest"), so refPath population throws.
   * Returns plain objects so callers can read the populated user fields.
   */
  async findByMeetingPopulated(meetingId: string): Promise<IAttendance[]> {
    const records = await this.model
      .find({ meetingId, isDeleted: false })
      .lean();

    const officerIds: string[] = [];
    const guestIds: string[] = [];
    for (const record of records) {
      const userId = record.userId as unknown as string;
      if (record.userType === UserType.GUEST) guestIds.push(userId);
      else officerIds.push(userId);
    }

    const [officers, guests] = await Promise.all([
      officerIds.length
        ? Officer.find({ _id: { $in: officerIds } }).lean()
        : [],
      guestIds.length ? Guest.find({ _id: { $in: guestIds } }).lean() : [],
    ]);

    const byId = new Map<string, unknown>();
    for (const officer of officers) byId.set(officer._id.toString(), officer);
    for (const guest of guests) byId.set(guest._id.toString(), guest);

    return records.map((record) => ({
      ...record,
      userId: byId.get(record.userId as unknown as string) ?? record.userId,
    })) as unknown as IAttendance[];
  }

  async findCheckedInOfficersByMeeting(
    meetingId: string,
  ): Promise<IAttendance[]> {
    return await this.model
      .find({
        meetingId,
        isDeleted: false,
        userType: UserType.OFFICER,
        status: { $in: [AttendanceStatus.PRESENT, AttendanceStatus.LATE] },
      })
      .sort({ checkInTime: 1 })
      .exec();
  }

  async checkOut(attendanceId: string): Promise<IAttendance | null> {
    return await this.model.findOneAndUpdate(
      { _id: attendanceId, isDeleted: false },
      {
        $set: {
          checkOutTime: new Date(),
          status: AttendanceStatus.PRESENT,
        },
      },
      { new: true },
    );
  }

  async markLate(
    attendanceId: string,
    remarks?: string,
  ): Promise<IAttendance | null> {
    return await this.model.findOneAndUpdate(
      { _id: attendanceId, isDeleted: false },
      {
        $set: {
          status: AttendanceStatus.LATE,
          remarks: remarks || "Arrived late",
        },
      },
      { new: true },
    );
  }

  async getMeetingStats(meetingId: string) {
    return await this.model.aggregate([
      {
        $match: {
          meetingId: new mongoose.Types.ObjectId(meetingId),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
  }
}
