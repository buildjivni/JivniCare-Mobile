import { MOCK_AUTH_TOKENS, MOCK_SEND_OTP_RESULT } from '@/data/authFixtures';
import type { AuthTokens, SendOtpResult, VerifyOtpPayload } from '@/types/auth';

import type { AuthRepository } from './AuthRepository';
import { mockDelay } from '../shared';

/** Mock implementation — returns static fixtures from `src/data/authFixtures.ts` after a
 * simulated delay. Selected by `src/repositories/index.ts` while `USE_MOCK_DATA` is on. */
export class MockAuthRepository implements AuthRepository {
  async sendOtp(_phone: string): Promise<SendOtpResult> {
    await mockDelay(400);
    return MOCK_SEND_OTP_RESULT;
  }

  async verifyOtp(_payload: VerifyOtpPayload): Promise<AuthTokens> {
    await mockDelay(400);
    return MOCK_AUTH_TOKENS;
  }

  async refresh(_refreshToken: string): Promise<AuthTokens> {
    await mockDelay(200);
    return MOCK_AUTH_TOKENS;
  }
}
