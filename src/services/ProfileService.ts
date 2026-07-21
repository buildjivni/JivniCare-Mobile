import { ValidationError } from '@/core/errors';
import { profileRepository } from '@/repositories';
import type { UserProfile } from '@/types/profile';

/**
 * F14 (Section 7). Documented responsibilities: "Profile edit validation, save orchestration
 * (flags the F14 missing-endpoint gap rather than pretending it's wired), read-only phone-field
 * enforcement."
 *
 * `update()` enforces the one concretely-named, mechanical validation rule this milestone can
 * verify without an external business-rules document — phone is read-only — then delegates to
 * `ProfileRepository.update()`, which still throws `NotImplementedError` (F14 has no documented
 * endpoint, confirmed again in Milestone 5), matching "flags the gap rather than pretending it's
 * wired" exactly. No other field-level validation is invented beyond this.
 *
 * `deactivate()` (F18) is **not** exposed here: Section 7 assigns "deactivation flow
 * orchestration" to `SettingsService`, which is outside this milestone's explicit 7-service
 * list — `ProfileRepository.deactivate()` (Milestone 5) therefore has no Service caller yet.
 * Adding it to `ProfileService` would be an undocumented method for this Service, which this
 * milestone's own instructions forbid ("Do NOT invent methods").
 */
export interface ProfileServiceContract {
  update(payload: Partial<UserProfile>): Promise<UserProfile>;
}

export const ProfileService: ProfileServiceContract = {
  async update(payload) {
    if (payload.phone !== undefined) {
      throw new ValidationError('ProfileService.update: phone is read-only and cannot be updated', {
        field: 'phone',
      });
    }
    return profileRepository.update(payload);
  },
};
