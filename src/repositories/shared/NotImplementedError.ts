import { AppError } from '@/core/errors';

/**
 * Thrown by an `Http*Repository` method whose backend endpoint doesn't exist yet, isn't
 * itemized in `docs/11-API-Contract.md`, or documents a transport `apiClient` doesn't support
 * (F09's SSE stream) — per this milestone's own "throw documented 'Not Implemented' placeholders"
 * instruction (Section 3). Kept repository-scoped rather than added to `core/errors`, since its
 * only job is naming *which* method and *why*, not classifying a transport/config failure the
 * way M4's error hierarchy does.
 */
export class NotImplementedError extends AppError {
  constructor(methodLabel: string, reason: string) {
    super(`${methodLabel} is not implemented: ${reason}`);
    this.name = 'NotImplementedError';
  }
}
