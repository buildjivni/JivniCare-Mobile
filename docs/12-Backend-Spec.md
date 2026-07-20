# Document 12: Backend-Spec.md
**Version:** V1.0.0 | **Date:** 2026-07-16 | **Status:** LOCKED
**Built from:** Direct inspection of `prisma/schema.prisma`, `src/middleware.ts`,
`src/lib/auth/`, and `src/app/api/v1/patient/search/route.ts` in the live repo — not from prior
draft docs. Where this document references a decision or number, it's citing what the code does
today, cross-referenced against `05-Business-Rules.md` where the two might diverge.

---

## 1. Schema Overview

**21 Prisma models, confirmed via `grep -c "^model " prisma/schema.prisma`** — matches every
prior document's claimed count, no drift found here.

Models directly relevant to the mobile patient app (the rest — Doctor onboarding steps, Admin
tables, clinic operator management — are out of scope for this app per `04-PRD.md` Section 1.1):

| Model | Relevant Fields (mobile-relevant subset) | Notes |
|---|---|---|
| `User` | id, phone, name, email, role, authProvider, isActive, latitude/longitude | `role` distinguishes PATIENT/DOCTOR/ADMIN; mobile app only ever creates/reads PATIENT rows |
| `Doctor` | verificationStatus, canShowOnPublic, isAcceptingBookings, consultationFee, weeklySchedule (JSON, object-keyed per Business-Rules Rule A6), specialty, clinicDistrict, clinicCity, isEmergencyEnabled | Search/profile source; mobile never writes to this model |
| `DailyQueue` | doctorId, date, type (REGULAR/EMERGENCY/WALKIN), totalTokens, dailyLimit, status | One row per doctor per day per queue type |
| `QueueToken` | tokenNumber, status, patientId (nullable — walk-in), requestId (idempotency), notified/notifiedAt (waitlist) | Central booking record |
| `DoctorRequest` | phone, notes (JSON-packed extra fields) | F13 Lead Capture writes here — NOT a separate LeadCapture table |
| `Notification` | userId, type, title, message, read, createdAt | F16/F17 backing store |
| `ConsentLog` | userId, consentText, consentVersion, ipAddress, createdAt | **Defined but unused — zero API routes reference this model. F19 has no backend yet.** |
| `AuditLog` | action, oldValue, newValue, userId, createdAt | Written on deactivation (`REQUEST_DATA_DELETION`), profile changes, admin actions |

---

## 2. Authentication Architecture

### 2.1 Two parallel auth systems currently coexist
```
LEGACY WEB FLOW (cookie-based):
  /api/auth/send-otp, /api/auth/verify-otp
  → createPhoneSessionResponse() → Set-Cookie: jivnicare_token (HttpOnly)
  → No session-limit enforcement for patients (confirmed: this path never calls
    enforceSessionLimit — see Business-Rules.md Rule S1)
  → 7-day JWT, no rotation

NEW MOBILE FLOW (Bearer-token based, /api/v1/):
  /api/v1/auth/send-otp, /api/v1/auth/verify-otp, /api/v1/auth/refresh
  → generateTokens() → returns { accessToken, refreshToken } directly in JSON body (flat,
    not wrapped in the apiResponse envelope — see API-Contract.md)
  → 2-session limit ENFORCED via Redis (FIFO eviction of oldest refresh token) — confirmed live
  → Access token: 30 minutes (corrected from an earlier draft's "15 minutes" —
    signToken(..., "30m") confirmed directly in refresh-token.ts)
  → Refresh token: 30 days, single-use, rotated on every refresh call (old token deleted,
    reuse returns 401)
```

**Mobile app uses ONLY the second system.** The legacy cookie flow is documented here for
context (so nobody accidentally builds against it), not because mobile should call it.

