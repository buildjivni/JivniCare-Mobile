# JivniCare Mobile — API Contract
**Version:** V1.1.0 | **Date:** 2026-07-16 | **Status:** LOCKED (all F01–F19 patient-relevant
endpoints now verified; F19 confirmed as a backend build gap, not a documentation gap)
**Method:** Every contract below was extracted by reading the actual route file, not inferred
from `04-PRD.md`'s `SOURCE:` pointers. Where this contract disagrees with `05-Business-Rules.md`
or `04-PRD.md`, the disagreement is called out explicitly — treat the code as correct and the
doc as needing a follow-up edit (tracked in the Corrections table at the bottom).

---

## ⚠️ MOBILE BLOCKERS — read this before building anything

Three cross-cutting problems will stop the mobile app from working even if every screen and
component is built perfectly. These aren't documentation gaps — they're missing backend work.

### Blocker 1: Almost every patient route is cookie-only. Bearer tokens don't work yet.
The new `/api/v1/auth/*` routes correctly issue a Bearer `accessToken` for mobile. But I checked
every patient-facing route the mobile app needs to call after login, and **all of them still only
read the `jivnicare_token` HttpOnly cookie** — none of them fall back to
`Authorization: Bearer <token>`:
- `POST /api/patient/book-appointment`
- `POST /api/patient/queue/cancel-token`
- `POST /api/patient/queue/claim-waitlist`
- `GET /api/patient/my-bookings`
- `GET /api/patient/bookings/stream`
- `POST /api/patient/delete-data`
- `GET /api/notifications`

A shared helper that **does** support both (`src/lib/auth/session.ts`, used elsewhere for
doctor/admin routes) already exists in the codebase — these seven routes simply weren't wired to
use it. **This needs to be fixed in the backend before the mobile app can book, cancel, join a
waitlist, see bookings, track a token, deactivate an account, or read notifications.** This is
not a mobile-side workaround — a React Native app has no way to send an HttpOnly cookie set by a
Next.js Set-Cookie header the way a browser does.

### Blocker 2: Lead capture requires Cloudflare Turnstile, same as OTP.
`POST /api/public/lead` (F13 — Request a Doctor) requires a `turnstileToken` and **fails closed in
production** if it's missing or invalid. This is the same mobile-incompatibility already known for
OTP send/verify (`10-auth-architecture.md`'s Mobile Gaps section flagged this for auth, but nobody
flagged it for lead capture). Needs the same fix path: either a Turnstile-free mobile variant of
this route, or App Attest / Play Integrity verification substituted for mobile clients.

### Blocker 3: Account deactivation does not actually require OTP, contradicting Business-Rules Rule D3.
`05-Business-Rules.md` Rule D3 states: *"OTP verification required before deactivation."*
The real route (`POST /api/patient/delete-data`) has no OTP step at all — it deactivates the
account immediately on a single authenticated POST with no re-verification. `07-Mobile-UX-Spec.md`
Screen S16 was designed around the OTP-gated flow the docs describe, and would currently be
building a UI step (OTP entry) that the backend doesn't ask for or check. **Decision needed:**
either add the OTP check to the route (matching the doc and the S16 screen design), or update
Business-Rules.md + S16 to remove the OTP step and just require the user to be an authenticated
session (lower friction, but weaker protection against someone else using an unlocked phone).

---

## Response Envelope — two formats coexist, know which one each endpoint uses

Most routes use the shared `apiResponse()` / `apiError()` helpers:
```json
// Success: apiResponse(data)
{ "success": true, "data": { ... }, "message": "optional string" }
// Error: apiError(message, status)
{ "success": false, "error": "human-readable message" }
```
**But `/api/v1/auth/send-otp`, `/api/v1/auth/verify-otp`, `/api/v1/auth/refresh`, and
`/api/v1/patient/search` return flat JSON, not this envelope** — e.g. `verify-otp`'s success
response is `{ accessToken, refreshToken, expiresIn, userExists, needsProfile, user }` directly,
with no `success`/`data` wrapper. Mobile client code must NOT assume every response is wrapped —
check per-endpoint below. (This inconsistency is a good candidate for a v1.1 cleanup, but isn't
worth blocking V1 mobile launch over — just document it accurately so nobody writes a shared
response parser that breaks on 4 of the most important endpoints.)

