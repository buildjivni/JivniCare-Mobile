/**
 * Idempotency-key generator for `BookingService.book()` — per Section 7's "idempotent
 * `requestId` generation" responsibility and `docs/11-API-Contract.md` Rule B3 ("mobile client
 * must generate and send `requestId`... a UUID"). No UUID library is added for this one call
 * site; this is a standard, dependency-free RFC 4122 v4-shaped generator (`Math.random()`-backed,
 * which is fine for a client-side idempotency key — it is never used for anything
 * security-sensitive).
 */
export function generateRequestId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = (Math.random() * 16) | 0;
    const value = character === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
