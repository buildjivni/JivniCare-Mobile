/**
 * Generic formatting helpers (Section 12's Utilities Strategy). Pure functions, zero React/RN
 * imports.
 *
 * Note: Section 12 also names `formatFee()` (₹-specific) and `formatTokenNumber()` (queue-token
 * specific) as consolidation targets for private helpers already duplicated in `DoctorCard.tsx`.
 * This milestone builds `formatCurrency()` as their generic replacement (parameterized currency
 * symbol/locale rather than hardcoded to ₹), but does not wire it into `DoctorCard.tsx` or any
 * other existing component — replacing an existing private helper's call sites is
 * component-level, feature-adjacent work this "Core Foundation" milestone's scope doesn't cover
 * (see the M3 implementation report's Technical Debt section).
 */

/** Formats `name` as initials (e.g. `"Dr. Priya Sharma"` → `"PS"`) — generalizes the private
 * helper currently duplicated in `DoctorCard.tsx`. Ignores common salutations so `"Dr."`, `"Mr."`,
 * etc. don't consume an initial slot. */
export function initialsFromName(name: string, maxInitials = 2): string {
  const SALUTATIONS = new Set(['dr', 'mr', 'mrs', 'ms', 'miss', 'prof']);
  const words = name
    .trim()
    .split(/\s+/)
    .filter((word) => !SALUTATIONS.has(word.replace(/\.$/, '').toLowerCase()));

  return words
    .slice(0, maxInitials)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

export interface FormatCurrencyOptions {
  locale?: string;
  currency?: string;
}

/** Formats `amount` as a localized currency string — defaults to `en-IN`/`INR` (the app's only
 * currently-documented market) but is parameterized rather than hardcoded, unlike the private
 * `formatFee()` it generalizes. */
export function formatCurrency(amount: number, options: FormatCurrencyOptions = {}): string {
  const { locale = 'en-IN', currency = 'INR' } = options;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
