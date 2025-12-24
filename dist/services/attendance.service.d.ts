import { IAttendance } from "../interfaces";
export declare class AttendanceService {
    private attendanceRepository;
    private officerRepository;
    private meetingRepository;
    private logger;
    constructor();
    checkInByUniqueCode(meetingId: string, uniqueCode: string): Promise<IAttendance>;
    checkInByFingerprint(meetingId: string, fingerprint: string): Promise<IAttendance>;
    checkOut(attendanceId: string): Promise<IAttendance>;
    getAttendanceByMeeting(meetingId: string): Promise<IAttendance[]>;
    getMeetingStats(meetingId: string): Promise<{
        present: number;
        absent: number;
        late: number;
        excused: number;
    }>;
    markAbsent(meetingId: string, officerId: string, remarks?: string): Promise<IAttendance>;
    getOfficerAttendanceHistory(officerId: string, startDate?: Date, endDate?: Date): Promise<IAttendance[]>;
    getOfficersAbsentForThreeMonths(): Promise<any[]>;
    private getLastAttendance;
}
