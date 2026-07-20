/**
 * Generic, framework-agnostic relative-time helpers (Section 12's Utilities Strategy: `"2 min
 * ago"`, `"Today"`, `"Tomorrow"` per `10-UX-Writing-Guide.md` Section 21 Rule 3). Pure functions,
 * zero React/RN imports — unit-testable with plain Jest.
 */

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Whether `date` falls on the same calendar day as `now` (defaults to the current time). */
export function isToday(date: Date, now: Date = new Date()): boolean {
  return isSameCalendarDay(date, now);
}

/** Whether `date` falls on the calendar day immediately after `now` (defaults to the current
 * time). */
export function isTomorrow(date: Date, now: Date = new Date()): boolean {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameCalendarDay(date, tomorrow);
}

/**
 * Formats `date` relative to `now` (defaults to the current time): `"just now"`, `"5 min ago"`,
 * `"2 hr ago"`, `"Today"`, `"Tomorrow"`, or a plain locale date string once it's more than a day
 * away in either direction.
 */
export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  const diffAbsMs = Math.abs(diffMs);

  if (diffMs >= 0 && diffAbsMs < MINUTE_MS) {
    return 'just now';
  }
  if (diffMs >= 0 && diffAbsMs < HOUR_MS) {
    const minutes = Math.floor(diffAbsMs / MINUTE_MS);
    return `${minutes} min ago`;
  }
  if (diffMs >= 0 && diffAbsMs < DAY_MS && isToday(date, now)) {
    const hours = Math.floor(diffAbsMs / HOUR_MS);
    return `${hours} hr ago`;
  }
  if (isToday(date, now)) {
    return 'Today';
  }
  if (isTomorrow(date, now)) {
    return 'Tomorrow';
  }
  return date.toLocaleDateString();
}
