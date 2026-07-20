# Document 05: Business-Rules.md
**Version:** V1.2.1 | **Date:** 2026-07-19 | **Status:** LOCKED
**Authority:** Tier 2 — Implementation decisions below PRD
**Supersedes:** V1.2.0 — Section 16 gains a cross-reference note (premium-redesign pass,
Founder directive, 2026-07-19) pointing at the new DoctorCard CTA Button UI treatment; no rule
numbers, thresholds, or logic in this section changed — this is a doc-linkage-only addition per
`13-AI-Development-Rules.md` Rule 4. V1.1.0 added Section 16 "Doctor Availability & Booking
Automation" (Founder directive, 2026-07-19). V1.1.0 superseded V1.0.0 — Rules S4, B3, D3, W1, and
Section 12 updated per `02-Source-of-Truth.md` Corrections Log.

---

## 1. BOOKING RULES

### 1.1 Core Booking Constraints
```
RULE B1: Max 3 active tokens per patient per day
  - Active = status IN (BOOKED, AWAITING_ARRIVAL, PAYMENT_PENDING, READY, CALLED, IN_CONSULTATION)
  - Checked at booking time via application-level query
  - NOT enforced at DB level (no unique constraint)
  
RULE B2: Atomic booking with Prisma $transaction
  - Step 1: SELECT daily_queues WHERE doctorId + date + type FOR UPDATE
  - Step 2: Check totalTokens < dailyLimit
  - Step 3: Increment totalTokens
  - Step 4: Create QueueToken with tokenNumber = totalTokens
  - All steps in ONE transaction — concurrent requests safe

RULE B3: Idempotency via UUID `requestId`
  - ⚠️ CORRECTED 2026-07-16: this field is named `requestId` in the actual Zod schema and
    request body — NOT `idempotencyKey`. Do not use the old name; the server will silently
    ignore an `idempotencyKey` field (Zod drops unknown keys), and the booking will proceed
    WITHOUT idempotency protection with no error raised. This was the single highest-risk
    naming mismatch found in the whole documentation set — double-check any client code
    written against the V1.0.0 draft of this rule.
  - Client generates a UUID when the booking page renders
  - Server checks Redis `idempotency:booking:{userId}:{requestId}` via SET NX, 24h TTL
  - If key already exists → 409, no new booking created
  - Key is deleted (rolled back) if the booking attempt throws, so a genuine failure can be
    safely retried with the same requestId
  - Side effects (SMS, notification, audit) SKIPPED on duplicate

RULE B4: Duplicate booking prevention
  - Application-level check: same patient + same doctor + same day + active status
  - Returns: "You already have a booking with Dr. [Name]" (specific error code ALREADY_BOOKED)
  - Race condition possible on double-click (mitigated by Rule B3's idempotency, not by this
    check alone — the two mechanisms are complementary, not redundant)

RULE B5: Walk-in auto-linking
  - When walk-in created: SELECT id FROM users WHERE phone = ? AND role = PATIENT
  - If match found → QueueToken.patientId auto-linked
  - If no match → patientId remains null (anonymous)
  - Zero UI change for doctor/receptionist

RULE B6: Booking blocked when — confirmed 13 named error codes exist in the actual route
  (do not collapse these into a single generic message; each maps to a distinct user-facing
  string per `10-UX-Writing-Guide.md`):
  DOCTOR_NOT_VERIFIED, DOCTOR_NOT_ACCEPTING, ALREADY_BOOKED, QUEUE_FULL, DAILY_LIMIT_REACHED,
  CLINIC_CLOSED_TODAY, CLINIC_CLOSED_ON_THIS_DAY, BOOKING_NOT_STARTED, BOOKING_FINISHED,
  QUEUE_PAUSED, EMERGENCY_FULL, EMERGENCY_ONLY_ACTIVE, WAITLIST_RESERVED
```

### 1.2 Token Number Assignment
```
RULE B7: Regular tokens: sequential integers 1, 2, 3...
RULE B8: Emergency tokens: 9001, 9002, 9003... (database — confirmed via EMERGENCY_TOKEN_BASE)
  - Display format: JVC-E-1, JVC-E-2, JVC-E-3...
  - Separate DailyQueue with type = EMERGENCY
RULE B9: Walk-in tokens: same sequence as regular, type = WALKIN
RULE B10: Token number NEVER updates after creation
```

