/**
 * Generic string helpers (Section 12's Utilities Strategy). Pure functions, zero React/RN
 * imports.
 */

/** Converts `"some_error_code"` to `"Some Error Code"` — generalizes the private
 * `formatErrorCodeLabel` helper previously duplicated in `app/booking/[id].tsx`. */
export function snakeCaseToTitleCase(value: string): string {
  return value
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/** Truncates `value` to `maxLength` characters, appending an ellipsis only when truncation
 * actually occurred (per `10-UX-Writing-Guide.md` Rule 21.7 — `"Dr. Rajesh Shar..."`, not
 * `"Dr. Rajesh S..."`, i.e. the ellipsis must not eat into the visible character budget). */
export function truncateWithEllipsis(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength)}...`;
}
