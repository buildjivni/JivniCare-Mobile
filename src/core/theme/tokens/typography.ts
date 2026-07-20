/**
 * Typography design tokens — the 7-row Type Scale table from `docs/08-Design-System.md`'s
 * Typography section, as named constants (size, line height, weight).
 *
 * Line heights are `fontSize * the doc's unitless multiplier column`, rounded to the nearest
 * whole pixel (React Native's `lineHeight` style accepts any number, but whole pixels match the
 * rounding already used by every existing arbitrary-value className in the codebase, e.g.
 * `text-[18px] leading-[23px]` for `title`).
 */
import type { TextStyle } from 'react-native';

export interface TypeScaleToken {
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle['fontWeight'];
}

// size 32, line-height multiplier 1.2, weight 700 — splash headline
export const HERO: TypeScaleToken = { fontSize: 32, lineHeight: 38, fontWeight: '700' };
// size 24, line-height multiplier 1.2, weight 700 — screen titles
export const HEADLINE: TypeScaleToken = { fontSize: 24, lineHeight: 29, fontWeight: '700' };
// size 18, line-height multiplier 1.3, weight 600 — card titles, section headers
export const TITLE: TypeScaleToken = { fontSize: 18, lineHeight: 23, fontWeight: '600' };
// size 16, line-height multiplier 1.5, weight 400 — primary body, buttons
export const BODY_LARGE: TypeScaleToken = { fontSize: 16, lineHeight: 24, fontWeight: '400' };
// size 14, line-height multiplier 1.5, weight 400 — secondary body, descriptions
export const BODY: TypeScaleToken = { fontSize: 14, lineHeight: 21, fontWeight: '400' };
// size 12, line-height multiplier 1.4, weight 400 — timestamps, hints, labels
export const CAPTION: TypeScaleToken = { fontSize: 12, lineHeight: 17, fontWeight: '400' };
// size 72, line-height multiplier 1.0, weight 700 — token number display
export const TOKEN_HERO: TypeScaleToken = { fontSize: 72, lineHeight: 72, fontWeight: '700' };

export const TYPOGRAPHY = {
  hero: HERO,
  headline: HEADLINE,
  title: TITLE,
  bodyLarge: BODY_LARGE,
  body: BODY,
  caption: CAPTION,
  tokenHero: TOKEN_HERO,
} as const;

export type TypographyToken = typeof TYPOGRAPHY;