---

## 2. QUEUE RULES

### 2.1 Queue State Machine (ONE-WAY ONLY)
```
BOOKED → AWAITING_ARRIVAL → PAYMENT_PENDING → READY → CALLED → IN_CONSULTATION → COMPLETED
                                                       ↓              ↓
                                                    NO_SHOW        NO_SHOW

CANCELLABLE: BOOKED, AWAITING_ARRIVAL, PAYMENT_PENDING, READY
AUTO-EXPIRE: BOOKED, AWAITING_ARRIVAL (04:00 AM IST cron)
TERMINAL: COMPLETED, NO_SHOW, CANCELLED, EXPIRED
RULE: No reverse transitions. Ever. No exceptions.
```

### 2.2 Doctor Queue Actions
```
RULE Q1: Call Next
  - Current CALLED token → IN_CONSULTATION
  - Previous IN_CONSULTATION → auto COMPLETED (bidirectional advance)
  - Next READY token → CALLED

RULE Q2: Mark Complete
  - Current IN_CONSULTATION → COMPLETED
  - Next READY token → auto CALLED (bidirectional advance)

RULE Q3: Mark No-Show
  - Current CALLED → NO_SHOW
  - NO_SHOW is terminal — no reactivation
  - Late patient = new walk-in token (auto-linked if registered)

RULE Q4: Undo Next
  - Reverts last queue transition
  - Only available to doctor/receptionist
  - Audit logged

RULE Q5: Add Walk-in
  - Fields: name, phone, address
  - Queue: Regular or Emergency
  - Token created with type = WALKIN
```

### 2.3 Queue Cache
```
RULE Q6: Redis key: queue:{queueId}, TTL: 30 seconds
RULE Q7: Invalidate immediately on ANY state change
RULE Q8: Miss → fresh DB fetch → store in Redis
RULE Q9: Queue cache does NOT replace real-time FCM updates
```

---

## 3. WAITLIST RULES

### 3.1 Improved Broadcast+Claim — LOCKED TARGET DESIGN FOR V1 MOBILE
```
⚠️ IMPORTANT (clarified 2026-07-16): the rules below describe what V1 mobile is required to
ship. They are NOT a description of what the current code does. The current code (as of this
writing) notifies the top **2** waitlisted entries with a stale-notification reset around
**~30 minutes**, and the claim endpoint itself (`claim-waitlist/route.ts`) only checks that a
notification is from the same *calendar/logical day* — it does not enforce a literal minute
countdown at the claim step. Building the mobile "claim within 15 min" countdown UI against
these numbers requires the backend to actually implement them first — tracked as
`14-Feature-Dependencies.md` Phase 0, item P0-5. Do not build the UI countdown before the
backend enforces the same number end-to-end, or the UI will show a promise the server doesn't
keep.

RULE W1: When slot opens (cancellation, status change, limit increase):
  1. Reset stale notifications (expired 15-min window — target; currently ~30-min in code)
  2. Lock top 3 waitlisted entries (FIFO by createdAt) — target; currently top 2 in code
  3. Mark as notified: true, set notifiedAt
  4. Send FCM push to all (3, once built): "Slot available! Tap to claim within 15 min"

RULE W2: Claim resolution:
  - First patient to tap → atomically check slot still free (row-locked transaction, confirmed
    in code via `SELECT ... FOR UPDATE` on the daily queue row)
  - If free → create QueueToken (BOOKED), delete waitlist entry
  - If taken → returns HTTP 200 (NOT an error status) with `{success:true, data:{success:false,
    isTaken:true, message:"..."}}` — reset that patient to notified:false. Mobile client MUST
    check the inner `data.isTaken` field, not just the HTTP status code, to detect a lost race.

RULE W3: Slower claimants:
  - Reset to notified: false, notifiedAt: null
  - Eligible for future slot openings
  - No penalty, no queue position loss

RULE W4: Same-speciality suggestion:
  - BEFORE showing waitlist option, check other doctors with same speciality
  - If available → show suggestion card: "Dr. [Name] — [X] slots available"
  - [Book with Dr. Name] [Stay on Waitlist]
```

