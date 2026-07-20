# JivniCare Mobile — Feature Dependencies & Development Plan
**Version:** V1.1.0 | **Date:** 2026-07-16 | **Status:** LOCKED
**Supersedes:** V1.0.0 — added the Screen → API → Model → Permission Matrix to close the gap
flagged in the readiness audit.
**Built from:** `04-PRD.md` (F01–F19), `05-Business-Rules.md`, and `11-API-Contract.md`'s
verified backend findings — not just a re-statement of the PRD's feature list.

---

## Phase 0 — Backend prerequisites (before mobile can function end-to-end)

These aren't mobile features — they're backend fixes/builds that block every mobile feature
downstream of them from working against the real API, even if the mobile UI itself is finished.
**A mobile screen can be built and demoed with mocked data before these land, but cannot be
connected to the real backend until they do.** Do these first, or explicitly track which screens
are UI-only-until-unblocked.

| # | What | Blocks | Why (from `11-API-Contract.md`) |
|---|---|---|---|
| P0-1 | Wire `session.ts`'s Bearer-aware auth helper into the 7 cookie-only patient routes | F08, F09, F10, F11, F12, F17, F18 — i.e. almost the entire app except login and search | Mobile sends `Authorization: Bearer`, these routes only read the `jivnicare_token` cookie, which a React Native client can't set the way a browser does |
| P0-2 | Add a mobile-compatible path around Cloudflare Turnstile for `/api/public/lead` | F13 | Turnstile is a browser-only challenge; fails closed in production |
| P0-3 | Decide + implement: does account deactivation get an OTP step, or does `05-Business-Rules.md` Rule D3 / Screen S16 get simplified to drop it? | F18 | Doc and screen both currently assume an OTP step the backend doesn't have |
| P0-4 | Build the `ConsentLog` write path (new endpoint, or add to verify-otp/book-appointment) | F19 | The table exists in schema; nothing writes to it anywhere in the codebase today |
| P0-5 | Decide + implement the waitlist broadcast group size and claim-window duration as ONE consistent number end-to-end | F12 | Code currently has "top 2 / ~30 min" in one place; docs specify "top 3 / 15 min" as the new mobile design; the claim endpoint itself only checks same-calendar-day, not a literal timer |
| P0-6 | Confirm or build the 30-day reactivation-on-login logic implied by Business-Rules Rule D7 | F18 | Not found in the login path during the API-Contract pass — S16's "reactivate within 30 days" promise needs this to actually exist |

**None of P0-1 through P0-6 require new UI decisions** — they're server-side, and can be done in
parallel with all of Phase 1 below by anyone with backend access, mobile-development knowledge
not required. Recommend starting these immediately and in parallel with Phase 1, not sequentially
before it — the only true hard dependency is "P0-1 must land before any Phase 2+ screen can be
QA'd against the real API," not "before Phase 2+ screens can be built."

---

## Dependency Graph — Booking → Queue → Notification → Payment → Analytics

