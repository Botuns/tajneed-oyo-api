import mongoose, { Schema } from "mongoose";
import { IAttendance } from "../interfaces";
import { AttendanceStatus, AttendanceType, UserType } from "../enums";

const AttendanceSchema = new Schema<IAttendance>(
  {
    meetingId: { type: Schema.Types.String, required: true, ref: "Meeting" },
    userId: {
      type: Schema.Types.String,
      required: true,
      refPath: "userType",
    },
    userType: { type: String, enum: UserType, required: true },
    attendanceType: { type: String, enum: AttendanceType, required: true },
    meetingDate: { type: Date, required: true },
    checkInTime: { type: Date, required: true },
    month: { type: String, required: true },
    checkOutTime: { type: Date },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "Officer" },
    status: {
      type: String,
      enum: AttendanceStatus,
      default: AttendanceStatus.PRESENT,
    },
    remarks: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Attendance = mongoose.model<IAttendance>(
  "Attendance",
  AttendanceSchema
);
