import { IOfficer } from "../interfaces/officer.interface";
import { IMeeting } from "../interfaces";
export declare class NotificationService {
    private transporter;
    private logger;
    constructor();
    sendMeetingReminder(officer: IOfficer, meeting: IMeeting): Promise<void>;
    sendAbsenceNotification(officer: IOfficer, meeting: IMeeting): Promise<void>;
    sendThreeMonthAbsenceWarning(officer: IOfficer): Promise<void>;
    sendBulkMeetingReminders(officers: IOfficer[], meeting: IMeeting): Promise<{
        success: number;
        failed: number;
    }>;
    sendBulkAbsenceNotifications(officers: IOfficer[], meeting: IMeeting): Promise<{
        success: number;
        failed: number;
    }>;
}
