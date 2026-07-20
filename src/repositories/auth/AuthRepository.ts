import type { AuthTokens, SendOtpResult, VerifyOtpPayload } from '@/types/auth';

/**
 * F01 (Phone OTP Login/Signup) — matches
 * `docs/engineering/Sprint-0-Engineering-Design.md` Section 6's `AuthRepository` interface
 * exactly. No speculative methods added.
 */
export interface AuthRepository {
  sendOtp(phone: string): Promise<SendOtpResult>;
  verifyOtp(payload: VerifyOtpPayload): Promise<AuthTokens>;
  refresh(refreshToken: string): Promise<AuthTokens>;
}
