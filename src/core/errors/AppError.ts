/**
 * Base application error. Every other error class in this module extends `AppError`, so any
 * catch site that only cares about "was this one of ours" can check `instanceof AppError` once
 * rather than enumerating every subclass.
 *
 * Note: `docs/engineering/Sprint-0-Engineering-Design.md` Section 5 documents exactly one error
 * class, `ApiError` (in the not-yet-built `src/api/errors.ts`), scoped narrowly to HTTP/API
 * responses (`status`/`code`/`message`/`retryable`). It does not document a general-purpose
 * `AppError` hierarchy. This file's hierarchy (`AppError`/`NetworkError`/`ValidationError`/
 * `StorageError`/`ConfigurationError`) is this milestone's own explicit instruction (Milestone 3
 * scope, item 8, "Error Architecture") — new, cross-cutting infrastructure for the exact modules
 * this milestone builds (`core/network`, `core/storage`, `core/config`), not a re-implementation
 * of `ApiError`. The two are complementary and will coexist: `ApiError` for API-layer response
 * shapes once `src/api/` is built, this hierarchy for everything else.
 */
export interface AppErrorOptions {
  /** Machine-readable code for programmatic branching (e.g. by a future error boundary or
   * Service-layer catch site). Optional — many errors are fine with just a message. */
  code?: string;
  /** The original error/value that caused this one, if any — preserved for logging, never for
   * display. */
  cause?: unknown;
}

export class AppError extends Error {
  readonly code?: string;
  readonly cause?: unknown;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = 'AppError';
    this.code = options.code;
    this.cause = options.cause;
  }
}
