import type { Doctor, DoctorSearchParams, DoctorSearchResult } from '@/types/doctor';

/**
 * F02/F03/F05 — matches
 * `docs/engineering/Sprint-0-Engineering-Design.md` Section 6's `DoctorRepository` interface
 * exactly. No speculative methods added.
 */
export interface DoctorRepository {
  search(params: DoctorSearchParams): Promise<DoctorSearchResult>;
  getById(id: string): Promise<Doctor>;
}
