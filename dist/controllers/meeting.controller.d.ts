import { Request, Response } from "express";
export declare class MeetingController {
    private meetingService;
    private logger;
    constructor();
    createMeeting: (req: Request, res: Response) => Promise<void>;
    getAllMeetings: (req: Request, res: Response) => Promise<void>;
    getMeetingById: (req: Request, res: Response) => Promise<void>;
    getUpcomingMeetings: (req: Request, res: Response) => Promise<void>;
    updateMeeting: (req: Request, res: Response) => Promise<void>;
    deleteMeeting: (req: Request, res: Response) => Promise<void>;
    updateMeetingStatus: (req: Request, res: Response) => Promise<void>;
    addExpectedAttendees: (req: Request, res: Response) => Promise<void>;
    createMonthlyMeeting: (req: Request, res: Response) => Promise<void>;
}
