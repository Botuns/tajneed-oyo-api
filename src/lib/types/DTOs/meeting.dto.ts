import { MeetingStatus } from "../../../enums";

export class CreateMeetingDto {
  title!: string;
  description!: string;
  date!: Date;
  startTime!: Date;
  endTime!: Date;
  location!: string;
  organizer!: string;
  expectedAttendees?: string[];
}

export class UpdateMeetingDto {
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

export class UpdateMeetingStatusDto {
  status!: MeetingStatus;
}

export class AddExpectedAttendeesDto {
  officerIds!: string[];
}

export class CreateMonthlyMeetingDto {
  organizerId!: string;
}
