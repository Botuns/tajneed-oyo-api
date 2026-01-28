"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.officeRouter = void 0;
const express_1 = require("express");
const office_controller_1 = require("../controllers/office.controller");
const logger_1 = require("../utils/logger");
const DTOs_1 = require("../lib/types/DTOs");
const auth_middleware_1 = require("../middlewares/auth.middleware");
/**
 * @swagger
 * tags:
 *   name: Offices
 *   description: Office management endpoints
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Office:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The office ID
 *         name:
 *           type: string
 *           description: Office name
 *         email:
 *           type: string
 *           format: email
 *           description: Office email address
 *         description:
 *           type: string
 *           description: Office description
 *         officers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Officer ID
 *               name:
 *                 type: string
 *                 description: Officer full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Officer email
 *           description: Array of officers assigned to this office (summary)
 *         totalOfficers:
 *           type: integer
 *           description: Total number of officers in the office
 *         responsibilities:
 *           type: array
 *           items:
 *             type: string
 *           description: List of office responsibilities
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
 *         name: "Finance Department"
 *         email: "finance@tajneed.org"
 *         description: "Handles all financial matters"
 *         officers:
 *           - id: "507f1f77bcf86cd799439012"
 *             name: "Jane Doe"
 *             email: "jane.doe@tajneed.org"
 *         totalOfficers: 5
 *         responsibilities: ["Budget management", "Financial reporting"]
 *         isDeleted: false
 *     CreateOfficeDto:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - description
 *         - responsibilities
 *       properties:
 *         name:
 *           type: string
 *           example: "Finance Department"
 *         email:
 *           type: string
 *           format: email
 *           example: "finance@tajneed.org"
 *         description:
 *           type: string
 *           example: "Handles all financial matters for the organization"
 *         responsibilities:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Budget management", "Financial reporting", "Expense tracking"]
 *     UpdateOfficeDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Finance Department Updated"
 *         email:
 *           type: string
 *           format: email
 *           example: "finance.updated@tajneed.org"
 *         description:
 *           type: string
 *           example: "Updated description"
 *         responsibilities:
 *           type: array
 *           items:
 *             type: string
 *     AddOfficerToOfficeDto:
 *       type: object
 *       required:
 *         - officerId
 *       properties:
 *         officerId:
 *           type: string
 *           description: The officer ID to add to this office
 *           example: "507f1f77bcf86cd799439012"
 */
exports.officeRouter = (0, express_1.Router)();
const officeController = new office_controller_1.OfficeController();
const logger = new logger_1.Logger("OfficeRoutes");
// officeRouter.use(isAuthenticated);
exports.officeRouter.use((req, res, next) => {
    logger.info("Incoming office route request", {
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.body,
    });
    next();
});
/**
 * @swagger
 * /offices:
 *   get:
 *     summary: Get all offices
 *     tags: [Offices]
 *     responses:
 *       200:
 *         description: List of all offices
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
 *                     $ref: '#/components/schemas/Office'
 */
exports.officeRouter.get("/", officeController.getAllOffices);
/**
 * @swagger
 * /offices/{id}:
 *   get:
 *     summary: Get office by ID
 *     tags: [Offices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The office ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Office details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Office'
 *       404:
 *         description: Office not found
 */
exports.officeRouter.get("/:id", officeController.getOfficeById);
/**
 * @swagger
 * /offices:
 *   post:
 *     summary: Create a new office
 *     tags: [Offices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOfficeDto'
 *     responses:
 *       201:
 *         description: Office created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Office'
 *       400:
 *         description: Invalid request body
 */
exports.officeRouter.post("/", 
// isAdmin,
(0, auth_middleware_1.validateRequest)(DTOs_1.CreateOfficeDto), officeController.createOffice);
/**
 * @swagger
 * /offices/{id}:
 *   patch:
 *     summary: Update an office
 *     tags: [Offices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The office ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOfficeDto'
 *     responses:
 *       200:
 *         description: Office updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Office'
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Office not found
 */
exports.officeRouter.patch("/:id", auth_middleware_1.isAdmin, (0, auth_middleware_1.validateRequest)(DTOs_1.UpdateOfficeDto), officeController.updateOffice);
/**
 * @swagger
 * /offices/{id}:
 *   delete:
 *     summary: Delete an office (soft delete)
 *     tags: [Offices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The office ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Office deleted successfully
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
 *                   example: Office deleted successfully
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Office not found
 */
exports.officeRouter.delete("/:id", auth_middleware_1.isAdmin, officeController.deleteOffice);
/**
 * @swagger
 * /offices/{id}/officers:
 *   post:
 *     summary: Add an officer to an office
 *     tags: [Offices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The office ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddOfficerToOfficeDto'
 *     responses:
 *       200:
 *         description: Officer added to office successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Office'
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Office or officer not found
 */
exports.officeRouter.post("/:id/officers", auth_middleware_1.isAdmin, (0, auth_middleware_1.validateRequest)(DTOs_1.AddOfficerToOfficeDto), officeController.addOfficerToOffice);
/**
 * @swagger
 * /offices/{id}/officers:
 *   delete:
 *     summary: Remove an officer from an office
 *     tags: [Offices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The office ID (MongoDB ObjectId)
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddOfficerToOfficeDto'
 *     responses:
 *       200:
 *         description: Officer removed from office successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Office'
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Office or officer not found
 */
exports.officeRouter.delete("/:id/officers", auth_middleware_1.isAdmin, (0, auth_middleware_1.validateRequest)(DTOs_1.AddOfficerToOfficeDto), officeController.removeOfficerFromOffice);