---

## F01 — Phone OTP Login/Signup

### `POST /api/v1/auth/send-otp`
```
Auth: none
Rate limit: otpRatelimit, key = otp_send_{phone10} (bypassed entirely in test-OTP mode)
Request:  { "phone": "9876543210" }
  - Validation: strips non-digits, takes last 10, must match /^[6-9]\d{9}$/
Response 200 (flat, not enveloped):
  { "message": "OTP bhej diya gaya hai", "sessionId": "<2Factor Details string>", "userExists": true|false }
Response 200 (test-OTP mode):
  { "message": "Test OTP generate ho gaya", "sessionId": "test_session_{phone10}", "userExists": bool }
Errors:
  400 - phone missing/invalid format
  429 - rate limited ("Bahut zyada requests. Thodi der mein try karein.")
  503 - SMS provider not configured, or 2Factor API unreachable
  500 - 2Factor returned Status != "Success"
Retry/Timeout: not specified in code — client should apply its own timeout (recommend 10s) and
  a single retry on network failure only, never on 429/503 (respect the rate limit).
```

### `POST /api/v1/auth/verify-otp`
```
Auth: none
Rate limit: otpRatelimit, key = otp_verify_{phone10}
Request:  { "phone": "9876543210", "otp": "123456", "sessionId": "<from send-otp>", "name"?: string, "location"?: any }
Response 200 (flat, NOT enveloped):
  {
    "accessToken": "<JWT, 30-min expiry>",
    "refreshToken": "<64-char hex, 30-day expiry>",
    "expiresIn": 1800,
    "userExists": bool,
    "needsProfile": bool,     // true if new user OR name is empty/"patient"
    "user": { "id", "phone", "name", "role", "doctorId", "latitude": null, "longitude": null }
  }
Errors:
  400 - phone/otp/sessionId missing, or phone not 10 digits
  401 - invalid/expired OTP (uses RAW NextResponse.json({error}, {status}), not apiError — same
        shape either way: {"error": "Invalid or expired OTP. Please try again."})
  429 - rate limited
  503 - verification service unavailable
  500 - generic server error (also returned on transient DB errors, with a DB-specific message)
Side effect: creates a new User row (role=PATIENT, authProvider=PATIENT_OTP) if phone is unseen.
Session limits: generateTokens() enforces PATIENT: 2 concurrent sessions via Redis
  (FIFO eviction of oldest refresh token) — confirmed live in code, contrary to what an earlier
  draft of PRD Decision #4 assumed for the *web* OTP flow (which genuinely doesn't enforce it —
  the mobile v1 flow does, correctly).
```

### `POST /api/v1/auth/refresh`
```
Auth: none (the refresh token itself is the credential)
Rate limit: refreshRatelimit, key = refresh_token_{refreshToken} — "20/hour" per Business-Rules
  Section 12 (not independently re-verified against the ratelimit config file in this pass)
Request:  { "refreshToken": "<hex string>" }
Response 200 (flat, NOT enveloped): same shape as verify-otp's token block —
  { "accessToken", "refreshToken", "expiresIn": 1800 }
  ⚠️ CORRECTION vs Business-Rules.md Rule S4 and PRD Decision #5: those say access token is
  "15 minutes." The actual code (`signToken(..., "30m")`) issues a **30-minute** access token.
  Update Business-Rules.md Rule S4 and PRD Decision #5 to say 30 minutes, not 15.
Errors:
  400 - refreshToken missing
  401 - "Invalid or expired refresh token. Please login again." (also returned if the token was
        already rotated/revoked — refresh tokens are single-use, rotation deletes the old one)
  429 - rate limited
Rotation: every successful call revokes the old refresh token and issues a brand new
  access+refresh pair. The old token cannot be reused (attempting to do so returns 401)
  — this is real, working Refresh Token Rotation, not just a stated intent.
```

---

## F02/F03 — Doctor Search + Filters

