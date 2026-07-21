import { STORAGE_KEYS } from '@/constants/storageKeys';
import { ValidationError } from '@/core/errors';
import { logger } from '@/core/logger';
import { SecureStoreAdapter } from '@/core/storage';
import { authRepository } from '@/repositories';
import type { AuthTokens, SendOtpResult, VerifyOtpPayload } from '@/types/auth';

/**
 * F01, Rules S1–S6, SEC1–SEC3 (Section 7). Per Section 5, item 4 — "`AuthService` is the one
 * exception that must be feature-complete (not just contract-shaped) before *any* other
 * repository can go 'real'," since every other domain requires a Bearer token this service is
 * the sole owner of.
 *
 * Built here: OTP send/verify orchestration, secure token persistence (`core/storage`'s
 * `SecureStoreAdapter`, keyed by M3's pre-built `STORAGE_KEYS.AUTH_ACCESS_TOKEN`/
 * `AUTH_REFRESH_TOKEN`), an in-memory access-token cache (exactly what Section 5's
 * auth-attach interceptor is documented to read from once built), and token refresh scheduling
 * (Section 7's "30-min access token lifecycle" — implemented generically off whatever
 * `expiresIn` the backend actually returns, not a hardcoded 30).
 *
 * Deliberately **not** built: "2-session-limit-aware error handling" (Rules S1–S6's exact
 * definition lives in `05-Business-Rules.md`, outside this milestone's read-first scope — no
 * error code is guessed at). `logout()` only clears this service's own session state
 * (SecureStore + in-memory cache); it does not touch React Query's cache, since Services must
 * not depend on React Query — a future `useLogout()` feature hook is expected to call both
 * `AuthService.logout()` and `queryClient.clear()`.
 */

const REFRESH_BUFFER_SECONDS = 60;

let accessToken: string | null = null;
let refreshTokenValue: string | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const secureStorage = new SecureStoreAdapter();

function clearRefreshTimer(): void {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

function scheduleRefresh(expiresInSeconds: number): void {
  clearRefreshTimer();
  const delayMs = Math.max(expiresInSeconds - REFRESH_BUFFER_SECONDS, 0) * 1000;
  refreshTimer = setTimeout(() => {
    refreshTokens().catch((error: unknown) => {
      // Not a silent swallow: logged via the one sanctioned logging surface (Section 14).
      // There is no UI for a background timer to surface to — the next foreground API call
      // will hit a 401 and go through the normal error path once Milestone 4's refresh-token
      // interceptor is implemented.
      logger.error('AuthService: background token refresh failed', { error });
    });
  }, delayMs);
}

async function persistTokens(tokens: AuthTokens): Promise<void> {
  accessToken = tokens.accessToken;
  refreshTokenValue = tokens.refreshToken;
  await Promise.all([
    secureStorage.setItem(STORAGE_KEYS.AUTH_ACCESS_TOKEN, tokens.accessToken),
    secureStorage.setItem(STORAGE_KEYS.AUTH_REFRESH_TOKEN, tokens.refreshToken),
  ]);
  scheduleRefresh(tokens.expiresIn);
}

async function refreshTokens(): Promise<AuthTokens> {
  const currentRefreshToken =
    refreshTokenValue ?? (await secureStorage.getItem(STORAGE_KEYS.AUTH_REFRESH_TOKEN));
  if (!currentRefreshToken) {
    throw new ValidationError(
      'AuthService.refresh: no refresh token available — user must log in again',
    );
  }
  const tokens = await authRepository.refresh(currentRefreshToken);
  await persistTokens(tokens);
  return tokens;
}

export interface AuthServiceContract {
  sendOtp(phone: string): Promise<SendOtpResult>;
  verifyOtp(payload: VerifyOtpPayload): Promise<AuthTokens>;
  refresh(): Promise<AuthTokens>;
  /** Reads the in-memory access-token cache Section 5's auth-attach interceptor is documented
   * to read from — no SecureStore read on every request. */
  getAccessToken(): string | null;
  logout(): Promise<void>;
}

export const AuthService: AuthServiceContract = {
  async sendOtp(phone) {
    return authRepository.sendOtp(phone);
  },

  async verifyOtp(payload) {
    const tokens = await authRepository.verifyOtp(payload);
    await persistTokens(tokens);
    return tokens;
  },

  async refresh() {
    return refreshTokens();
  },

  getAccessToken() {
    return accessToken;
  },

  async logout() {
    clearRefreshTimer();
    accessToken = null;
    refreshTokenValue = null;
    await Promise.all([
      secureStorage.removeItem(STORAGE_KEYS.AUTH_ACCESS_TOKEN),
      secureStorage.removeItem(STORAGE_KEYS.AUTH_REFRESH_TOKEN),
    ]);
  },
};
