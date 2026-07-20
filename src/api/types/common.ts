/**
 * Reusable, generic API types only — no feature DTOs (no `Doctor`, `QueueToken`, etc.; those
 * belong to `src/types/` per Section 2's Folder Responsibilities table, once a future milestone
 * builds them).
 */

export type { ApiResponse, HttpMethod } from '@/core/network';

/**
 * Generic shape for a *normalized* API error — what a future envelope-normalizing response
 * interceptor (Section 5) would produce from either documented raw shape
 * (`{success:false, error}` or a flat `{error}`), per `docs/11-API-Contract.md`'s Response
 * Envelope section. Nothing in this milestone constructs one — no interceptor logic is
 * implemented (Section 5 of this milestone's scope) — this is the reserved shape for when one
 * is.
 */
export interface ApiErrorResponse {
  status: number;
  code?: string;
  message: string;
  retryable: boolean;
}

/**
 * Generic paginated-list shape. Field names deliberately mirror the pagination fields already
 * observed across `docs/11-API-Contract.md`'s F02/F03 Search response (`page`, `limit`,
 * `hasMore`) — generic, not specific to doctors or any one endpoint.
 */
export interface PaginatedResponse<TItem> {
  items: TItem[];
  page: number;
  limit: number;
  hasMore: boolean;
  total?: number;
}

/**
 * Per-request options `ApiClient.request()` accepts. `isPublic` is this milestone's "Request
 * context" + "future auth header injection" placeholder — Section 5 documents that public
 * endpoints (send-otp, verify-otp, search, lead capture) must opt out of a future auth-attach
 * interceptor; nothing reads this flag yet, since no auth interceptor exists in this milestone.
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  timeoutMs?: number;
  signal?: AbortSignal;
  body?: unknown;
  isPublic?: boolean;
}
