import mongoose, { Schema } from "mongoose";
import { IMeeting } from "../interfaces";
import { MeetingStatus } from "../enums";

const MeetingSchema = new Schema<IMeeting>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: { type: Schema.Types.String, ref: "Officer", required: true },
    expectedAttendees: [{ type: Schema.Types.ObjectId, ref: "Officer" }],
    status: {
      type: String,
      enum: MeetingStatus,
      default: MeetingStatus.SCHEDULED,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Meeting = mongoose.model<IMeeting>("Meeting", MeetingSchema);
