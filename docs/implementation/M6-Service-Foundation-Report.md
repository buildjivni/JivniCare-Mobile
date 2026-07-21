# M6 — Service Foundation Implementation Report

**Date:** 2026-07-20
**Branch:** `audit-prep`
**Milestone:** Sprint 0, Milestone 6 (Service Foundation)

## Executive Summary

Built the Service layer for the 7 domains this milestone's instructions explicitly named:
`AuthService`, `DoctorService`, `BookingService`, `QueueService`, `WaitlistService`,
`NotificationService`, `ProfileService`. Each is a flat file under `src/services/` exporting a
`PascalCase` object literal implementing a hand-written `*ServiceContract` interface — matching
Section 6's own `BookingService` code example (a plain object, not a class) while also
satisfying this milestone's explicit "create interfaces and implementations" instruction.

`AuthService` was built feature-complete, per Section 5 item 4's explicit exception ("`AuthService`
is the one exception that must be feature-complete... before *any* other repository can go
'real'"): real token persistence via `core/storage`'s `SecureStoreAdapter`, an in-memory
access-token cache, and expiry-driven refresh scheduling. Every other service is intentionally
thin — mostly pass-through orchestration over Milestone 5's repositories — because most of
Section 7's richer, business-rule-labeled responsibilities (the 13 B6 codes, `dailyLimitContext`,
Rule C1's cancellable-state definition, the 2-session-limit rule) are defined in documents this
milestone was told not to read (`05-Business-Rules.md`, `10-UX-Writing-Guide.md`,
`15-Known-Gaps.md`), or depend on API-layer infrastructure (`ApiError.code`) that Milestone 4
explicitly left unbuilt. Every such gap is named individually below and in-code, rather than
guessed at.

`SettingsService` and `AnalyticsService` — present in Section 7's 8-row table — were **not**
built, since this milestone's own instructions list exactly 7 services and exclude both,
matching the same "the milestone's own explicit list wins" precedent M4 (endpoint folders) and
M5 (repository folders) already established.

No component, hook, store, or `app/` code was touched or imported.

## Documentation Cross-Check (Read First)

Read only the three documents specified:

1. `docs/engineering/Sprint-0-Engineering-Design.md`
2. `docs/implementation/M5-Repository-Foundation-Report.md`
3. `docs/11-API-Contract.md`

**No conflict was found between the Engineering Design and the Repository interfaces built in
M5** — every Service method built this milestone calls an existing, unmodified Repository method
by its exact M5 signature.

One scope gap, not a conflict, is flagged: Section 7's "Service Layer" table has no row for
`WaitlistService` at all, even though Section 4's Feature-hook table and this milestone's own
instructions both name it. It was built as a thin, rule-free pass-through — see **Business
Workflow Mapping** below — rather than treated as a blocker, since `WaitlistRepository` (M5)
already exists and gives it an unambiguous method surface to wrap.

## Files Created

### `src/services/`

| File | Exports |
|---|---|
| `AuthService.ts` | `AuthService`, `AuthServiceContract` |
| `DoctorService.ts` | `DoctorService`, `DoctorServiceContract` |
| `BookingService.ts` | `BookingService`, `BookingServiceContract` |
| `QueueService.ts` | `QueueService`, `QueueServiceContract` |
| `WaitlistService.ts` | `WaitlistService`, `WaitlistServiceContract` |
| `NotificationService.ts` | `NotificationService`, `NotificationServiceContract` |
| `ProfileService.ts` | `ProfileService`, `ProfileServiceContract` |
| `shared/generateRequestId.ts` | `generateRequestId` |
| `shared/index.ts` | barrel for `shared/` |
| `index.ts` | top-level barrel — the only import path a future Feature/hook is meant to use |

11 files total.

## Files Modified

- `docs/engineering/Sprint-0-Engineering-Design.md` — added an M6 status block.

## Service Architecture

