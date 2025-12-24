"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingService = void 0;
const meeting_repository_1 = require("../repositories/meeting.repository");
const custom_error_1 = require("../utils/custom.error");
const logger_1 = require("../utils/logger");
const enums_1 = require("../enums");
const office_repository_1 = require("../repositories/office.repository");
class MeetingService {
    meetingRepository;
    officeRepository;
    logger;
    constructor() {
        this.meetingRepository = new meeting_repository_1.MeetingRepository();
        this.officeRepository = new office_repository_1.OfficeRepository();
        this.logger = new logger_1.Logger("MeetingService");
    }
    async createMeeting(meetingData) {
        try {
            this.logger.info("Creating new meeting", { title: meetingData.title });
            const meeting = await this.meetingRepository.create({
                ...meetingData,
                status: enums_1.MeetingStatus.SCHEDULED,
            });
            this.logger.info("Meeting created successfully", {
                meetingId: meeting._id,
            });
            return meeting;
        }
        catch (error) {
            this.logger.error("Meeting creation failed", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async getAllMeetings() {
        try {
            this.logger.info("Fetching all meetings");
            const meetings = await this.meetingRepository.findAll();
            this.logger.info("Meetings fetched successfully", {
                count: meetings.length,
            });
            return meetings;
        }
        catch (error) {
            this.logger.error("Failed to fetch meetings", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async getMeetingById(id) {
        try {
            this.logger.info("Fetching meeting by ID", { meetingId: id });
            const meeting = await this.meetingRepository.findById(id);
            if (!meeting) {
                this.logger.warn("Meeting not found", { meetingId: id });
                throw new custom_error_1.CustomError("Meeting not found", 404);
            }
            this.logger.info("Meeting fetched successfully", { meetingId: id });
            return meeting;
        }
        catch (error) {
            this.logger.error("Failed to fetch meeting", error.stack, {
                meetingId: id,
                error: error.message,
            });
            throw error;
        }
    }
    async getUpcomingMeetings() {
        try {
            this.logger.info("Fetching upcoming meetings");
            const meetings = await this.meetingRepository.findUpcomingMeetings();
            this.logger.info("Upcoming meetings fetched successfully", {
                count: meetings.length,
            });
            return meetings;
        }
        catch (error) {
            this.logger.error("Failed to fetch upcoming meetings", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
    async updateMeeting(id, updateData) {
        try {
            this.logger.info("Updating meeting", { meetingId: id, updateData });
            const meeting = await this.meetingRepository.update(id, updateData);
            if (!meeting) {
                this.logger.warn("Meeting not found for update", { meetingId: id });
                throw new custom_error_1.CustomError("Meeting not found", 404);
            }
            this.logger.info("Meeting updated successfully", { meetingId: id });
            return meeting;
        }
        catch (error) {
            this.logger.error("Failed to update meeting", error.stack, {
                meetingId: id,
                error: error.message,
            });
            throw error;
        }
    }
    async deleteMeeting(id) {
        try {
            this.logger.info("Deleting meeting", { meetingId: id });
            const result = await this.meetingRepository.delete(id);
            if (!result) {
                this.logger.warn("Meeting not found for deletion", { meetingId: id });
                throw new custom_error_1.CustomError("Meeting not found", 404);
            }
            this.logger.info("Meeting deleted successfully", { meetingId: id });
        }
        catch (error) {
            this.logger.error("Failed to delete meeting", error.stack, {
                meetingId: id,
                error: error.message,
            });
            throw error;
        }
    }
    async updateMeetingStatus(id, status) {
        try {
            this.logger.info("Updating meeting status", { meetingId: id, status });
            const meeting = await this.meetingRepository.updateStatus(id, status);
            if (!meeting) {
                this.logger.warn("Meeting not found for status update", {
                    meetingId: id,
                });
                throw new custom_error_1.CustomError("Meeting not found", 404);
            }
            this.logger.info("Meeting status updated successfully", {
                meetingId: id,
            });
            return meeting;
        }
        catch (error) {
            this.logger.error("Failed to update meeting status", error.stack, {
                meetingId: id,
                error: error.message,
            });
            throw error;
        }
    }
    async addExpectedAttendees(meetingId, officerIds) {
        try {
            this.logger.info("Adding expected attendees to meeting", {
                meetingId,
                officerIds,
            });
            const meeting = await this.meetingRepository.addExpectedAttendees(meetingId, officerIds);
            if (!meeting) {
                this.logger.warn("Meeting not found while adding attendees", {
                    meetingId,
                });
                throw new custom_error_1.CustomError("Meeting not found", 404);
            }
            this.logger.info("Expected attendees added successfully", { meetingId });
            return meeting;
        }
        catch (error) {
            this.logger.error("Failed to add expected attendees", error.stack, {
                meetingId,
                error: error.message,
            });
            throw error;
        }
    }
    getSecondSaturdayOfMonth(year, month) {
        let date = new Date(year, month, 1);
        let saturdayCount = 0;
        while (saturdayCount < 2) {
            if (date.getDay() === 6) {
                saturdayCount++;
            }
            if (saturdayCount < 2) {
                date.setDate(date.getDate() + 1);
            }
        }
        return date;
    }
    async createMonthlyMeeting(organizerId) {
        try {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
            const meetingDate = this.getSecondSaturdayOfMonth(currentYear, currentMonth);
            const existingMeeting = await this.meetingRepository.findOne({
                date: {
                    $gte: new Date(meetingDate.setHours(0, 0, 0, 0)),
                    $lt: new Date(meetingDate.setHours(23, 59, 59, 999)),
                },
            });
            if (existingMeeting) {
                this.logger.info("Monthly meeting already exists", {
                    date: meetingDate,
                });
                return existingMeeting;
            }
            const offices = await this.officeRepository.findAll();
            const allOfficerIds = offices.flatMap((office) => office.officers.map((officer) => officer.toString()));
            const startTime = new Date(meetingDate);
            startTime.setHours(10, 0, 0, 0);
            const endTime = new Date(meetingDate);
            endTime.setHours(12, 0, 0, 0);
            const meeting = await this.createMeeting({
                title: `Monthly Ilaqa Meeting - ${meetingDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
                description: "Monthly Ilaqa meeting held on the second Saturday of the month",
                date: meetingDate,
                startTime,
                endTime,
                location: "Ilaqa Office",
                organizer: organizerId,
                expectedAttendees: allOfficerIds,
                status: enums_1.MeetingStatus.SCHEDULED,
            });
            this.logger.info("Monthly meeting created successfully", {
                meetingId: meeting._id,
                date: meetingDate,
            });
            return meeting;
        }
        catch (error) {
            this.logger.error("Failed to create monthly meeting", error.stack, {
                error: error.message,
            });
            throw error;
        }
    }
}
exports.MeetingService = MeetingService;
