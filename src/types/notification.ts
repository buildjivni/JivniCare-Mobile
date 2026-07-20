/**
 * F17 — `docs/11-API-Contract.md`'s `GET /api/notifications` section describes its payload only
 * as "`<Notification rows, newest first>`" without itemizing fields. This is therefore a
 * **deliberately minimal** domain type — only `id` is asserted; the existence of `markRead`/
 * `unread-count` endpoints confirms a read-state field exists somewhere on this shape, but its
 * exact name isn't documented, so it is not guessed here. Flagged as technical debt — extend
 * once the real backend field list is confirmed.
 */
export interface Notification {
  id: string;
}
