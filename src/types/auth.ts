import type { UserProfile } from './profile';

/** F01 `send-otp` response — `docs/11-API-Contract.md` gives this shape verbatim (flat, not
 * enveloped): `{ message, sessionId, userExists }`. */
export interface SendOtpResult {
  message: string;
  sessionId: string;
  userExists: boolean;
}

/** F01 `verify-otp` request body, per the contract's exact Zod-shaped fields. `location` is
 * typed `any` in the contract itself — kept `unknown` here rather than inventing a shape for it. */
export interface VerifyOtpPayload {
  phone: string;
  otp: string;
  sessionId: string;
  name?: string;
  location?: unknown;
}

/**
 * F01 `verify-otp`/`refresh` response. The Engineering Design's `AuthRepository` interface
 * (Section 6) gives both methods the same `Promise<AuthTokens>` return type, but the two raw
 * responses differ: `verify-otp` returns `{accessToken, refreshToken, expiresIn, userExists,
 * needsProfile, user}`, while `refresh` returns only `{accessToken, refreshToken, expiresIn}`.
 * The verify-otp-only fields are therefore optional here, so both endpoints' raw shapes satisfy
 * this one shared type without over-claiming what `refresh()` actually returns.
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  userExists?: boolean;
  needsProfile?: boolean;
  user?: UserProfile;
}
