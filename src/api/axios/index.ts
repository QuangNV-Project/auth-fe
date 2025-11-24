import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ENV } from '@/config/env'
import { ApiErrorResponse, StandardizedApiError } from '@/types/common.ts'

const axiosClient = axios.create({
  baseURL: ENV.BACK_END_URL,
  timeout: 1000000,
  withCredentials: true,
})

function getTokenFromStorage(): string | null {
  try {
    const t = localStorage.getItem('token')
    if (t) return t
  } catch (e) {
    console.error('Error getting token from localStorage', e)
  }
  return null
}

export class ApiError extends Error implements StandardizedApiError {
  success: false = false
  statusCode: number
  timestamp: Date
  data: unknown | null
  errors: string[]

  constructor(message: string, statusCode: number = 0, standardizedError?: StandardizedApiError) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.timestamp = standardizedError?.timestamp || new Date()
    this.data = standardizedError?.data || null
    this.errors = standardizedError?.errors || []
  }

  // Helper method to get user-friendly error message
  getUserMessage(): string {
    if (this.errors && this.errors.length > 0) {
      return this.errors.join(', ')
    }
    return this.message
  }

  // Helper method to check if error is validation error
  isValidationError(): boolean {
    return this.statusCode === 422 && this.errors && this.errors.length > 0
  }

  // Helper method to check if error requires re-authentication
  isAuthError(): boolean {
    return this.statusCode === 401
  }
}

// Request interceptor: attach auth header and sensible content-type
axiosClient.interceptors.request.use((config: any) => {
  const token = getTokenFromStorage()
  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    }
  }

  // If body is FormData, let browser set appropriate headers
  const isForm = config.data instanceof FormData
  if (!isForm) {
    config.headers = {
      'Content-Type': 'application/json',
      ...(config.headers || {}),
    }
  }

  return config
})

// Response interceptor: normalize data and errors
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const payload = response.data
    return payload
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // Network or server errors
    const resp = error?.response
    const status = resp?.status || 0
    const errorData = resp?.data as ApiErrorResponse

    // Create standardized error
    const standardizedError: StandardizedApiError = {
      success: false,
      message: errorData?.message || error?.message || 'Unknown API error',
      data: errorData?.data || null,
      errors: errorData?.errors || [],
      statusCode: status,
      timestamp: new Date(),
    }

    // Handle different HTTP status codes
    let userFriendlyMessage = standardizedError.message

    switch (status) {
      case 400:
        userFriendlyMessage = errorData?.message || 'Invalid request. Please check your input.'
        break
      case 401:
        userFriendlyMessage = 'Authentication failed. Please login again.'
        break
      case 403:
        userFriendlyMessage = 'Access denied. You don\'t have permission to perform this action.'
        break
      case 404:
        userFriendlyMessage = 'Resource not found.'
        break
      case 422:
        // Validation errors - combine all error messages
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          userFriendlyMessage = errorData.errors.join(', ')
        } else {
          userFriendlyMessage = errorData?.message || 'Validation failed.'
        }
        break
      case 429:
        userFriendlyMessage = 'Too many requests. Please try again later.'
        break
      case 500:
        userFriendlyMessage = 'Server error. Please try again later.'
        break
      default:
        if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
          userFriendlyMessage = 'Network error. Please check your connection.'
        }
    }

    const apiErr = new ApiError(userFriendlyMessage, status, standardizedError)
    return Promise.reject(apiErr)
  }
)

export const apiRequest = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return (axiosClient.request as any)(config) as Promise<T>
}

export default axiosClient
