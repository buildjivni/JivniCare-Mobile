import type { CreateBookingPayload, QueueToken } from '@/types/booking';

/**
 * F08/F10/F11 — matches
 * `docs/engineering/Sprint-0-Engineering-Design.md` Section 6's `BookingRepository` interface
 * exactly. No speculative methods added.
 */
export interface BookingRepository {
  create(payload: CreateBookingPayload): Promise<QueueToken>;
  cancel(tokenId: string): Promise<void>;
  getMyBookings(): Promise<QueueToken[]>;
}
