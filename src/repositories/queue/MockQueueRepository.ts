import { MOCK_QUEUE_TOKEN } from '@/data/bookingFixtures';
import type { QueueToken } from '@/types/booking';

import type { QueueRepository } from './QueueRepository';
import { mockDelay } from '../shared';

/** Mock implementation — returns a static fixture from `src/data/bookingFixtures.ts` after a
 * simulated delay. Unlike `HttpQueueRepository`, mocking this method doesn't require a real
 * transport, so it is safe to return a value here despite F09's SSE-only real endpoint. */
export class MockQueueRepository implements QueueRepository {
  async getTokenStatus(_tokenId: string): Promise<QueueToken> {
    await mockDelay(200);
    return MOCK_QUEUE_TOKEN;
  }
}
