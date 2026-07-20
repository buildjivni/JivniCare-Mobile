/**
 * Assembles the individual token files into the single `Tokens` shape `useTheme()` returns, and
 * the `{ light, dark }` structure Section 8 ("Theme Architecture" → "Dark Mode Strategy") of
 * `docs/engineering/Sprint-0-Engineering-Design.md` specifies.
 *
 * Dark mode is explicitly out of scope for the patient app for V1 (`docs/08-Design-System.md`'s
 * "Dark Mode" note: scoped to the Admin/Doctor web dashboards only). `dark` is intentionally set
 * equal to `light` today, so that adding a real dark theme later is a data change (populating
 * `dark` with real values) rather than an architecture change.
 */
import { COLORS } from './tokens/colors';
import { ELEVATION } from './tokens/elevation';
import { OPACITY } from './tokens/opacity';
import { RADIUS } from './tokens/radius';
import { SPACING } from './tokens/spacing';
import { TYPOGRAPHY } from './tokens/typography';

export interface Tokens {
  colors: typeof COLORS;
  typography: typeof TYPOGRAPHY;
  spacing: typeof SPACING;
  radius: typeof RADIUS;
  elevation: typeof ELEVATION;
  opacity: typeof OPACITY;
}

const tokens: Tokens = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radius: RADIUS,
  elevation: ELEVATION,
  opacity: OPACITY,
};

export interface Theme {
  light: Tokens;
  dark: Tokens;
}

export const THEME: Theme = {
  light: tokens,
  dark: tokens,
};
