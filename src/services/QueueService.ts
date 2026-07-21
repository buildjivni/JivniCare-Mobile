import { bookingRepository, queueRepository } from '@/repositories';
import type { QueueToken } from '@/types/booking';

/**
 * F09, F11, Rules Q1–Q9, C1–C5 (Section 7). Documented responsibilities: "Token status polling
 * orchestration (until FCM/F16 lands), cancellable-state check (Rule C1) before allowing a
 * cancel action, cancellation-error mapping."
 *
 * `cancel()` calls `bookingRepository.cancel()` — Section 6 places the actual cancel endpoint
 * on `BookingRepository`, but Section 4's Feature-hook table (`useCancelBooking()`) assigns the
 * business-rule-aware wrapper to `QueueService`, a legitimate cross-domain repository call
 * ("Services may call multiple repositories").
 *
 * **Not** built: the cancellable-state check (Rule C1) — its exact state-machine definition
 * lives in `05-Business-Rules.md`, outside this milestone's read-first scope, so no state is
 * guessed at as "cancellable" or not; `cancel()` lets the backend be the source of truth and
 * whatever the repository throws propagate unchanged. `getTokenStatus()` still throws
 * `NotImplementedError` via `QueueRepository` (F09's only documented transport is SSE,
 * incompatible with a one-shot `Promise`, per `docs/implementation/M5-Repository-Foundation-
 * Report.md`) — no polling loop is built on top of a method that cannot return real data yet.
 */
export interface QueueServiceContract {
  getTokenStatus(tokenId: string): Promise<QueueToken>;
  cancel(tokenId: string): Promise<void>;
}

export const QueueService: QueueServiceContract = {
  async getTokenStatus(tokenId) {
    return queueRepository.getTokenStatus(tokenId);
  },

  async cancel(tokenId) {
    return bookingRepository.cancel(tokenId);
  },
};