```
                    ┌─────────────────┐
                    │  F01 Login/OTP  │  ← everything downstream needs an authenticated user
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────────┐
              ▼                                  ▼
    ┌──────────────────┐              ┌────────────────────┐
    │ F15 Language      │              │ F14 Profile Edit   │
    │ Toggle (mandatory │              │ (needed if          │
    │ before F01, but   │              │  needsProfile=true  │
    │ persists after)   │              │  from verify-otp)   │
    └──────────────────┘              └──────────┬──────────┘
                                                    │
                             ┌──────────────────────┘
                             ▼
              ┌──────────────────────────┐
              │ F02/F03 Search + Filters │  ← no auth required, can be built/tested independently
              └─────────────┬─────────────┘
                             ▼
              ┌──────────────────────────┐
              │ F04 Speciality List      │  ← feeds F02/F03's filter UI, static data, no dependency risk
              └─────────────┬─────────────┘
                             ▼
              ┌──────────────────────────┐
              │ F05 Doctor Profile       │
              │ F06 Live Queue Badge     │  ← needs FCM (F16) wired for real-time; degrades to polling without it
              └─────────────┬─────────────┘
                             ▼
              ┌──────────────────────────┐
              │ F19 Consent Capture      │  ← MUST be resolved (P0-4) before F07/F08, since the
              │ (blocks the checkbox     │     booking consent checkbox in F07's flow has nowhere
              │  in F07's flow)          │     to write to otherwise
              └─────────────┬─────────────┘
                             ▼
              ┌──────────────────────────┐
              │ F07 Railway-Style Preview │
              │ F08 Book Appointment      │  ← the core transaction; needs P0-1 (Bearer auth) live
              └─────────────┬─────────────┘
                             │
              ┌──────────────┼──────────────────┐
              ▼                                  ▼
    ┌──────────────────┐              ┌────────────────────┐
    │ F09 Token Tracking│              │ F10 My Bookings    │
    │ (needs F16 FCM to │              │ (list view, no     │
    │  be real-time;    │              │  hard dependency   │
    │  SSE endpoint      │              │  beyond F08)       │
    │  exists but isn't  │              │                    │
    │  mobile-viable)    │              └────────────────────┘
    └─────────┬──────────┘
              ▼
    ┌──────────────────┐
    │ F11 Cancel Token  │  ← on cancel, triggers F12's waitlist notify (server-side, automatic)
    └─────────┬──────────┘
              ▼
    ┌──────────────────┐
    │ F12 Join Waitlist │  ← needs P0-5 resolved (broadcast size + timer) and F16 (FCM) to be
    │                   │     meaningfully different from a manual refresh
    └──────────────────┘

    ┌──────────────────────────────────────────┐
    │ F16 Push Notifications (FCM)              │  ← cross-cutting. F06, F09, F12 all degrade to
    │ F17 In-App Notification Inbox             │     manual-refresh-only without it. Should be
    └──────────────────────────────────────────┘     built EARLY, not treated as a late nice-to-have.

    ┌──────────────────────────────────────────┐
    │ F18 Data Deletion / Deactivation          │  ← depends only on F01 (needs a session) and P0-3
    └──────────────────────────────────────────┘     Independent of the booking chain entirely.

    ┌──────────────────────────────────────────┐
    │ Payment (display-only, Business-Rules §7) │  ← NOT a separate feature/endpoint — it's fields
    └──────────────────────────────────────────┘     already present on F07/F08's response (fee,
                                                       consultationFee) and F13's billing-adjacent
                                                       copy. No dependency risk, but do not build
                                                       a "Payment" screen/module — there isn't one.

    ┌──────────────────────────────────────────┐
    │ Analytics                                  │  ← not in F01–F19 at all. If needed for V1
    └──────────────────────────────────────────┘     (crash-free rate, funnel tracking per PRD
                                                       Section 7 Success Criteria), this is a
                                                       Firebase Analytics SDK integration task,
                                                       cross-cutting like F16, not a user-facing
                                                       screen — flag to founder if this was assumed
                                                       to be a mobile screen anywhere, it isn't one.
```

---

## Recommended Build Order (Phases)

### Phase 1 — Foundation (can start immediately, no backend blockers)
1. F15 Language Toggle (mandatory onboarding gate — build this first, everything else sits behind it in the nav stack per `07-Mobile-UX-Spec.md` S02)
2. F01 Login/OTP/Refresh — the 3 `/api/v1/auth/*` endpoints are fully Bearer-compatible today, no P0 blocker
3. F02/F03 Search + Filters — fully Bearer/public-compatible today, no P0 blocker
4. F04 Speciality List — static data, no dependency
5. F05 Doctor Profile — read-only, depends only on F02/F03's data shape

**Everything in Phase 1 can be built, connected to the real API, and demoed before any P0 backend
work lands** — this is deliberately the phase to start on Day 1.

### Phase 2 — Core transaction (needs P0-1 and P0-4 landed first)
6. F19 Consent Capture backend (P0-4) — do this before F07/F08's UI is wired to real data, even
   though the checkbox component itself can be built earlier
7. F07 Railway-Style Booking Preview
8. F08 Book Appointment
9. F14 Profile Edit — needed here because `needsProfile: true` from F01 routes new users through
   it before they can complete F08 in practice

### Phase 3 — Real-time layer (build F16 here, not later — it's load-bearing for Phase 4)
10. F16 Push Notifications (FCM) — device registration, foreground/background/killed handling
11. F17 In-App Notification Inbox
12. F06 Live Queue Status Badge — now can use FCM instead of building a throwaway polling version
13. F09 Token Tracking — same reasoning

### Phase 4 — Post-booking actions (needs P0-5 for F12 specifically)
14. F11 Cancel Token
15. F12 Join Waitlist — do not start the UI's "claim within N minutes" countdown component until
    P0-5 has settled on one real number
