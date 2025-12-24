/**
 * @swagger
 * tags:
 *   name: Officers
 *   description: Officer management endpoints
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Officer:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The officer ID
 *         firstName:
 *           type: string
 *           description: Officer's first name
 *         lastName:
 *           type: string
 *           description: Officer's last name
 *         email:
 *           type: string
 *           format: email
 *           description: Officer's email address
 *         phoneNumber:
 *           type: string
 *           description: Officer's phone number
 *         uniqueCode:
 *           type: string
 *           description: Auto-generated unique code for attendance
 *         fingerprint:
 *           type: string
 *           description: Fingerprint data for biometric check-in
 *         offices:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of office IDs the officer belongs to
 *         userType:
 *           type: string
 *           enum: [ADMIN, OFFICER, GUEST]
 *           description: Type of user
 *         isAdmin:
 *           type: boolean
 *           description: Whether the officer has admin privileges
 *         tenureStart:
 *           type: string
 *           format: date-time
 *           description: Start date of tenure
 *         tenureEnd:
 *           type: string
 *           format: date-time
 *           description: End date of tenure (optional)
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
 *         firstName: "John"
 *         lastName: "Doe"
 *         email: "john.doe@example.com"
 *         phoneNumber: "+2348012345678"
 *         uniqueCode: "OFC-ABC123"
 *         userType: "OFFICER"
 *         isAdmin: false
 *         tenureStart: "2024-01-01T00:00:00Z"
 *         offices: ["507f1f77bcf86cd799439012"]
 *     CreateOfficerDto:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNumber
 *         - tenureStart
 *       properties:
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345678"
 *         offices:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of office IDs
 *           example: ["507f1f77bcf86cd799439012"]
 *         userType:
 *           type: string
 *           enum: [ADMIN, OFFICER, GUEST]
 *           example: "OFFICER"
 *         isAdmin:
 *           type: boolean
 *           example: false
 *         tenureStart:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         tenureEnd:
 *           type: string
 *           format: date-time
 *           example: "2025-12-31T23:59:59Z"
 *     UpdateOfficerDto:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.updated@example.com"
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345678"
 *         offices:
 *           type: array
 *           items:
 *             type: string
 *         userType:
 *           type: string
 *           enum: [ADMIN, OFFICER, GUEST]
 *         isAdmin:
 *           type: boolean
 *         tenureStart:
 *           type: string
 *           format: date-time
 *         tenureEnd:
 *           type: string
 *           format: date-time
 *     RegisterFingerprintDto:
 *       type: object
 *       required:
 *         - fingerprintData
 *       properties:
 *         fingerprintData:
 *           type: string
 *           description: Base64 encoded fingerprint data
 *           example: "base64_encoded_fingerprint_data"
 */
export declare const officerRouter: import("express-serve-static-core").Router;
