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
export declare const officeRouter: import("express-serve-static-core").Router;
