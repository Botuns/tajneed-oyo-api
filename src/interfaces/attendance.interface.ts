import { AttendanceStatus, AttendanceType, Months, UserType } from "../enums";
import { BaseEntity } from "./base.inteface";

export interface IAttendance extends BaseEntity {
    meetingId: string; // Reference to Meeting ID
  userId: string; // Reference to Officer or Guest ID
  userType: UserType;
  attendanceType: AttendanceType;
  meetingDate: Date;
  checkInTime: Date;
  checkOutTime?: Date;
  month: Months;
  verified: boolean;
  verifiedBy?: string; // Reference to Officer ID who verified
  status : AttendanceStatus;
  remarks?: string;
}
