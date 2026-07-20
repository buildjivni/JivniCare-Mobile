/**
 * Spacing scale design tokens — `docs/08-Design-System.md`'s Spacing Scale table.
 *
 * Note: NativeWind/Tailwind's default numeric spacing scale (each step = 4px) already lines up
 * exactly with these values (e.g. `p-4` = 16px = `SPACE_4`), which is why no existing
 * `className` string needed to change for this milestone — these named constants exist for any
 * JS-level (non-className) spacing need, e.g. inline styles, `Animated` values, or dynamic
 * layout math.
 */

export const SPACE_1 = 4;
export const SPACE_2 = 8;
export const SPACE_3 = 12;
export const SPACE_4 = 16;
export const SPACE_5 = 20;
export const SPACE_6 = 24;
export const SPACE_8 = 32;
export const SPACE_12 = 48;

export const SPACING = {
  space1: SPACE_1,
  space2: SPACE_2,
  space3: SPACE_3,
  space4: SPACE_4,
  space5: SPACE_5,
  space6: SPACE_6,
  space8: SPACE_8,
  space12: SPACE_12,
} as const;

export type SpacingToken = typeof SPACING;
