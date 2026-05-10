import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { Logger } from "../utils/logger";
import {
  CheckInByUniqueCodeDto,
  CheckInByFingerprintDto,
  MarkAbsentDto,
  CheckInMulkByUniqueCodeDto,
  CheckInMulkByFingerprintDto,
  CheckInGuestDto,
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
 *         _id:
 *           type: string
 *           description: The attendance record ID
 *         meetingId:
 *           type: string
 *           description: Associated meeting ID
 *         userId:
 *           type: string
 *           description: User (officer/guest) ID
 *         userType:
 *           type: string
 *           enum: [ADMIN, OFFICER, GUEST]
 *           description: Type of user
 *         attendanceType:
 *           type: string
 *           enum: [FINGERPRINT, UNIQUE_CODE, GUEST_DETAILS]
 *           description: Method used for check-in
 *         meetingDate:
 *           type: string
 *           format: date-time
 *           description: Date of the meeting
 *         checkInTime:
 *           type: string
 *           format: date-time
 *           description: Check-in timestamp
 *         checkOutTime:
 *           type: string
 *           format: date-time
 *           description: Check-out timestamp
 *         month:
 *           type: string
 *           enum: [JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER]
 *           description: Month of attendance
 *         verified:
 *           type: boolean
 *           description: Whether attendance is verified
 *         verifiedBy:
 *           type: string
 *           description: Officer ID who verified
 *         status:
 *           type: string
 *           enum: [PRESENT, ABSENT, LATE, EXCUSED]
 *           description: Attendance status
 *         remarks:
 *           type: string
 *           description: Additional remarks
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
 *         meetingId: "507f1f77bcf86cd799439012"
 *         userId: "507f1f77bcf86cd799439013"
 *         userType: "OFFICER"
 *         attendanceType: "UNIQUE_CODE"
 *         meetingDate: "2025-12-19T00:00:00Z"
 *         checkInTime: "2025-12-19T09:00:00Z"
 *         checkOutTime: "2025-12-19T11:00:00Z"
 *         month: "DECEMBER"
 *         verified: true
 *         status: "PRESENT"
 *         isDeleted: false
 *     CheckInByUniqueCodeDto:
 *       type: object
 *       required:
 *         - meetingId
 *         - uniqueCode
 *       properties:
 *         meetingId:
 *           type: string
 *           description: The meeting ID to check into
 *           example: "507f1f77bcf86cd799439012"
 *         uniqueCode:
 *           type: string
 *           description: Officer's unique code
 *           example: "OFC-ABC123"
 *     CheckInByFingerprintDto:
 *       type: object
 *       required:
 *         - meetingId
 *         - fingerprint
 *       properties:
 *         meetingId:
 *           type: string
 *           description: The meeting ID to check into
 *           example: "507f1f77bcf86cd799439012"
 *         fingerprint:
 *           type: string
 *           description: Base64 encoded fingerprint data
 *           example: "base64_encoded_fingerprint_data"
 *     MarkAbsentDto:
 *       type: object
 *       required:
 *         - meetingId
 *         - officerId
 *       properties:
 *         meetingId:
 *           type: string
 *           description: The meeting ID
 *           example: "507f1f77bcf86cd799439012"
 *         officerId:
 *           type: string
 *           description: The officer ID to mark as absent
 *           example: "507f1f77bcf86cd799439013"
 *         remarks:
 *           type: string
 *           description: Optional remarks for the absence
 *           example: "Out of town"
 *     AttendanceStats:
 *       type: object
 *       properties:
 *         totalExpected:
 *           type: integer
 *           description: Total expected attendees
 *           example: 50
 *         present:
 *           type: integer
 *           description: Number of attendees present
 *           example: 45
 *         absent:
 *           type: integer
 *           description: Number of attendees absent
 *           example: 3
 *         late:
 *           type: integer
 *           description: Number of attendees late
 *           example: 2
 *         attendanceRate:
 *           type: number
 *           format: float
 *           description: Attendance rate percentage
 *           example: 90.0
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
 *     summary: Check in using unique code
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckInByUniqueCodeDto'
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
 *                 message:
 *                   type: string
 *                   example: Check-in successful
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
 *       400:
 *         description: Invalid unique code or already checked in
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
 *     summary: Check in using fingerprint
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckInByFingerprintDto'
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
 *                 message:
 *                   type: string
 *                   example: Check-in successful
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
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
 *     summary: Check out from a meeting
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The attendance record ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Checked out successfully
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
 *                   example: Check-out successful
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: Attendance record not found
 */
attendanceRouter.patch("/:id/checkout", attendanceController.checkOut);

/**
 * @swagger
 * /attendance/meeting/{meetingId}:
 *   get:
 *     summary: Get all attendance records for a meeting
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: meetingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The meeting ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439012"
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
 *     summary: Get attendance statistics for a meeting
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: meetingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The meeting ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439012"
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
 *                   $ref: '#/components/schemas/AttendanceStats'
 */
attendanceRouter.get(
  "/meeting/:meetingId/stats",
  attendanceController.getMeetingStats
);

/**
 * @swagger
 * /attendance/mark-absent:
 *   post:
 *     summary: Mark an officer as absent for a meeting
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarkAbsentDto'
 *     responses:
 *       200:
 *         description: Officer marked as absent successfully
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
 *                   example: Officer marked as absent
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: Meeting or officer not found
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
 *     summary: Get attendance history for an officer
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: officerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The officer ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439013"
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
 *         description: List of officers with three consecutive month absences
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
 *                       officer:
 *                         $ref: '#/components/schemas/Officer'
 *                       consecutiveAbsences:
 *                         type: integer
 *                         example: 3
 *                       months:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["OCTOBER", "NOVEMBER", "DECEMBER"]
 */
attendanceRouter.get(
  "/absent/three-months",
  attendanceController.getOfficersAbsentForThreeMonths
);

/**
 * @swagger
 * components:
 *   schemas:
 *     CheckInMulkByUniqueCodeDto:
 *       type: object
 *       required: [meetingId, uniqueCode]
 *       properties:
 *         meetingId: { type: string, example: "507f1f77bcf86cd799439012" }
 *         uniqueCode: { type: string, example: "MLK-XYZ123" }
 *     CheckInMulkByFingerprintDto:
 *       type: object
 *       required: [meetingId, fingerprint]
 *       properties:
 *         meetingId: { type: string, example: "507f1f77bcf86cd799439012" }
 *         fingerprint: { type: string, example: "base64_encoded_fingerprint_data" }
 *     CheckInGuestDto:
 *       type: object
 *       required: [meetingId, firstName, lastName, email, phoneNumber, auxiliary, state, purpose]
 *       properties:
 *         meetingId: { type: string, example: "507f1f77bcf86cd799439012" }
 *         firstName: { type: string, example: "Abdul" }
 *         lastName: { type: string, example: "Qahar" }
 *         email: { type: string, example: "guest@example.com" }
 *         phoneNumber: { type: string, example: "+2348012345678" }
 *         auxiliary: { type: string, enum: [KHUDDAM, ANSARULLAH, OTHERS], example: "KHUDDAM" }
 *         state: { type: string, example: "Oyo" }
 *         purpose: { type: string, example: "Observer" }
 *     MeetingAttendanceBreakdown:
 *       type: object
 *       properties:
 *         officers: { type: array, items: { $ref: '#/components/schemas/Attendance' } }
 *         dilaQaids: { type: array, items: { $ref: '#/components/schemas/Attendance' } }
 *         mulk: { type: array, items: { $ref: '#/components/schemas/Attendance' } }
 *         guests: { type: array, items: { $ref: '#/components/schemas/Attendance' } }
 *     RoleStats:
 *       type: object
 *       properties:
 *         present: { type: integer }
 *         absent: { type: integer }
 *         late: { type: integer }
 *         excused: { type: integer }
 *         total: { type: integer }
 *     MeetingStatsBreakdown:
 *       type: object
 *       properties:
 *         officers: { $ref: '#/components/schemas/RoleStats' }
 *         dilaQaids: { $ref: '#/components/schemas/RoleStats' }
 *         mulk: { $ref: '#/components/schemas/RoleStats' }
 *         guests: { $ref: '#/components/schemas/RoleStats' }
 *         totals: { $ref: '#/components/schemas/RoleStats' }
 */

/**
 * @swagger
 * /attendance/checkin/mulk/unique-code:
 *   post:
 *     summary: Check in a mulk member using unique code
 *     description: Same Officer record under the hood (Officer.isMulk = true). Rejects 400 if the code belongs to a non-mulk officer.
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CheckInMulkByUniqueCodeDto' }
 *     responses:
 *       201: { description: Mulk check-in successful }
 *       400: { description: Already checked in OR code belongs to a non-mulk officer }
 *       404: { description: Meeting not found OR no mulk member with this code }
 */
attendanceRouter.post(
  "/checkin/mulk/unique-code",
  validateRequest(CheckInMulkByUniqueCodeDto),
  attendanceController.checkInMulkByUniqueCode
);

/**
 * @swagger
 * /attendance/checkin/mulk/fingerprint:
 *   post:
 *     summary: Check in a mulk member using fingerprint
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CheckInMulkByFingerprintDto' }
 *     responses:
 *       201: { description: Mulk check-in successful }
 *       400: { description: Already checked in OR fingerprint belongs to a non-mulk officer }
 *       404: { description: Meeting not found OR no mulk member with this fingerprint }
 */
attendanceRouter.post(
  "/checkin/mulk/fingerprint",
  validateRequest(CheckInMulkByFingerprintDto),
  attendanceController.checkInMulkByFingerprint
);

/**
 * @swagger
 * /attendance/checkin/guest:
 *   post:
 *     summary: Walk-in guest check-in (creates the Guest record inline)
 *     description: |
 *       No pre-registration. The Guest record is created on first call (or reused if a guest with the same phoneNumber already exists).
 *       Duplicate check-in for the same meeting is rejected.
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CheckInGuestDto' }
 *     responses:
 *       201: { description: Guest check-in successful }
 *       400: { description: Guest already checked in for this meeting }
 *       404: { description: Meeting not found }
 */
attendanceRouter.post(
  "/checkin/guest",
  validateRequest(CheckInGuestDto),
  attendanceController.checkInGuest
);

/**
 * @swagger
 * /attendance/meeting/{meetingId}/breakdown:
 *   get:
 *     summary: Get attendance broken down by role (officers, Dila Qaids, mulk, guests)
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: meetingId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Per-role attendance lists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/MeetingAttendanceBreakdown' }
 *       404: { description: Meeting not found }
 */
attendanceRouter.get(
  "/meeting/:meetingId/breakdown",
  attendanceController.getMeetingBreakdown
);

/**
 * @swagger
 * /attendance/meeting/{meetingId}/stats/breakdown:
 *   get:
 *     summary: Get attendance counts per role and per status
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: meetingId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Per-role status counts plus totals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/MeetingStatsBreakdown' }
 *       404: { description: Meeting not found }
 */
attendanceRouter.get(
  "/meeting/:meetingId/stats/breakdown",
  attendanceController.getMeetingStatsBreakdown
);
