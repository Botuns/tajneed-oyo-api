import { AttendanceStatus, AttendanceType, Months, UserType } from "../enums";
import { BaseEntity } from "./base.inteface";
export interface IAttendance extends BaseEntity {
    meetingId: string;
    userId: string;
    userType: UserType;
    attendanceType: AttendanceType;
    meetingDate: Date;
    checkInTime: Date;
    checkOutTime?: Date;
    month: Months;
    verified: boolean;
    verifiedBy?: string;
    status: AttendanceStatus;
    remarks?: string;
}
