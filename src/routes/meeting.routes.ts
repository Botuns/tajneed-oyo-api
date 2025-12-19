import { Router } from "express";
import { MeetingController } from "../controllers/meeting.controller";
import { Logger } from "../utils/logger";
import {
  CreateMeetingDto,
  UpdateMeetingDto,
  UpdateMeetingStatusDto,
  AddExpectedAttendeesDto,
  CreateMonthlyMeetingDto,
} from "../lib/types/DTOs";
import {
  isAdmin,
  isAuthenticated,
  validateRequest,
} from "../middlewares/auth.middleware";

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

export const meetingRouter = Router();
const meetingController = new MeetingController();
const logger = new Logger("MeetingRoutes");

meetingRouter.use((req, res, next) => {
  logger.info("Incoming meeting route request", {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
  });
  next();
});

/**
 * @swagger
 * /meetings:
 *   get:
 *     summary: Get all meetings
 *     tags: [Meetings]
 *     responses:
 *       200:
 *         description: List of all meetings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Meeting'
 */
meetingRouter.get("/", meetingController.getAllMeetings);

/**
 * @swagger
 * /meetings/upcoming:
 *   get:
 *     summary: Get upcoming meetings
 *     tags: [Meetings]
 *     responses:
 *       200:
 *         description: List of upcoming meetings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Meeting'
 */
meetingRouter.get("/upcoming", meetingController.getUpcomingMeetings);

/**
 * @swagger
 * /meetings/{id}:
 *   get:
 *     summary: Get meeting by ID
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The meeting ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Meeting details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Meeting'
 *       404:
 *         description: Meeting not found
 */
meetingRouter.get("/:id", meetingController.getMeetingById);

/**
 * @swagger
 * /meetings:
 *   post:
 *     summary: Create a new meeting
 *     tags: [Meetings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMeetingDto'
 *     responses:
 *       201:
 *         description: Meeting created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Meeting'
 *       400:
 *         description: Invalid request body
 */
meetingRouter.post(
  "/",
  validateRequest(CreateMeetingDto),
  meetingController.createMeeting
);

/**
 * @swagger
 * /meetings/monthly:
 *   post:
 *     summary: Create monthly recurring meeting (auto-generated)
 *     tags: [Meetings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMonthlyMeetingDto'
 *     responses:
 *       201:
 *         description: Monthly meeting created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Meeting'
 *       400:
 *         description: Invalid request body
 */
meetingRouter.post(
  "/monthly",
  validateRequest(CreateMonthlyMeetingDto),
  meetingController.createMonthlyMeeting
);

/**
 * @swagger
 * /meetings/{id}:
 *   patch:
 *     summary: Update a meeting
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The meeting ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMeetingDto'
 *     responses:
 *       200:
 *         description: Meeting updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Meeting'
 *       404:
 *         description: Meeting not found
 */
meetingRouter.patch(
  "/:id",
  validateRequest(UpdateMeetingDto),
  meetingController.updateMeeting
);

/**
 * @swagger
 * /meetings/{id}/status:
 *   patch:
 *     summary: Update meeting status
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The meeting ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMeetingStatusDto'
 *     responses:
 *       200:
 *         description: Meeting status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Meeting'
 *       404:
 *         description: Meeting not found
 */
meetingRouter.patch(
  "/:id/status",
  validateRequest(UpdateMeetingStatusDto),
  meetingController.updateMeetingStatus
);

/**
 * @swagger
 * /meetings/{id}/attendees:
 *   post:
 *     summary: Add expected attendees to a meeting
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The meeting ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddExpectedAttendeesDto'
 *     responses:
 *       200:
 *         description: Attendees added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Meeting'
 *       404:
 *         description: Meeting not found
 */
meetingRouter.post(
  "/:id/attendees",
  validateRequest(AddExpectedAttendeesDto),
  meetingController.addExpectedAttendees
);

/**
 * @swagger
 * /meetings/{id}:
 *   delete:
 *     summary: Delete a meeting (soft delete)
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The meeting ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Meeting deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Meeting deleted successfully
 *       404:
 *         description: Meeting not found
 */
meetingRouter.delete("/:id", meetingController.deleteMeeting);
