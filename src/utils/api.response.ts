export enum ResponseStatus {
    SUCCESS = 'success',
    ERROR = 'error',
    VALIDATION_ERROR = 'validation_error'
    
}

export interface BaseResponse<T = any> {
    status: ResponseStatus;
    message: string;
    data?: T;
    errors?: string[] | Record<string, string>;
    timestamp?: number;
    traceId?: string;
}

export class ApiResponse {
    /**
     * Creates a successful response
     * @param data - The response payload
     * @param message - Optional success message
     */
    static success<T>(data: T, message: string = 'Operation successful'): BaseResponse<T> {
        return {
            status: ResponseStatus.SUCCESS,
            message,
            data,
            timestamp: Date.now()
        };
    }

    /**
     * Create an error response
     * @param message - Error message
     * @param errors - Optional detailed errors
     * @param status - HTTP status code (optional)
     */
    static error(
        message: string = 'An unexpected error occurred', 
        errors?: string[] | Record<string, string>,
        status: ResponseStatus = ResponseStatus.ERROR
    ): BaseResponse {
        return {
            status,
            message,
            errors,
            timestamp: Date.now()
        };
    }

    /**
     * Create a validation error response
     * @param errors - Validation errors
     */
    static validationError(errors: Record<string, string>): BaseResponse {
        return {
            status: ResponseStatus.VALIDATION_ERROR,
            message: 'Validation failed',
            errors,
            timestamp: Date.now()
        };
    }
}