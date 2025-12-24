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
export declare const attendanceRouter: import("express-serve-static-core").Router;