```
Feature / Hook (unbuilt)
   │  imports only from
   ▼
@/services   (flat barrel — no factory needed; Services have no mock/real split of their own)
   │
   ├─ AuthService / DoctorService / BookingService / QueueService /
   │  WaitlistService / NotificationService / ProfileService
   │
   └─ each a plain object literal, calling one or more @/repositories instances
```

Unlike the Repository layer (interface + `Http*`/`Mock*` implementation pair, swapped by a
factory), Services have exactly one implementation each — the mock/real swap already happened
one layer down (Milestone 5's `src/repositories/index.ts`), so a Service simply calls whichever
repository instance that factory already resolved.

## Service Dependency Matrix

| Service | Repositories called | Sibling services called |
|---|---|---|
| `AuthService` | `authRepository` | — |
| `DoctorService` | `doctorRepository` | — |
| `BookingService` | `bookingRepository` | — |
| `QueueService` | `queueRepository`, `bookingRepository` | — |
| `WaitlistService` | `waitlistRepository` | — |
| `NotificationService` | `notificationRepository` | — |
| `ProfileService` | `profileRepository` | — |

`QueueService.cancel()` calling `bookingRepository` (not `queueRepository`) is intentional —
Section 6 places the real cancel endpoint on `BookingRepository`, but Section 4's Feature-hook
table (`useCancelBooking()`) assigns the business-rule-aware wrapper to `QueueService`. This is
the one legitimate cross-domain repository call in this milestone, permitted by "Services may
call multiple repositories." No Service calls a sibling Service this milestone (Section 19
permits it for genuinely business-rule-driven cross-domain flows, e.g. a future
`BookingService`↔`WaitlistService` same-specialty-suggestion flow per Rule W4 — not needed yet).

## Business Workflow Mapping

| Service method | Documented workflow | Built | Deferred (and why) |
|---|---|---|---|
| `AuthService.sendOtp` | F01 | Pass-through to repository | — |
| `AuthService.verifyOtp` | F01 | Repository call + persist tokens + schedule refresh | 2-session-limit error handling (Rules S1–S6, unread doc) |
| `AuthService.refresh` | F01, "30-min lifecycle" | Reads stored refresh token, repository call, re-persist, reschedule | — |
| `AuthService.getAccessToken` | Section 5's auth-attach interceptor read point | In-memory cache read | — |
| `AuthService.logout` | "clear session + caches" | Clears SecureStore + in-memory cache + timer | Clearing React Query's cache — Services must not depend on React Query; left to a future `useLogout()` hook |
| `DoctorService.search` | F02/F03 | Pass-through | 4-filter "shaping" — already 1:1 in `DoctorSearchParams` (M5), nothing to add |
| `DoctorService.getById` | F05 | Pass-through (still throws `NotImplementedError`) | `isLive`/`isClosed` derivation — Section 7 itself says "once backend fields exist"; they don't |
| `BookingService.book` | F08, Rule B3 | Pass-through + `requestId` generation if the caller didn't supply one | 13-code (Rule B6) mapping, `dailyLimitContext`, consent gating — see below |
| `BookingService.getMyBookings` | F10 | Pass-through | — |
| `QueueService.getTokenStatus` | F09 | Pass-through (still throws `NotImplementedError`) | Polling orchestration — no polling loop built on a method with no real transport yet |
| `QueueService.cancel` | F11 | Calls `bookingRepository.cancel` | Cancellable-state check (Rule C1, unread doc) |
| `WaitlistService.join` / `.claim` | F12 | Pass-through | Not documented in Section 7 at all (see above) |
| `NotificationService.getInbox` / `.markRead` / `.getUnreadCount` | F17 | Pass-through | FCM device-token registration (F16 not landed) |
| `ProfileService.update` | F14 | Read-only-phone validation + pass-through (still throws `NotImplementedError`) | Any validation beyond the phone-read-only rule (no F14 request schema exists to validate against) |

