import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { Logger } from "../utils/logger";
import {
  CheckInByUniqueCodeDto,
  CheckInByFingerprintDto,
  MarkAbsentDto,
} from "../lib/types/DTOs";
import { validateRequest } from "../middlewares/auth.middleware";

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance tracking endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Attendance:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The attendance record ID
 *         meetingId:
 *           type: string
 *           description: Associated meeting ID
 *         officerId:
 *           type: string
 *           description: Officer ID
 *         checkInTime:
 *           type: string
 *           format: date-time
 *           description: Check-in timestamp
 *         checkOutTime:
 *           type: string
 *           format: date-time
 *           description: Check-out timestamp
 *         status:
 *           type: string
 *           enum: [present, absent, late]
 *           description: Attendance status
 *       example:
 *         id: 507f1f77bcf86cd799439011
 *         meetingId: 507f1f77bcf86cd799439012
 *         officerId: 507f1f77bcf86cd799439013
 *         checkInTime: 2025-12-19T09:00:00Z
 *         checkOutTime: 2025-12-19T11:00:00Z
 *         status: present
 */

export const attendanceRouter = Router();
const attendanceController = new AttendanceController();
const logger = new Logger("AttendanceRoutes");

attendanceRouter.use((req, res, next) => {
  logger.info("Incoming attendance route request", {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
  });
  next();
});

/**
 * @swagger
 * /attendance/checkin/unique-code:
 *   post:
 *     summary: Check in by unique code
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uniqueCode
 *               - meetingId
 *             properties:
 *               uniqueCode:
 *                 type: string
 *                 description: Officer's unique code
 *                 example: OFC001
 *               meetingId:
 *                 type: string
 *                 description: Meeting ID
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Checked in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
 *       400:
 *         description: Invalid request or already checked in
 *       404:
 *         description: Officer or meeting not found
 */
attendanceRouter.post(
  "/checkin/unique-code",
  validateRequest(CheckInByUniqueCodeDto),
  attendanceController.checkInByUniqueCode
);

/**
 * @swagger
 * /attendance/checkin/fingerprint:
 *   post:
 *     summary: Check in by fingerprint
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fingerprintData
 *               - meetingId
 *             properties:
 *               fingerprintData:
 *                 type: string
 *                 description: Fingerprint biometric data
 *               meetingId:
 *                 type: string
 *                 description: Meeting ID
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Checked in successfully
 *       400:
 *         description: Invalid fingerprint or already checked in
 *       404:
 *         description: Officer or meeting not found
 */
attendanceRouter.post(
  "/checkin/fingerprint",
  validateRequest(CheckInByFingerprintDto),
  attendanceController.checkInByFingerprint
);

/**
 * @swagger
 * /attendance/{id}/checkout:
 *   patch:
 *     summary: Check out from meeting
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The attendance record ID
 *     responses:
 *       200:
 *         description: Checked out successfully
 *       404:
 *         description: Attendance record not found
 */
attendanceRouter.patch("/:id/checkout", attendanceController.checkOut);

/**
 * @swagger
 * /attendance/meeting/{meetingId}:
 *   get:
 *     summary: Get attendance records for a meeting
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: meetingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The meeting ID
 *     responses:
 *       200:
 *         description: List of attendance records
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
 *                     $ref: '#/components/schemas/Attendance'
 */
attendanceRouter.get(
  "/meeting/:meetingId",
  attendanceController.getAttendanceByMeeting
);

/**
 * @swagger
 * /attendance/meeting/{meetingId}/stats:
 *   get:
 *     summary: Get meeting attendance statistics
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: meetingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The meeting ID
 *     responses:
 *       200:
 *         description: Meeting attendance statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalExpected:
 *                       type: integer
 *                       example: 50
 *                     present:
 *                       type: integer
 *                       example: 45
 *                     absent:
 *                       type: integer
 *                       example: 5
 *                     attendanceRate:
 *                       type: number
 *                       example: 90.0
 */
attendanceRouter.get(
  "/meeting/:meetingId/stats",
  attendanceController.getMeetingStats
);

/**
 * @swagger
 * /attendance/mark-absent:
 *   post:
 *     summary: Mark officers as absent
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - meetingId
 *               - officerIds
 *             properties:
 *               meetingId:
 *                 type: string
 *                 description: Meeting ID
 *                 example: 507f1f77bcf86cd799439012
 *               officerIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of officer IDs to mark as absent
 *                 example: ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"]
 *     responses:
 *       200:
 *         description: Officers marked as absent successfully
 *       404:
 *         description: Meeting not found
 */
attendanceRouter.post(
  "/mark-absent",
  validateRequest(MarkAbsentDto),
  attendanceController.markAbsent
);

/**
 * @swagger
 * /attendance/officer/{officerId}/history:
 *   get:
 *     summary: Get officer attendance history
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: officerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The officer ID
 *     responses:
 *       200:
 *         description: Officer's attendance history
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
 *                     $ref: '#/components/schemas/Attendance'
 */
attendanceRouter.get(
  "/officer/:officerId/history",
  attendanceController.getOfficerAttendanceHistory
);

/**
 * @swagger
 * /attendance/absent/three-months:
 *   get:
 *     summary: Get officers absent for three consecutive months
 *     tags: [Attendance]
 *     responses:
 *       200:
 *         description: List of officers absent for three months
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
 *                     type: object
 *                     properties:
 *                       officerId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       consecutiveAbsences:
 *                         type: integer
 */
attendanceRouter.get(
  "/absent/three-months",
  attendanceController.getOfficersAbsentForThreeMonths
);
