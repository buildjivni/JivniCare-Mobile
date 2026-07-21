import { waitlistRepository } from '@/repositories';
import type { WaitlistClaimResult } from '@/types/waitlist';

/**
 * F12. **Not documented in Section 7's Service Layer table at all** — that table lists only
 * `AuthService`/`DoctorService`/`BookingService`/`QueueService`/`NotificationService`/
 * `ProfileService`/`SettingsService`/`AnalyticsService`. `WaitlistService` is, however,
 * explicitly named by both this milestone's own instructions and Section 4's Feature-hook table
 * ("`useWaitlist(doctorId)` ... Join + claim mutations over `WaitlistRepository`/
 * `WaitlistService`"), and `WaitlistRepository` already exists (Milestone 5). Flagged as a gap
 * in Section 7 rather than silently building undocumented business rules — this is therefore a
 * thin pass-through with zero rule content added, mirroring `WaitlistRepository`'s own methods
 * 1:1, since no documented Service-level responsibility exists to build on top.
 */
export interface WaitlistServiceContract {
  join(doctorId: string): Promise<void>;
  claim(doctorId: string): Promise<WaitlistClaimResult>;
}

export const WaitlistService: WaitlistServiceContract = {
  async join(doctorId) {
    return waitlistRepository.join(doctorId);
  },

  async claim(doctorId) {
    return waitlistRepository.claim(doctorId);
  },
};
