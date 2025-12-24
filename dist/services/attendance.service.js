"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const attendance_repository_1 = require("../repositories/attendance.repository");
const officer_repository_1 = require("../repositories/officer.repository");
const meeting_repository_1 = require("../repositories/meeting.repository");
const custom_error_1 = require("../utils/custom.error");
const logger_1 = require("../utils/logger");
const enums_1 = require("../enums");
class AttendanceService {
    attendanceRepository;
    officerRepository;
    meetingRepository;
    logger;
    constructor() {
        this.attendanceRepository = new attendance_repository_1.AttendanceRepository();
        this.officerRepository = new officer_repository_1.OfficerRepository();
        this.meetingRepository = new meeting_repository_1.MeetingRepository();
        this.logger = new logger_1.Logger("AttendanceService");
    }
    async checkInByUniqueCode(meetingId, uniqueCode) {
        try {
            this.logger.info("Check-in by unique code", { meetingId, uniqueCode });
            const meeting = await this.meetingRepository.findById(meetingId);
            if (!meeting) {
                throw new custom_error_1.CustomError("Meeting not found", 404);
            }
            const officer = await this.officerRepository.findOne({
                uniqueCode,
                isDeleted: false,
            });
            if (!officer) {
                throw new custom_error_1.CustomError("Officer not found with this unique code", 404);
            }
            const existingAttendance = await this.attendanceRepository.findOne({
                meetingId,
                userId: officer._id.toString(),
                isDeleted: false,
            });
            if (existingAttendance) {
                throw new custom_error_1.CustomError("Already checked in for this meeting", 400);
            }
            const now = new Date();
            const monthName = now
                .toLocaleString("default", {
                month: "long",
            })
                .toUpperCase();
            const attendance = await this.attendanceRepository.create({
                meetingId,
                userId: officer._id.toString(),
                userType: enums_1.UserType.OFFICER,
                attendanceType: enums_1.AttendanceType.UNIQUE_CODE,
                meetingDate: meeting.date,
                checkInTime: now,
                month: monthName,
                verified: true,
                status: enums_1.AttendanceStatus.PRESENT,
            });
            this.logger.info("Check-in successful", {
                attendanceId: attendance._id,
                officerId: officer._id,
            });
            return attendance;
        }
        catch (error) {
            this.logger.error("Check-in failed", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async checkInByFingerprint(meetingId, fingerprint) {
        try {
            this.logger.info("Check-in by fingerprint", { meetingId });
            const meeting = await this.meetingRepository.findById(meetingId);
            if (!meeting) {
                throw new custom_error_1.CustomError("Meeting not found", 404);
            }
            const officer = await this.officerRepository.findOne({
                fingerprint,
                isDeleted: false,
            });
            if (!officer) {
                throw new custom_error_1.CustomError("Officer not found with this fingerprint", 404);
            }
            const existingAttendance = await this.attendanceRepository.findOne({
                meetingId,
                userId: officer._id.toString(),
                isDeleted: false,
            });
            if (existingAttendance) {
                throw new custom_error_1.CustomError("Already checked in for this meeting", 400);
            }
            const now = new Date();
            const monthName = now
                .toLocaleString("default", {
                month: "long",
            })
                .toUpperCase();
            const attendance = await this.attendanceRepository.create({
                meetingId,
                userId: officer._id.toString(),
                userType: enums_1.UserType.OFFICER,
                attendanceType: enums_1.AttendanceType.FINGERPRINT,
                meetingDate: meeting.date,
                checkInTime: now,
                month: monthName,
                verified: true,
                status: enums_1.AttendanceStatus.PRESENT,
            });
            this.logger.info("Check-in by fingerprint successful", {
                attendanceId: attendance._id,
                officerId: officer._id,
            });
            return attendance;
        }
        catch (error) {
            this.logger.error("Check-in by fingerprint failed", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async checkOut(attendanceId) {
        try {
            this.logger.info("Check-out", { attendanceId });
            const attendance = await this.attendanceRepository.checkOut(attendanceId);
            if (!attendance) {
                throw new custom_error_1.CustomError("Attendance record not found", 404);
            }
            this.logger.info("Check-out successful", { attendanceId });
            return attendance;
        }
        catch (error) {
            this.logger.error("Check-out failed", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async getAttendanceByMeeting(meetingId) {
        try {
            this.logger.info("Fetching attendance by meeting", { meetingId });
            const attendances = await this.attendanceRepository.findByMeeting(meetingId);
            this.logger.info("Attendance records fetched successfully", {
                count: attendances.length,
            });
            return attendances;
        }
        catch (error) {
            this.logger.error("Failed to fetch attendance", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async getMeetingStats(meetingId) {
        try {
            this.logger.info("Fetching meeting statistics", { meetingId });
            const stats = await this.attendanceRepository.getMeetingStats(meetingId);
            const formattedStats = {
                present: 0,
                absent: 0,
                late: 0,
                excused: 0,
            };
            stats.forEach((stat) => {
                formattedStats[stat._id.toLowerCase()] =
                    stat.count;
            });
            this.logger.info("Meeting statistics fetched successfully", {
                meetingId,
            });
            return formattedStats;
        }
        catch (error) {
            this.logger.error("Failed to fetch meeting statistics", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async markAbsent(meetingId, officerId, remarks) {
        try {
            this.logger.info("Marking officer as absent", { meetingId, officerId });
            const meeting = await this.meetingRepository.findById(meetingId);
            if (!meeting) {
                throw new custom_error_1.CustomError("Meeting not found", 404);
            }
            const now = new Date();
            const monthName = now
                .toLocaleString("default", {
                month: "long",
            })
                .toUpperCase();
            const attendance = await this.attendanceRepository.create({
                meetingId,
                userId: officerId,
                userType: enums_1.UserType.OFFICER,
                attendanceType: enums_1.AttendanceType.UNIQUE_CODE,
                meetingDate: meeting.date,
                checkInTime: now,
                month: monthName,
                verified: true,
                status: enums_1.AttendanceStatus.ABSENT,
                remarks: remarks || "Did not attend meeting",
            });
            this.logger.info("Officer marked as absent", {
                attendanceId: attendance._id,
            });
            return attendance;
        }
        catch (error) {
            this.logger.error("Failed to mark officer as absent", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async getOfficerAttendanceHistory(officerId, startDate, endDate) {
        try {
            this.logger.info("Fetching officer attendance history", {
                officerId,
                startDate,
                endDate,
            });
            const query = {
                userId: officerId,
                isDeleted: false,
            };
            if (startDate || endDate) {
                query.meetingDate = {};
                if (startDate)
                    query.meetingDate.$gte = startDate;
                if (endDate)
                    query.meetingDate.$lte = endDate;
            }
            const attendances = await this.attendanceRepository.find(query);
            this.logger.info("Officer attendance history fetched successfully", {
                officerId,
                count: attendances.length,
            });
            return attendances;
        }
        catch (error) {
            this.logger.error("Failed to fetch officer attendance history", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async getOfficersAbsentForThreeMonths() {
        try {
            this.logger.info("Fetching officers absent for three months");
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            const allOfficers = await this.officerRepository.find({
                isDeleted: false,
            });
            const officersAbsentForThreeMonths = [];
            for (const officer of allOfficers) {
                const attendances = await this.attendanceRepository.find({
                    userId: officer._id.toString(),
                    meetingDate: { $gte: threeMonthsAgo },
                    status: enums_1.AttendanceStatus.PRESENT,
                    isDeleted: false,
                });
                if (attendances.length === 0) {
                    officersAbsentForThreeMonths.push({
                        officer,
                        lastAttendance: await this.getLastAttendance(officer._id.toString()),
                    });
                }
            }
            this.logger.info("Officers absent for three months fetched successfully", {
                count: officersAbsentForThreeMonths.length,
            });
            return officersAbsentForThreeMonths;
        }
        catch (error) {
            this.logger.error("Failed to fetch officers absent for three months", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async getLastAttendance(officerId) {
        const attendances = await this.attendanceRepository.find({
            userId: officerId,
            isDeleted: false,
        });
        return attendances.length > 0
            ? attendances.sort((a, b) => new Date(b.meetingDate).getTime() -
                new Date(a.meetingDate).getTime())[0]
            : null;
    }
}
exports.AttendanceService = AttendanceService;
