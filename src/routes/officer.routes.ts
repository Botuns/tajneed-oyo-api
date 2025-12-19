import { Router } from "express";
import { OfficerController } from "../controllers/officer.controller";
import { Logger } from "../utils/logger";
import { validateRequest } from "../middlewares/auth.middleware";
import {
  CreateOfficerDto,
  UpdateOfficerDto,
  RegisterFingerprintDto,
} from "../lib/types/DTOs/officer.dto";

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
 *         id:
 *           type: string
 *           description: The officer ID
 *         name:
 *           type: string
 *           description: The officer's name
 *         uniqueCode:
 *           type: string
 *           description: The officer's unique code
 *         email:
 *           type: string
 *           description: The officer's email
 *         phone:
 *           type: string
 *           description: The officer's phone number
 *       example:
 *         id: 507f1f77bcf86cd799439011
 *         name: John Doe
 *         uniqueCode: OFC001
 *         email: john.doe@example.com
 *         phone: "+1234567890"
 */

export const officerRouter = Router();
const officerController = new OfficerController();
const logger = new Logger("OfficerRoutes");

officerRouter.use((req, res, next) => {
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
officerRouter.get("/", officerController.getAllOfficers);

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
 *         description: The officer ID
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
officerRouter.get("/:id", officerController.getOfficerById);

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
 *         description: The officer's unique code
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
officerRouter.get(
  "/unique-code/:uniqueCode",
  officerController.getOfficerByUniqueCode
);

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
 *             type: object
 *             required:
 *               - name
 *               - uniqueCode
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               uniqueCode:
 *                 type: string
 *                 example: OFC001
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
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
officerRouter.post(
  "/",
  validateRequest(CreateOfficerDto),
  officerController.createOfficer
);

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
 *         description: The officer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe Updated
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.updated@example.com
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: Officer updated successfully
 *       404:
 *         description: Officer not found
 */
officerRouter.patch(
  "/:id",
  validateRequest(UpdateOfficerDto),
  officerController.updateOfficer
);

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
 *         description: The officer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fingerprintData
 *             properties:
 *               fingerprintData:
 *                 type: string
 *                 description: The fingerprint data
 *     responses:
 *       200:
 *         description: Fingerprint registered successfully
 *       404:
 *         description: Officer not found
 */
officerRouter.post(
  "/:id/fingerprint",
  validateRequest(RegisterFingerprintDto),
  officerController.registerFingerprint
);

/**
 * @swagger
 * /officers/{id}:
 *   delete:
 *     summary: Delete an officer
 *     tags: [Officers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The officer ID
 *     responses:
 *       200:
 *         description: Officer deleted successfully
 *       404:
 *         description: Officer not found
 */
officerRouter.delete("/:id", officerController.deleteOfficer);