---

## 4. CANCELLATION RULES

```
RULE C1: Patient can cancel: BOOKED, AWAITING_ARRIVAL, PAYMENT_PENDING, READY
RULE C2: Cannot cancel: CALLED, IN_CONSULTATION, COMPLETED, NO_SHOW, EXPIRED, CANCELLED
RULE C3: Cancellation flow:
  - Confirmation dialog required
  - Token status → CANCELLED
  - IDOR protection: cancelling someone else's token returns 403 and is logged as a security
    event (confirmed in code — this matters, don't remove it in a "cleanup")
  - In-app notification: "Booking cancelled successfully"
  - Redirect to My Bookings
RULE C4: NO refund processing (pay at clinic, JivniCare never touches money)
RULE C5: Cancelled slot → triggers waitlist notification (Rule W1) — confirmed this happens
  SYNCHRONOUSLY inside the same DB transaction as the cancellation, not via a background job;
  SMS dispatch to the notified waitlist entries happens after the transaction commits
```

---

## 5. VERIFICATION RULES

```
RULE V1: Default status: PENDING_ACTIVATION
RULE V2: Step 4 complete: PENDING_REVIEW
RULE V3: Admin approve: VERIFIED + canShowOnPublic = true
RULE V4: Admin reject: REJECTED + reason + doctor can resubmit
  - Confirmed via code: resubmission goes DIRECTLY to PENDING_REVIEW, not back through
    PENDING_ACTIVATION — the doctor does not repeat onboarding steps 1-4.
RULE V5: Admin ban: SUSPENDED + hide profile + disable login
  - Confirmed via code: SUSPENDED is NOT a hard-terminal state at the database/validation
    level — the same `verify-doctor` endpoint accepts any of the 5 enum values as a target,
    so an admin CAN manually move a SUSPENDED doctor back to VERIFIED at their discretion.
    There is no separate "reinstate" endpoint or extra confirmation step — it's the same
    single-call action as any other status change. Document this clearly for admin-dashboard
    UI copy (a "ban" is administratively reversible, and the UI should not imply otherwise).
RULE V6: 48hr activation expiry for admin-onboarded doctors
  - Note: admin-onboarded doctor creation is not a built feature (see PRD Out of Scope) — this
    rule applies to the future V2 admin-onboarding flow, not anything live today.
RULE V7: Public search filters: verificationStatus = VERIFIED AND canShowOnPublic = true
RULE V8: VerificationStatus enum (confirmed via Zod schema in `verifyDoctorSchema`):
  PENDING_ACTIVATION / PENDING_REVIEW / VERIFIED / REJECTED / SUSPENDED
  - NEVER use "APPROVED" — this value does not exist in the enum
```

---

## 6. EMERGENCY RULES

```
RULE E1: Emergency tokens: JVC-E-1, JVC-E-2... display; 9001, 9002... database
RULE E2: Separate DailyQueue with type = EMERGENCY
RULE E3: Direct toggle by doctor (no approval queue in V1)
  - Confirmed via code: POST /api/admin/toggle-emergency sets isEmergencyEnabled/
    offersEmergency immediately in a single transaction — no read of a pending-request field,
    no approval workflow. Any document (including older web-platform docs) that describes an
    approval-queue workflow for this is deprecated — see Source-of-Truth.md Section 2.
RULE E4: Emergency capacity set by doctor (default: 0)
RULE E5: Emergency queue: separate tab in doctor dashboard
RULE E6: Emergency fee: optional, displayed on profile if set
```

---

## 7. PAYMENT RULES

### 7.1 V1: Display-Only System
```
RULE P1: NO payment gateway integration (Razorpay, Stripe, PhonePe, UPI — NONE)
RULE P2: NO online money collection
RULE P3: NO subscription billing or auto-deduction
RULE P4: NO invoice generation
RULE P5: Patient pays doctor directly at clinic
```

