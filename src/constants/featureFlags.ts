import { IS_DEV } from '@/core/config';

/**
 * Documented feature flags (Section 11's Constants Strategy). Nothing in this milestone reads
 * these yet — they exist so the flag a future repository factory (`USE_MOCK_DATA`, Section 5's
 * Future Backend Integration Strategy) or OTP test flow needs already has one, typed, canonical
 * home instead of being invented ad hoc later.
 */
export const FEATURE_FLAGS = {
  /** Gates real-vs-mock repository selection (Section 5, item 2) — `true` until a domain's
   * backend blocker (P0-1..P0-6) is resolved. */
  USE_MOCK_DATA: true,
  /** Mirrors the current web app's `NEXT_PUBLIC_ENABLE_TEST_OTP`-equivalent for mobile
   * (`07-Mobile-UX-Spec.md` S04) — enabled only in development by default. */
  ENABLE_TEST_OTP: IS_DEV,
  /** `AnalyticsService` (Section 7/14) is not built in this milestone; this flag is reserved for
   * when it is. */
  ENABLE_ANALYTICS: false,
} as const;
