import { apiClient } from '@/api';
import type { AuthTokens, SendOtpResult, VerifyOtpPayload } from '@/types/auth';

import type { AuthRepository } from './AuthRepository';
import { assertSuccessResponse } from '../shared';

/**
 * Real implementation — calls the three F01 endpoints exactly as documented in
 * `docs/11-API-Contract.md`. All three respond with flat JSON (not the `{success,data}`
 * envelope), per that document's Response Envelope section, so no unwrapping beyond the generic
 * 2xx gate is needed. `sendOtp`/`verifyOtp`/`refresh` are all pre-login, so each is marked
 * `isPublic` for the future auth interceptor (Section 5 of M4) to skip attaching a token.
 */
export class HttpAuthRepository implements AuthRepository {
  async sendOtp(phone: string): Promise<SendOtpResult> {
    const response = await apiClient.request<SendOtpResult>('/api/v1/auth/send-otp', 'POST', {
      body: { phone },
      isPublic: true,
    });
    return assertSuccessResponse(response, 'AuthRepository.sendOtp');
  }

  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthTokens> {
    const response = await apiClient.request<AuthTokens>('/api/v1/auth/verify-otp', 'POST', {
      body: payload,
      isPublic: true,
    });
    return assertSuccessResponse(response, 'AuthRepository.verifyOtp');
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.request<AuthTokens>('/api/v1/auth/refresh', 'POST', {
      body: { refreshToken },
      isPublic: true,
    });
    return assertSuccessResponse(response, 'AuthRepository.refresh');
  }
}
