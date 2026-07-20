/**
 * Network infrastructure types only — request/response shapes and future interceptor hook
 * points. No client class and no `fetch` call live here; per this milestone's scope, building the
 * actual HTTP client (`src/api/client.ts`) and its endpoints is explicitly out of scope
 * (Section 5 of `docs/engineering/Sprint-0-Engineering-Design.md` documents that as a separate,
 * `src/api/`-layer deliverable).
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  /** Overrides `NETWORK_CONFIG.defaultTimeoutMs` for this one request (Section 5: "Overridable
   * per-request for future higher-latency operations"). */
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface ApiResponse<TData> {
  data: TData;
  status: number;
}

/** Future request-interceptor hook shape (Section 5's Interceptors table: auth-attach,
 * idempotency-attach). Not implemented anywhere yet — this milestone only reserves the shape. */
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

/** Future response-interceptor hook shape (Section 5's Interceptors table: envelope-normalize,
 * 401-refresh, 429-surface, dev-logging). Not implemented anywhere yet. */
export type ResponseInterceptor<TData = unknown> = (
  response: ApiResponse<TData>,
) => ApiResponse<TData> | Promise<ApiResponse<TData>>;
