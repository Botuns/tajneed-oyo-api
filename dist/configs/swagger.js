"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const environment_1 = require("./environment");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Tajneed OYO API",
            version: "1.0.0",
            description: "API documentation for Tajneed OYO Management System",
            contact: {
                name: "API Support",
            },
        },
        servers: [
            {
                url: `https://tajneed-api.azurewebsites.net/${environment_1.environmentConfig.API_VERSION}`,
                description: "Production server",
            },
            {
                url: `http://localhost:${environment_1.environmentConfig.PORT}/${environment_1.environmentConfig.API_VERSION}`,
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT token",
                },
            },
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "error",
                        },
                        message: {
                            type: "string",
                            example: "Error message",
                        },
                    },
                },
                Success: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "success",
                        },
                        message: {
                            type: "string",
                            example: "Operation successful",
                        },
                        data: {
                            type: "object",
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        "./src/routes/*.ts",
        "./src/controllers/*.ts",
        "./src/lib/types/DTOs/*.ts",
    ],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
