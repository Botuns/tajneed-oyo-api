import { MeetingStatus } from "../../../enums";
export declare class CreateMeetingDto {
    title: string;
    description: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    location: string;
    organizer: string;
    expectedAttendees?: string[];
}
export declare class UpdateMeetingDto {
    title?: string;
    description?: string;
    date?: Date;
    startTime?: Date;
    endTime?: Date;
    location?: string;
    organizer?: string;
    expectedAttendees?: string[];
    status?: MeetingStatus;
}
export declare class UpdateMeetingStatusDto {
    status: MeetingStatus;
}
export declare class AddExpectedAttendeesDto {
    officerIds: string[];
}
export declare class CreateMonthlyMeetingDto {
    organizerId: string;
}
