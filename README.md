# Oyo Ilaqa Attendance System API

Enterprise-grade attendance management system for Oyo Ilaqa meetings with automated scheduling, notifications, and tracking.

## Features

### Core Functionality

- **Officer Management**: Enrollment, fingerprint registration, unique code generation
- **Office Management**: Create and manage organizational offices
- **Meeting Management**: CRUD operations, automatic scheduling for 2nd Saturday
- **Attendance Tracking**: Check-in via fingerprint or unique code
- **Automated Reminders**: Email notifications 1 week before meetings
- **Absence Tracking**: Automatic notifications for absent officers
- **3-Month Rule**: Track and warn officers absent for 3+ months

### Automated Tasks

- Monthly meeting creation (2nd Saturday)
- Weekly reminder emails (Saturday 9 AM)
- Post-meeting absence notifications (Saturday 6 PM)
- Monthly 3-month absence check (1st day 10 AM)

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Scheduling**: node-cron
- **Email**: Nodemailer
- **Logging**: Winston
- **Validation**: Zod & express-validator
- **Security**: Helmet, CORS, Rate Limiting

## Installation

\`\`\`bash
npm install
\`\`\`

## Configuration

Copy \`.env.example\` to \`.env\` and configure:

\`\`\`bash
cp .env.example .env
\`\`\`

Key configurations:

- \`MONGODB_URI\`: MongoDB connection string
- \`SMTP\_\*\`: Email service credentials
- \`JWT_SECRET\`: Secret key for authentication

## Running the Application

### Development

\`\`\`bash
npm run dev
\`\`\`

### Production

\`\`\`bash
npm run build
npm start
\`\`\`

## API Endpoints

### Officers

- \`POST /v1/officers\` - Create officer
- \`GET /v1/officers\` - Get all officers
- \`GET /v1/officers/:id\` - Get officer by ID
- \`GET /v1/officers/unique-code/:code\` - Get by unique code
- \`PATCH /v1/officers/:id\` - Update officer
- \`DELETE /v1/officers/:id\` - Delete officer
- \`POST /v1/officers/:id/fingerprint\` - Register fingerprint

### Offices

- \`POST /v1/offices\` - Create office
- \`GET /v1/offices\` - Get all offices
- \`GET /v1/offices/:id\` - Get office by ID
- \`PATCH /v1/offices/:id\` - Update office
- \`DELETE /v1/offices/:id\` - Delete office
- \`POST /v1/offices/:id/officers\` - Add officer to office

### Meetings

- \`POST /v1/meetings\` - Create meeting
- \`POST /v1/meetings/monthly\` - Create monthly meeting
- \`GET /v1/meetings\` - Get all meetings
- \`GET /v1/meetings/upcoming\` - Get upcoming meetings
- \`GET /v1/meetings/:id\` - Get meeting by ID
- \`PATCH /v1/meetings/:id\` - Update meeting
- \`PATCH /v1/meetings/:id/status\` - Update meeting status
- \`POST /v1/meetings/:id/attendees\` - Add expected attendees
- \`DELETE /v1/meetings/:id\` - Delete meeting

### Attendance

- \`POST /v1/attendance/checkin/unique-code\` - Check in with unique code
- \`POST /v1/attendance/checkin/fingerprint\` - Check in with fingerprint
- \`PATCH /v1/attendance/:id/checkout\` - Check out
- \`GET /v1/attendance/meeting/:id\` - Get attendance for meeting
- \`GET /v1/attendance/meeting/:id/stats\` - Get meeting statistics
- \`POST /v1/attendance/mark-absent\` - Mark officer absent
- \`GET /v1/attendance/officer/:id/history\` - Get officer attendance history
- \`GET /v1/attendance/absent/three-months\` - Get officers absent 3+ months

## Project Structure

\`\`\`
src/
├── app.ts # Application setup
├── server.ts # Server entry point
├── configs/  
│ ├── database.ts # MongoDB configuration
│ └── environment.ts # Environment variables
├── controllers/ # Request handlers
├── services/ # Business logic
│ ├── meeting.service.ts
│ ├── attendance.service.ts
│ ├── officer.service.ts
│ ├── office.service.ts
│ ├── notification.service.ts
│ └── scheduler.service.ts
├── repositories/ # Data access layer
├── models/ # Mongoose schemas
├── routes/ # API routes
├── middlewares/ # Custom middleware
├── interfaces/ # TypeScript interfaces
├── enums/ # Enums and constants
├── lib/types/DTOs/ # Data transfer objects
└── utils/ # Utility functions
\`\`\`

## Scheduled Tasks

### Monthly Meeting Creation

- **Schedule**: 1st day of month at midnight
- **Action**: Creates meeting for 2nd Saturday of current month

### Meeting Reminders

- **Schedule**: Every Saturday at 9:00 AM
- **Action**: Send reminders for meetings within next 7 days

### Absence Notifications

- **Schedule**: Every Saturday at 6:00 PM
- **Action**: Notify officers who were absent from today's meetings

### Three-Month Check

- **Schedule**: 1st day of month at 10:00 AM
- **Action**: Warn officers absent for 3+ consecutive months

## Development

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Consistent logging with Winston
- Comprehensive error handling

### Best Practices

- Repository pattern for data access
- Service layer for business logic
- DTO validation for requests
- Centralized error handling
- Request/response logging

## Security

- JWT authentication
- Rate limiting
- CORS protection
- Helmet security headers
- MongoDB sanitization
- Input validation

## License

ISC
