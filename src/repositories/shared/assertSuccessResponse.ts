import { UnknownError } from '@/core/errors';
import type { ApiResponse } from '@/api';

/**
 * Minimal, generic 2xx gate for `Http*Repository` methods. Section 4 ("Error Handling") only
 * requires repositories to translate API Foundation errors into repository-level results "if
 * documented" — no per-endpoint error-code mapping (the 13 B6 booking codes, bilingual message
 * selection, etc.) is documented at this layer, so none is built here. This only prevents a
 * repository from reading success-shaped fields out of an error-shaped body; interpreting *why*
 * a call failed stays a Service-layer concern (a future milestone).
 */
export function assertSuccessResponse<TData>(response: ApiResponse<TData>, context: string): TData {
  if (response.status < 200 || response.status >= 300) {
    throw new UnknownError(`${context} failed with status ${response.status}`, {
      cause: response.data,
    });
  }
  return response.data;
}
