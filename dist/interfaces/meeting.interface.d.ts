import { MeetingStatus } from "../enums";
import { BaseEntity } from "./base.inteface";
export interface IMeeting extends BaseEntity {
    title: string;
    description: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    location: string;
    organizer: string;
    expectedAttendees: string[];
    status: MeetingStatus;
}
