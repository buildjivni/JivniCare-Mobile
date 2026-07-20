/**
 * F01/F14 — the `user` object `docs/11-API-Contract.md`'s `verify-otp` response documents in
 * full: `{ id, phone, name, role, doctorId, latitude, longitude }`. Reused verbatim as the
 * `UserProfile` domain model for `ProfileRepository`, since it's the one place the contract
 * itemizes every field of a patient's profile.
 */
export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  role: string;
  doctorId: string | null;
  latitude: number | null;
  longitude: number | null;
}
