import type { WaitlistClaimResult } from '@/types/waitlist';

/**
 * F12 — matches
 * `docs/engineering/Sprint-0-Engineering-Design.md` Section 6's `WaitlistRepository` interface
 * exactly. No speculative methods added.
 */
export interface WaitlistRepository {
  join(doctorId: string): Promise<void>;
  claim(doctorId: string): Promise<WaitlistClaimResult>;
}
