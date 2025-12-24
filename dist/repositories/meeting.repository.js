"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingRepository = void 0;
const enums_1 = require("../enums");
const meeting_model_1 = require("../models/meeting.model");
const BaseRepository_1 = require("./base/BaseRepository");
class MeetingRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(meeting_model_1.Meeting);
    }
    async findUpcomingMeetings() {
        return await this.model
            .find({
            date: { $gte: new Date() },
            status: { $ne: enums_1.MeetingStatus.CANCELLED },
            isDeleted: false,
        })
            .sort({ date: 1 });
    }
    async addExpectedAttendees(meetingId, officerIds) {
        return await this.model.findOneAndUpdate({ _id: meetingId, isDeleted: false }, { $addToSet: { expectedAttendees: { $each: officerIds } } }, { new: true });
    }
    async updateStatus(meetingId, status) {
        return await this.model.findOneAndUpdate({ _id: meetingId, isDeleted: false }, { $set: { status } }, { new: true });
    }
}
exports.MeetingRepository = MeetingRepository;
