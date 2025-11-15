import nodemailer from "nodemailer";
import { environmentConfig } from "../configs/environment";
import { Logger } from "../utils/logger";
import { IOfficer } from "../interfaces/officer.interface";
import { IMeeting } from "../interfaces";

export class NotificationService {
  private transporter: nodemailer.Transporter;
  private logger: Logger;

  constructor() {
    this.logger = new Logger("NotificationService");
    this.transporter = nodemailer.createTransport({
      host: environmentConfig.EMAIL.SMTP_HOST,
      port: environmentConfig.EMAIL.SMTP_PORT,
      secure: false,
      auth: {
        user: environmentConfig.EMAIL.SMTP_USER,
        pass: environmentConfig.EMAIL.SMTP_PASS,
      },
    });
  }

  async sendMeetingReminder(
    officer: IOfficer,
    meeting: IMeeting
  ): Promise<void> {
    try {
      const mailOptions = {
        from: environmentConfig.EMAIL.FROM_EMAIL,
        to: officer.email,
        subject: `Reminder: Upcoming Meeting - ${meeting.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Meeting Reminder</h2>
            <p>Dear ${officer.firstName} ${officer.lastName},</p>
            
            <p>This is a reminder for the upcoming meeting:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #34495e;">${meeting.title}</h3>
              <p><strong>Date:</strong> ${new Date(
                meeting.date
              ).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${new Date(
                meeting.startTime
              ).toLocaleTimeString()} - ${new Date(
          meeting.endTime
        ).toLocaleTimeString()}</p>
              <p><strong>Location:</strong> ${meeting.location}</p>
              <p><strong>Description:</strong> ${meeting.description}</p>
            </div>
            
            <p style="color: #e74c3c; font-weight: bold;">
              Please note: Officers must not be absent from meetings for more than three consecutive months.
            </p>
            
            <p>We look forward to your attendance.</p>
            
            <p>Best regards,<br>Ilaqa Oyo Administration</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.info("Meeting reminder sent successfully", {
        officerId: officer._id,
        meetingId: meeting._id,
        email: officer.email,
      });
    } catch (error: any) {
      this.logger.error("Failed to send meeting reminder", error.stack, {
        officerId: officer._id,
        meetingId: meeting._id,
        error: error.message,
      });
      throw error;
    }
  }

  async sendAbsenceNotification(
    officer: IOfficer,
    meeting: IMeeting
  ): Promise<void> {
    try {
      const mailOptions = {
        from: environmentConfig.EMAIL.FROM_EMAIL,
        to: officer.email,
        subject: `Absence Notification - ${meeting.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e74c3c;">Absence Notification</h2>
            <p>Dear ${officer.firstName} ${officer.lastName},</p>
            
            <p>We noticed that you were absent from the following meeting:</p>
            
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h3 style="margin-top: 0; color: #856404;">${meeting.title}</h3>
              <p><strong>Date:</strong> ${new Date(
                meeting.date
              ).toLocaleDateString()}</p>
              <p><strong>Location:</strong> ${meeting.location}</p>
            </div>
            
            <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <p style="margin: 0; color: #721c24; font-weight: bold;">
                ⚠️ Important Reminder: Officers must not be absent from meetings for more than three consecutive months.
              </p>
            </div>
            
            <p>If you were unable to attend due to an emergency or unavoidable circumstance, please contact the administration as soon as possible to provide an explanation.</p>
            
            <p>Your regular attendance is crucial for the effective functioning of our organization.</p>
            
            <p>Best regards,<br>Ilaqa Oyo Administration</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.info("Absence notification sent successfully", {
        officerId: officer._id,
        meetingId: meeting._id,
        email: officer.email,
      });
    } catch (error: any) {
      this.logger.error("Failed to send absence notification", error.stack, {
        officerId: officer._id,
        meetingId: meeting._id,
        error: error.message,
      });
      throw error;
    }
  }

  async sendThreeMonthAbsenceWarning(officer: IOfficer): Promise<void> {
    try {
      const mailOptions = {
        from: environmentConfig.EMAIL.FROM_EMAIL,
        to: officer.email,
        subject: "URGENT: Three Month Absence Warning",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc3545;">⚠️ URGENT: Three Month Absence Warning</h2>
            <p>Dear ${officer.firstName} ${officer.lastName},</p>
            
            <div style="background-color: #f8d7da; padding: 20px; border-radius: 5px; margin: 20px 0; border: 2px solid #dc3545;">
              <p style="margin: 0; color: #721c24; font-size: 16px;">
                <strong>This is a critical notice regarding your attendance.</strong>
              </p>
              <p style="color: #721c24; margin-top: 15px;">
                Our records indicate that you have been absent from meetings for three consecutive months. 
                This violates our attendance policy and requires immediate action.
              </p>
            </div>
            
            <h3 style="color: #2c3e50;">Required Actions:</h3>
            <ul style="line-height: 1.8;">
              <li>Contact the administration immediately</li>
              <li>Provide a valid explanation for your absences</li>
              <li>Confirm your commitment to attend future meetings</li>
              <li>Attend the next scheduled meeting without fail</li>
            </ul>
            
            <p style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
              <strong>Note:</strong> Failure to respond to this notice and attend the next meeting may result in 
              administrative action regarding your officer status.
            </p>
            
            <p>Please contact us at your earliest convenience to discuss this matter.</p>
            
            <p>Best regards,<br>Ilaqa Oyo Administration</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.info("Three month absence warning sent successfully", {
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
      throw error;
    }
  }

  async sendBulkMeetingReminders(
    officers: IOfficer[],
    meeting: IMeeting
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const officer of officers) {
      try {
        await this.sendMeetingReminder(officer, meeting);
        success++;
      } catch (error) {
        failed++;
      }
    }

    this.logger.info("Bulk meeting reminders sent", {
      total: officers.length,
      success,
      failed,
      meetingId: meeting._id,
    });

    return { success, failed };
  }

  async sendBulkAbsenceNotifications(
    officers: IOfficer[],
    meeting: IMeeting
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const officer of officers) {
      try {
        await this.sendAbsenceNotification(officer, meeting);
        success++;
      } catch (error) {
        failed++;
      }
    }

    this.logger.info("Bulk absence notifications sent", {
      total: officers.length,
      success,
      failed,
      meetingId: meeting._id,
    });

    return { success, failed };
  }
}
