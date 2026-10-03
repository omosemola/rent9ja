// ============================================================================
// Error parsing (ports AuthBloc._parseError)
// ============================================================================

import axios from 'axios';
import type { ApiErrorBody } from '@/types/api';

export function parseError(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && data.message != null) {
      const msg = data.message;
      return Array.isArray(msg) ? msg.join(', ') : String(msg);
    }
    const status = error.response?.status ?? 'Connection failed';
    return `Network error (${status}). Please check backend connection.`;
  }
  if (error instanceof Error) return error.message.replace('Exception: ', '');
  return String(error).replace('Exception: ', '');
}
