# API Testing Guide

## Quick Start

Base URL: `http://localhost:4000/v1`

## 1. Create an Officer

**Endpoint:** `POST /officers`

\`\`\`json
{
"firstName": "John",
"lastName": "Doe",
"email": "john.doe@example.com",
"phoneNumber": "+2348012345678",
"tenureStart": "2024-01-01",
"isAdmin": true
}
\`\`\`

**Response:**

- Auto-generates unique code (e.g., "OYO4A7B2C")
- Returns officer with ID

## 2. Register Fingerprint

**Endpoint:** `POST /officers/:id/fingerprint`

\`\`\`json
{
"fingerprintData": "base64_encoded_fingerprint_data"
}
\`\`\`

## 3. Create an Office

**Endpoint:** `POST /offices`

\`\`\`json
{
"name": "Tajneed Office",
"email": "tajneed@oyoilaqa.org",
"description": "Responsible for member registration and records",
"responsibilities": [
"Member enrollment",
"Database management",
"Meeting coordination"
]
}
\`\`\`

## 4. Add Officer to Office

**Endpoint:** `POST /offices/:officeId/officers`

\`\`\`json
{
"officerId": "officer_id_here"
}
\`\`\`

## 5. Create Monthly Meeting (Automated)

**Endpoint:** `POST /meetings/monthly`

\`\`\`json
{
"organizerId": "officer_id_here"
}
\`\`\`

This automatically:

- Calculates 2nd Saturday of current month
- Sets meeting time (10:00 AM - 12:00 PM)
- Adds all officers as expected attendees

## 6. Check In to Meeting (Unique Code)

**Endpoint:** `POST /attendance/checkin/unique-code`

\`\`\`json
{
"meetingId": "meeting_id_here",
"uniqueCode": "OYO4A7B2C"
}
\`\`\`

## 7. Check In to Meeting (Fingerprint)

**Endpoint:** `POST /attendance/checkin/fingerprint`

\`\`\`json
{
"meetingId": "meeting_id_here",
"fingerprint": "hashed_fingerprint_data"
}
\`\`\`

## 8. Get Meeting Attendance

**Endpoint:** `GET /attendance/meeting/:meetingId`

Returns all attendees for the meeting.

## 9. Get Meeting Statistics

**Endpoint:** `GET /attendance/meeting/:meetingId/stats`

\`\`\`json
{
"present": 45,
"absent": 5,
"late": 2,
"excused": 1
}
\`\`\`

## 10. Get Officer Attendance History

**Endpoint:** `GET /attendance/officer/:officerId/history?startDate=2024-01-01&endDate=2024-12-31`

## 11. Get Officers Absent 3+ Months

**Endpoint:** `GET /attendance/absent/three-months`

Returns officers who haven't attended in 3+ months.

## 12. Update Meeting Status

**Endpoint:** `PATCH /meetings/:id/status`

\`\`\`json
{
"status": "IN_PROGRESS"
}
\`\`\`

Status values: `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`

## 13. Mark Officer Absent

**Endpoint:** `POST /attendance/mark-absent`

\`\`\`json
{
"meetingId": "meeting_id_here",
"officerId": "officer_id_here",
"remarks": "Did not attend - no notice given"
}
\`\`\`

## Automated Tasks (No API Calls Needed)

### 1. Monthly Meeting Creation

- Runs: 1st day of each month at midnight
- Creates meeting for 2nd Saturday

### 2. Meeting Reminders

- Runs: Every Saturday at 9:00 AM
- Sends email reminders for meetings within next 7 days

### 3. Absence Notifications

- Runs: Every Saturday at 6:00 PM
- Emails officers who didn't attend today's meetings
- Automatically marks them as absent

### 4. Three-Month Warning

- Runs: 1st day of each month at 10:00 AM
- Emails officers absent for 3+ consecutive months

## Testing Workflow

1. Create admin officer
2. Create regular officers
3. Create offices
4. Add officers to offices
5. Create monthly meeting (or wait for automatic creation)
6. Officers check in to meeting
7. View attendance and statistics
8. System automatically sends notifications after meeting
9. View attendance history
10. Check for officers absent 3+ months

## Environment Variables

Required for email notifications:
\`\`\`
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=your_email@gmail.com
\`\`\`

## Health Check

**Endpoint:** `GET /health`

\`\`\`json
{
"status": "success",
"message": "Server is running",
"timestamp": "2024-11-15T10:30:00.000Z"
}
\`\`\`