### Why the deferred items were deferred, specifically

- **13-code (Rule B6) error mapping (`BookingService`)** is blocked by two independent gaps: (1)
  the exact code→bilingual-string table lives in `05-Business-Rules.md`/`10-UX-Writing-Guide.md`,
  outside this milestone's read-first scope; (2) the `ApiError` class that would carry a `code`
  field to map *from* was explicitly left unbuilt by Milestone 4 (only transport-level
  `NetworkError`/`ConfigurationError`/`UnknownError` exist, none with a `code`). Building this
  now would mean inventing both the code table and the carrier type — squarely "never invent
  business rules."
- **`dailyLimitContext` disambiguation (`BookingService`)** is defined in `15-Known-Gaps.md`
  §2.2, not read this milestone.
- **Cancellable-state check, Rule C1 (`QueueService`)** — its state-machine definition lives in
  `05-Business-Rules.md`, not read this milestone.
- **2-session-limit-aware error handling (`AuthService`)** — Rules S1–S6's exact definition lives
  in `05-Business-Rules.md`, not read this milestone.
- **`isLive`/`isClosed` derivation (`DoctorService`)** — Section 7 itself flags this as
  conditional on backend fields that don't exist yet (`Doctor` in `src/types/doctor.ts` is a
  deliberately partial type per M5, with no live/closed source field).