### `GET /api/v1/patient/search` and `POST /api/v1/patient/search` (both supported, same handler)
```
Auth: none
Rate limit: publicSearchRatelimit, key = search:{ip} (skipped entirely in test/Playwright mode)
GET query params: query|q, speciality|specialty (comma-separated), availability, maxFee,
  minExperience, page, limit, lat, lng, district
POST body: same fields as JSON
Defaults: page=1, limit=15 (confirms Business-Rules/PRD's "15 per page" decision — verified)
Response 200 (flat, NOT enveloped):
  {
    "results": [ <doctor card objects, shape from mapPrismaDoctorToUI> ],
    "total": number,
    "isFuzzy": bool,
    "didYouMean": string|null,
    "emptyMessage": string|null,
    "page": number, "limit": number, "hasMore": bool
  }
Errors:
  429 - rate limited: { "error": "Too many requests. Please try again later." }
  500 - { "error": "Search failed. Please try again." }
Filter mechanics (confirmed from code, matches F03's 4-filter list exactly):
  - Hard filter (always applied): verificationStatus = VERIFIED AND canShowOnPublic = true
  - District: matches clinicDistrict OR clinicCity, case-insensitive
  - Specialty: OR match against provided list, case-insensitive
  - Availability: "today" checks isAvailableToday/isQueueActive; "tomorrow" recomputes clinic
    day-status for tomorrow's date specifically (not just a flag check)
  - Max Fee / Min Experience: simple numeric threshold filters, applied AFTER scoring/ranking
  - DB safety cap: fetches max 100 doctors before in-memory scoring (Business-Rules doesn't
    mention this cap — worth adding, since it means results beyond the top 100 raw matches
    for a very broad query will never appear regardless of score)
```

---

## F08 — Book Appointment

### `POST /api/patient/book-appointment`
```
Auth: jivnicare_token cookie ONLY — see Blocker 1 above. NOT bearer-compatible yet.
Rate limit: bookingRatelimit, key = book_appt_{userId}
Request:
  { "doctorId": string, "date"?: string, "location"?: any, "isEmergency"?: bool, "requestId"?: string }
  ⚠️ CORRECTION vs Business-Rules.md Rule B3: the doc calls this field "idempotencyKey."
  The actual Zod field name is requestId. Rename in Business-Rules.md, or the mobile client
  will send a field the server silently ignores (Zod would just treat idempotencyKey as unknown
  and drop it — the booking would go through WITHOUT idempotency protection, silently).
Idempotency mechanics: Redis SET NX on `idempotency:booking:{userId}:{requestId}`, 24h TTL.
  If the key already exists → 409 immediately, no new booking created. Key is rolled back
  (deleted) if the booking attempt throws, so a genuine failure can be safely retried with the
  same requestId.
Response 200 (enveloped): { "success": true, "data": { "success": true, "token": <QueueToken> } }
  (note the doubled "success" — apiResponse() wraps a payload that itself contains success:true)
Errors (all via apiError, enveloped {success:false, error: <message>}):
  401 - not authenticated
  400 - payload validation failed (Zod)
  409 - duplicate request (idempotency), or ALREADY_BOOKED (message includes existing token #)
  429 - rate limited
  400 - one of 13 named business-rule failures, each with a specific Hindi message:
        DOCTOR_NOT_VERIFIED, DOCTOR_NOT_ACCEPTING, ALREADY_BOOKED, QUEUE_FULL,
        DAILY_LIMIT_REACHED, CLINIC_CLOSED_TODAY, CLINIC_CLOSED_ON_THIS_DAY,
        BOOKING_NOT_STARTED, BOOKING_FINISHED, QUEUE_PAUSED, EMERGENCY_FULL,
        EMERGENCY_ONLY_ACTIVE, WAITLIST_RESERVED
  500 - unhandled error, or transient DB error (separate friendly message)
Side effects on success: creates an in-app Notification (BOOKING_CONFIRMED) AND sends a
  transactional SMS — both fire-and-forget (failures here are logged but don't fail the booking).
```

---

## F11 — Cancel Token

