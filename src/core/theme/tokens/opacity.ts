/**
 * Opacity design tokens.
 *
 * `docs/08-Design-System.md` has no single "Opacity Scale" table (unlike Colors/Typography/
 * Spacing/Radius/Elevation, which each get their own named table) — these values are instead
 * defined ad hoc across the Button System, Card System, and Bottom Sheet specs. This file
 * consolidates every distinct opacity value that document defines into one set of named
 * constants, the same "gather scattered-but-defined values into one module" treatment Section 8
 * of `docs/engineering/Sprint-0-Engineering-Design.md` applies to the other token categories.
 */

// Button System: "Disabled: opacity 0.5, no pointer events" (Primary/Secondary/Danger/Ghost)
export const OPACITY_DISABLED = 0.5;
// Button System: "Pressed: opacity 0.85" (Primary/Danger)
export const OPACITY_PRESSED = 0.85;
// Button System: Secondary/Ghost "Pressed: background --color-primary at 8% opacity"
export const OPACITY_PRESSED_TINT = 0.08;
// Button System: Icon Button "Pressed: background --color-text-tertiary at 10% opacity"
export const OPACITY_ICON_PRESSED_TINT = 0.1;
// Card System: DoctorCard Closed State "grayscale + opacity-60"
export const OPACITY_CLOSED = 0.6;
// Card System: Bottom Sheet "Backdrop: rgba(0,0,0,0.5)"
export const OPACITY_BACKDROP = 0.5;

export const OPACITY = {
  disabled: OPACITY_DISABLED,
  pressed: OPACITY_PRESSED,
  pressedTint: OPACITY_PRESSED_TINT,
  iconPressedTint: OPACITY_ICON_PRESSED_TINT,
  closed: OPACITY_CLOSED,
  backdrop: OPACITY_BACKDROP,
} as const;

export type OpacityToken = typeof OPACITY;