### 7.2 Patient-Side Display
```
RULE P6: Consultation Fee: ₹[doctor.consultationFee] — always shown
RULE P7: Platform Convenience Fee: ~~₹29~~ FREE (strikethrough + green)
RULE P8: Total Payable: ₹[consultationFee] only
RULE P9: Savings message: "You're saving ₹29 — Early Access Benefit"
RULE P10: Payment method label: "💊 Pay at Clinic / Hospital"
```

### 7.3 Doctor-Side Display (CORRECTED per `JivniCare-V1-Master-Plan.md`)
```
RULE P11: REMOVE per-booking "savings" concept from doctor-facing surfaces
RULE P12: Doctor dashboard shows: Actual clinic revenue (patients × consultationFee)
RULE P13: Billing page ONLY shows:
  - Current Plan: Early Partner / Standard
  - Monthly Fee: ₹0 (Standard: ~~₹2,999~~ struck through)
  - Status: Active until [date]
RULE P14: Early Partner Program:
  - First 20 verified doctors
  - 100% discount on all fees
  - Gold "⭐ Early Partner" badge
  - Free until 31 December 2026
```

---

## 8. SESSION RULES

```
RULE S1: Web patient login (legacy /api/auth/verify-otp): Unlimited concurrent sessions
  - Confirmed via direct code trace: this route calls createPhoneSessionResponse(), which
    never calls the session-limit enforcement function. This is a real, current gap in the
    WEB flow specifically — not something to "fix" as part of mobile documentation, just
    documented accurately here so nobody assumes web behaves like mobile.

RULE S2: Mobile patient login (/api/v1/auth/verify-otp): 2 concurrent sessions, ENFORCED
  - Confirmed via code: generateTokens() in refresh-token.ts enforces this via Redis with
    FIFO eviction of the oldest refresh token when a 3rd login occurs. This is genuinely live
    and working — no backend work needed here, unlike most other "locked decision" rows.

RULE S3: Doctor: Max 3 concurrent sessions
  - Enforced via enforceSessionLimit(), confirmed in the TOTP-verify and session-callback
    routes (web dashboard login paths)

RULE S4: Admin: Max 1 concurrent session
  - Previous session invalidated on new login

RULE S5: RTR for mobile — CORRECTED 2026-07-16:
  - Access token: **30 minutes** (was documented as 15 minutes in V1.0.0 — corrected after
    reading `signToken(..., "30m")` directly in `refresh-token.ts`)
  - Refresh token: 30 days
  - Rotation: confirmed working — every successful refresh call revokes the old refresh token
    and issues a brand-new access+refresh pair; reusing an already-rotated refresh token
    returns 401
  - Storage: iOS Keychain / Android Keystore (never AsyncStorage)

RULE S6: Web session: 7-day JWT (no change, applies to the legacy cookie-based flow only)
```

---

## 9. AVAILABILITY RULES

### 9.1 Doctor Status States
```
RULE A1: AVAILABLE — Auto-trigger at clinicStartTime, accepts bookings, 🟢 LIVE badge
RULE A2: ON_BREAK — Manual toggle, preserves queue order, no auto-cancel, isAcceptingBookings=false
RULE A3: OFFLINE — Manual toggle or 04:00 AM IST cron, proactive notification to booked
  patients, no auto-cancel, isAcceptingBookings=false
RULE A4: BUSY (auto-computed) — NOT manually selectable, computed: totalTokens >= dailyLimit
RULE A5: End-of-day reset — 04:00 AM IST cron: All doctors → OFFLINE
```

### 9.2 Weekly Schedule
```
RULE A6: Format: Object {MON: {isOpen, start, end, maxPatients}} — NOT array format
RULE A7: isOpen default behavior: Missing/undefined isOpen → CLOSED (canonical truth). Only
  explicit isOpen: true → OPEN. Single helper function: isDayOpen(daySchedule): boolean
RULE A8: Slot count: maxPatients sets dailyLimit for that day, default fallback 30, slot count
  = max(0, maxPatients - totalTokens)
RULE A9: Queue creation: getOrCreateDailyQueue() MUST check isDayOpen() before creating ACTIVE
  queue — never create ACTIVE queue for a closed day
```

---

## 10. NOTIFICATION RULES

