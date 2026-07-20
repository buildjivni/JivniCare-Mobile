/**
 * Centralized, strongly-typed environment configuration — the single import point (`@/core/config`)
 * for anything that varies by build environment. No other file should read `process.env.EXPO_PUBLIC_*`
 * directly; per `docs/engineering/Sprint-0-Engineering-Design.md` Section 11's Configuration
 * Strategy, only `EXPO_PUBLIC_`-prefixed variables are ever used client-side, and Section 5's API
 * Architecture requires the base URL be "sourced from `core/config` (environment-specific, never
 * hardcoded)" everywhere else.
 */

export type AppEnvironment = 'development' | 'staging' | 'production';

function resolveEnvironment(): AppEnvironment {
  const override = process.env.EXPO_PUBLIC_APP_ENV;
  if (override === 'development' || override === 'staging' || override === 'production') {
    return override;
  }
  // Falls back to the bundler's own dev/prod distinction (RN's global `__DEV__`) when no explicit
  // override is set — matches the "development ready, production ready" requirement without
  // needing every developer to configure an env var just to run the app locally.
  return __DEV__ ? 'development' : 'production';
}

export const APP_ENV: AppEnvironment = resolveEnvironment();
export const IS_DEV = APP_ENV === 'development';
export const IS_STAGING = APP_ENV === 'staging';
export const IS_PROD = APP_ENV === 'production';

/**
 * Placeholder per-environment API base URLs. No real backend exists yet — `README.md`'s own
 * "Environment Variables" section confirms "None are currently required... no network calls or
 * API base URL are wired up yet" and names `EXPO_PUBLIC_API_BASE_URL` as the one *planned*
 * variable. These placeholders exist purely so `core/config` has a typed, non-empty value to
 * export today (satisfying "development ready, production ready, future staging support"); they
 * are not real endpoints and must be replaced via `EXPO_PUBLIC_API_BASE_URL` once real
 * infrastructure is provisioned. No secret or real credential is embedded here.
 */
const PLACEHOLDER_API_BASE_URL: Record<AppEnvironment, string> = {
  development: 'https://api-dev.jivnicare.example',
  staging: 'https://api-staging.jivnicare.example',
  production: 'https://api.jivnicare.example',
};

export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? PLACEHOLDER_API_BASE_URL[APP_ENV];

/** Default request timeout in milliseconds — 10s per Section 5's documented client timeout
 * (matches `11-API-Contract.md` F01's own recommendation), overridable per-request by callers. */
export const API_TIMEOUT_MS = 10_000;
