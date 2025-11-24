import { toast } from 'react-toastify'
import { ApiError } from '@/api/axios'

/**
 * Utility class for handling API errors in a consistent way
 */
export class ErrorHandler {
    /**
     * Show appropriate toast message based on error type
     */
    static showError(error: any, defaultMessage?: string): void {
        if (error instanceof ApiError) {
            const message = error.getUserMessage()

            if (error.isValidationError()) {
                toast.error(`Validation Error: ${message}`)
            } else if (error.isAuthError()) {
                toast.error('Authentication failed. Please login again.')
                // You can add redirect to login page here if needed
                // window.location.href = '/login'
            } else {
                toast.error(message)
            }
        } else {
            // Handle non-ApiError cases
            const message = error?.message || defaultMessage || 'An unexpected error occurred'
            toast.error(message)
        }
    }

    /**
     * Get user-friendly error message without showing toast
     */
    static getErrorMessage(error: any, defaultMessage?: string): string {
        if (error instanceof ApiError) {
            return error.getUserMessage()
        }

        return error?.message || defaultMessage || 'An unexpected error occurred'
    }

    /**
     * Check if error is a network/connection error
     */
    static isNetworkError(error: any): boolean {
        return error?.code === 'NETWORK_ERROR' ||
            error?.statusCode === 0 ||
            !navigator.onLine
    }

    /**
     * Check if error requires user re-authentication
     */
    static isAuthError(error: any): boolean {
        if (error instanceof ApiError) {
            return error.isAuthError()
        }
        return error?.statusCode === 401 || error?.status === 401
    }

    /**
     * Check if error is a validation error
     */
    static isValidationError(error: any): boolean {
        if (error instanceof ApiError) {
            return error.isValidationError()
        }
        return error?.statusCode === 422 || error?.status === 422
    }
}

/**
 * Hook for consistent error handling in React components
 */
export const useErrorHandler = () => {
    const handleError = (error: any, defaultMessage?: string) => {
        ErrorHandler.showError(error, defaultMessage)
    }

    return { handleError }
}