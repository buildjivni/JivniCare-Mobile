import { MOCK_QUEUE_TOKEN, MOCK_QUEUE_TOKENS } from '@/data/bookingFixtures';
import type { CreateBookingPayload, QueueToken } from '@/types/booking';

import type { BookingRepository } from './BookingRepository';
import { mockDelay } from '../shared';

/** Mock implementation — returns static fixtures from `src/data/bookingFixtures.ts` after a
 * simulated delay. */
export class MockBookingRepository implements BookingRepository {
  async create(_payload: CreateBookingPayload): Promise<QueueToken> {
    await mockDelay(500);
    return MOCK_QUEUE_TOKEN;
  }

  async cancel(_tokenId: string): Promise<void> {
    await mockDelay(300);
  }

  async getMyBookings(): Promise<QueueToken[]> {
    await mockDelay(300);
    return MOCK_QUEUE_TOKENS;
  }
}
