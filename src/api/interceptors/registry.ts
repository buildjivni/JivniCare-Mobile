import type {
  ApiResponse,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from '@/core/network';

/**
 * Interceptor architecture only — an ordered-registration pipeline, per this milestone's
 * "Create interceptor architecture only... Do NOT implement their logic" instruction. Both
 * arrays start empty and stay empty in this milestone; nothing calls `register*Interceptor`
 * anywhere. Per Section 5's Interceptors table, four are anticipated for a future milestone:
 *
 * - Auth interceptor            — attaches `Authorization: Bearer <token>`, skips requests with
 *                                  `RequestOptions.isPublic`
 * - Logging interceptor         — dev-only request/response logging via `core/logger`
 * - Retry interceptor           — one automatic retry for idempotent GETs on network failure only
 * - Refresh-token interceptor   — silent 401 → `AuthService.refresh()` → replay once
 */

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor<unknown>[] = [];

export function registerRequestInterceptor(interceptor: RequestInterceptor): void {
  requestInterceptors.push(interceptor);
}

export function registerResponseInterceptor(interceptor: ResponseInterceptor<unknown>): void {
  responseInterceptors.push(interceptor);
}

export async function runRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
  let result = config;
  for (const interceptor of requestInterceptors) {
    result = await interceptor(result);
  }
  return result;
}

export async function runResponseInterceptors<TData>(
  response: ApiResponse<TData>,
): Promise<ApiResponse<TData>> {
  let result: ApiResponse<unknown> = response;
  for (const interceptor of responseInterceptors) {
    result = await interceptor(result);
  }
  return result as ApiResponse<TData>;
}
