import mongoose from "mongoose";
import { AttendanceStatus, UserType } from "../enums";
import { IAttendance } from "../interfaces";
import { Attendance } from "../models/attendance.model";
import { BaseRepository } from "./base/BaseRepository";

export class AttendanceRepository extends BaseRepository<IAttendance> {
  constructor() {
    super(Attendance);
  }

  async findByMeeting(meetingId: string): Promise<IAttendance[]> {
    return await this.model
      .find({
        meetingId,
        isDeleted: false,
      })
      .populate("userId");
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