### 2.2 The critical gap: most patient action routes weren't updated for either flow's Bearer support
`src/lib/auth/session.ts` contains a helper (`checkUserStatus` and friends) that DOES support
reading `Authorization: Bearer <token>` as a fallback when the cookie is absent — this is used
by doctor/admin routes already. **Seven patient routes were never wired to use this helper and
only read the cookie:**
```
POST /api/patient/book-appointment
POST /api/patient/queue/cancel-token
POST /api/patient/queue/claim-waitlist
GET  /api/patient/my-bookings
GET  /api/patient/bookings/stream
POST /api/patient/delete-data
GET  /api/notifications (+ /mark-read, /unread-count)
```
This is `14-Feature-Dependencies.md` Phase 0 item P0-1 — the single highest-priority backend fix
for mobile. See `11-API-Contract.md`'s "Mobile Blockers" section for the full detail.

### 2.3 Middleware protection scope
`src/middleware.ts` protects, at the edge (307 redirect before the request even reaches a route
handler):
- `/doctor/*` and `/admin/*` **page** routes (web dashboard UI)
- `/api/admin/*` for non-GET methods only

It does **not** blanket-protect `/api/patient/*` or `/api/doctor/*` API routes — those rely on
per-route auth checks inside each handler (which is where the cookie-only gap above lives).
This confirms `04-PRD.md` Decision #6 as an accurate description of current behavior, not
something that needs fixing on its own — the fix needed is per-route (2.2 above), not a
middleware-level change.

### 2.4 Verification status state machine
```
Enum (confirmed via verifyDoctorSchema Zod definition):
  PENDING_ACTIVATION → PENDING_REVIEW → VERIFIED
                                       ↘ REJECTED (resubmit → PENDING_REVIEW directly, confirmed
                                                    via code — doctor does NOT repeat onboarding
                                                    steps 1-4)
  Any state → SUSPENDED (admin action)
  SUSPENDED → any state, including back to VERIFIED (confirmed: NOT hard-terminal — the same
              single admin endpoint accepts any of the 5 enum values as a target with no
              additional confirmation step; document this in admin UI copy so a "ban" doesn't
              read as permanent when it isn't)
Public search filter (always applied, non-negotiable): verificationStatus = VERIFIED
  AND canShowOnPublic = true
```
**"APPROVED" is not a valid value anywhere in this enum** — if you see it in an older document,
that document is deprecated (see `02-Source-of-Truth.md` Section 2).

---

## 3. Search Architecture

`GET/POST /api/v1/patient/search` (confirmed dual-method, same handler):

```
1. HARD FILTER (always applied, not user-configurable):
   verificationStatus = VERIFIED AND canShowOnPublic = true

2. SAFETY CAP: fetch max 100 matching doctors from Postgres before scoring — a very broad
   query (e.g. empty search + no filters) will never surface a doctor ranked beyond the 100th
   raw DB match, regardless of how well they'd score. Not documented in any prior draft;
   confirmed by direct code read. Acceptable for V1's expected doctor volume (PRD Section 2.3:
   10 doctors in 3 months), but worth a Known-Gaps.md entry for when doctor count scales past
   the low hundreds.

3. OPTIONAL FILTERS (applied after the hard filter, before or after scoring depending on type):
   - district: matches clinicDistrict OR clinicCity, case-insensitive
   - speciality: OR match against a provided list, case-insensitive
   - availability: "today" checks isAvailableToday/isQueueActive flags; "tomorrow" recomputes
     the clinic's day-status specifically for tomorrow's date (not just a cached flag)
   - maxFee / minExperience: simple numeric threshold filters, applied AFTER the in-memory
     scoring pass

4. RESPONSE: flat JSON (NOT wrapped in the standard apiResponse envelope) —
   { results, total, isFuzzy, didYouMean, emptyMessage, page, limit, hasMore }
   Default page size: 15 (confirmed — matches the locked Decision #17)

5. RATE LIMIT: publicSearchRatelimit, key = search:{ip}, 20 requests/minute — shared between
   this v1 route and the legacy /api/public/search (both use the same limiter instance)
```