16. F10 My Bookings

### Phase 5 — Account management (independent, can slot in anywhere after F01)
17. F18 Data Deletion/Deactivation — needs P0-3's decision made first, otherwise the S16 screen
    is built against an assumption that might get reversed

---

## What can be parallelized vs. what can't

**Safe to parallelize across multiple developers/AI sessions:**
- Phase 1's five features have no interdependencies on each other beyond F15 gating the nav stack
- F16/F17 (Phase 3) can be built in parallel with Phase 2, since neither depends on the other —
  they only need to both be done before Phase 3's F06/F09 can use them
- P0-1 through P0-6 (backend) can all happen in parallel with Phase 1 mobile UI work

**Not safe to parallelize:**
- F19's backend (P0-4) must exist before F08 is connected to real data, even though F07/F08's UI
  can be storyboarded earlier
- F12's UI countdown timer should not be finalized until P0-5 picks one number — building it
  against "15 min" and then discovering the backend enforces something else is wasted work
- F06 and F09 should not be built as "FCM-ready" placeholders and then reworked later — build
  them against real FCM from the start (Phase 3), since a polling-only version is explicitly the
  thing `04-PRD.md` says mobile is upgrading away from (SSE was already flagged as
  background-unreliable; don't reintroduce the same problem with client-side polling as a
  stand-in)

---

## Screen → API → Model → Permission Matrix

This closes the checklist gap flagged in the readiness audit ("Is the API Mapping Matrix
complete"). One row per screen from `07-Mobile-UX-Spec.md`, cross-referenced against
`11-API-Contract.md` and `12-Backend-Spec.md`.

| Screen | API(s) called | Primary Model(s) touched | Permission |
|---|---|---|---|
| S01 Splash | none | none | none |
| S02 Language Selection | none (local state) | none | none |
| S03 Phone Login | `POST /api/v1/auth/send-otp` | none (SMS provider only) | public |
| S04 OTP Verification | `POST /api/v1/auth/verify-otp` | `User` (create if new) | public |
| S05 Home/Search | `GET/POST /api/v1/patient/search` | `Doctor` (read) | public |
| S06 Search Results | `GET/POST /api/v1/patient/search` | `Doctor` (read) | public |
| S07 Doctor Profile | doctor detail read (see Backend-Spec.md §1) | `Doctor` (read) | public |
| S08 Booking Confirmation | `POST /api/patient/book-appointment` **+ ConsentLog write (F19, not built)** | `QueueToken` (create), `DailyQueue` (update), `ConsentLog` (create — pending) | **patient session (Bearer) — currently blocked, see P0-1** |
| S09 Token Tracking | `GET /api/patient/bookings/stream` (needs Bearer + FCM rework) | `QueueToken` (read) | **patient session — blocked, P0-1** |
| S10 My Bookings | `GET /api/patient/my-bookings` | `QueueToken` (read, unbounded) | **patient session — blocked, P0-1** |
| S11 Cancel Confirmation | `POST /api/patient/queue/cancel-token` | `QueueToken` (update), waitlist entries (update, side effect) | **patient session — blocked, P0-1**; ownership-checked (403 if not yours) |
| S12 Waitlist Join | `POST /api/patient/queue/claim-waitlist` | `QueueToken` (create on win), waitlist entry (update) | **patient session — blocked, P0-1** |
| S13 Profile Edit | new endpoint (F14, not built) | `User` (update) | patient session (once built) |
| S14 Settings | none (local + logout) | none | patient session (for logout action) |
| S15 Notification Inbox | `GET /api/notifications`, `PATCH /mark-read`, `GET /unread-count` | `Notification` (read/update) | **patient session — blocked, P0-1** |
| S16 Data Deletion | `POST /api/patient/delete-data` **+ OTP verification (P0-3, not built)** | `User` (update isActive), `AuditLog` (create) | **patient session — blocked, P0-1** |

**Reading this table:** every row marked "blocked, P0-1" will compile and render fine, but will
fail against the real backend (401, since Bearer isn't accepted) until Phase 0 item P0-1 lands.
Build the UI now against this contract; don't wait for P0-1 to start screen development, per the
"safe to parallelize" note above.

---

*This plan assumes a solo founder + AI-driven development model per `04-PRD.md` Section 6
("Solo founder + AI-driven development = minimize moving parts"). Phase boundaries are dependency
boundaries, not time estimates — no calendar dates are implied.*
