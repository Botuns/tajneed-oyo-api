import { Application } from "express";
export declare class App {
    app: Application;
    private logger;
    private schedulerService;
    private constructor();
    static create(): Promise<App>;
    private setupMiddleware;
    private initializeDatabase;
    private setupRoutes;
    private setupErrorHandling;
    private startScheduler;
}