### 10.1 FCM Push Categories
```
RULE N1: BOOKING_CONFIRMED — Trigger: Token created — "Token #[X] with Dr. [Name]. Visit [Clinic] today."
RULE N2: TOKEN_CALLED — Trigger: Doctor calls next — "Token #[X] — [Y] ahead. Please be ready."
RULE N3: QUEUE_UPDATE — Trigger: Position changes by >2 — "[X] patients ahead of you now."
RULE N4: DOCTOR_STATUS_CHANGE — Trigger: Doctor toggles status
RULE N5: WAITLIST_CLAIM — Trigger: Slot opens + patient in top group — "Tap to claim within 15 min"
RULE N6: SYSTEM — Trigger: Platform announcements
```

### 10.2 In-App Notifications
```
RULE N7: All push notifications also create an in-app notification (Notification table)
RULE N8: Unread count badge on bell icon — GET /api/notifications/unread-count, confirmed live
RULE N9: Mark read — PATCH /api/notifications/mark-read (confirmed PATCH, not POST), accepts
  an optional ids[] array or marks ALL unread as read if omitted
RULE N10: "Auto-delete after 30 days" — NOT confirmed as a server-side cron in this pass;
  treat as a client-side display filter until a background job is found/built. Flag in
  Known-Gaps.md until verified.
RULE N11: Swipe to dismiss (client-side UI behavior)
```

---

## 11. DATA DELETION RULES

```
RULE D1: Feature name: "Deactivate Account" (NOT "Delete Data")
RULE D2: Hidden in Settings → Account (not prominent)
RULE D3: OTP verification required before deactivation
  - ⚠️ STATUS CLARIFIED 2026-07-16: this is a LOCKED PRODUCT DECISION, confirmed by founder.
    The current code (`delete-data/route.ts`) has NO OTP step — it deactivates immediately on
    a single authenticated POST. This rule describes what must be BUILT, not what exists.
    Tracked as `14-Feature-Dependencies.md` Phase 0, item P0-3. Do not remove this rule or
    simplify the S16 screen to drop the OTP step — build the backend to match instead.
RULE D4: Effects (confirmed accurate for what the code does today):
  - isActive = false
  - All sessions invalidated
  - JWT added to Redis revocation list for its remaining TTL
  - Auth cookie deleted server-side
  - Audit log: action = REQUEST_DATA_DELETION
RULE D5: NO actual PII deletion in V1 (DPDP Act gap)
  - phone, email, name, location remain in database
  - deletedAt field exists but never written
RULE D6: 30-day retention window before permanent deactivation (retention/purge job not
  independently confirmed in this pass — flag in Known-Gaps.md)
RULE D7: Can reactivate within 30 days by logging in again
  - ⚠️ NOT CONFIRMED: the login path was not found to contain isActive-reactivation logic
    during the API-Contract verification pass. Tracked as Feature-Dependencies.md Phase 0,
    item P0-6 — verify or build before the S16 screen promises this to users.
```

---

## 12. RATE LIMIT RULES

