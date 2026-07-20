# Document 04: PRD.md (Product Requirements Document)
**Version:** V1.1.0 | **Date:** 2026-07-16 | **Status:** LOCKED
**Supersedes:** V1.0.0 (2026-07-15) — Decisions #4, #5, #8, #29 updated per
`02-Source-of-Truth.md` Section 3 Corrections Log. **Scope:** Patient App Only (V1.0)

---

## 1. SCOPE LOCK — V1.0

### 1.1 What's IN ✅
- Patient-facing React Native app (Expo)
- Full parity with web Patient features F01-F19
- Hindi + English language support (first-time mandatory selection)
- Push notifications via FCM
- Offline read-cache (7 days)
- Deep linking (Universal Links + `jivnicare://` fallback)

### 1.2 What's OUT ❌
- Doctor mobile app (V1.1)
- Admin mobile app (never planned)
- Biometric login (V1.1)
- Bhojpuri/Maithili languages (V1.1)
- In-app payment gateway
- Video consultation
- Medicine delivery
- Lab test booking
- Insurance integration
- AI symptom checker
- Patient health records
- Admin-initiated doctor onboarding (never built on web; stays out for mobile too — see
  `02-Source-of-Truth.md` Section 2, `06-web-flow.md` Flow A3 is deprecated)

### 1.3 Scope Lock Rationale
Solo founder + AI-driven development = minimize moving parts. Patient app is the most tested web
flow. Doctor app doubles blast radius. Build patient app first, validate, then expand.

---

## 2. PRODUCT OVERVIEW

### 2.1 Vision
Queue-first, same-day doctor booking for Tier-2/3 cities. Every patient gets a token from home.
Every doctor gets a digital queue.

### 2.2 Target Market
- **Geography:** All 37 Bihar districts + Deoghar (Jharkhand) are technically supported by the
  live `BIHAR_DISTRICTS` constant — this is pan-Bihar-ready architecture, not a 2-district
  limit. **Go-to-market focus** for Phase 1 (Months 1-3) remains Jamui + Deoghar specifically,
  per `03-Product-Vision.md` Section 6.1 — a doctor from any other district can still register
  and appear in search; the platform does not block them.
- **Patients:** Age no restriction, Hindi primary, Android mid-range (₹8K-15K), low-medium bandwidth
- **Doctors:** Local clinic doctors, tech comfort low-medium

### 2.3 Success Metrics
- 10 verified doctors in 3 months
- 500 registered patients in 3 months
- Zero critical bugs in first 30 days

---

## 3. THE 30 LOCKED DECISIONS

