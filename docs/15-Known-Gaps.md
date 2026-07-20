# Document 15: Known-Gaps.md
**Version:** V1.0.0 | **Date:** 2026-07-16 | **Status:** LOCKED (living document — see
`02-Source-of-Truth.md` Section 4, update this file as items resolve rather than deleting them)
**Purpose:** Everything that is deliberately NOT in V1, everything that's unverified and needs a
follow-up code read, and everything accepted as a known limitation. This is the single place an
AI agent (or a human) should check before assuming something is missing by accident rather than
by design — per `13-AI-Development-Rules.md` Rule 5's Emergency Protocol, this is where
contradictions and open questions get written down instead of silently guessed at.

---

## 1. V2 Deferrals (deliberately out of scope for V1 — see `03-Product-Vision.md` Section 5 and `04-PRD.md` Section 5)

| Feature | Deferred To | Why |
|---|---|---|
| Video Consultation | V2 | Infrastructure heavy, regulatory complexity |
| In-App Payment Gateway | V2 | Display-only system in V1 by design |
| Medicine Delivery | V3 | Supply chain complexity |
| Lab Test Booking | V3 | Lab partnerships required |
| Bhojpuri/Maithili languages | V1.1 | Hindi/English sufficient for launch |
| Insurance Integration | V3 | Regulatory complexity |
| AI Symptom Checker | V2 | Medical liability |
| Doctor-side Mobile App | V1.1 | Doubles blast radius for a solo founder |
| Patient Health Records | V2 | Data privacy complexity |
| Subscription Plans for Doctors | V2 | Build market on free listing first |
| Biometric login | V1.1 | Q2 2027 timeline |
| Gender/Language search filters | V1.1 | Don't exist on web either |
| Distance radius filter UI | V2 | Never built on web |
| Admin-initiated doctor onboarding | V2 | Never built on web (`06-web-flow.md` Flow A3 was deprecated for describing this as if it existed) |
| Fully automated FIFO auto-booking with timeout windows | V2 | V1 uses Broadcast+Claim instead — see `05-Business-Rules.md` Section 3 |
| Certificate pinning, screenshot blocking, auto-lock | V1.1 | Security hardening pass, not launch-blocking |
| Dark mode (mobile) | Not planned | Scoped to web admin/doctor dashboards only, per `08-Design-System.md` |
| Voice search | V1.1 | Mic icon shown disabled in V1 per `08-Design-System.md` Icon Library note |

---

## 2. Backend Build Gaps (tracked in detail in `14-Feature-Dependencies.md` Phase 0 — summarized here for quick reference)

| # | Gap | Blocks | Detail |
|---|---|---|---|
| P0-1 | 7 patient routes are cookie-only, no Bearer support | Almost the entire app post-login | `11-API-Contract.md` "Mobile Blockers" |
| P0-2 | Lead capture requires browser-only Cloudflare Turnstile | F13 | Same section |
| P0-3 | Deactivation OTP step doesn't exist in code (confirmed as a locked decision it SHOULD exist — founder confirmed 2026-07-16) | F18 | `05-Business-Rules.md` Rule D3 |
| P0-4 | `ConsentLog` has zero backend write path anywhere | F19, blocks F07/F08's consent checkbox from persisting | `12-Backend-Spec.md` Section 1 |
| P0-5 | Waitlist broadcast size (2 vs 3) and claim window (~30min calendar-day check vs 15min literal timer) — code and locked decision disagree | F12 | `05-Business-Rules.md` Section 3 |
| P0-6 | 30-day reactivation-on-login logic (Business-Rules Rule D7) not found in the login path | F18 | Same |

---

## 2.1 New Component Flags (added 2026-07-19 — `WaitlistForm` organism generation)