### `POST /api/patient/queue/cancel-token`
```
Auth: jivnicare_token cookie ONLY — see Blocker 1.
Rate limit: cancelTokenRatelimit, key = cancel_token_{userId}
Request: { "tokenId": string }
Response 200: { "success": true, "data": { "success": true, "message": "Aapka booking cancel kar diya gaya hai." } }
Errors:
  400 - tokenId missing
  401 - not authenticated
  403 - IDOR protection: token belongs to a different patient (logged as a security event)
  404 - token not found
  409 - token not in a cancellable state ("INVALID_STATE" — already called/completed/etc.)
  429 - rate limited
  500 - unhandled
Side effect: inside the SAME transaction that sets status=CANCELLED, the top 2 waitlisted
  entries for that doctor are located and marked notified — confirms Broadcast+Claim mechanics
  from Business-Rules Section 3, triggered synchronously on cancel (not via a background job).
  SMS dispatch to those 2 patients happens AFTER the transaction commits (separate step).
```

---

## F12 — Join Waitlist

### `POST /api/patient/queue/claim-waitlist`
```
Auth: jivnicare_token cookie ONLY — see Blocker 1.
Request: { "doctorId": string }
Response 200 (SUCCESS): { "success": true, "data": { "success": true, "message": "Slot claimed successfully!", "token": <QueueToken> } }
Response 200 (SLOT ALREADY TAKEN — NOT an HTTP error, still 200!):
  { "success": true, "data": { "success": false, "message": "Yeh slot abhi kisi aur ne le liya hai — you are still on the waitlist.", "isTaken": true } }
  ⚠️ IMPORTANT: mobile client must check the inner `data.success`/`data.isTaken` field, not just
  the HTTP status, to detect a lost claim race. An HTTP-status-only client would treat this as a
  success and show the wrong confirmation screen.
Errors (real HTTP errors):
  400 - not on this doctor's waitlist / not yet notified / notification is from a previous
        logical day ("purani ho chuki hai") / Zod validation failure
  401 - not authenticated
  500 - unhandled
Expiry mechanics — found an unresolved inconsistency, flagging rather than guessing:
  This route's own staleness check compares the *calendar/logical day* of the notification to
  today — it does NOT check a literal 15-minute or 30-minute timer at the claim step itself. The
  actual minute-based countdown (30 min per an earlier code comment found in
  queueService.ts's notifyWaitlistForFreedSlot; 15 min per 05-Business-Rules.md Rule W1's new
  "Improved" design) is enforced elsewhere, in the reset-stale-notifications step, not here.
  Before building the S09/S12 "claim within 15 min" countdown UI, verify which number is
  actually enforced end-to-end — right now two different values exist in two different places
  and neither was traced all the way through in this pass.
Also note: 05-Business-Rules.md Rule W1 says "top 3" waitlisted entries are notified. An earlier
  code comment found in queueService.ts says "top 2." Per PRD Decision #3, "top 3 / 15-min" is
  explicitly a **new decision for mobile** ("Improved Broadcast+Claim"), not a claim that the
  code already does this — so this isn't a doc error, it's a backend change that still needs to
  be built (both the notify-side top-3 logic and, per above, a consistent 15-min timer).
```

---

## F10 — My Bookings

### `GET /api/patient/my-bookings`
```
Auth: jivnicare_token cookie ONLY — see Blocker 1.
Request: none (GET, no query params — no pagination, no active/past split server-side)
Response 200 (flat, NOT enveloped):
  { "success": true, "bookings": [ <QueueToken, includes nested queue.doctor + queue.tokens
    (only the currently-BOOKED ones, for position context)> ] }
Errors: 401 unauthenticated, 500 generic (with a separate friendlier message on transient DB errors)
⚠️ No pagination and no limit — returns every token the patient has ever booked, oldest and
  newest together, ordered by bookedAt desc. Mobile-UX-Spec S10's Active/Past tabs are a
  client-side filter over this single unbounded list. Fine for V1 given expected volumes, but
  worth a Known-Gaps.md entry — a long-time user with hundreds of past bookings will pull the
  entire history on every My Bookings screen load.
```

---

## F09 — Token Status Tracking

