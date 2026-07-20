import { AppError, type AppErrorOptions } from './AppError';

export interface NetworkErrorOptions extends AppErrorOptions {
  /** Whether the operation that threw this is safe to retry — mirrors
   * `docs/engineering/Sprint-0-Engineering-Design.md` Section 5's `ApiError.retryable` field, for
   * the same reason: a network blip is retryable, a client-side abort or malformed request is
   * not. Defaults to `false` (never retry unless a caller explicitly says it's safe to). */
  retryable?: boolean;
}

/** Thrown by `core/network` for connectivity-level failures (offline, timeout, DNS, aborted
 * request) — distinct from an HTTP error response, which is `src/api/errors.ts`'s future
 * `ApiError` (a request that reached the server and got a 4xx/5xx back is not a `NetworkError`). */
export class NetworkError extends AppError {
  readonly retryable: boolean;

  constructor(message: string, options: NetworkErrorOptions = {}) {
    super(message, options);
    this.name = 'NetworkError';
    this.retryable = options.retryable ?? false;
  }
}
