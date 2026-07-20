import { apiClient } from '@/api';
import type { UserProfile } from '@/types/profile';

import type { ProfileRepository } from './ProfileRepository';
import { assertSuccessResponse, NotImplementedError } from '../shared';

/**
 * Real implementation. `update()` throws `NotImplementedError`: `docs/11-API-Contract.md` does
 * not document a patient profile-edit (F14) endpoint at all — the same gap `src/api/endpoints/
 * profile/index.ts` flagged in Milestone 4. No URL is fabricated.
 *
 * `deactivate()` calls F18's documented `delete-data` endpoint (flat response, no request body).
 */
export class HttpProfileRepository implements ProfileRepository {
  async update(_payload: Partial<UserProfile>): Promise<UserProfile> {
    throw new NotImplementedError(
      'ProfileRepository.update',
      'F14 profile-edit endpoint is not documented',
    );
  }

  async deactivate(): Promise<void> {
    const response = await apiClient.request<{ success: boolean; message: string }>(
      '/api/patient/delete-data',
      'POST',
    );
    assertSuccessResponse(response, 'ProfileRepository.deactivate');
  }
}
