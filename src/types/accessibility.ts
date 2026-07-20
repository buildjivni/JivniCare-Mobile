/**
 * Shared accessibility contract for every interactive atom/molecule.
 * Source of truth: docs/09-Component-Library.md, Section 0 (Shared Accessibility Base).
 * Defined once here per that doc's intent ("written once here instead of repeated 20 times")
 * rather than redeclared inline in each component.
 */

export type AccessibilityRoleToken =
  | 'button'
  | 'link'
  | 'image'
  | 'header'
  | 'checkbox'
  | 'radio'
  | 'text'
  | 'adjustable'
  | 'search'
  | 'none';

export interface AccessibleProps {
  /**
   * REQUIRED on every pressable/interactive element — what a screen reader announces.
   * Must be the Hindi OR English string currently active per the app's language state,
   * sourced from docs/10-UX-Writing-Guide.md — never a hardcoded English string regardless
   * of app language.
   */
  accessibilityLabel: string;
  accessibilityRole?: AccessibilityRoleToken;
  /** What happens on activation, when the label alone doesn't make it obvious. */
  accessibilityHint?: string;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    /** Set true during Loading states so screen readers announce "busy". */
    busy?: boolean;
  };
  /** For E2E test targeting. */
  testID?: string;
}
