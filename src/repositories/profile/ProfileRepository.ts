import type { UserProfile } from '@/types/profile';

/**
 * F14/F18 — matches
 * `docs/engineering/Sprint-0-Engineering-Design.md` Section 6's `ProfileRepository` interface
 * exactly. No speculative methods added.
 */
export interface ProfileRepository {
  update(payload: Partial<UserProfile>): Promise<UserProfile>;
  deactivate(): Promise<void>;
}
