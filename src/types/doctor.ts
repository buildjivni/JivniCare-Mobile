/**
 * F02/F03/F05 — `docs/11-API-Contract.md`'s search section describes its doctor objects only as
 * "doctor card objects, shape from `mapPrismaDoctorToUI`" without itemizing fields, and F05's
 * doctor-detail endpoint isn't itemized in the contract at all (flagged there as needing a
 * follow-up read). This is therefore a **deliberately partial** domain type, built only from the
 * fields the pre-existing `DoctorCardDoctor` UI type
 * (`src/components/molecules/DoctorCard.tsx`) implies exist on the underlying entity, minus that
 * type's UI-specific formatting (pre-formatted time strings, `QueueStatusBadgeStatus`, which
 * belong to presentation, not the domain model). Flagged as technical debt in
 * `docs/implementation/M5-Repository-Foundation-Report.md` — extend once the real backend field
 * list is confirmed, rather than guessed further here.
 */
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  consultationFee: number;
  isVerified: boolean;
  isEarlyPartner: boolean;
  patientsServed: number;
  profilePhoto?: string;
}

/** F02/F03 — `docs/11-API-Contract.md`'s exact GET/POST query-param list for
 * `/api/v1/patient/search`. `specialty` is comma-separated on the wire; modeled as an array at
 * the domain layer. */
export interface DoctorSearchParams {
  query?: string;
  specialty?: string[];
  availability?: 'today' | 'tomorrow';
  maxFee?: number;
  minExperience?: number;
  page?: number;
  limit?: number;
  lat?: number;
  lng?: number;
  district?: string;
}

/** F02/F03 — the search response's exact flat shape (not enveloped), per the contract. */
export interface DoctorSearchResult {
  results: Doctor[];
  total: number;
  isFuzzy: boolean;
  didYouMean: string | null;
  emptyMessage: string | null;
  page: number;
  limit: number;
  hasMore: boolean;
}
