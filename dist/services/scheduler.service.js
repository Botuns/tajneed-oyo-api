"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const logger_1 = require("../utils/logger");
const meeting_service_1 = require("./meeting.service");
const attendance_service_1 = require("./attendance.service");
const notification_service_1 = require("./notification.service");
const officer_repository_1 = require("../repositories/officer.repository");
const meeting_repository_1 = require("../repositories/meeting.repository");
const enums_1 = require("../enums");
class SchedulerService {
    logger;
    meetingService;
    attendanceService;
    notificationService;
    officerRepository;
    meetingRepository;
    constructor() {
        this.logger = new logger_1.Logger("SchedulerService");
        this.meetingService = new meeting_service_1.MeetingService();
        this.attendanceService = new attendance_service_1.AttendanceService();
        this.notificationService = new notification_service_1.NotificationService();
        this.officerRepository = new officer_repository_1.OfficerRepository();
        this.meetingRepository = new meeting_repository_1.MeetingRepository();
    }
    start() {
        this.scheduleMonthlyMeetingCreation();
        this.scheduleWeeklyMeetingReminders();
        this.schedulePostMeetingAbsenceNotifications();
        this.scheduleThreeMonthAbsenceCheck();
        this.logger.info("All scheduled tasks started successfully");
    }
    scheduleMonthlyMeetingCreation() {
        node_cron_1.default.schedule("0 0 1 * *", async () => {
            try {
                this.logger.info("Running scheduled task: Create monthly meeting for next month");
                const adminOfficer = await this.officerRepository.findOne({
                    isAdmin: true,
                    isDeleted: false,
                });
                if (!adminOfficer) {
                    this.logger.error("Cannot create monthly meeting - no admin officer found", "");
                    return;
                }
                await this.meetingService.createMonthlyMeeting(adminOfficer._id.toString());
                this.logger.info("Monthly meeting created successfully via scheduler");
            }
            catch (error) {
                this.logger.error("Failed to create monthly meeting via scheduler", error.stack, {
                    error: error.message,
                });
            }
        });
        this.logger.info("Scheduled: Monthly meeting creation (1st day of each month at midnight)");
    }
    scheduleWeeklyMeetingReminders() {
        node_cron_1.default.schedule("0 9 * * 6", async () => {
            try {
                this.logger.info("Running scheduled task: Send meeting reminders for upcoming meetings");
                const now = new Date();
                const oneWeekFromNow = new Date();
                oneWeekFromNow.setDate(now.getDate() + 7);
                const upcomingMeetings = await this.meetingRepository.find({
                    date: {
                        $gte: now,
                        $lte: oneWeekFromNow,
                    },
                    status: enums_1.MeetingStatus.SCHEDULED,
                    isDeleted: false,
                });
                for (const meeting of upcomingMeetings) {
                    try {
                        const officers = await this.officerRepository.find({
                            _id: { $in: meeting.expectedAttendees },
                            isDeleted: false,
                        });
                        if (officers.length > 0) {
                            const result = await this.notificationService.sendBulkMeetingReminders(officers, meeting);
                            this.logger.info("Meeting reminders sent", {
                                meetingId: meeting._id,
                                success: result.success,
                                failed: result.failed,
                            });
                        }
                    }
                    catch (error) {
                        this.logger.error("Failed to send reminders for meeting", error.stack, {
                            meetingId: meeting._id,
                            error: error.message,
                        });
                    }
                }
                this.logger.info("Completed scheduled task: Send meeting reminders", {
                    meetingsProcessed: upcomingMeetings.length,
                });
            }
            catch (error) {
                this.logger.error("Failed to execute meeting reminders scheduler", error.stack, {
                    error: error.message,
                });
            }
        });
        this.logger.info("Scheduled: Meeting reminders (Every Saturday at 9:00 AM)");
    }
    schedulePostMeetingAbsenceNotifications() {
        node_cron_1.default.schedule("0 18 * * 6", async () => {
            try {
                this.logger.info("Running scheduled task: Send absence notifications for today's meetings");
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const endOfDay = new Date(today);
                endOfDay.setHours(23, 59, 59, 999);
                const todaysMeetings = await this.meetingRepository.find({
                    date: {
                        $gte: today,
                        $lte: endOfDay,
                    },
                    status: { $in: [enums_1.MeetingStatus.COMPLETED, enums_1.MeetingStatus.IN_PROGRESS] },
                    isDeleted: false,
                });
                for (const meeting of todaysMeetings) {
                    try {
                        const attendances = await this.attendanceService.getAttendanceByMeeting(meeting._id.toString());
                        const attendedOfficerIds = attendances.map((a) => a.userId);
                        const absentOfficers = await this.officerRepository.find({
                            _id: {
                                $in: meeting.expectedAttendees,
                                $nin: attendedOfficerIds,
                            },
                            isDeleted: false,
                        });
                        for (const officer of absentOfficers) {
                            await this.attendanceService.markAbsent(meeting._id.toString(), officer._id.toString(), "Marked absent automatically after meeting");
                        }
                        if (absentOfficers.length > 0) {
                            const result = await this.notificationService.sendBulkAbsenceNotifications(absentOfficers, meeting);
                            this.logger.info("Absence notifications sent", {
                                meetingId: meeting._id,
                                absentCount: absentOfficers.length,
                                success: result.success,
                                failed: result.failed,
                            });
                        }
                    }
                    catch (error) {
                        this.logger.error("Failed to process absence notifications for meeting", error.stack, {
                            meetingId: meeting._id,
                            error: error.message,
                        });
                    }
                }
                this.logger.info("Completed scheduled task: Send absence notifications", {
                    meetingsProcessed: todaysMeetings.length,
                });
            }
            catch (error) {
                this.logger.error("Failed to execute absence notifications scheduler", error.stack, {
                    error: error.message,
                });
            }
        });
        this.logger.info("Scheduled: Post-meeting absence notifications (Every Saturday at 6:00 PM)");
    }
    scheduleThreeMonthAbsenceCheck() {
        node_cron_1.default.schedule("0 10 1 * *", async () => {
            try {
                this.logger.info("Running scheduled task: Check for officers absent for three months");
                const officersAbsentForThreeMonths = await this.attendanceService.getOfficersAbsentForThreeMonths();
                for (const { officer } of officersAbsentForThreeMonths) {
                    try {
                        await this.notificationService.sendThreeMonthAbsenceWarning(officer);
                        this.logger.info("Three month absence warning sent", {
                            officerId: officer._id,
                            email: officer.email,
                        });
                    }
                    catch (error) {
                        this.logger.error("Failed to send three month absence warning", error.stack, {
                            officerId: officer._id,
                            error: error.message,
                        });
                    }
                }
                this.logger.info("Completed scheduled task: Three month absence check", {
                    officersWarned: officersAbsentForThreeMonths.length,
                });
            }
            catch (error) {
                this.logger.error("Failed to execute three month absence check scheduler", error.stack, {
                    error: error.message,
                });
            }
        });
        this.logger.info("Scheduled: Three month absence check (1st day of each month at 10:00 AM)");
    }
    stopAllTasks() {
        node_cron_1.default.getTasks().forEach((task) => task.stop());
        this.logger.info("All scheduled tasks stopped");
    }
}
exports.SchedulerService = SchedulerService;
