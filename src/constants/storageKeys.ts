/**
 * Named storage key strings — prevents typo-based key mismatches across future `core/storage`
 * call sites (`docs/engineering/Sprint-0-Engineering-Design.md` Section 11). These are key
 * *names* only; this milestone does not read or write any of them (that is explicitly out of
 * scope — "Do NOT implement authentication storage. Do NOT store tokens.").
 */
export const STORAGE_KEYS = {
  AUTH_ACCESS_TOKEN: 'auth.accessToken',
  AUTH_REFRESH_TOKEN: 'auth.refreshToken',
  SETTINGS_LANGUAGE: 'settings.language',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
