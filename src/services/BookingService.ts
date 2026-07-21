import { bookingRepository } from '@/repositories';
import type { CreateBookingPayload, QueueToken } from '@/types/booking';

import { generateRequestId } from './shared';

/**
 * F07, F08, F19, Rules B1–B10 (Section 7). Documented responsibilities: "13-code (Rule B6)
 * error mapping, `dailyLimitContext` disambiguation (per `15-Known-Gaps.md` §2.2), idempotent
 * `requestId` generation, consent-checkbox gating (pending F19/P0-4)."
 *
 * Built: idempotent `requestId` generation (Rule B3) — a caller-supplied `requestId` is
 * respected as-is (for retry-with-same-key semantics per Section 5's Retry Policy); one is
 * generated only if the caller didn't already supply one.
 *
 * **Not** built, and deliberately not guessed at:
 * - 13-code (Rule B6) error mapping — requires both `05-Business-Rules.md`'s exact code table
 *   (outside this milestone's read-first scope) and an `ApiError.code`-bearing error type,
 *   which Milestone 4 explicitly left unbuilt (only transport-level `NetworkError`/
 *   `ConfigurationError`/`UnknownError` exist today — none carry a `code`). `book()` lets
 *   whatever the Repository throws propagate unchanged.
 * - `dailyLimitContext` disambiguation — defined in `15-Known-Gaps.md` §2.2, not read this
 *   milestone.
 * - Consent-checkbox gating — blocked on F19/P0-4, which has no backend or repository at all
 *   (confirmed absent again in `docs/implementation/M5-Repository-Foundation-Report.md`).
 */
export interface BookingServiceContract {
  book(payload: CreateBookingPayload): Promise<QueueToken>;
  getMyBookings(): Promise<QueueToken[]>;
}

export const BookingService: BookingServiceContract = {
  async book(payload) {
    const requestId = payload.requestId ?? generateRequestId();
    return bookingRepository.create({ ...payload, requestId });
  },

  async getMyBookings() {
    return bookingRepository.getMyBookings();
  },
};
