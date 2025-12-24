export declare class Logger {
    private logger;
    private context?;
    constructor(context?: string);
    private createLogger;
    info(message: any, meta?: object): void;
    error(message: any, trace?: string, meta?: object): void;
    warn(message: any, meta?: object): void;
    debug(message: any, meta?: object): void;
    verbose(message: any, meta?: object): void;
    logRequest(req: any, res: any, responseTime: number): void;
    static handleUncaughtErrors(): void;
    createChildLogger(childContext: string): Logger;
}
export declare const globalLogger: Logger;
export declare const logPerformance: (name: string, fn: () => Promise<any>) => Promise<any>;
