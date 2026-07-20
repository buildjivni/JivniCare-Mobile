/** F08 — `docs/11-API-Contract.md`'s exact `book-appointment` request body. `location` is typed
 * `any` in the contract itself — kept `unknown` here rather than inventing a shape for it. */
export interface CreateBookingPayload {
  doctorId: string;
  date?: string;
  location?: unknown;
  isEmergency?: boolean;
  requestId?: string;
}

/**
 * F08/F09/F10/F11/F12 — every one of these sections references `<QueueToken>` as a return shape
 * without ever itemizing its fields in `docs/11-API-Contract.md`; F10 additionally notes it
 * "includes nested `queue.doctor` + `queue.tokens`" without listing those either. This is
 * therefore a **deliberately minimal** domain type — only `id` and `status` are asserted, since
 * every F-section's error/state descriptions (`"INVALID_STATE"`, "not in a cancellable state")
 * confirm a status field exists. Flagged as technical debt — extend once the real backend field
 * list is confirmed, rather than guessed further here.
 */
export interface QueueToken {
  id: string;
  status: string;
}
