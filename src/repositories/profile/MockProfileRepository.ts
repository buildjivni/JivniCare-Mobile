import { MOCK_USER_PROFILE } from '@/data/profileFixtures';
import type { UserProfile } from '@/types/profile';

import type { ProfileRepository } from './ProfileRepository';
import { mockDelay } from '../shared';

/** Mock implementation — returns a static fixture from `src/data/profileFixtures.ts` after a
 * simulated delay. Unlike `HttpProfileRepository`, mocking `update()` doesn't require a real
 * endpoint, so it is safe to resolve here despite F14 being undocumented. */
export class MockProfileRepository implements ProfileRepository {
  async update(payload: Partial<UserProfile>): Promise<UserProfile> {
    await mockDelay(300);
    return { ...MOCK_USER_PROFILE, ...payload };
  }

  async deactivate(): Promise<void> {
    await mockDelay(300);
  }
}
