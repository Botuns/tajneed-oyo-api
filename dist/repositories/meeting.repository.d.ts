import { MeetingStatus } from "../enums";
import { IMeeting } from "../interfaces";
import { BaseRepository } from "./base/BaseRepository";
export declare class MeetingRepository extends BaseRepository<IMeeting> {
    constructor();
    findUpcomingMeetings(): Promise<IMeeting[]>;
    addExpectedAttendees(meetingId: string, officerIds: string[]): Promise<IMeeting | null>;
    updateStatus(meetingId: string, status: MeetingStatus): Promise<IMeeting | null>;
}
