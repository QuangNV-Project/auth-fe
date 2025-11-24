export type ApiErrorResponse = {
  success: false
  message: string
  data: unknown | null
  errors: object
}

export interface StandardizedApiError extends ApiErrorResponse {
  /** HTTP status code */
  statusCode: number
  timestamp: Date
}
