import { API_TIMEOUT_MS } from '@/core/config';

/** Base network configuration — timeout/headers only, sourced from `core/config` so the value is
 * never duplicated. No base URL here: Section 5 assigns that to the future `src/api/client.ts`
 * directly (it already reads `API_BASE_URL` from `core/config` itself). */
export const NETWORK_CONFIG = {
  defaultTimeoutMs: API_TIMEOUT_MS,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
} as const;
