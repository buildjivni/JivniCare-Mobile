/**
 * Color design tokens — the single source of truth for every hex value used across the app.
 *
 * Sourced verbatim from `docs/08-Design-System.md`'s Color Palette (Primary/Neutral/Semantic),
 * Status Colors, and Badge System tables — see Section 8 ("Theme Architecture") of
 * `docs/engineering/Sprint-0-Engineering-Design.md` for the architecture this file implements.
 *
 * This mirrors the flat mapping already present in `tailwind.config.js`'s `theme.extend.colors`
 * (both are hand-kept in sync against the same locked doc; `tailwind.config.js` was not
 * regenerated from this file in this milestone — see the M2 implementation report).
 *
 * Brand-color conflict note (`docs/08.1-Brand-Assets.md`, "Brand Colour Rules" section,
 * flagged/unresolved): that document's "Primary Green" (`#529C60`) differs from this file's
 * `SECONDARY` (`#4B9F5F`, `docs/08-Design-System.md`'s `--color-secondary`). Per that document's
 * own resolution note, `SECONDARY` below intentionally uses the Design-System value for UI
 * component tokens (buttons, badges, success states) — `#529C60` is reserved for already-exported
 * brand asset files only, and is not a UI token.
 */

// Primary Colors
export const PRIMARY = '#5696C7';
export const PRIMARY_DARK = '#2B6CB0';
export const SECONDARY = '#4B9F5F';
export const SECONDARY_DARK = '#2F855A';
export const NAVY = '#1B3F6B';

// Neutral Colors
export const BACKGROUND = '#F8F9FA';
export const SURFACE = '#FFFFFF';
export const TEXT_PRIMARY = '#1F2937';
export const TEXT_SECONDARY = '#6B7280';
export const TEXT_TERTIARY = '#9CA3AF';
export const BORDER = '#E5E7EB';
export const BORDER_FOCUS = '#5696C7';

// Semantic Colors
export const SUCCESS = '#16A34A';
export const WARNING = '#F59E0B';
export const ERROR = '#DC2626';
export const INFO = '#3B82F6';
export const EMERGENCY = '#DC2626';

// Disabled input background — Input System's Text Input "Disabled" spec. Already present in
// tailwind.config.js as `muted`.
export const MUTED = '#F3F4F6';

// Generic neutrals used directly as icon/text colors (e.g. white glyphs on colored badges).
// Not their own named token row in the Color Palette table, but used throughout the Button/
// Badge/Icon specs as literal white/black.
export const WHITE = '#FFFFFF';
export const BLACK = '#000000';

// Status Colors (Queue/Token status table)
export const STATUS_AVAILABLE = '#16A34A';
export const STATUS_ON_BREAK = '#F59E0B';
export const STATUS_BUSY = '#EA580C';
export const STATUS_OFFLINE = '#6B7280';
export const STATUS_CALLED = '#16A34A';
export const STATUS_WAITING = '#F59E0B';
export const STATUS_COMPLETED = '#6B7280';
export const STATUS_CANCELLED = '#DC2626';
export const STATUS_NO_SHOW = '#6B7280';
export const STATUS_EXPIRED = '#6B7280';

// Badge System — Early Partner's diagonal gradient (already implemented via react-native-svg's
// <LinearGradient> in Badge.tsx). This is one of the few gradients explicitly defined in
// docs/08-Design-System.md, per this milestone's "no gradients unless explicitly defined" rule.
export const EARLY_PARTNER_GRADIENT_START = '#F59E0B';
export const EARLY_PARTNER_GRADIENT_END = '#D97706';

export const COLORS = {
  primary: PRIMARY,
  primaryDark: PRIMARY_DARK,
  secondary: SECONDARY,
  secondaryDark: SECONDARY_DARK,
  navy: NAVY,

  background: BACKGROUND,
  surface: SURFACE,
  textPrimary: TEXT_PRIMARY,
  textSecondary: TEXT_SECONDARY,
  textTertiary: TEXT_TERTIARY,
  border: BORDER,
  borderFocus: BORDER_FOCUS,

  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  info: INFO,
  emergency: EMERGENCY,

  muted: MUTED,
  white: WHITE,
  black: BLACK,

  statusAvailable: STATUS_AVAILABLE,
  statusOnBreak: STATUS_ON_BREAK,
  statusBusy: STATUS_BUSY,
  statusOffline: STATUS_OFFLINE,
  statusCalled: STATUS_CALLED,
  statusWaiting: STATUS_WAITING,
  statusCompleted: STATUS_COMPLETED,
  statusCancelled: STATUS_CANCELLED,
  statusNoShow: STATUS_NO_SHOW,
  statusExpired: STATUS_EXPIRED,

  earlyPartnerGradientStart: EARLY_PARTNER_GRADIENT_START,
  earlyPartnerGradientEnd: EARLY_PARTNER_GRADIENT_END,
} as const;

export type ColorToken = typeof COLORS;
