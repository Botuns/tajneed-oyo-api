import swaggerJsdoc from "swagger-jsdoc";
import { environmentConfig } from "./environment";

const options: swaggerJsdoc.Options = {
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
        url: `https://tajneed-api.azurewebsites.net/${environmentConfig.API_VERSION}`,
        description: "Production server",
      },
      {
        url: `http://localhost:${environmentConfig.PORT}/${environmentConfig.API_VERSION}`,
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

export const swaggerSpec = swaggerJsdoc(options);