| What was found | Current status / why it's not resolved | What it blocks or affects |
|---|---|---|
| `WaitlistForm` organism build request included a Name field | `07-Mobile-UX-Spec.md` S12's documented Waitlist form has ONE field (Phone, pre-filled from the logged-in patient) — no Name field. Name-collection is documented elsewhere, for F13 Lead Capture (`10-UX-Writing-Guide.md` Section 15), a different screen. Resolved by adding a `collectName` prop (default `true` to satisfy the explicit build request) rather than silently dropping the requirement or silently rewriting S12's spec. | Whoever wires this component into the actual S12 screen should set `collectName={false}` unless a founder decision adds a Name field to S12 |
| No documented endpoint for the *initial* waitlist-join action | `11-API-Contract.md` F12 (`POST /api/patient/queue/claim-waitlist`) is the CLAIM step for when a slot opens — S12's own spec text calls this out as "distinct from the CLAIM flow." No F-numbered endpoint documents the join action itself. | `WaitlistForm`'s `onSubmit` is left as a callback for the parent screen to wire once this endpoint is confirmed/built — the component does not call any API itself |
| Task copy ("Get Priority Access" button, "You're in!" success text) doesn't match `10-UX-Writing-Guide.md` Section 10 | Canonical strings are "Join Waitlist" (button) and "You are #{position} on the waitlist" (success, position-aware). `WaitlistForm` defaults to the canonical copy via overridable props rather than baking in non-canonical copy as the library default. | Any screen that specifically wants the non-canonical copy must pass it explicitly via props |
| No canonical Name-field label/placeholder/validation-error strings exist for a waitlist context | `nameLabel` defaults to "Name" (borrowed from Section 11 Profile Strings); `nameRequiredError`/`nameTooShortError` have no canonical source at all — generic English defaults used, flagged rather than invented silently | Low priority unless `collectName` is actually turned on for a shipped S12 |
| No documented endpoint returns a waitlist queue position | `WaitlistForm`'s `position` prop stays optional and the success state degrades gracefully (generic confirmation, no Badge) when absent | Position-aware success copy/Badge won't render until a backend response shape for this is confirmed |

---

## 2.2 New Component Flags (added 2026-07-19 — `BookingWidget` molecule generation)

