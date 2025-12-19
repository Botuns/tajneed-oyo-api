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
 *         id:
 *           type: string
 *           description: The office ID
 *         name:
 *           type: string
 *           description: The office name
 *         location:
 *           type: string
 *           description: The office location
 *         officers:
 *           type: array
 *           items:
 *             type: string
 *           description: List of officer IDs assigned to this office
 *       example:
 *         id: 507f1f77bcf86cd799439011
 *         name: Main Office
 *         location: New York
 *         officers: ["507f1f77bcf86cd799439012"]
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
 *         description: The office ID
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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Main Office
 *               location:
 *                 type: string
 *                 example: New York
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
 *       401:
 *         description: Unauthorized - Admin access required
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
 *         description: The office ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Main Office Updated
 *               location:
 *                 type: string
 *                 example: New York, NY
 *     responses:
 *       200:
 *         description: Office updated successfully
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
 *     summary: Delete an office
 *     tags: [Offices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The office ID
 *     responses:
 *       200:
 *         description: Office deleted successfully
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
 *     summary: Add officer to office
 *     tags: [Offices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The office ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - officerId
 *             properties:
 *               officerId:
 *                 type: string
 *                 description: The officer ID to add
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Officer added successfully
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
