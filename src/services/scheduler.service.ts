import cron from "node-cron";
import { Logger } from "../utils/logger";
import { MeetingService } from "./meeting.service";
import { AttendanceService } from "./attendance.service";
import { NotificationService } from "./notification.service";
import { OfficerRepository } from "../repositories/officer.repository";
import { MeetingRepository } from "../repositories/meeting.repository";
import { MeetingStatus } from "../enums";

export class SchedulerService {
  private logger: Logger;
  private meetingService: MeetingService;
  private attendanceService: AttendanceService;
  private notificationService: NotificationService;
  private officerRepository: OfficerRepository;
  private meetingRepository: MeetingRepository;

  constructor() {
    this.logger = new Logger("SchedulerService");
    this.meetingService = new MeetingService();
    this.attendanceService = new AttendanceService();
    this.notificationService = new NotificationService();
    this.officerRepository = new OfficerRepository();
    this.meetingRepository = new MeetingRepository();
  }

  start() {
    this.scheduleMonthlyMeetingCreation();
    this.scheduleWeeklyMeetingReminders();
    this.schedulePostMeetingAbsenceNotifications();
    this.scheduleThreeMonthAbsenceCheck();

    this.logger.info("All scheduled tasks started successfully");
  }

  private scheduleMonthlyMeetingCreation() {
    cron.schedule("0 0 1 * *", async () => {
      try {
        this.logger.info(
          "Running scheduled task: Create monthly meeting for next month"
        );

        const adminOfficer = await this.officerRepository.findOne({
          isAdmin: true,
          isDeleted: false,
        });

        if (!adminOfficer) {
          this.logger.error(
            "Cannot create monthly meeting - no admin officer found",
            ""
          );
          return;
        }

        await this.meetingService.createMonthlyMeeting(
          adminOfficer._id.toString()
        );

        this.logger.info("Monthly meeting created successfully via scheduler");
      } catch (error: any) {
        this.logger.error(
          "Failed to create monthly meeting via scheduler",
          error.stack,
          {
            error: error.message,
          }
        );
      }
    });

    this.logger.info(
      "Scheduled: Monthly meeting creation (1st day of each month at midnight)"
    );
  }

  private scheduleWeeklyMeetingReminders() {
    cron.schedule("0 9 * * 6", async () => {
      try {
        this.logger.info(
          "Running scheduled task: Send meeting reminders for upcoming meetings"
        );

        const now = new Date();
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(now.getDate() + 7);

        const upcomingMeetings = await this.meetingRepository.find({
          date: {
            $gte: now,
            $lte: oneWeekFromNow,
          },
          status: MeetingStatus.SCHEDULED,
          isDeleted: false,
        } as any);

        for (const meeting of upcomingMeetings) {
          try {
            const officers = await this.officerRepository.find({
              _id: { $in: meeting.expectedAttendees },
              isDeleted: false,
            } as any);

            if (officers.length > 0) {
              const result =
                await this.notificationService.sendBulkMeetingReminders(
                  officers,
                  meeting
                );

              this.logger.info("Meeting reminders sent", {
                meetingId: meeting._id,
                success: result.success,
                failed: result.failed,
              });
            }
          } catch (error: any) {
            this.logger.error(
              "Failed to send reminders for meeting",
              error.stack,
              {
                meetingId: meeting._id,
                error: error.message,
              }
            );
          }
        }

        this.logger.info("Completed scheduled task: Send meeting reminders", {
          meetingsProcessed: upcomingMeetings.length,
        });
      } catch (error: any) {
        this.logger.error(
          "Failed to execute meeting reminders scheduler",
          error.stack,
          {
            error: error.message,
          }
        );
      }
    });

    this.logger.info(
      "Scheduled: Meeting reminders (Every Saturday at 9:00 AM)"
    );
  }

  private schedulePostMeetingAbsenceNotifications() {
    cron.schedule("0 18 * * 6", async () => {
      try {
        this.logger.info(
          "Running scheduled task: Send absence notifications for today's meetings"
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const todaysMeetings = await this.meetingRepository.find({
          date: {
            $gte: today,
            $lte: endOfDay,
          },
          status: { $in: [MeetingStatus.COMPLETED, MeetingStatus.IN_PROGRESS] },
          isDeleted: false,
        } as any);

        for (const meeting of todaysMeetings) {
          try {
            const attendances =
              await this.attendanceService.getAttendanceByMeeting(
                meeting._id.toString()
              );

            const attendedOfficerIds = attendances.map((a) => a.userId);

            const absentOfficers = await this.officerRepository.find({
              _id: {
                $in: meeting.expectedAttendees,
                $nin: attendedOfficerIds,
              },
              isDeleted: false,
            } as any);

            for (const officer of absentOfficers) {
              await this.attendanceService.markAbsent(
                meeting._id.toString(),
                officer._id.toString(),
                "Marked absent automatically after meeting"
              );
            }

            if (absentOfficers.length > 0) {
              const result =
                await this.notificationService.sendBulkAbsenceNotifications(
                  absentOfficers,
                  meeting
                );

              this.logger.info("Absence notifications sent", {
                meetingId: meeting._id,
                absentCount: absentOfficers.length,
                success: result.success,
                failed: result.failed,
              });
            }
          } catch (error: any) {
            this.logger.error(
              "Failed to process absence notifications for meeting",
              error.stack,
              {
                meetingId: meeting._id,
                error: error.message,
              }
            );
          }
        }

        this.logger.info(
          "Completed scheduled task: Send absence notifications",
          {
            meetingsProcessed: todaysMeetings.length,
          }
        );
      } catch (error: any) {
        this.logger.error(
          "Failed to execute absence notifications scheduler",
          error.stack,
          {
            error: error.message,
          }
        );
      }
    });

    this.logger.info(
      "Scheduled: Post-meeting absence notifications (Every Saturday at 6:00 PM)"
    );
  }

  private scheduleThreeMonthAbsenceCheck() {
    cron.schedule("0 10 1 * *", async () => {
      try {
        this.logger.info(
          "Running scheduled task: Check for officers absent for three months"
        );

        const officersAbsentForThreeMonths =
          await this.attendanceService.getOfficersAbsentForThreeMonths();

        for (const { officer } of officersAbsentForThreeMonths) {
          try {
            await this.notificationService.sendThreeMonthAbsenceWarning(
              officer
            );

            this.logger.info("Three month absence warning sent", {
              officerId: officer._id,
              email: officer.email,
            });
          } catch (error: any) {
            this.logger.error(
              "Failed to send three month absence warning",
              error.stack,
              {
                officerId: officer._id,
                error: error.message,
              }
            );
          }
        }

        this.logger.info(
          "Completed scheduled task: Three month absence check",
          {
            officersWarned: officersAbsentForThreeMonths.length,
          }
        );
      } catch (error: any) {
        this.logger.error(
          "Failed to execute three month absence check scheduler",
          error.stack,
          {
            error: error.message,
          }
        );
      }
    });

    this.logger.info(
      "Scheduled: Three month absence check (1st day of each month at 10:00 AM)"
    );
  }

  stopAllTasks() {
    cron.getTasks().forEach((task) => task.stop());
    this.logger.info("All scheduled tasks stopped");
  }
}
