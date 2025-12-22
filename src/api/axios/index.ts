import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ENV } from '@/config/env'
import { ApiSuccessResponse } from '../types/types';
import { ApiErrorResponse, StandardizedApiError } from '@/types/common.ts';
import { authStore } from '@/stores/authStore';

const axiosClient = axios.create({
  baseURL: ENV.BACK_END_URL,
  timeout: 100000, // Thường là 100s, check lại đơn vị ms
  withCredentials: true,
})

// Custom Error Class
export class ApiError extends Error implements StandardizedApiError {
  success: false = false
  statusCode: number
  timestamp: Date
  data: unknown | null
  errors: string

  constructor(message: string, statusCode: number = 0, standardizedError?: StandardizedApiError) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.timestamp = standardizedError?.timestamp || new Date()
    this.data = standardizedError?.data || null
    this.errors = standardizedError?.errors || ''
  }
}

// REQUEST INTERCEPTOR
axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authStore.getState().authValues.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Content-Type logic
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config
})

// RESPONSE INTERCEPTOR
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;

    // Chuẩn hóa lỗi API cho các trường hợp khác
    const errorData = error.response?.data as ApiErrorResponse;
    const standardizedError: StandardizedApiError = {
      success: false,
      message: errorData?.message || error.message || 'Unknown API error',
      data: errorData?.data || null,
      errors: errorData?.errors || '',
      statusCode: status || 0,
      timestamp: new Date(),
    };

    return Promise.reject(new ApiError(standardizedError.message, status, standardizedError));
  }
)

export const apiRequest = async <T = any>(config: AxiosRequestConfig): Promise<ApiSuccessResponse<T>> => {
  const response = await axiosClient.request<T>(config)
  return response.data as ApiSuccessResponse<T>
}