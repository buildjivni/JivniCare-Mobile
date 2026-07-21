import { doctorRepository } from '@/repositories';
import type { Doctor, DoctorSearchParams, DoctorSearchResult } from '@/types/doctor';

/**
 * F02–F06, Business-Rules §16 (Section 7). Documented responsibilities: "Search parameter
 * shaping (4-filter model), result mapping, profile fetch, `isLive`/`isClosed` presentational
 * derivation."
 *
 * `search()`/`getById()` are thin pass-throughs — `DoctorSearchParams` already models the
 * documented 4-filter shape 1:1 (Section 6), and `DoctorRepository` already returns typed
 * domain models, so no extra parameter shaping or result mapping is needed on top.
 * `isLive`/`isClosed` derivation is **not** built: Section 7 itself qualifies this as "per Rule
 * DA1–DA4, once backend fields exist" — `src/types/doctor.ts`'s `Doctor` type (Milestone 5) does
 * not have the underlying live/closed source fields yet, and Rules DA1–DA4's exact logic lives
 * in `05-Business-Rules.md`, outside this milestone's read-first scope. `getById()` still throws
 * `NotImplementedError` (F05 has no documented endpoint) — unchanged from the Repository layer.
 */
export interface DoctorServiceContract {
  search(params: DoctorSearchParams): Promise<DoctorSearchResult>;
  getById(id: string): Promise<Doctor>;
}

export const DoctorService: DoctorServiceContract = {
  async search(params) {
    return doctorRepository.search(params);
  },

  async getById(id) {
    return doctorRepository.getById(id);
  },
};
