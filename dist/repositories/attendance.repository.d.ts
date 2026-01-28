import { IAttendance } from "../interfaces";
import { BaseRepository } from "./base/BaseRepository";
export declare class AttendanceRepository extends BaseRepository<IAttendance> {
    constructor();
    findByMeeting(meetingId: string): Promise<IAttendance[]>;
    findCheckedInOfficersByMeeting(meetingId: string): Promise<IAttendance[]>;
    checkOut(attendanceId: string): Promise<IAttendance | null>;
    markLate(attendanceId: string, remarks?: string): Promise<IAttendance | null>;
    getMeetingStats(meetingId: string): Promise<any[]>;
}
