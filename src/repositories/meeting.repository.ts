import { MeetingStatus } from "../enums";
import { IMeeting } from "../interfaces";
import { Meeting } from "../models/meeting.model";
import { BaseRepository } from "./base/BaseRepository";

export class MeetingRepository extends BaseRepository<IMeeting> {
  constructor() {
    super(Meeting);
  }

  async findUpcomingMeetings(): Promise<IMeeting[]> {
    return await this.model
      .find({
        date: { $gte: new Date() },
        status: { $ne: MeetingStatus.CANCELLED },
        isDeleted: false,
      })
      .sort({ date: 1 });
  }

  async addExpectedAttendees(
    meetingId: string,
    officerIds: string[]
  ): Promise<IMeeting | null> {
    return await this.model.findOneAndUpdate(
      { _id: meetingId, isDeleted: false },
      { $addToSet: { expectedAttendees: { $each: officerIds } } },
      { new: true }
    );
  }

  async updateStatus(
    meetingId: string,
    status: MeetingStatus
  ): Promise<IMeeting | null> {
    return await this.model.findOneAndUpdate(
      { _id: meetingId, isDeleted: false },
      { $set: { status } },
      { new: true }
    );
  }
}
