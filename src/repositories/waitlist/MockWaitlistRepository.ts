import { MOCK_WAITLIST_CLAIM_RESULT } from '@/data/waitlistFixtures';
import type { WaitlistClaimResult } from '@/types/waitlist';

import type { WaitlistRepository } from './WaitlistRepository';
import { mockDelay } from '../shared';

/** Mock implementation — returns a static fixture from `src/data/waitlistFixtures.ts` after a
 * simulated delay. Unlike `HttpWaitlistRepository`, mocking `join()` doesn't require a real
 * endpoint, so it is safe to resolve here despite the join step being undocumented. */
export class MockWaitlistRepository implements WaitlistRepository {
  async join(_doctorId: string): Promise<void> {
    await mockDelay(300);
  }

  async claim(_doctorId: string): Promise<WaitlistClaimResult> {
    await mockDelay(300);
    return MOCK_WAITLIST_CLAIM_RESULT;
  }
}
