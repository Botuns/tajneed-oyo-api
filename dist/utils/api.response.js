"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = exports.ResponseStatus = void 0;
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["SUCCESS"] = "success";
    ResponseStatus["ERROR"] = "error";
    ResponseStatus["VALIDATION_ERROR"] = "validation_error";
})(ResponseStatus || (exports.ResponseStatus = ResponseStatus = {}));
class ApiResponse {
    /**
     * Creates a successful response
     * @param data - The response payload
     * @param message - Optional success message
     */
    static success(data, message = 'Operation successful') {
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
    static error(message = 'An unexpected error occurred', errors, status = ResponseStatus.ERROR) {
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
    static validationError(errors) {
        return {
            status: ResponseStatus.VALIDATION_ERROR,
            message: 'Validation failed',
            errors,
            timestamp: Date.now()
        };
    }
}
exports.ApiResponse = ApiResponse;
