import type { WaitlistClaimResult } from '@/types/waitlist';

import { MOCK_QUEUE_TOKEN } from './bookingFixtures';

/** Fixture for `MockWaitlistRepository` (F12) — used only when `core/config`'s `USE_MOCK_DATA`
 * flag is on. */
export const MOCK_WAITLIST_CLAIM_RESULT: WaitlistClaimResult = {
  success: true,
  message: 'Waitlist slot claimed',
  token: MOCK_QUEUE_TOKEN,
};
