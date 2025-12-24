export declare const environmentConfig: {
    PORT: string | number;
    NODE_ENV: string;
    API_VERSION: string;
    DATABASE: {
        MONGODB_URI: string;
        MAX_POOL_SIZE: number;
        RETRY_WRITES: boolean;
        CONNECTION_TIMEOUT: number;
        KEEPALIVE: boolean;
        OPTIONS: {
            useNewUrlParser: boolean;
            useUnifiedTopology: boolean;
            retryWrites: boolean;
        };
    };
    AUTH: {
        JWT_SECRET: string;
        JWT_EXPIRATION: string;
        REFRESH_TOKEN_EXPIRATION: string;
        PASSWORD_SALT_ROUNDS: number;
        TOKEN_HEADER: string;
    };
    LOGGING: {
        LEVEL: string;
        FILE_SIZE: string;
        MAX_FILES: string;
        LOG_TO_CONSOLE: boolean;
        LOG_TO_FILE: boolean;
        LOG_PATH: string;
    };
    SECURITY: {
        CORS_ORIGIN: string;
        RATE_LIMIT_WINDOW_MS: number;
        RATE_LIMIT_MAX: number;
        ENABLE_HTTPS: boolean;
        SSL_KEY_PATH: string | undefined;
        SSL_CERT_PATH: string | undefined;
        HELMET_ENABLED: boolean;
        XSS_PROTECTION: boolean;
    };
    EMAIL: {
        SMTP_HOST: string | undefined;
        SMTP_PORT: number;
        SMTP_USER: string | undefined;
        SMTP_PASS: string | undefined;
        FROM_EMAIL: string;
    };
    CACHE: {
        ENABLED: boolean;
        HOST: string;
        PORT: number;
        PASSWORD: string | undefined;
        TTL: number;
    };
};
interface ConfigValidationError {
    field: string;
    message: string;
}
export declare function validateConfig(): ConfigValidationError[];
export declare function isProduction(): boolean;
export declare function isDevelopment(): boolean;
export declare function isTest(): boolean;
export declare const configValidationErrors: ConfigValidationError[];
export {};
