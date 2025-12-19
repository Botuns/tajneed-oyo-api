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
 *         id:
 *           type: string
 *           description: The meeting ID
 *         title:
 *           type: string
 *           description: The meeting title
 *         description:
 *           type: string
 *           description: Meeting description
 *         date:
 *           type: string
 *           format: date-time
 *           description: Meeting date and time
 *         location:
 *           type: string
 *           description: Meeting location
 *         status:
 *           type: string
 *           enum: [scheduled, ongoing, completed, cancelled]
 *           description: Meeting status
 *         officeId:
 *           type: string
 *           description: Associated office ID
 *         expectedAttendees:
 *           type: array
 *           items:
 *             type: string
 *           description: List of expected officer IDs
 *       example:
 *         id: 507f1f77bcf86cd799439011
 *         title: Monthly Review
 *         description: Monthly team review meeting
 *         date: 2025-12-20T10:00:00Z
 *         location: Conference Room A
 *         status: scheduled
 *         officeId: 507f1f77bcf86cd799439012
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
 *         description: The meeting ID
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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - officeId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Monthly Review
 *               description:
 *                 type: string
 *                 example: Monthly team review meeting
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-12-20T10:00:00Z
 *               location:
 *                 type: string
 *                 example: Conference Room A
 *               officeId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       201:
 *         description: Meeting created successfully
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
 *     summary: Create monthly recurring meeting
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - dayOfMonth
 *               - officeId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Monthly Review
 *               description:
 *                 type: string
 *                 example: Recurring monthly meeting
 *               dayOfMonth:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 31
 *                 example: 15
 *               location:
 *                 type: string
 *                 example: Conference Room A
 *               officeId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       201:
 *         description: Monthly meeting created successfully
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The meeting ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Meeting updated successfully
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The meeting ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [scheduled, ongoing, completed, cancelled]
 *                 example: ongoing
 *     responses:
 *       200:
 *         description: Meeting status updated successfully
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
 *     summary: Add expected attendees to meeting
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The meeting ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - officerIds
 *             properties:
 *               officerIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
 *     responses:
 *       200:
 *         description: Attendees added successfully
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
 *     summary: Delete a meeting
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The meeting ID
 *     responses:
 *       200:
 *         description: Meeting deleted successfully
 *       404:
 *         description: Meeting not found
 */
meetingRouter.delete("/:id", meetingController.deleteMeeting);
