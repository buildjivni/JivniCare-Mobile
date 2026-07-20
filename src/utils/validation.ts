/**
 * Generic validation helpers only (Section 12's Utilities Strategy, and this milestone's own
 * explicit "Validation helpers (generic only)... Do NOT implement business validation"
 * instruction). Phone-number and business-rule validation stay out of this file — see
 * `docs/engineering/Sprint-0-Engineering-Design.md` Section 12's `phone.ts`/`businessRules.ts`,
 * neither of which is part of this milestone.
 */

export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function hasMinLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

export function hasMaxLength(value: string, max: number): boolean {
  return value.trim().length <= max;
}

/** Generalizes the private name-length validator previously duplicated in `WaitlistForm.tsx`,
 * with the minimum configurable rather than hardcoded to one form's constant. */
export function isNameValid(name: string, minLength = 2): boolean {
  return isRequired(name) && hasMinLength(name, minLength);
}
