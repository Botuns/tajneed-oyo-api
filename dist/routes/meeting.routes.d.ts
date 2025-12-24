/**
 * @swagger
 * tags:
 *   name: Meetings
 *   description: Meeting management endpoints
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Meeting:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The meeting ID
 *         title:
 *           type: string
 *           description: Meeting title
 *         description:
 *           type: string
 *           description: Meeting description
 *         date:
 *           type: string
 *           format: date-time
 *           description: Meeting date
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Meeting start time
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: Meeting end time
 *         location:
 *           type: string
 *           description: Meeting location
 *         organizer:
 *           type: string
 *           description: Organizer officer ID
 *         expectedAttendees:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of expected attendee officer IDs
 *         status:
 *           type: string
 *           enum: [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED]
 *           description: Meeting status
 *         isDeleted:
 *           type: boolean
 *           description: Soft delete flag
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         title: "Monthly Tajneed Meeting"
 *         description: "Regular monthly meeting for all officers"
 *         date: "2025-12-20T00:00:00Z"
 *         startTime: "2025-12-20T10:00:00Z"
 *         endTime: "2025-12-20T12:00:00Z"
 *         location: "Main Hall"
 *         organizer: "507f1f77bcf86cd799439012"
 *         expectedAttendees: ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"]
 *         status: "SCHEDULED"
 *         isDeleted: false
 *     CreateMeetingDto:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - date
 *         - startTime
 *         - endTime
 *         - location
 *         - organizer
 *       properties:
 *         title:
 *           type: string
 *           example: "Monthly Tajneed Meeting"
 *         description:
 *           type: string
 *           example: "Regular monthly meeting for all officers"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2025-12-20T00:00:00Z"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2025-12-20T10:00:00Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2025-12-20T12:00:00Z"
 *         location:
 *           type: string
 *           example: "Main Hall"
 *         organizer:
 *           type: string
 *           description: Organizer officer ID
 *           example: "507f1f77bcf86cd799439012"
 *         expectedAttendees:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of officer IDs expected to attend
 *           example: ["507f1f77bcf86cd799439013"]
 *     UpdateMeetingDto:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Updated Meeting Title"
 *         description:
 *           type: string
 *           example: "Updated description"
 *         date:
 *           type: string
 *           format: date-time
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         organizer:
 *           type: string
 *         expectedAttendees:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 *           enum: [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED]
 *     UpdateMeetingStatusDto:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED]
 *           example: "IN_PROGRESS"
 *     AddExpectedAttendeesDto:
 *       type: object
 *       required:
 *         - officerIds
 *       properties:
 *         officerIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of officer IDs to add as expected attendees
 *           example: ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"]
 *     CreateMonthlyMeetingDto:
 *       type: object
 *       required:
 *         - organizerId
 *       properties:
 *         organizerId:
 *           type: string
 *           description: The officer ID who will organize monthly meetings
 *           example: "507f1f77bcf86cd799439012"
 */
export declare const meetingRouter: import("express-serve-static-core").Router;
