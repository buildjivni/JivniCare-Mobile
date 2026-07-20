import { AppError, type AppErrorOptions } from './AppError';

/**
 * Catch-all for a failure that doesn't confidently classify as `NetworkError` (connectivity/
 * timeout/abort) or `ConfigurationError` (a bad config value) — e.g. a malformed response body
 * that fails to parse. Added in Milestone 4 (API Foundation) for `src/api/errors.ts`'s transport
 * error mapping, which this milestone's own instructions named alongside the two error types
 * above ("Map transport errors into Core Error types. Examples: NetworkError,
 * ConfigurationError, UnknownError") — grouped into the same `core/errors` hierarchy Milestone 3
 * built, rather than a new, separate error type living in `src/api/`.
 */
export class UnknownError extends AppError {
  constructor(message: string, options: AppErrorOptions = {}) {
    super(message, options);
    this.name = 'UnknownError';
  }
}
