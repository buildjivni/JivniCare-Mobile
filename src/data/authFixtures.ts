import type { AuthTokens, SendOtpResult } from '@/types/auth';

/** Fixtures for `MockAuthRepository` (F01) — used only when `core/config`'s `USE_MOCK_DATA`
 * flag is on. Shapes match `docs/11-API-Contract.md`'s F01 section exactly. */
export const MOCK_SEND_OTP_RESULT: SendOtpResult = {
  message: 'OTP sent successfully',
  sessionId: 'mock-session-001',
  userExists: true,
};

export const MOCK_AUTH_TOKENS: AuthTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresIn: 1800,
  userExists: true,
  needsProfile: false,
  user: {
    id: 'user-mock-001',
    phone: '+919999999999',
    name: 'Mock Patient',
    role: 'PATIENT',
    doctorId: null,
    latitude: null,
    longitude: null,
  },
};
