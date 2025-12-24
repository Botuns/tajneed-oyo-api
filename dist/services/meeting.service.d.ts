import { IMeeting } from "../interfaces";
import { MeetingStatus } from "../enums";
export declare class MeetingService {
    private meetingRepository;
    private officeRepository;
    private logger;
    constructor();
    createMeeting(meetingData: Partial<IMeeting>): Promise<IMeeting>;
    getAllMeetings(): Promise<IMeeting[]>;
    getMeetingById(id: string): Promise<IMeeting>;
    getUpcomingMeetings(): Promise<IMeeting[]>;
    updateMeeting(id: string, updateData: Partial<IMeeting>): Promise<IMeeting>;
    deleteMeeting(id: string): Promise<void>;
    updateMeetingStatus(id: string, status: MeetingStatus): Promise<IMeeting>;
    addExpectedAttendees(meetingId: string, officerIds: string[]): Promise<IMeeting>;
    getSecondSaturdayOfMonth(year: number, month: number): Date;
    createMonthlyMeeting(organizerId: string): Promise<IMeeting>;
}