### `GET /api/patient/bookings/stream`
```
Auth: jivnicare_token cookie ONLY — see Blocker 1.
Transport: Server-Sent Events (SSE) — confirmed this is a streaming GET, not a polling endpoint.
  04-PRD.md F06/F09 already correctly flags "MOBILE CHANGE: SSE → FCM (mandatory, SSE unreliable
  in background)" — this is doubly true now: even setting FCM aside, SSE requires a persistent
  HTTP connection that carries the cookie, which a Bearer-token mobile client can't establish the
  same way. This endpoint needs the Bearer fix (Blocker 1) at minimum, and realistically should
  be replaced by FCM push + a simple polling GET for the mobile client rather than porting SSE.
```

---

## F13 — Lead Capture ("Request a Doctor")

### `POST /api/public/lead`
```
Auth: none (public), but see Blocker 2 — Turnstile required
Rate limit: leadRatelimit, applied separately to IP (lead_ip_{ip}) AND phone (lead_phone_{phone10})
  — both must pass
Request:
  {
    "phone": string (10-15 chars), "name"?: string, "city"?: string,
    "roleInterest"?: "PATIENT"|"DOCTOR"|"ADMIN", "specialty"?: string, "source"?: string,
    "lastStepCompleted"?: string, "turnstileToken"?: string
  }
  ⚠️ Note for PRD F13: fields go beyond "Name, Phone, District, Speciality" as documented —
  roleInterest, source, and lastStepCompleted also exist and aren't mentioned in PRD.
Response 200: { "success": true, "data": { "success": true, "leadId": string } }
Errors:
  400 - Zod validation failure, or missing turnstileToken when required
  429 - rate limited (either IP or phone bucket)
  500 - turnstile service unreachable in production (fails closed), or generic error
Storage confirmed: upserts into DoctorRequest by phone (not a separate LeadCapture table —
  matches the finding already logged in the prior Web-vs-Docs audit), city/roleInterest/source/
  lastStepCompleted are packed into the notes JSON field alongside the pre-existing metadata.
```

---

## F17 — In-App Notifications

### `GET /api/notifications`
```
Auth: jivnicare_token cookie ONLY (AUTH_COOKIE constant) — see Blocker 1.
Query params: limit (default 15)
Response 200 (NOT the standard envelope — uses raw NextResponse.json):
  { "success": true, "notifications": [ <Notification rows, newest first> ] }
Errors: 401 unauthenticated, 500 generic.
```

### `PATCH /api/notifications/mark-read`
```
Auth: jivnicare_token cookie ONLY — see Blocker 1.
Request: { "ids"?: string[] }  — omit or send empty array to mark ALL unread as read
Response 200 (flat): { "success": true }
Errors: 401 unauthenticated, 500 generic
Note: method is PATCH, not POST — make sure the mobile HTTP client is configured for it.
```

### `GET /api/notifications/unread-count`
```
Auth: jivnicare_token cookie ONLY — see Blocker 1.
Request: none
Response 200 (flat): { "success": true, "unreadCount": number }
Errors: 401 unauthenticated, 500 generic
```

---

## F18 — Data Deletion / Deactivation

### `POST /api/patient/delete-data`
```
Auth: jivnicare_token cookie ONLY — see Blocker 1 AND Blocker 3 (no OTP step exists).
Request: none (empty POST body)
Response 200: { "success": true, "message": "Data deletion request recorded. Account deactivated successfully." }
  (raw NextResponse.json, not the apiResponse/apiError envelope)
Errors: 401 unauthenticated, 500 generic.
Confirmed side effects (matches Business-Rules Rule D5/D6 exactly — this part IS accurate):
  1. AuditLog row created (action: UPDATE, newValue: "REQUEST_DATA_DELETION")
  2. User.isActive set to false — no other field touched, no PII removed
  3. Current JWT added to a Redis revocation list for its remaining TTL
  4. Auth cookie deleted server-side in the response
  NOT confirmed: any 30-day-reactivation-window logic — nothing in this route re-activates
  isActive on a later login. If Rule D7 ("can reactivate within 30 days by logging in again") is
  meant to be automatic, I did not find the code that does it — flag as unverified, needs a
  follow-up check of the login path for an isActive-false re-activation branch before the S16
  screen promises this to users.
```

