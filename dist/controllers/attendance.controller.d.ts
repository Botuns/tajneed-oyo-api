import { Request, Response } from "express";
export declare class AttendanceController {
    private attendanceService;
    private logger;
    constructor();
    checkInByUniqueCode: (req: Request, res: Response) => Promise<void>;
    checkInByFingerprint: (req: Request, res: Response) => Promise<void>;
    checkOut: (req: Request, res: Response) => Promise<void>;
    getAttendanceByMeeting: (req: Request, res: Response) => Promise<void>;
    getMeetingStats: (req: Request, res: Response) => Promise<void>;
    markAbsent: (req: Request, res: Response) => Promise<void>;
    getOfficerAttendanceHistory: (req: Request, res: Response) => Promise<void>;
    getOfficersAbsentForThreeMonths: (req: Request, res: Response) => Promise<void>;
}
