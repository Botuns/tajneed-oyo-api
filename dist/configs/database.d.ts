export declare class Database {
    private static logger;
    /**
     * Initialize database connection
     */
    static connect(): Promise<void>;
    /**
     * Close database connection
     */
    static disconnect(): Promise<void>;
    /**
     * Setup mongoose event listeners for monitoring
     */
    private static setupMongooseEventListeners;
    /**
     * Check database connection status
     */
    static healthCheck(): Promise<boolean>;
}
