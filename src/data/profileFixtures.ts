import type { UserProfile } from '@/types/profile';

/** Fixture for `MockProfileRepository` (F14/F18) — used only when `core/config`'s
 * `USE_MOCK_DATA` flag is on. */
export const MOCK_USER_PROFILE: UserProfile = {
  id: 'user-mock-001',
  phone: '+919999999999',
  name: 'Mock Patient',
  role: 'PATIENT',
  doctorId: null,
  latitude: null,
  longitude: null,
};