**Search-rating-boost claim (PRD Decision #29) is UNVERIFIED** — no rating field was found
referenced in the scoring logic during this pass. Do not treat "keep + document" as confirmed
until someone reads the full scoring function line-by-line. Flagged in `15-Known-Gaps.md`.

---

## 4. Queue & Booking Data Flow

### 4.1 Atomic booking (F08)
```
1. SELECT DailyQueue WHERE doctorId + date + type FOR UPDATE  (row lock)
2. Validate against 13 named business conditions (Business-Rules.md Rule B6) — any failure
   aborts the transaction and returns the specific named error code
3. Check Redis idempotency key: idempotency:booking:{userId}:{requestId} via SET NX, 24h TTL
   — if present, return 409 without creating a new token
4. Increment DailyQueue.totalTokens
5. Create QueueToken with tokenNumber = totalTokens
6. COMMIT
7. (Outside the transaction, fire-and-forget, failures logged not thrown):
   - Create Notification row (BOOKING_CONFIRMED)
   - Send transactional SMS
On any throw before commit: the Redis idempotency key is deleted, so a genuine failure can
  be safely retried with the same requestId without permanently blocking that request.
```

### 4.2 Cancellation + waitlist trigger (F11 → F12)
```
1. Verify token belongs to the requesting patient (403 + security-event log if not — IDOR
   protection, confirmed present, do not remove in any refactor)
2. Verify token is in a cancellable state (Business-Rules.md Rule C1) — 409 if not
3. Inside the SAME transaction:
   a. Set QueueToken.status = CANCELLED
   b. Query the top N waitlisted entries for this doctor (N=2 confirmed in code today;
      N=3 is the locked target — see Feature-Dependencies.md P0-5)
   c. Mark those entries notified=true, notifiedAt=now()
4. COMMIT
5. (After commit) Send SMS to the notified waitlist entries
```

### 4.3 Waitlist claim (F12)
```
1. Verify the requesting patient has a notified=true waitlist entry for this doctor
2. Verify the notification is from the same calendar/logical day (NOT a literal minute-based
   check at this step — see the note in API-Contract.md F12 about the 15-min vs 30-min
   inconsistency)
3. Row-lock the DailyQueue, check the slot is still open
4. If open: create QueueToken (BOOKED), delete the waitlist entry → 200, data.success=true
5. If already taken: reset this entry to notified=false → 200 (NOT an error status),
   data.success=false, data.isTaken=true — client MUST check this inner field
```

---

## 5. Rate Limiting Infrastructure

All rate limits use Redis-backed sliding-window counters (implementation not traced key-by-key
in this pass beyond confirming Upstash Redis as the backing store per `03-testing-guidelines.md`'s
mock-configuration notes). See `05-Business-Rules.md` Section 12 for the authoritative
endpoint → limit → window table — do not duplicate that table here, reference it.

---

## 6. Holiday Override & Admin Invite (documented per PRD Decision #25/#26)

Both confirmed to exist in the schema/migrations but **not traced in detail during this pass** —
neither is mobile-patient-app-relevant (holiday override affects doctor schedule computation,
which the mobile app only reads the *result* of via search/profile; admin invite is an
admin-onboarding-only concern). Flagged in `15-Known-Gaps.md` as "exists, not fully documented,
not blocking mobile V1."

---

## 7. What This Document Deliberately Does NOT Cover

- Doctor-side and Admin-side route logic beyond what's needed to understand data the mobile app
  reads (e.g. how a doctor's queue-management actions work is out of scope — the mobile patient
  app only ever reads the resulting QueueToken.status, never calls those routes)
- Payment gateway integration — there isn't one; see `05-Business-Rules.md` Section 7
- The `hospitals/` page/section and `/d/[shortCode]` short-link route — both exist in the
  codebase, purpose undocumented anywhere, flagged in `15-Known-Gaps.md` for founder review
  rather than guessed at here

---

*Backend Spec Locked: 2026-07-16 | Cross-reference `11-API-Contract.md` for endpoint-level
detail and `05-Business-Rules.md` for business-logic detail — this document is the "how the
system is architected" layer between those two.*
