import { MOCK_DOCTOR_SEARCH_RESULT } from '@/data/doctorFixtures';
import type { Doctor, DoctorSearchParams, DoctorSearchResult } from '@/types/doctor';

import type { DoctorRepository } from './DoctorRepository';
import { mockDelay, NotImplementedError } from '../shared';

/** Mock implementation — returns static fixtures from `src/data/doctorFixtures.ts` after a
 * simulated delay. `getById` still throws `NotImplementedError`, matching `HttpDoctorRepository`:
 * F05 has no documented endpoint or response shape to mock, in either implementation. */
export class MockDoctorRepository implements DoctorRepository {
  async search(_params: DoctorSearchParams): Promise<DoctorSearchResult> {
    await mockDelay(400);
    return MOCK_DOCTOR_SEARCH_RESULT;
  }

  async getById(_id: string): Promise<Doctor> {
    await mockDelay(200);
    throw new NotImplementedError(
      'DoctorRepository.getById',
      'F05 doctor-detail endpoint is not documented',
    );
  }
}