| What was found | Current status / why it's not resolved | What it blocks or affects |
|---|---|---|
| Build request asked for a "molecule" named `BookingWidget` at `src/components/molecules/` | `09-Component-Library.md` Section 3.4 already documents a component with this exact name as an ORGANISM, with a token/queue-based interface (`doctor`, `estimatedToken`, `totalSlots`, `patientsAhead`, `consultationFee`, `onConfirm`, `onWaitlist`, `blocked`/`blockReason`) — a different shape entirely. Built the requested molecule at the requested path per the explicit task instruction, rather than silently overwriting or renaming the documented organism. Both now exist as distinct concepts sharing one name — a founder decision is needed on whether to rename one of them. | Anyone building S07/S08 against the documented organism interface should NOT reach for `src/components/molecules/BookingWidget.tsx` — it is a different component with a different contract |
| Task asked the widget to show "time slots" | No time-slot concept exists anywhere in the booking model — `05-Business-Rules.md` Rules B1–B10 and `11-API-Contract.md` F08 describe a sequential QUEUE TOKEN system (a patient gets the next token number for "today," not a chosen time-of-day slot); F08's request body has no `slotId` field. Built a generic `slots: BookingSlot[]` prop as requested rather than silently pretending it maps to a real backend field. | A real F08 integration wiring this component's `onSubmit(slotId)` to `POST /api/patient/book-appointment` will need to either drop slot selection or get a backend change adding real slot support — do not send `slotId` to the current endpoint expecting it to do anything |
| Task said `onSubmit` should catch "the error code (one of the 13 named B6 codes)" | `11-API-Contract.md` F08 confirms the real route returns `{success:false, error: <message>}` — an already-localized MESSAGE STRING, not a machine-readable code. There is no documented field carrying one of the 13 B6 code names to the client. `BookingWidget` implements the code → copy mapping (`getBookingErrorMessage`) assuming its `onSubmit` prop already rejects with a `{code: BookingErrorCode}` shape; whichever screen wires the real endpoint must itself decide how to derive a code from the server's message text (fragile) or get a backend change adding a machine-readable `errorCode` field to the response (preferred, per Rule 7's "fix the backend gap" guidance). | Blocks a real F08 integration from working end-to-end until one of the two fixes above lands |
| `DAILY_LIMIT_REACHED` (Rule B6) has two different canonical messages in `10-UX-Writing-Guide.md` Section 6 depending on which limit fired (doctor-level "No slots today" vs. patient-level 3-booking cap "You have 3 active bookings today") | Rule B6 names only ONE code for both cases and no documented response field disambiguates them. `BookingWidget` exposes a `dailyLimitContext` prop (`'doctorLevel' \| 'patientLevel'`, default `'doctorLevel'`) so the caller can choose, rather than guessing which message is correct. | Whoever integrates the real endpoint needs to determine which case actually fired (likely by matching the server's message text) before setting this prop correctly |
| Task's literal button text ("Book Appointment") doesn't match either canonical action-button string in `10-UX-Writing-Guide.md` — S08's confirm action is "Confirm Booking" (Section 6), S07's entry CTA is "Book Appointment Now" (`09-Component-Library.md` Section 1.1's usage example) | `bookButtonLabel` defaults to the task's literal "Book Appointment" text and is fully overridable, rather than silently substituting one of the two canonical strings the task didn't ask for. | Whoever embeds this widget in an actual S07/S08 screen should pass the correct canonical `bookButtonLabel` explicitly rather than rely on the default |
| Haptic feedback on error (`05-Business-Rules.md` Rule ACC5: "Error messages: Visual + audio + haptic") | Not wired — `expo-haptics` is not yet a dependency in `package.json`. Visual (error-colored banner) and audio (screen reader via `accessibilityLiveRegion="assertive"`) are both implemented. | Low priority until `expo-haptics` is added as a project dependency for another reason |

---

## 2.3 New Business Rule Flags (added 2026-07-19 — Doctor Availability & Booking Automation)

| What was found | Current status / why it's not resolved | What it blocks or affects |
|---|---|---|
| Founder directive introduced `bookingStartTime`/`opdStartTime`/`closingTime`/`isLive` as a new doctor-profile automation model, distinct from the EXISTING Section 9 (`05-Business-Rules.md`) status model (`AVAILABLE`/`ON_BREAK`/`OFFLINE`/`BUSY`, single `clinicStartTime` field, 04:00 AM IST cron reset) | The two models were NOT unified — Section 16 was added alongside Section 9 rather than replacing it, per `13-AI-Development-Rules.md` Rule 4/5 (don't change locked rule numbers/logic, don't silently resolve a contradiction). `DoctorCard` now carries both the OLD `queueStatus` prop and the NEW `isLive`/`isClosed` props as independent inputs. | Any backend work implementing this feature needs a founder decision on whether `isLive` supersedes `AVAILABLE`/`OFFLINE`, runs alongside it, or one derives from the other |
| None of `bookingStartTime`, `opdStartTime`, `closingTime`, `isLive`, `manualOverrideActive` (or equivalent) are confirmed to exist in the live schema or any documented API response (`11-API-Contract.md` was not updated by this pass) | This is a frontend-first, backend-pending build — same pattern as the Waitlist 15-min window (P0-5). The mobile `DoctorCard` component was built against mock/prop data only. | Blocks a real end-to-end integration until a backend engineer adds these fields and `11-API-Contract.md` documents the endpoint(s) that return them |
| Rule DA3 (Manual Override) doesn't specify the exact backend precedence mechanism between a cron-driven automated toggle and a doctor's manual toggle | Flagged as an implementation decision for backend engineering rather than guessed at in this doc set | Whoever builds the backend cron/toggle logic needs to pick a concrete mechanism (e.g. a separate `manualOverrideActive` boolean checked before the cron writes `isLive`) consistent with Rule DA3's stated behavior |
| The founder directive referenced updating `07-Mobile-UX-Spec.md` "Section S03 / Doctor Card" | This document's actual Screen Inventory has S03 = Phone Login; there is no screen numbered as a Doctor Card screen (DoctorCard is a molecule used inside S05/S06). Resolved by adding a new standalone "DoctorCard Component Spec" section rather than overwriting S03 or guessing a different screen number — see that section's own inline flag in `07-Mobile-UX-Spec.md`. | Founder should confirm whether a specific different screen number was actually intended |
| Premium-redesign directive (2026-07-19) asked for a per-card "Book Appointment" / disabled "Currently Closed" button, which appears to overlap the EXISTING note (same section) that "the card remains fully tappable... blocking a booking attempt is S07/S08's job" | Resolved as ADDITIVE, not a contradiction: the outer card's own tap-to-navigate-to-S07 behavior is unchanged (still enabled/tappable even when `isClosed`); the NEW CTA Button is a distinct, narrower, nested control that reuses the card's existing `onPress` (no new `onBookPress` callback added) and is the ONLY thing that becomes `disabled`. See `07-Mobile-UX-Spec.md`'s "CTA BUTTON ROW" subsection for the explicit reasoning. | If a future requirement wants the button to trigger a different action than the card body (e.g. jump straight to S08 instead of S07), a new `onBookPress` prop will need to be added then — not built speculatively now |
| Reference images for the redesign showed a star rating (e.g. "4.9") next to the doctor's name | No rating field exists anywhere in `DoctorCardDoctor`, `05-Business-Rules.md`, or `11-API-Contract.md`'s doctor shape — `15-Known-Gaps.md` Section 3 already flags doctor rating as an unverified/unconfirmed concept for search-boost purposes, with the same absence noted for the API. Not added to `DoctorCard` — copying the reference image's layout/spacing/shadow feel was in scope; inventing an undocumented data field was not, per `13-AI-Development-Rules.md` Rule 1. | If product later confirms a rating field, `DoctorCard` is a natural place to surface it next to the name — flagged here so it isn't silently invented later either |

---

## 3. Unverified Claims (need a follow-up code read before being treated as confirmed)

| Item | Current Status | Where It Matters |
|---|---|---|
| Search rating-boost (PRD Decision #29) | No rating field found referenced in `/api/v1/patient/search`'s scoring logic during the API-Contract pass — but the scoring function was not read line-by-line, so absence-of-evidence isn't confirmed absence | If F02/F03 documentation or UI implies a rating-based boost exists, don't build against it until confirmed |
| Notification 30-day auto-delete (Business-Rules Rule N10) | No server-side cron confirmed found; may be a client-side display filter only | F17 — don't assume the server purges old notifications; if the mobile UI needs a 30-day cutoff, it may need to compute it client-side |
| `hospitals/` page section | Exists in the codebase (`(public)/hospitals/page.tsx`, `hospitals/[slug]/page.tsx`), purpose/relationship to the `Doctor` model not documented anywhere across all 3 audits | Not referenced by any of F01-F19 — leave untouched, flag for founder review before removing OR building mobile support for it |
| `/d/[shortCode]` short-link route | Exists, undocumented purpose (likely a QR-sticker/share-link redirect) | Same — flag, don't guess |
| Admin Invite flow (PRD Decision #25) | Exists in a DB migration, not traced in detail | Admin-only, not mobile-patient-app relevant — low priority to resolve |
| Holiday Override (PRD Decision #26) | Exists in schema, not traced in detail | Affects the *result* the mobile app reads (a doctor's computed day-status) but mobile never calls this logic directly — low priority |
| Two doctor-detail page routes on web (`doctor/[slug]` AND `doctors/[slug]`, singular/plural) | Both exist; unclear if one is a redirect or dead code | Not mobile-blocking (mobile builds its own S07 from the API, doesn't reuse web pages), but worth a founder decision before web-side cleanup |

---

## 4. Accepted V1 Limitations (not bugs — deliberate or reasonable-for-now tradeoffs)

| Limitation | Why It's Accepted for V1 | Revisit When |
|---|---|---|
| `GET /api/patient/my-bookings` has no pagination — returns entire history every call | Expected patient volume is low in V1 (`03-Product-Vision.md` targets: 500 patients by Month 3) | If a patient's booking count regularly exceeds ~50-100, or API response times degrade |
| Search has a 100-doctor safety cap before scoring | Expected doctor volume is very low in V1 (10 doctors by Month 3, 100 by Month 6) | Once doctor count approaches the 100-doctor cap in any single search's raw match set |
| Two response envelope formats coexist (`apiResponse`-wrapped vs flat) across different endpoints | Not worth a breaking API change mid-V1-build; documented precisely per-endpoint in `11-API-Contract.md` instead | A planned v1.1 API cleanup pass, if one is ever scheduled — not urgent |
| District scope shows as "37 Bihar districts + Deoghar" technically, but go-to-market focus is 2 districts | This is a marketing-focus vs. technical-capability distinction, not a bug — see `03-Product-Vision.md`'s note in Section 6.1 | N/A — this isn't a gap, just make sure nobody "fixes" the code to match the narrower marketing focus |
| `/api/v1/patient/search` and legacy `/api/public/search` both exist and do overlapping things | Confirmed intentional per `04-PRD.md`'s TRD versioning history — v1 is for mobile, legacy stays for web, both share a rate limiter | If web is ever migrated to call the v1 route too, this becomes one endpoint instead of two — not a V1 mobile concern |
| Emoji used in copy strings, Lucide icons used in structural UI | Deliberate split, not a bug — see `08-Design-System.md`'s Icon Library note | If cross-platform emoji rendering ever causes a real visual bug report |

---

## 5. Meta: Corrections Already Applied (for history — see `02-Source-of-Truth.md` Section 3 for the authoritative version of this list)

This section exists so nobody re-discovers and re-"fixes" something that was already corrected
during the 2026-07-16 documentation pass. If you find yourself about to change one of these
back to its "V1.0.0" value, stop — check `02-Source-of-Truth.md` Section 3 first.

- Access token expiry: 30 minutes (not 15)
- Booking idempotency field: `requestId` (not `idempotencyKey`)
- Waitlist button text: "Book with Dr. {name}" (not "Book Now") on S12
- F13 lead capture fields include `roleInterest`, `source`, `lastStepCompleted` beyond the
  originally-documented Name/Phone/District/Speciality
- `/api/v1/patient/search` added to the rate-limit table (was missing)
- Verification resubmit target: `PENDING_REVIEW` directly, not back through `PENDING_ACTIVATION`
- `SUSPENDED` is not hard-terminal — same admin endpoint can reverse it
- Emergency toggle is direct, no approval queue (multiple older docs described an approval
  workflow that was never built)
- District scope is technically pan-Bihar (37 districts + Deoghar), not a 2-district hard limit
- Specialty count is 30 (tier-grouped across 4 tiers), not 20
- Cookie name is `jivnicare_token`, not `jvc_session`
- Verification status enum uses `VERIFIED`, never `APPROVED`

---

## 6. How to add to this document

When you find something during development that belongs here, add it under the right section
above rather than creating a new file or a scattered comment. Use this format:
```
| What you found | Current status / why it's not resolved | What it blocks or affects |
```
Then, per `13-AI-Development-Rules.md` Rule 5, notify the founder before proceeding on anything
that touches a Tier 1/2 document's stated behavior.

---

*Known Gaps Locked: 2026-07-16 | This is a living document — items move OUT of this file (to a
Resolved section, or deleted with a changelog note in `02-Source-of-Truth.md`) as they're
addressed, never silently.*
