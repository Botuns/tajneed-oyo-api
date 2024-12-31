import { AttendanceType, UserType } from "../enums";
import { BaseEntity } from "./base.inteface";

export interface IAttendance extends BaseEntity {
  userId: string; // Reference to Officer or Guest ID
  userType: UserType;
  attendanceType: AttendanceType;
  meetingDate: Date;
  checkInTime: Date;
  checkOutTime?: Date;
  verified: boolean;
  verifiedBy?: string; // Reference to Officer ID who verified
}
