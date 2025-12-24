"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../enums");
const attendance_model_1 = require("../models/attendance.model");
const BaseRepository_1 = require("./base/BaseRepository");
class AttendanceRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(attendance_model_1.Attendance);
    }
    async findByMeeting(meetingId) {
        return await this.model
            .find({
            meetingId,
            isDeleted: false,
        })
            .populate("userId");
    }
    async checkOut(attendanceId) {
        return await this.model.findOneAndUpdate({ _id: attendanceId, isDeleted: false }, {
            $set: {
                checkOutTime: new Date(),
                status: enums_1.AttendanceStatus.PRESENT,
            },
        }, { new: true });
    }
    async markLate(attendanceId, remarks) {
        return await this.model.findOneAndUpdate({ _id: attendanceId, isDeleted: false }, {
            $set: {
                status: enums_1.AttendanceStatus.LATE,
                remarks: remarks || "Arrived late",
            },
        }, { new: true });
    }
    async getMeetingStats(meetingId) {
        return await this.model.aggregate([
            {
                $match: {
                    meetingId: new mongoose_1.default.Types.ObjectId(meetingId),
                    isDeleted: false,
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
    }
}
exports.AttendanceRepository = AttendanceRepository;