| Endpoint | Limit | Window | Limiter Key |
|----------|-------|--------|-------------|
| /api/v1/auth/send-otp | 5 | 15 min | otpRatelimit (key: otp_send_{phone}) |
| /api/v1/auth/verify-otp | 5 | 15 min | otpRatelimit (key: otp_verify_{phone}) |
| /api/v1/auth/refresh | 20 | 1 hour | refreshRatelimit (key: refresh_token_{token}) |
| /api/v1/patient/search | 20 | 1 min | publicSearchRatelimit — **added 2026-07-16**, shares the limiter with `/api/public/search`, was missing from this table in V1.0.0 |
| /api/public/search | 20 | 1 min | publicSearchRatelimit (key: search:{ip}) |
| /api/patient/book-appointment | 10 | 1 min | bookingRatelimit (key: book_appt_{userId}) |
| /api/public/lead | 5 | 15 min | leadRatelimit — applied to BOTH ip and phone independently, both must pass |
| /api/patient/queue/cancel-token | 10 | 1 hour | cancelTokenRatelimit (key: cancel_token_{userId}) |
| /api/admin/* mutations | 15 | 1 min | adminMutationRatelimit |

---

## 13. OFFLINE BEHAVIOR RULES

```
RULE O1: READ operations (queue status, search, doctor profile):
  - Cache last-known state locally, show "Reconnecting..." banner when stale (>5 min)
  - Cache duration: 7 days
RULE O2: WRITE operations (book, cancel, profile update):
  - NO auto-retry, optimistic UI update, explicit [Retry] button on failure
  - Reason: auto-retry risks duplicate actions against shared DB (Rule B3's idempotency
    protects against network-drop duplicates specifically — it does NOT make blind auto-retry
    safe for every failure mode, e.g. a request that reached the server and partially
    succeeded before a response was lost)
RULE O3: Network detection: monitor connectivity, show offline banner, queue writes until
  reconnected (queued writes still require explicit user confirmation to send, per O2)
RULE O4: Cache invalidation: pull-to-refresh always fetches fresh, background refresh every 30s
  when app active, clear cache on logout
```

---

## 14. SECURITY RULES

```
RULE SEC1: NEVER store JWT in AsyncStorage, localStorage, or Zustand
RULE SEC2: Access token: iOS Keychain / Android Keystore
RULE SEC3: Refresh token: iOS Keychain / Android Keystore (separate from access)
RULE SEC4: Turnstile bypass for mobile → needed for BOTH auth AND lead capture (F13) — the
  latter was not previously documented as needing this; confirmed 2026-07-16
RULE SEC5: Native Google Sign-In → /api/v1/auth/google-mobile endpoint (not yet built —
  doctor/admin only in current scope, not blocking patient-app V1)
RULE SEC6: Certificate pinning for API calls (V1.1)
RULE SEC7: Screenshot blocking on OTP screen (optional)
RULE SEC8: Auto-lock app after 5 min inactivity (V1.1)
```

---

## 15. ACCESSIBILITY RULES

```
RULE ACC1: Minimum touch target: 44×44px (Apple HIG + Android Material)
RULE ACC2: Color contrast: WCAG AA 4.5:1 minimum for text
  - Primary text on white: #2B6CB0 (5.2:1)
  - Secondary text on white: #2F855A (5.1:1)
RULE ACC3: Screen reader labels on all interactive elements
RULE ACC4: Focus order: Logical top-to-bottom, left-to-right
RULE ACC5: Error messages: Visual + audio (screen reader) + haptic
RULE ACC6: Language: All strings in both Hindi and English
RULE ACC7: Font size: Respect system font size settings
```

---

## 16. DOCTOR AVAILABILITY & BOOKING AUTOMATION

> ⚠️ NEW SECTION (2026-07-19, Founder directive) — defines a "train-ticketing" style booking
> automation model: booking can open well before the physical clinic (OPD) opens. This section
> is DISTINCT from, and NOT YET RECONCILED WITH, the existing Section 9 (AVAILABILITY RULES)
> status model (`AVAILABLE`/`ON_BREAK`/`OFFLINE`/`BUSY`, `clinicStartTime`, the 04:00 AM IST cron
> reset). Per `13-AI-Development-Rules.md` Rule 5 ("Always Follow Source-of-Truth — and Say So
> When You Can't"), this overlap is being flagged here and in `15-Known-Gaps.md` Section 2.3
> rather than silently merged or silently allowed to contradict Section 9. Until a founder
> decision unifies the two models, treat this section as the locked spec for the DoctorCard
> live/closed UI and booking-automation schedule; treat Section 9 as the existing queue
> status-toggle model. Do not delete or "fix" Section 9 to match this section, or vice versa.

### 16.1 Core Fields (LOCKED TARGET — new fields, not yet confirmed in the live schema/API)
```
RULE DA1: Separation of Times — every doctor profile has THREE independent time-of-day fields:
  - `bookingStartTime` — when online token booking opens for the day (e.g. 07:00 AM)
  - `opdStartTime`     — when the doctor's physical OPD/clinic actually opens (e.g. 10:00 AM)
  - `closingTime`      — when BOTH booking and the OPD close for the day
  These are intentionally decoupled: `bookingStartTime` is typically EARLIER than
  `opdStartTime` — the "train ticketing" model (you can book a 10 AM train's ticket at 7 AM).
  Do not conflate this with Section 9 Rule A1's single `clinicStartTime` field — that field is
  the EXISTING status-toggle trigger for the AVAILABLE/OFFLINE queue-status model; these three
  fields are the NEW automation-schedule fields for the isLive/isClosed model below. Reconciling
  the two field sets is an open item — see `15-Known-Gaps.md` Section 2.3. This rule does not
  specify a backend schema location (new Doctor model columns vs. a separate table) — that is an
  implementation decision for backend engineering, not specified by this doc.
```

### 16.2 Automated Live Status
```
RULE DA2: Automated `isLive` toggle
  - At `bookingStartTime` → the profile automatically sets `isLive = true` (starts accepting
    bookings).
  - At `closingTime` → the profile automatically sets `isLive = false` (stops accepting
    bookings).
  - Between `bookingStartTime` and `opdStartTime`, `isLive` is TRUE even though the physical OPD
    is not yet open — this is the intended "book ahead" window. The UI MUST show
    `bookingStartTime` and `opdStartTime` as two separate, explicit strings (see
    `07-Mobile-UX-Spec.md`'s DoctorCard Component Spec) so a patient is never misled into
    thinking the doctor is physically available the moment booking opens.
  - The mechanism (cron job vs. compute-on-read) is NOT specified by this rule — flagged as an
    implementation detail for backend engineering, not a product decision this document makes.

  UI note (added 2026-07-19, premium-redesign pass, doc-linkage only — no rule text/threshold
  changed): the mobile `DoctorCard` renders this `isLive`/`isClosed` state via a dedicated CTA
  Button ("Book Appointment" / disabled "Currently Closed") in addition to the container-level
  grayscale treatment — see `07-Mobile-UX-Spec.md`'s "CTA BUTTON ROW" subsection and
  `09-Component-Library.md` Section 2.1 for the UI contract. This rule's actual booking-eligibility
  logic is unchanged; the button is a presentational reflection of `isClosed`, not a new rule.
```

### 16.3 Manual Override
```
RULE DA3: Manual override, same-day only
  - A doctor can manually toggle their own profile OFFLINE at any time (e.g. sick day, early
    closure), regardless of what the automated schedule (Rule DA2) currently says.
  - While a manual override is active, the automated schedule is SUSPENDED for the REST OF THAT
    CALENDAR DAY ONLY — automation must NOT fight the manual toggle back to `isLive = true`
    before midnight.
  - A doctor CAN manually toggle back ON before `closingTime` if they change their mind — doing
    so re-enables automation for the remainder of the day (the override is undone); manually
    going offline does NOT lock the doctor into manual mode until midnight.
  - Whether "manual override" is implemented as a separate boolean flag (e.g.
    `manualOverrideActive`) or as a direct overwrite of `isLive` with a "last-write-wins vs.
    cron" precedence rule is NOT specified here — flagged as an implementation decision for
    backend engineering, see `15-Known-Gaps.md` Section 2.3.
```

### 16.4 Midnight Reset
```
RULE DA4: Midnight reset (00:00 local clinic time)
  - At 12:00 AM, ANY manual override from the previous day is cleared.
  - The system reverts fully to the automated schedule (Rule DA2) for the new day — a doctor who
    manually went offline yesterday is NOT offline today by default; today's `isLive` is
    computed fresh from today's `bookingStartTime` / `closingTime`.
  - This is a DIFFERENT reset from Section 9 Rule A5's existing "04:00 AM IST cron: All doctors
    → OFFLINE" queue-status reset. Rule A5 resets the QUEUE-STATUS model (`AVAILABLE` etc.);
    Rule DA4 resets the MANUAL-OVERRIDE flag in this new automation model. Until the two models
    are reconciled (see 16 intro note above), both resets would need to exist side-by-side — do
    not delete or repurpose Rule A5 to "make room" for DA4.
```

---

*Rules Locked: 2026-07-15 | Corrected: 2026-07-16 | Section 16 added: 2026-07-19 | Changes
require PRD update + founder approval*
