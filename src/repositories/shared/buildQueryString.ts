export type QueryParamValue = string | number | boolean | string[] | undefined;

/**
 * Generic querystring builder shared by any `Http*Repository` GET method that takes filter
 * params (`DoctorRepository.search`, `NotificationRepository.getInbox`). Array values are
 * comma-joined, matching `docs/11-API-Contract.md`'s documented comma-separated `specialty`
 * param. Pure data-shape translation — no business meaning is attached to any key.
 */
export function buildQueryString(params: Record<string, QueryParamValue>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      if (value.length > 0) {
        searchParams.set(key, value.join(','));
      }
    } else {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}
