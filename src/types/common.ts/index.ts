export type ApiErrorResponse = {
  success: false
  message: string
  data: unknown | null
  errors: string
}

export interface StandardizedApiError extends ApiErrorResponse {
  /** HTTP status code */
  statusCode: number
  timestamp: Date
}

export type ApiResponse<T> = {
  success: true
  message: string
  data: T | null
  statusCode: number
  timestamp: Date
}