"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configValidationErrors = exports.environmentConfig = void 0;
exports.validateConfig = validateConfig;
exports.isProduction = isProduction;
exports.isDevelopment = isDevelopment;
exports.isTest = isTest;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env.local first, then fall back to .env
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env.local") });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
exports.environmentConfig = {
    PORT: process.env.PORT || 4000,
    NODE_ENV: process.env.NODE_ENV || "development",
    API_VERSION: process.env.API_VERSION || "v1",
    DATABASE: {
        MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/attendance_system",
        MAX_POOL_SIZE: parseInt(process.env.DB_MAX_POOL_SIZE || "10"),
        RETRY_WRITES: process.env.DB_RETRY_WRITES === "true",
        CONNECTION_TIMEOUT: parseInt(process.env.DB_CONNECTION_TIMEOUT || "10000"),
        KEEPALIVE: process.env.DB_KEEPALIVE === "true",
        OPTIONS: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
        },
    },
    AUTH: {
        JWT_SECRET: process.env.JWT_SECRET || "fallback_secret_key",
        JWT_EXPIRATION: process.env.JWT_EXPIRATION || "24h",
        REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION || "7d",
        PASSWORD_SALT_ROUNDS: parseInt(process.env.PASSWORD_SALT_ROUNDS || "10"),
        TOKEN_HEADER: process.env.TOKEN_HEADER || "Authorization",
    },
    LOGGING: {
        LEVEL: process.env.LOG_LEVEL || "info",
        FILE_SIZE: process.env.LOG_FILE_SIZE || "10m",
        MAX_FILES: process.env.LOG_MAX_FILES || "5",
        LOG_TO_CONSOLE: process.env.LOG_TO_CONSOLE === "true",
        LOG_TO_FILE: process.env.LOG_TO_FILE === "true",
        LOG_PATH: process.env.LOG_PATH || "./logs",
    },
    // Security Configuration
    SECURITY: {
        CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
        RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
        RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "100"), // max 100 requests per window
        ENABLE_HTTPS: process.env.ENABLE_HTTPS === "true",
        SSL_KEY_PATH: process.env.SSL_KEY_PATH,
        SSL_CERT_PATH: process.env.SSL_CERT_PATH,
        HELMET_ENABLED: process.env.HELMET_ENABLED !== "false",
        XSS_PROTECTION: process.env.XSS_PROTECTION !== "false",
    },
    // Email Configuration
    EMAIL: {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: parseInt(process.env.SMTP_PORT || "587"),
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
        FROM_EMAIL: process.env.FROM_EMAIL || "abdulqaharolajide@gmail.com",
    },
    // Cache Configuration (if using Redis or similar)
    CACHE: {
        ENABLED: process.env.CACHE_ENABLED === "true",
        HOST: process.env.CACHE_HOST || "localhost",
        PORT: parseInt(process.env.CACHE_PORT || "6379"),
        PASSWORD: process.env.CACHE_PASSWORD,
        TTL: parseInt(process.env.CACHE_TTL || "3600"), // 1 hour in seconds
    },
};
// Validate critical configurations
function validateConfig() {
    const errors = [];
    // Validate Database Configuration
    if (!exports.environmentConfig.DATABASE.MONGODB_URI) {
        errors.push({
            field: "DATABASE.MONGODB_URI",
            message: "MongoDB URI is required",
        });
    }
    // Validate Authentication Configuration
    if (exports.environmentConfig.AUTH.JWT_SECRET === "fallback_secret_key" &&
        exports.environmentConfig.NODE_ENV === "production") {
        errors.push({
            field: "AUTH.JWT_SECRET",
            message: "JWT secret must be set in production environment",
        });
    }
    if (exports.environmentConfig.AUTH.PASSWORD_SALT_ROUNDS < 10) {
        errors.push({
            field: "AUTH.PASSWORD_SALT_ROUNDS",
            message: "Password salt rounds should be at least 10",
        });
    }
    // CORS validation removed - configure CORS_ORIGIN in production for better security
    if (exports.environmentConfig.SECURITY.ENABLE_HTTPS &&
        (!exports.environmentConfig.SECURITY.SSL_KEY_PATH ||
            !exports.environmentConfig.SECURITY.SSL_CERT_PATH)) {
        errors.push({
            field: "SECURITY.SSL_PATHS",
            message: "SSL key and certificate paths are required when HTTPS is enabled",
        });
    }
    // Validate Rate Limiting
    if (exports.environmentConfig.SECURITY.RATE_LIMIT_WINDOW_MS < 1000) {
        errors.push({
            field: "SECURITY.RATE_LIMIT_WINDOW_MS",
            message: "Rate limit window should be at least 1000ms",
        });
    }
    // Validate Logging Configuration
    if (exports.environmentConfig.LOGGING.LOG_TO_FILE &&
        !exports.environmentConfig.LOGGING.LOG_PATH) {
        errors.push({
            field: "LOGGING.LOG_PATH",
            message: "Log path is required when file logging is enabled",
        });
    }
    // Validate Email Configuration if enabled
    if (exports.environmentConfig.EMAIL.SMTP_HOST &&
        (!exports.environmentConfig.EMAIL.SMTP_USER || !exports.environmentConfig.EMAIL.SMTP_PASS)) {
        errors.push({
            field: "EMAIL.SMTP_CREDENTIALS",
            message: "SMTP credentials are required when SMTP host is configured",
        });
    }
    // Validate Cache Configuration if enabled
    if (exports.environmentConfig.CACHE.ENABLED && !exports.environmentConfig.CACHE.HOST) {
        errors.push({
            field: "CACHE.HOST",
            message: "Cache host is required when cache is enabled",
        });
    }
    return errors;
}
// Helper function to check if running in production
function isProduction() {
    return exports.environmentConfig.NODE_ENV === "production";
}
// Helper function to check if running in development
function isDevelopment() {
    return exports.environmentConfig.NODE_ENV === "development";
}
// Helper function to check if running in test
function isTest() {
    return exports.environmentConfig.NODE_ENV === "test";
}
// Export the config validation result
exports.configValidationErrors = validateConfig();
// Throw error if validation fails in production
if (isProduction() && exports.configValidationErrors.length > 0) {
    throw new Error(`Invalid configuration: ${JSON.stringify(exports.configValidationErrors, null, 2)}`);
}