---

## Error Catalog (cross-reference)

Per-endpoint errors are documented inline above (each F-section's "Errors" block). For the
booking flow specifically, `05-Business-Rules.md` Rule B6 names 13 distinct error codes — the
full code → English/Hindi text → recovery-action table lives in
`10-UX-Writing-Guide.md` Section 6, so that the copy and the contract don't drift into two
separate half-versions of the same table. If you're implementing error handling for F08 Book
Appointment, read that table alongside this document's F08 section — this doc tells you *when*
each code fires and what HTTP status it carries; that doc tells you exactly what to say and do
about it in both languages.

---

## Corrections needed in other docs (found during this pass)

| Doc | Section | Says | Should say | Confirmed via |
|---|---|---|---|---|
| `05-Business-Rules.md` | Rule S4 | Access token: 15 minutes | **30 minutes** | `signToken(..., "30m")` in `refresh-token.ts` |
| `04-PRD.md` | Decision #5 | 15-min access + 30-day refresh | **30-min access** + 30-day refresh | same |
| `05-Business-Rules.md` | Rule B3 | Field called `idempotencyKey` | **`requestId`** | Zod schema in `book-appointment/route.ts` |
| `05-Business-Rules.md` | Rule D3 | "OTP verification required before deactivation" | **No OTP step exists in code** — needs a product decision (add it, or drop it from the doc/S16 screen) | `delete-data/route.ts` has no OTP check |
| `04-PRD.md` | F13 fields | "Name, Phone, District, Speciality" | Also **roleInterest, source, lastStepCompleted** | `leadSchema` in `public/lead/route.ts` |
| `05-Business-Rules.md` | Section 12 rate limits | Lists `/api/public/search`, omits `/api/v1/patient/search` | Add the v1 route — it shares the same `publicSearchRatelimit` limiter | confirmed in `v1/patient/search/route.ts` |

---

## F19 — Consent Capture

```
STATUS: NO BACKEND EXISTS. This is not a documentation gap — it's a missing feature.
Checked every route in src/app/api for any reference to the ConsentLog model/table: zero
matches. The model is fully defined in prisma/schema.prisma (userId, consentText,
consentVersion, ipAddress, createdAt) but no endpoint anywhere reads or writes it — not at
signup, not at booking, not anywhere. This is the same pattern as the already-known dead
`deletedAt` field and the unused emergency-approval workflow: schema exists, nothing wired to it.
ACTION REQUIRED before mobile can ship F19: a new endpoint (or an addition to verify-otp /
book-appointment) must be built to actually write ConsentLog rows when the consent checkboxes
described in 04-PRD.md F19 and 09-Component-Library.md's ConsentCheckbox component are checked.
Right now those checkboxes, if built as specified, would have nothing to submit to.
```

---

## Summary — what's fully verified vs. what still needs a look

| Feature | Status |
|---|---|
| F01 Login/OTP/Refresh | ✅ Fully verified, 3 endpoints |
| F02/F03 Search + Filters | ✅ Fully verified |
| F08 Book Appointment | ✅ Fully verified |
| F09 Token Tracking (SSE) | ✅ Auth + transport confirmed; payload shape not itemized (SSE event schema needs a follow-up read of the stream's `send()` calls before building S09's live updates) |
| F10 My Bookings | ✅ Fully verified |
| F11 Cancel Token | ✅ Fully verified |
| F12 Join Waitlist | ✅ Fully verified, with two flagged inconsistencies (expiry window, top-2-vs-3) |
| F13 Lead Capture | ✅ Fully verified |
| F17 In-App Notifications | ✅ Fully verified, 3 endpoints |
| F18 Data Deletion | ✅ Fully verified |
| F19 Consent Capture | ❌ **No backend exists at all — needs to be built, not documented** |
| Doctor/Admin routes | Out of scope — PRD Section 1.1 correctly scopes this app to Patient-only |

*This document is now complete for every F01–F19 feature that has a patient-mobile-relevant
backend. F19 is the one open item, and it's a build task, not a writing task.*
