import { Router } from "express";
import { OfficeController } from "../controllers/office.controller";

import { Logger } from "../utils/logger";
import {
  AddOfficerToOfficeDto,
  CreateOfficeDto,
  UpdateOfficeDto,
} from "../lib/types/DTOs";
import {
  isAdmin,
  isAuthenticated,
  validateRequest,
} from "../middlewares/auth.middleware";

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
 *             type: string
 *           description: Array of officer IDs assigned to this office
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
 *         officers: ["507f1f77bcf86cd799439012"]
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

export const officeRouter = Router();
const officeController = new OfficeController();
const logger = new Logger("OfficeRoutes");

// officeRouter.use(isAuthenticated);

officeRouter.use((req, res, next) => {
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
officeRouter.get("/", officeController.getAllOffices);

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
officeRouter.get("/:id", officeController.getOfficeById);

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
officeRouter.post(
  "/",
  // isAdmin,
  validateRequest(CreateOfficeDto),
  officeController.createOffice
);

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
officeRouter.patch(
  "/:id",
  isAdmin,
  validateRequest(UpdateOfficeDto),
  officeController.updateOffice
);

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
officeRouter.delete("/:id", isAdmin, officeController.deleteOffice);

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
officeRouter.post(
  "/:id/officers",
  isAdmin,
  validateRequest(AddOfficerToOfficeDto),
  officeController.addOfficerToOffice
);
