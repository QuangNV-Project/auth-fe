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
  errors: object

  constructor(message: string, statusCode: number = 0, standardizedError?: StandardizedApiError) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.timestamp = standardizedError?.timestamp || new Date()
    this.data = standardizedError?.data || null
    this.errors = standardizedError?.errors || {}
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
    return payload.data
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

    const apiErr = new ApiError(standardizedError.message, status, standardizedError)
    return Promise.reject(apiErr)
  }
)

export const apiRequest = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return (axiosClient.request as any)(config) as Promise<T>
}

export default axiosClient