| # | Decision | Doc Claim (original) | Actual Code (as of 2026-07-16) | Final Decision |
|---|----------|-----------|-------------|----------------|
| 1 | District Scope | 2 districts | 37 Bihar districts + Deoghar | **Dynamic location-based, pan-Bihar ready — see Section 2.2** |
| 2 | Specialty Count | 20 | 30 | **30+ with tier-grouping + icons** |
| 3 | Waitlist Mechanism | FIFO AUTO-BOOK | Broadcast+Claim (top 2, ~30-min stale window) | **Improved Broadcast+Claim (top 3, 15-min window) — this is a forward decision; backend does not implement it yet, tracked as Feature-Dependencies.md Phase 0 item P0-5** |
| 4 | Patient Session Limit | 2 max | Bypassed for real OTP login (2-session limit code exists but isn't wired into `/api/auth/verify-otp`); the NEW `/api/v1/auth/verify-otp` mobile route DOES enforce 2 concurrent sessions via Redis | **Mobile app: 2 concurrent sessions, enforced (already live in `/api/v1/`)** |
| 5 | RTR (Refresh Token Rotation) | Not implemented | Implemented in `/api/v1/` — confirmed working rotation, single-use refresh tokens | **Already implemented for mobile: 30-minute access token (not 15 — corrected 2026-07-16) + 30-day refresh token, rotated on every use** |
| 6 | Middleware Protection | ALL routes | UI page routes (`/doctor/*`, `/admin/*`) + non-GET `/api/admin/*` only — most patient API routes rely on per-route auth checks, not blanket middleware | **Hybrid approach confirmed as accurate description of current code — no change needed** |
| 7 | Search Filters | 7 filters | 4 filters (Speciality, Availability, Max Fee, Min Experience) | **Standardize: Speciality, Availability, Max Fee, Min Experience** |
| 8 | Data Deletion | Real deletion | Deactivation only, **no OTP step exists in code today** | **"Deactivate Account" (hidden, OTP required — CONFIRMED as locked decision 2026-07-16, backend build required, see Feature-Dependencies.md P0-3), 30-day retention** |
| 9 | Emergency Token Format | E1, E2 strings | 9001, 9002 base integers (confirmed via `EMERGENCY_TOKEN_BASE`) | **JVC-E-1, JVC-E-2... display; 9001, 9002... database** |
| 10 | Weekly Schedule Shape | Array | Object | **Object format {MON: {isOpen, start, end, maxPatients}}** |
| 11 | Language Support | English only | None built | **Hindi/English mandatory, first-time onboarding** |
| 12 | Push Notifications | Not implemented | — | **FCM full implementation (6 categories)** |
| 13 | Patient Profile Edit | Planned | Never built | **Fresh build for mobile** |
| 14 | Emergency Toggle | Approval queue | Direct toggle (confirmed: `POST /api/admin/toggle-emergency` sets the flag immediately, no pending-request read) | **Direct toggle by doctor (no approval queue in V1)** |
| 15 | Color Contrast | Brand colors | WCAG fail (3.24:1) | **Keep brand colors, use darker text variants (#2B6CB0, #2F855A)** |
| 16 | Search Rate Limit | 100/hour | 20/min | **20 requests/minute** |
| 17 | Search Page Size | 20 | 15 (confirmed: `limit=15` default in `/api/v1/patient/search`) | **15 results per page** |
| 18 | Touch Target Size | Not specified | 40×40, 20×20 | **44×44px minimum everywhere** |
| 19 | DB Query Optimization | SELECT * | Full rows pulled | **SELECT only required fields** |
| 20 | Cache Headers | None | Missing | **s-maxage=60, stale-while-revalidate for static endpoints** |
| 21 | Verification Status | APPROVED | VERIFIED | **"VERIFIED" (not APPROVED) — confirmed via Zod enum in `verifyDoctorSchema`** |
| 22 | Cookie Name | jvc_session | jivnicare_token | **jivnicare_token — confirmed via `src/middleware.ts`** |
| 23 | Hospitals Section | Documented | Dead code (page exists, no doc references it) | **Out of scope for mobile-patient app; flag for founder review in `Known-Gaps.md`, don't remove without confirming it's truly unused** |
| 24 | Short Links | Documented | `/d/[shortCode]` page exists, undocumented purpose | **Out of scope for mobile-patient app; flag in `Known-Gaps.md`** |
| 25 | Admin Invite | Not documented | Exists in migration | **Document properly in Backend-Spec (admin-only, not mobile-relevant)** |
| 26 | Holiday Override | Not documented | Exists in schema | **Document behavior in Backend-Spec** |
| 27 | Notifications API | Partial | Full routes exist (`/api/notifications`, `/mark-read`, `/unread-count` — all confirmed) | **Full documentation in API-Contract — done** |
| 28 | Payment Display (Doctor) | Platform savings | Fake numbers (corrected by `JivniCare-V1-Master-Plan.md`) | **Actual clinic revenue (patients × fee = revenue)** |
| 29 | Search Rating Boost | "No rating" | No rating field found referenced in `/api/v1/patient/search`'s scoring — **this decision item is unverified as of 2026-07-16, do not treat "Keep + document" as confirmed until someone reads the scoring function line-by-line** | **Flagged for `Known-Gaps.md` — needs a follow-up code read before this row can be called locked** |
| 30 | Booking Endpoint | /book | /book-appointment | **book-appointment — confirmed via route file + `06-web-flow.md`'s API mapping** |

---

## 4. FEATURE LIST — V1.0 (F01-F19)

### F01 — Phone OTP Login/Signup
```
REQUIREMENT: Patient logs in via phone + OTP. No password.
SOURCE: src/app/api/v1/auth/send-otp/route.ts, verify-otp/route.ts, refresh/route.ts
  (mobile uses the /api/v1/ routes, NOT the legacy /api/auth/send-otp — see API-Contract.md)
ACCEPTANCE: 
  - Phone input with +91 prefix
  - 6-digit OTP, 30s resend cooldown
  - Auto-read OTP from SMS (Android)
  - Test OTP "123456" in dev mode only
  - RTR: 30-minute access token (corrected from 15 — see Decision #5) + 30-day refresh token
  - 2 concurrent session limit enforced (Redis-based, confirmed live)
OUT OF SCOPE: Biometric, Google Sign-In for patients
```

### F02 — Doctor Search
```
REQUIREMENT: Search by name, symptom, or specialty
SOURCE: src/app/api/v1/patient/search/route.ts (confirmed: supports both GET and POST)
ACCEPTANCE:
  - Min 2 chars to trigger
  - Symptom map: 200+ terms (Hindi + English + Bhojpuri + typos)
  - Hard filter always applied: verificationStatus=VERIFIED AND canShowOnPublic=true
  - DB safety cap: max 100 doctors fetched before in-memory scoring (results beyond top 100
    raw matches never appear — document this as a known limit, not a bug)
OUT OF SCOPE: Distance radius filter UI (V2)
```

### F03 — Search Filters
```
REQUIREMENT: Narrow search results
SOURCE: src/features/patient/components/doctors/DoctorFilters.tsx (web reference;
  mobile builds fresh per Component-Library.md FilterPanel)
ACTUAL FILTERS (4 only, confirmed):
  1. Speciality — multi-select checkbox, 30 items, tier-grouped
  2. Availability — Any / Available Today / Available Tomorrow
  3. Max Fee — Any / Under ₹500 / Under ₹1000
  4. Min Experience — Any / 5+ / 10+ / 15+ years
NOT FILTERS (auto-detected or separate):
  - District: Auto-detected via GPS/manual setting
  - Emergency: Separate section, not filter
  - Gender/Language: Not in UI (V1.1)
ACCEPTANCE: Bottom sheet on mobile, instant apply
```

### F04 — Speciality List
```
REQUIREMENT: Select specialty during search and registration
SOURCE: src/lib/seo/metadata.ts (HEALTHCARE_SPECIALTIES, 30 items, confirmed by direct read)
DECISION: Build tier-grouped version with icons for mobile
TIER 1 (Popular): General Physician, Pediatrician, Gynecologist & Obstetrician, Orthopedic Surgeon, Dentist
TIER 2 (Regular): Dermatologist & Cosmetologist, ENT Specialist, Ophthalmologist, General Surgeon, Diabetologist
TIER 3 (Specialist): Cardiologist, Neurologist, Gastroenterologist, Pulmonologist, Endocrinologist, Urologist, Nephrologist, Psychiatrist & Psychologist, Physiotherapist, Oncologist, Rheumatologist
TIER 4 (AYUSH + Others): Ayurvedic Doctor, Homeopathic Doctor, Unani Specialist, Siddha Specialist, Naturopath, Dietitian & Nutritionist, Sexologist, Hair & Skin Specialist, Geriatrician, Emergency Medicine Specialist
ACCEPTANCE: 
  - Searchable dropdown, icons per specialty, type-to-filter, bottom sheet on mobile
```

### F05 — Doctor Profile Page
```
REQUIREMENT: View full doctor details
SOURCE: src/features/patient/components/doctors/profile/DoctorProfileView.tsx (web reference)
ABOVE FOLD (mobile): Clinic photo slider (max 3), avatar+status dot, name+verified badge,
  specialty+experience, clinic name/city, consultation fee, queue status badge, patients served,
  [Book Appointment Now] CTA
BELOW FOLD: About, Education, Expertise, Languages, Clinic address/timing/owner, Emergency info,
  [Share Profile]
ACCEPTANCE: All data loads in <2s, images lazy-loaded
```

### F06 — Live Queue Status Badge
```
REQUIREMENT: Real-time queue status on doctor card and profile
SOURCE (web): src/app/api/patient/bookings/stream/route.ts (SSE)
MOBILE CHANGE: SSE → FCM (mandatory — SSE also requires the cookie this route reads, which a
  Bearer-token mobile client can't establish the same way; see API-Contract.md F09)
STATUSES: AVAILABLE 🟢 / ON_BREAK 🟡 / BUSY 🟠 / OFFLINE ⚫
ACCEPTANCE: Push notification on status change, badge updates in real-time
```

### F07 — Railway-Style Booking Flow
```
REQUIREMENT: See token position BEFORE confirming booking
SOURCE: src/features/patient/components/doctors/profile/BookingWidget.tsx (web reference)
FLOW: Token preview, visual slot bar, fee breakdown, consent checkbox (blocked until F19 backend
  exists — see Known-Gaps.md), [Confirm Booking]
ACCEPTANCE: Preview accurate within 1 token position
```

### F08 — Book Appointment
```
REQUIREMENT: Create booking token
SOURCE: src/app/api/patient/book-appointment/route.ts
RULES:
  - Max 3 active tokens per patient per day
  - Atomic booking: Prisma $transaction + SELECT FOR UPDATE
  - Idempotency: field is `requestId` (corrected — NOT `idempotencyKey`), Redis SET NX,
    24h TTL, rolled back on failure so retries with the same requestId are safe
  - Walk-in auto-linking: Silent phone lookup
  - 13 named business-rule error codes exist (see API-Contract.md F08 for the full list)
BLOCKED STATES: Queue full, doctor offline, already booked, 3-limit reached (each has its own
  named error code — do not collapse these into one generic "booking failed" message)
MOBILE CHANGE: Requires Bearer-token support to be added to this route first — see
  Feature-Dependencies.md Phase 0, item P0-1. Write ops → NO offline auto-retry.
ACCEPTANCE: Booking completes in <3s on 3G
```

### F09 — Token Status Tracking
```
REQUIREMENT: Track live token position
SOURCE (web): src/app/api/patient/bookings/stream/route.ts — confirmed SSE transport, needs
  Bearer-token support + FCM replacement per Feature-Dependencies.md Phase 3
SCREEN DESIGN: HERO token #, doctor info, "X ahead"/"serving #Y", progress bar (no time
  estimate), clinic info, status badge, [Cancel Booking] if cancellable
AUTO-REFRESH: Silent 30s polling + FCM push for instant updates
ACCEPTANCE: Status updates within 5 seconds of doctor action
```

### F10 — My Bookings
```
REQUIREMENT: View all active + past bookings
SOURCE: src/app/api/patient/my-bookings/route.ts — confirmed NO pagination, returns full
  history every call (see Known-Gaps.md — acceptable for V1 given expected volumes)
TABS: Active (BOOKED/AWAITING_ARRIVAL/PAYMENT_PENDING/READY/CALLED/IN_CONSULTATION) — split is
  client-side, not server-side; Past (COMPLETED/NO_SHOW/CANCELLED/EXPIRED)
ACCEPTANCE: Pull-to-refresh, loads in <2s
```

### F11 — Cancel Token
```
REQUIREMENT: Cancel booking in allowed states
SOURCE: src/app/api/patient/queue/cancel-token/route.ts
CANCELLABLE STATES: BOOKED, AWAITING_ARRIVAL, PAYMENT_PENDING, READY
Confirmed: cancellation includes IDOR protection (403 if the token belongs to a different
  patient, logged as a security event) and triggers waitlist notification synchronously inside
  the same transaction.
NO REFUND: Pay at clinic, JivniCare never touches money
ACCEPTANCE: Cancellation processes in <2s
```

### F12 — Join Waitlist
```
REQUIREMENT: Get notified when slot opens
SOURCE: src/app/api/patient/queue/claim-waitlist/route.ts
MECHANISM: Improved Broadcast+Claim — top 3, 15-minute window. **This is the locked target
  design for V1 mobile; it is NOT what the code does today** (code is top-2, ~30-min stale
  window, and the claim endpoint itself only checks same-calendar-day, not a literal timer).
  Backend build tracked as Feature-Dependencies.md Phase 0 item P0-5.
IMPORTANT: "slot already taken" is returned as HTTP 200 with `data.isTaken: true`, not an HTTP
  error — mobile client must check the inner field, not just status code.
ACCEPTANCE: Notification delivers within 60s of slot opening
```

### F13 — Lead Capture ("Request a Doctor")
```
REQUIREMENT: Capture interest when no doctor found
SOURCE: src/app/api/public/lead/route.ts
FIELDS (corrected — confirmed via Zod schema): Name, Phone, District, Speciality, AND
  roleInterest, source, lastStepCompleted (not previously documented)
STORAGE: DoctorRequest table (extra fields packed into notes JSON)
BLOCKED ON: Cloudflare Turnstile requirement — fails closed in production, needs a mobile-
  compatible path before this feature works on mobile (Feature-Dependencies.md Phase 0, P0-2)
RATE LIMIT: 5 requests / 15 min, applied to BOTH ip and phone independently (both must pass)
ACCEPTANCE: Form submits in <2s, confirmation message shown
```

### F14 — Patient Profile Edit
```
REQUIREMENT: Edit patient profile
STATUS: GAP — never built on web
DECISION: Build fresh for mobile
FIELDS: Name, Email, Phone (read-only), Location, Preferred Language
ACCEPTANCE: Changes sync to backend immediately, offline edits queued
```

### F15 — Language Toggle
```
REQUIREMENT: Hindi/English switch
STATUS: GAP — no i18n library exists
DECISION: Build fresh for mobile
MANDATORY: First-time onboarding screen — user MUST choose before proceeding
PERSISTENCE: Zustand store + secure storage
SCOPE: All patient-facing strings (200+ strings, per UX-Writing-Guide.md)
ACCEPTANCE: Language changes instantly without app restart
```

### F16 — Push Notifications
```
REQUIREMENT: Native push via FCM
STATUS: GAP on web → MOBILE UPGRADE
CATEGORIES (6): BOOKING_CONFIRMED, TOKEN_CALLED, QUEUE_UPDATE, DOCTOR_STATUS_CHANGE,
  WAITLIST_CLAIM, SYSTEM
FCM INTEGRATION: Register device token on login, unregister on logout, handle foreground/
  background/killed states, deep link to relevant screen on tap
ACCEPTANCE: Delivery rate >95%, latency <5s
```

### F17 — In-App Notifications
```
REQUIREMENT: Notification inbox inside app
SOURCE: /api/notifications (GET), /mark-read (PATCH — not POST), /unread-count (GET) — all
  three confirmed by direct code read
FEATURES: Unread count badge, mark individual/all as read, delete after 30 days (client-side
  filter — confirmed no server-side auto-delete cron for notifications specifically)
ACCEPTANCE: Inbox loads in <1s, swipe to dismiss
```

### F18 — Data Deletion Request
```
REQUIREMENT: DPDP Act 2023 compliance
SOURCE: src/app/api/patient/delete-data/route.ts
CURRENT CODE BEHAVIOR: Sets isActive: false, revokes JWT via Redis, deletes cookie — no OTP
  step, no PII removed, no confirmed 30-day-reactivation-on-login logic found.
LOCKED DECISION (2026-07-16): OTP verification IS required — this is a backend build item
  (Feature-Dependencies.md Phase 0, P0-3), not something to drop from the doc or the S16 screen.
FLOW: Hidden in Settings → Account, OTP verification required, 30-day retention window
  (reactivation-on-login logic also needs to be built/confirmed — Feature-Dependencies.md P0-6),
  audit log created, all sessions invalidated
ACCEPTANCE: Account disabled within 5s of OTP confirmation
```

### F19 — Consent Capture
```
REQUIREMENT: Legal consent at signup + booking
SOURCE: Prisma ConsentLog model
STATUS (confirmed 2026-07-16): NO BACKEND EXISTS. The model is fully defined in
  prisma/schema.prisma but zero API routes read or write it anywhere in the codebase.
  This blocks F07's consent checkbox from having anywhere to submit to.
ACTION REQUIRED: New endpoint (or addition to verify-otp/book-appointment) must be built —
  Feature-Dependencies.md Phase 0, item P0-4.
AT SIGNUP: ☑ "I agree to Terms of Use and Privacy Policy" / ☑ "I confirm I am booking for myself or as guardian"
AT BOOKING: ☑ "I understand JivniCare is a booking platform, not a medical provider. I will pay at clinic."
STORAGE: ConsentLog table (text, version, IP, timestamp) — once the write path exists
ACCEPTANCE: Cannot proceed without checking both boxes
```

---

## 5. OUT OF SCOPE — V1.0

| Feature | Deferred To | Reason |
|---------|-------------|--------|
| Doctor mobile app | V1.1 | Double blast radius |
| Biometric login | V1.1 | Q2 2027 timeline |
| Bhojpuri/Maithili | V1.1 | Hindi/English sufficient for launch |
| Gender/Language filters | V1.1 | Web mein bhi nahi hain |
| In-app payment | V2 | Display-only system in V1 |
| Video consultation | V2 | Telemedicine phase |
| EMR/Prescriptions | V2 | Medical records phase |
| Insurance integration | V2 | Monetization phase |
| WhatsApp booking | V2 | Channel expansion |
| Admin-initiated onboarding | V2 | Operational complexity, never built on web either |

---

## 6. PLATFORM DECISIONS

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | React Native (Expo) | Fastest solo-dev path, OTA updates |
| State Management | Zustand | Reuse web stores, minimal boilerplate |
| Backend | Shared (one DB, one API) | No double-booking risk |
| Architecture | Modular Monolith | Microservices = overhead for solo founder |
| Auth | OTP + RTR | Familiar to users, secure for mobile — already implemented in `/api/v1/` |
| Real-time | FCM replaces SSE | Background reliability |
| Offline | Read-cache only | Write auto-retry = duplicate booking risk |
| Analytics | Firebase (free tier) | Zero cost, FCM integration |
| Deep Links | Universal + Custom scheme | Seamless web→app |

---

## 7. SUCCESS CRITERIA

### Launch Criteria
- [ ] All F01-F19 features implemented (F19 requires new backend work first — see Section 4)
- [ ] All 6 Phase 0 backend items from `Feature-Dependencies.md` resolved
- [ ] All 30 decisions documented and followed (Decision #29 needs a follow-up verification —
      see table above)
- [ ] No V2 features accidentally built
- [ ] Unit tests >80% coverage for critical flows
- [ ] E2E tests pass for: Login → Search → Book → Track → Cancel
- [ ] Performance: Cold start <3s, API response <2s on 3G
- [ ] Accessibility: 44×44px touch targets, screen reader labels
- [ ] Security: No JWT in storage, Keychain/Keystore for tokens

### Post-Launch Metrics
- Day 7: 100+ downloads
- Day 30: 500+ registered patients
- Day 90: 10+ verified doctors active
- Crash-free rate: >99%

---

*Scope Locked: 2026-07-15 | Corrected: 2026-07-16 | Changes require founder approval*
