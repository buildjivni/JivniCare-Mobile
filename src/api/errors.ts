import { AppError, ConfigurationError, NetworkError, UnknownError } from '@/core/errors';

/**
 * Validates the client's configured base URL is at least a well-formed absolute URL — a
 * malformed/missing base URL is a *configuration* problem, not a network one, and should fail
 * fast before ever attempting a `fetch()` call.
 */
export function assertValidBaseUrl(baseUrl: string): void {
  try {
    new URL(baseUrl);
  } catch (cause) {
    throw new ConfigurationError(`Invalid API base URL: "${baseUrl}"`, { cause });
  }
}

function isAbortError(cause: unknown): boolean {
  return cause instanceof Error && cause.name === 'AbortError';
}

/**
 * Maps a raw transport-layer failure — thrown by `fetch` itself, an aborted/timed-out request,
 * or a response body that fails to parse — into one of `core/errors`' typed classes.
 * Deliberately does **not** interpret HTTP status codes or response bodies (e.g. the 13 named
 * B6 booking codes, or `docs/11-API-Contract.md`'s per-endpoint envelopes) — that is
 * business/feature-specific error mapping, explicitly out of this milestone's scope ("Do not
 * implement feature-specific errors"). A non-2xx HTTP response that `fetch` itself didn't throw
 * on is returned by `ApiClient.request()` as a normal, typed `ApiResponse` for a future
 * Repository/Service layer to interpret.
 */
export function mapTransportError(cause: unknown): AppError {
  if (cause instanceof AppError) {
    return cause;
  }
  if (isAbortError(cause)) {
    return new NetworkError('Request timed out or was aborted', { cause, retryable: true });
  }
  if (cause instanceof TypeError) {
    // `fetch` throws a bare TypeError for connectivity failures (offline, DNS, refused
    // connection) — the base URL was already validated by `assertValidBaseUrl` before this
    // point, so a TypeError here is assumed to be connectivity, not configuration.
    return new NetworkError('Network request failed', { cause, retryable: true });
  }
  return new UnknownError('An unexpected transport error occurred', { cause });
}
