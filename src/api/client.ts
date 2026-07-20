import { API_BASE_URL, API_TIMEOUT_MS } from '@/core/config';
import { NETWORK_CONFIG } from '@/core/network';
import type { ApiResponse, HttpMethod } from '@/core/network';

import { assertValidBaseUrl, mapTransportError } from './errors';
import { runRequestInterceptors, runResponseInterceptors } from './interceptors';
import type { RequestOptions } from './types';

export interface ApiClientConfig {
  baseUrl: string;
  timeoutMs: number;
  defaultHeaders: Record<string, string>;
}

export const DEFAULT_API_CLIENT_CONFIG: ApiClientConfig = {
  baseUrl: API_BASE_URL,
  timeoutMs: API_TIMEOUT_MS,
  defaultHeaders: { ...NETWORK_CONFIG.defaultHeaders },
};

/**
 * Centralized, generic HTTP client — foundation only, per this milestone's "API Client"
 * requirement (typed configuration, uses `core/config`'s base URL, uses `core/network`'s
 * types, timeout support). Wraps the platform `fetch` API directly, matching Section 5's "no
 * heavyweight HTTP library needed" decision — no Axios or other client library was added.
 *
 * Nothing calls `request()` anywhere in this milestone — `src/api/endpoints/*` are placeholder
 * folders only (Section 7), and no repository/service/screen exists yet to call this client.
 * This file builds the shape a future `Http*Repository` will use.
 */
export class ApiClient {
  constructor(private readonly config: ApiClientConfig = DEFAULT_API_CLIENT_CONFIG) {
    assertValidBaseUrl(this.config.baseUrl);
  }

  async request<TData>(
    path: string,
    method: HttpMethod,
    options: RequestOptions = {},
  ): Promise<ApiResponse<TData>> {
    const timeoutMs = options.timeoutMs ?? this.config.timeoutMs;

    const preparedConfig = await runRequestInterceptors({
      method,
      headers: { ...this.config.defaultHeaders, ...options.headers },
      timeoutMs,
      signal: options.signal,
    });

    const timeoutController = new AbortController();
    const timeoutId = setTimeout(
      () => timeoutController.abort(),
      preparedConfig.timeoutMs ?? timeoutMs,
    );
    options.signal?.addEventListener('abort', () => timeoutController.abort());

    try {
      const response = await fetch(`${this.config.baseUrl}${path}`, {
        method: preparedConfig.method,
        headers: preparedConfig.headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: timeoutController.signal,
      });

      const data = (await response.json()) as TData;
      const apiResponse: ApiResponse<TData> = { data, status: response.status };
      return await runResponseInterceptors(apiResponse);
    } catch (cause) {
      throw mapTransportError(cause);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

/** Default, app-wide client instance — configured from `core/config`, not yet imported by
 * anything (Section 7's endpoint placeholders don't call it; that's a future milestone). */
export const apiClient = new ApiClient();
