export declare class SchedulerService {
    private logger;
    private meetingService;
    private attendanceService;
    private notificationService;
    private officerRepository;
    private meetingRepository;
    constructor();
    start(): void;
    private scheduleMonthlyMeetingCreation;
    private scheduleWeeklyMeetingReminders;
    private schedulePostMeetingAbsenceNotifications;
    private scheduleThreeMonthAbsenceCheck;
    stopAllTasks(): void;
}
