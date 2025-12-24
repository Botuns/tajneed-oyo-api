export declare enum ResponseStatus {
    SUCCESS = "success",
    ERROR = "error",
    VALIDATION_ERROR = "validation_error"
}
export interface BaseResponse<T = any> {
    status: ResponseStatus;
    message: string;
    data?: T;
    errors?: string[] | Record<string, string>;
    timestamp?: number;
    traceId?: string;
}
export declare class ApiResponse {
    /**
     * Creates a successful response
     * @param data - The response payload
     * @param message - Optional success message
     */
    static success<T>(data: T, message?: string): BaseResponse<T>;
    /**
     * Create an error response
     * @param message - Error message
     * @param errors - Optional detailed errors
     * @param status - HTTP status code (optional)
     */
    static error(message?: string, errors?: string[] | Record<string, string>, status?: ResponseStatus): BaseResponse;
    /**
     * Create a validation error response
     * @param errors - Validation errors
     */
    static validationError(errors: Record<string, string>): BaseResponse;
}
