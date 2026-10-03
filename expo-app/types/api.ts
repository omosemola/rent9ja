// ============================================================================
// Shared API types
// ============================================================================

/** NestJS error body. `message` is a string or an array of validation errors. */
export interface ApiErrorBody {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}