- **Consent-checkbox gating (`BookingService`)** — F19 has no repository, endpoint, or backend at
  all (confirmed again in M5's report).
- **FCM device-token registration (`NotificationService`)** — Section 7's own phrasing, "once F16
  lands," confirms it hasn't.

## Repository Usage

Every repository call site uses the exact method signature Milestone 5 established — no new
repository methods were added or assumed. `authRepository`, `doctorRepository`,
`bookingRepository`, `queueRepository`, `waitlistRepository`, `notificationRepository`, and
`profileRepository` (all from `@/repositories`'s factory) are each called by exactly one Service,
except `bookingRepository`, which both `BookingService` and `QueueService` call (see Service
Dependency Matrix).

## Error Strategy

- No Service-level error translation scheme is documented (Section 3/user instructions: "only if
  documented"), so none was built beyond two narrow, mechanical validations that are explicitly
  named as this milestone's own Service responsibilities (not invented business rules):
  - `AuthService.refresh()` throws `ValidationError` if no refresh token is available (a basic
    precondition, not a named business code).
  - `ProfileService.update()` throws `ValidationError` if the caller attempts to change `phone`
    (Section 7's explicitly-named "read-only phone-field enforcement").
- Every other repository-thrown error (`NetworkError`, `ConfigurationError`, `UnknownError`,
  `NotImplementedError`) propagates through its calling Service method completely unchanged — no
  exception is ever caught and silently discarded anywhere in this milestone's code. The one
  `catch` in the codebase (`AuthService`'s background refresh timer) logs via `core/logger`
  rather than swallowing, since a background timer has no UI to surface an error to.

## Public API Surface

```typescript
import {
  AuthService,
  DoctorService,
  BookingService,
  QueueService,
  WaitlistService,
  NotificationService,
  ProfileService,
  type AuthServiceContract,
  type DoctorServiceContract,
  type BookingServiceContract,
  type QueueServiceContract,
  type WaitlistServiceContract,
  type NotificationServiceContract,
  type ProfileServiceContract,
} from '@/services';
```

## Architecture Impact

- `src/services/` is now populated (previously either absent or empty scaffolding).
- `eslint-plugin-boundaries`'s `service` element type (configured since M1, unused until now) is
  now exercised: `service → repository/util/core` is allowed and used; `service →
  components/hooks/store/app` was never attempted anywhere.
- No new dependency was added to `package.json`. `generateRequestId()` is a dependency-free
  `Math.random()`-backed UUID v4-shaped generator rather than pulling in a UUID library for one
  call site.

## Dependency Graph

```
service → repository   (authRepository, doctorRepository, bookingRepository, queueRepository,
                          waitlistRepository, notificationRepository, profileRepository)
service → core         (ValidationError, logger, SecureStoreAdapter)
service → constants    (STORAGE_KEYS — unclassified by boundaries)
service → types        (unclassified by boundaries — domain models)
service → service      (none used this milestone; permitted by Section 19 for future
                         business-rule-driven cross-domain flows)
```

No `service → component/hook/store/app` import exists anywhere in the new code.

## Validation Results

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run lint` | ✅ 0 errors, 0 boundary violations (8 pre-existing warnings in `Input.tsx`/`OTPInput.tsx`, unrelated to this milestone) |
| `npm run format:check` | ✅ All files match Prettier style |
| `npx expo-doctor` | ⚠️ 1 pre-existing failure (`react-native-worklets`/`react-native-reanimated` minor/patch drift) — present since M1, unrelated to this milestone |
| `npx expo export --platform android` | ✅ Bundled successfully (3459 modules — unchanged from M5, since nothing in `app/` imports `@/services` yet) |
| `npx expo export --platform ios` | ✅ Bundled successfully (3368 modules — unchanged from M5) |

## Build Status

Both Android and iOS Metro bundles exported successfully with no new errors or warnings. Module
counts are identical to M5's export, confirming no screen/UI code was touched.

## TypeScript Status

Clean — `npx tsc --noEmit` reports 0 errors across the whole project after this milestone's
changes.

## Lint Status

Clean — 0 errors, 0 `eslint-plugin-boundaries` violations. The 8 remaining warnings all pre-date
this milestone (unchanged from M5's report).

## Expo Status

`expo-doctor`: 19/20 checks pass. The 1 failure is the same `react-native-worklets`/
`react-native-reanimated` version-drift flagged identically in M1–M5's reports — not introduced
by this milestone.

## Remaining Risks

1. **`BookingService.book()` has no error-code mapping.** Until both `05-Business-Rules.md`'s
   13 B6 codes are read and an `ApiError`-with-`code` type exists (an M4-scope addition), any
   booking failure surfaces as a generic, unmapped error to whatever Feature layer calls this
   Service. This is the single biggest gap blocking a real booking UX from being built on top of
   this milestone's work.
2. **`QueueService.cancel()` performs no cancellable-state check.** A future caller can attempt
   to cancel a token in a non-cancellable state; the backend is the only current source of truth
   for rejecting that, not this Service.
3. **`AuthService`'s refresh scheduling is process-lifetime only.** If the app is killed and
   relaunched, the scheduled `setTimeout` is lost; nothing in this milestone re-reads persisted
   tokens and re-schedules a refresh at app startup — that wiring belongs to a future
   `app/_layout.tsx`-level bootstrap (screen integration, out of this milestone's scope).
4. **`WaitlistService` has no Section 7 documentation to verify against.** Its thin pass-through
   shape is defensible given the Repository layer's own shape, but if `05-Business-Rules.md`
   documents specific Waitlist business rules (Rule W-series) that were never surfaced to this
   milestone, this Service will need revisiting once that content is read.

## Technical Debt

- Every "deferred" item listed in **Business Workflow Mapping** is technical debt by
  construction — each is a named Section 7 responsibility not yet built, tracked here rather
  than silently dropped.
- `ProfileRepository.deactivate()` (F18) has no Service caller at all yet, pending a future
  `SettingsService` milestone.
- No unit tests were added for any Service (out of this milestone's explicit scope, but Section
  17 documents Services as the layer most suited to pure-function-style unit testing once tests
  are in scope).

## Rollback Plan

Revert this milestone's single commit. `src/services/` returns to its pre-M6 state (empty/absent).
No other milestone's files are touched by this change (only the Engineering Design's status
block is modified, itself purely additive), so no other milestone is affected by a revert.

## Ready For Review

**YES**
