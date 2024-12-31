import { MeetingStatus } from "../enums";
import { BaseEntity } from "./base.inteface";

export interface IMeeting extends BaseEntity {
  title: string;
  description: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  location: string;
  organizer: string; // Reference to Officer ID--usually tajneed officer
  expectedAttendees: string[]; // References to Officer IDs
  status: MeetingStatus;
}
