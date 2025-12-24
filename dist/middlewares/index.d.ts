export declare class Middleware {
    private static logger;
    /**
     * Setup all middleware
     */
    static setup(app: any): void;
    /**
     * Rate limiting middleware
     */
    private static rateLimiter;
    /**
     * Request logging middleware
     */
    private static requestLogger;
    /**
     * Global error handling middleware
     */
    private static errorHandler;
    /**
     * Health check endpoint
     */
    private static healthCheck;
}
