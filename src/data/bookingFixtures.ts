import type { QueueToken } from '@/types/booking';

/** Fixtures for `MockBookingRepository`/`MockQueueRepository` (F08/F09/F10/F11) — used only when
 * `core/config`'s `USE_MOCK_DATA` flag is on. `QueueToken`'s field list is itself partial (see
 * `src/types/booking.ts` for why). */
export const MOCK_QUEUE_TOKEN: QueueToken = {
  id: 'token-mock-001',
  status: 'BOOKED',
};

export const MOCK_QUEUE_TOKENS: QueueToken[] = [MOCK_QUEUE_TOKEN];
