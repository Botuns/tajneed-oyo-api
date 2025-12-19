import dotenv from "dotenv";
import path from "path";

// Load .env.local first, then fall back to .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const environmentConfig = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || "development",
  API_VERSION: process.env.API_VERSION || "v1",

  DATABASE: {
    MONGODB_URI:
      process.env.MONGODB_URI || "mongodb://localhost:27017/attendance_system",
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
    RATE_LIMIT_WINDOW_MS: parseInt(
      process.env.RATE_LIMIT_WINDOW_MS || "900000"
    ), // 15 minutes
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

interface ConfigValidationError {
  field: string;
  message: string;
}

// Validate critical configurations
export function validateConfig(): ConfigValidationError[] {
  const errors: ConfigValidationError[] = [];

  // Validate Database Configuration
  if (!environmentConfig.DATABASE.MONGODB_URI) {
    errors.push({
      field: "DATABASE.MONGODB_URI",
      message: "MongoDB URI is required",
    });
  }

  // Validate Authentication Configuration
  if (
    environmentConfig.AUTH.JWT_SECRET === "fallback_secret_key" &&
    environmentConfig.NODE_ENV === "production"
  ) {
    errors.push({
      field: "AUTH.JWT_SECRET",
      message: "JWT secret must be set in production environment",
    });
  }

  if (environmentConfig.AUTH.PASSWORD_SALT_ROUNDS < 10) {
    errors.push({
      field: "AUTH.PASSWORD_SALT_ROUNDS",
      message: "Password salt rounds should be at least 10",
    });
  }

  // Validate Security Configuration
  if (
    environmentConfig.NODE_ENV === "production" &&
    environmentConfig.SECURITY.CORS_ORIGIN === "*"
  ) {
    errors.push({
      field: "SECURITY.CORS_ORIGIN",
      message: "CORS origin should be specifically defined in production",
    });
  }

  if (
    environmentConfig.SECURITY.ENABLE_HTTPS &&
    (!environmentConfig.SECURITY.SSL_KEY_PATH ||
      !environmentConfig.SECURITY.SSL_CERT_PATH)
  ) {
    errors.push({
      field: "SECURITY.SSL_PATHS",
      message:
        "SSL key and certificate paths are required when HTTPS is enabled",
    });
  }

  // Validate Rate Limiting
  if (environmentConfig.SECURITY.RATE_LIMIT_WINDOW_MS < 1000) {
    errors.push({
      field: "SECURITY.RATE_LIMIT_WINDOW_MS",
      message: "Rate limit window should be at least 1000ms",
    });
  }

  // Validate Logging Configuration
  if (
    environmentConfig.LOGGING.LOG_TO_FILE &&
    !environmentConfig.LOGGING.LOG_PATH
  ) {
    errors.push({
      field: "LOGGING.LOG_PATH",
      message: "Log path is required when file logging is enabled",
    });
  }

  // Validate Email Configuration if enabled
  if (
    environmentConfig.EMAIL.SMTP_HOST &&
    (!environmentConfig.EMAIL.SMTP_USER || !environmentConfig.EMAIL.SMTP_PASS)
  ) {
    errors.push({
      field: "EMAIL.SMTP_CREDENTIALS",
      message: "SMTP credentials are required when SMTP host is configured",
    });
  }

  // Validate Cache Configuration if enabled
  if (environmentConfig.CACHE.ENABLED && !environmentConfig.CACHE.HOST) {
    errors.push({
      field: "CACHE.HOST",
      message: "Cache host is required when cache is enabled",
    });
  }

  return errors;
}

// Helper function to check if running in production
export function isProduction(): boolean {
  return environmentConfig.NODE_ENV === "production";
}

// Helper function to check if running in development
export function isDevelopment(): boolean {
  return environmentConfig.NODE_ENV === "development";
}

// Helper function to check if running in test
export function isTest(): boolean {
  return environmentConfig.NODE_ENV === "test";
}

// Export the config validation result
export const configValidationErrors = validateConfig();

// Throw error if validation fails in production
if (isProduction() && configValidationErrors.length > 0) {
  throw new Error(
    `Invalid configuration: ${JSON.stringify(configValidationErrors, null, 2)}`
  );
}
