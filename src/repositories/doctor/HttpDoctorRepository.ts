import { apiClient } from '@/api';
import type { Doctor, DoctorSearchParams, DoctorSearchResult } from '@/types/doctor';

import type { DoctorRepository } from './DoctorRepository';
import { assertSuccessResponse, buildQueryString, NotImplementedError } from '../shared';

/**
 * Real implementation. `search()` calls F02/F03's documented, flat (not enveloped)
 * `/api/v1/patient/search` and is marked `isPublic` — the contract lists this endpoint as
 * working without authentication today.
 *
 * `getById()` throws `NotImplementedError`: `docs/11-API-Contract.md` does not itemize a
 * doctor-detail (F05) endpoint at all — flagged there as needing a follow-up read of the
 * SSE `send()` payload or a dedicated detail route. No URL is fabricated.
 */
export class HttpDoctorRepository implements DoctorRepository {
  async search(params: DoctorSearchParams): Promise<DoctorSearchResult> {
    const query = buildQueryString({
      query: params.query,
      specialty: params.specialty,
      availability: params.availability,
      maxFee: params.maxFee,
      minExperience: params.minExperience,
      page: params.page,
      limit: params.limit,
      lat: params.lat,
      lng: params.lng,
      district: params.district,
    });

    const response = await apiClient.request<DoctorSearchResult>(
      `/api/v1/patient/search${query}`,
      'GET',
      {
        isPublic: true,
      },
    );
    return assertSuccessResponse(response, 'DoctorRepository.search');
  }

  async getById(_id: string): Promise<Doctor> {
    throw new NotImplementedError(
      'DoctorRepository.getById',
      'F05 doctor-detail endpoint is not itemized in docs/11-API-Contract.md',
    );
  }
}
