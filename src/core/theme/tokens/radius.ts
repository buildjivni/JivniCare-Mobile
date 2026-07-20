/**
 * Border radius design tokens — `docs/08-Design-System.md`'s Radius Scale table.
 */

export const RADIUS_SM = 8;
export const RADIUS_MD = 12;
export const RADIUS_LG = 16;
export const RADIUS_XL = 24;
export const RADIUS_2XL = 32;
export const RADIUS_FULL = 9999;

export const RADIUS = {
  sm: RADIUS_SM,
  md: RADIUS_MD,
  lg: RADIUS_LG,
  xl: RADIUS_XL,
  xxl: RADIUS_2XL,
  full: RADIUS_FULL,
} as const;

export type RadiusToken = typeof RADIUS;
