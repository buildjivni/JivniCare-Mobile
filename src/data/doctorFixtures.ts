import type { Doctor, DoctorSearchResult } from '@/types/doctor';

/** Fixtures for `MockDoctorRepository` (F02/F03) — used only when `core/config`'s
 * `USE_MOCK_DATA` flag is on. `Doctor`'s field list is itself partial (see `src/types/doctor.ts`
 * for why), so this fixture only populates what that type declares. */
export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-001',
    name: 'Dr. Rajesh Sharma',
    specialty: 'General Physician',
    experience: 12,
    consultationFee: 500,
    isVerified: true,
    isEarlyPartner: true,
    patientsServed: 1240,
  },
  {
    id: 'doc-002',
    name: 'Dr. Anita Verma',
    specialty: 'Pediatrics',
    experience: 8,
    consultationFee: 400,
    isVerified: true,
    isEarlyPartner: false,
    patientsServed: 860,
  },
];

export const MOCK_DOCTOR_SEARCH_RESULT: DoctorSearchResult = {
  results: MOCK_DOCTORS,
  total: MOCK_DOCTORS.length,
  isFuzzy: false,
  didYouMean: null,
  emptyMessage: null,
  page: 1,
  limit: 20,
  hasMore: false,
};
