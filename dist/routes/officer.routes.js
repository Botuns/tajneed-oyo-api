"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.officerRouter = void 0;
const express_1 = require("express");
const officer_controller_1 = require("../controllers/officer.controller");
const logger_1 = require("../utils/logger");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const officer_dto_1 = require("../lib/types/DTOs/officer.dto");
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
exports.officerRouter = (0, express_1.Router)();
const officerController = new officer_controller_1.OfficerController();
const logger = new logger_1.Logger("OfficerRoutes");
exports.officerRouter.use((req, res, next) => {
    logger.info("Incoming officer route request", {
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.body,
    });
    next();
});
/**
 * @swagger
 * /officers:
 *   get:
 *     summary: Get all officers
 *     tags: [Officers]
 *     responses:
 *       200:
 *         description: List of all officers
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
 *                     $ref: '#/components/schemas/Officer'
 */
exports.officerRouter.get("/", officerController.getAllOfficers);
/**
 * @swagger
 * /officers/{id}:
 *   get:
 *     summary: Get officer by ID
 *     tags: [Officers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The officer ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Officer details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Officer'
 *       404:
 *         description: Officer not found
 */
exports.officerRouter.get("/:id", officerController.getOfficerById);
/**
 * @swagger
 * /officers/unique-code/{uniqueCode}:
 *   get:
 *     summary: Get officer by unique code
 *     tags: [Officers]
 *     parameters:
 *       - in: path
 *         name: uniqueCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The officer's unique code for attendance
 *         example: "OFC-ABC123"
 *     responses:
 *       200:
 *         description: Officer details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Officer'
 *       404:
 *         description: Officer not found
 */
exports.officerRouter.get("/unique-code/:uniqueCode", officerController.getOfficerByUniqueCode);
/**
 * @swagger
 * /officers:
 *   post:
 *     summary: Create a new officer
 *     tags: [Officers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOfficerDto'
 *     responses:
 *       201:
 *         description: Officer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Officer'
 *       400:
 *         description: Invalid request body
 */
exports.officerRouter.post("/", (0, auth_middleware_1.validateRequest)(officer_dto_1.CreateOfficerDto), officerController.createOfficer);
/**
 * @swagger
 * /officers/{id}:
 *   patch:
 *     summary: Update an officer
 *     tags: [Officers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The officer ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOfficerDto'
 *     responses:
 *       200:
 *         description: Officer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Officer'
 *       404:
 *         description: Officer not found
 */
exports.officerRouter.patch("/:id", (0, auth_middleware_1.validateRequest)(officer_dto_1.UpdateOfficerDto), officerController.updateOfficer);
/**
 * @swagger
 * /officers/{id}/fingerprint:
 *   post:
 *     summary: Register officer fingerprint
 *     tags: [Officers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The officer ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterFingerprintDto'
 *     responses:
 *       200:
 *         description: Fingerprint registered successfully
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
 *                   example: Fingerprint registered successfully
 *       404:
 *         description: Officer not found
 */
exports.officerRouter.post("/:id/fingerprint", (0, auth_middleware_1.validateRequest)(officer_dto_1.RegisterFingerprintDto), officerController.registerFingerprint);
/**
 * @swagger
 * /officers/{id}:
 *   delete:
 *     summary: Delete an officer (soft delete)
 *     tags: [Officers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The officer ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Officer deleted successfully
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
 *                   example: Officer deleted successfully
 *       404:
 *         description: Officer not found
 */
exports.officerRouter.delete("/:id", officerController.deleteOfficer);
