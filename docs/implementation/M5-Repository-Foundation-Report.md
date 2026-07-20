# M5 — Repository Foundation Implementation Report

**Date:** 2026-07-20
**Branch:** `audit-prep`
**Milestone:** Sprint 0, Milestone 5 (Repository Foundation)

## Executive Summary

Built the Repository layer: one interface + `Http*`/`Mock*` implementation pair per domain, for
all 7 domains `docs/engineering/Sprint-0-Engineering-Design.md` Section 6 documents (`Auth`,
`Doctor`, `Booking`, `Queue`, `Waitlist`, `Notification`, `Profile`). Every method signature
matches Section 6's own interface code block exactly — no speculative methods were added.

Repositories are the **only** layer permitted to import `src/api/` (Milestone 4). 9 of the 13
documented methods call their exact, documented endpoint through `apiClient` and translate the
raw (envelope-specific, not blanket-parsed) response into a typed domain model. The remaining 4
methods throw a new, repository-scoped `NotImplementedError` in their `Http*` implementation,
because either no endpoint is documented at all, or (one case) the only documented endpoint uses
a transport `apiClient` cannot represent — see **Remaining Risks** below; this is the one
conflict this milestone's read-first instruction asked to be reported.

Section 6's repository method signatures reference domain types (`Doctor`, `QueueToken`,
`AuthTokens`, etc.) that did not exist anywhere in the codebase before this milestone and are
never itemized field-by-field in either source document. Six new files were added to
`src/types/` to satisfy this — three are complete (backed by an exact, itemized contract shape),
three are **deliberately partial** (see **API Types** below). No repository-level error
translation, generic CRUD abstraction, `BaseRepository`, or `RepositoryResult` type was built,
since none of these appear anywhere in the Engineering Design (Section 6's actual pattern has no
shared base class at all).

No business logic, validation rules, UI logic, or feature orchestration was implemented.
`consent/` and `lead/` (present in the repository folder scaffold since M1, but outside both this
milestone's explicit 7-domain list and Section 6's interface block) were left untouched.

## Documentation Cross-Check (Read First)

Read only the three documents specified:

1. `docs/engineering/Sprint-0-Engineering-Design.md`
2. `docs/implementation/M4-API-Foundation-Report.md`
3. `docs/11-API-Contract.md`

**No blocking conflict was found between the Engineering Design and the API Contract.**
Section 6's 7 repository interfaces (`AuthRepository`, `DoctorRepository`, `BookingRepository`,
`QueueRepository`, `WaitlistRepository`, `NotificationRepository`, `ProfileRepository`) match
the API Contract's F-groupings exactly, and the design doc itself already anticipates and flags
two of the four endpoint gaps found below (`WaitlistRepository.join`'s undocumented endpoint,
and F05's un-itemized doctor-detail endpoint).

One genuine tension was found and is flagged prominently rather than worked around silently:
Section 6 gives `QueueRepository.getTokenStatus(tokenId): Promise<QueueToken>` a one-shot,
Promise-based signature, but the API Contract's only documented F09 transport is a Server-Sent
Events stream (`GET /api/patient/bookings/stream`) — a persistent connection, not a single JSON
response. `ApiClient.request()` (Milestone 4) has no way to represent that as a
`Promise<QueueToken>`, and no simple polling GET is documented as an alternative. Per this
milestone's own "throw documented 'Not Implemented' placeholders" allowance, `getTokenStatus()`
throws `NotImplementedError` in `HttpQueueRepository` rather than fabricating a URL or
half-implementing SSE inside a Promise-shaped method. See **Remaining Risks**.

## Files Created

### `src/types/` (domain models Section 6's interfaces reference)

| File | Types | Completeness |
|---|---|---|
| `profile.ts` | `UserProfile` | Complete — matches `verify-otp`'s itemized `user` object |
| `auth.ts` | `SendOtpResult`, `VerifyOtpPayload`, `AuthTokens` | Complete — matches F01's itemized shapes |
| `doctor.ts` | `Doctor`, `DoctorSearchParams`, `DoctorSearchResult` | `Doctor` partial (see below); the other two complete |
| `booking.ts` | `CreateBookingPayload`, `QueueToken` | `CreateBookingPayload` complete; `QueueToken` partial (see below) |
| `waitlist.ts` | `WaitlistClaimResult` | Complete — matches F12's two itemized 200-status variants |
| `notification.ts` | `Notification` | Partial (see below) |

### `src/data/` (fixtures for `Mock*Repository`)

`authFixtures.ts`, `doctorFixtures.ts`, `bookingFixtures.ts`, `waitlistFixtures.ts`,
`notificationFixtures.ts`, `profileFixtures.ts` — one file per domain, each exporting static,
typed constants used only by that domain's `Mock*Repository`. The pre-existing
`src/data/mockDoctor.ts` (built before Sprint 0, typed as the UI-shaped `DoctorCardDoctor`) was
**not** touched or replaced.

### `src/repositories/shared/`

| File | Purpose |
|---|---|
| `mockDelay.ts` | Cancellable delay for `Mock*Repository` methods — the one genuinely-documented shared piece from Section 6 |
| `NotImplementedError.ts` | Thrown by an `Http*Repository` method with no documented (or no representable) endpoint |
| `assertSuccessResponse.ts` | Generic 2xx gate — throws `UnknownError` on non-2xx, otherwise returns `response.data` |
| `buildQueryString.ts` | Generic querystring builder for GET methods with filter params (`search`, `getInbox`) |
| `index.ts` | Barrel |

### `src/repositories/<domain>/` — ×7 (`auth`, `doctor`, `booking`, `queue`, `waitlist`, `notification`, `profile`)

Each domain has exactly 4 files: `<Domain>Repository.ts` (interface), `Http<Domain>Repository.ts`
(real implementation), `Mock<Domain>Repository.ts` (mock implementation), `index.ts` (barrel).
28 files total.

### `src/repositories/index.ts`

Top-level factory barrel — reads `FEATURE_FLAGS.USE_MOCK_DATA` (built ahead of time in M3) and
exports one ready-to-use instance per domain (`authRepository`, `doctorRepository`,
`bookingRepository`, `queueRepository`, `waitlistRepository`, `notificationRepository`,
`profileRepository`), plus re-exports every repository interface type. This is the only module a
future Service is meant to import from.

## Files Modified

- `docs/engineering/Sprint-0-Engineering-Design.md` — added an M5 status block.
- `src/repositories/{auth,booking,doctor,queue,waitlist,notification,profile}/.gitkeep` — deleted (folders now populated).

## Repository Architecture

```
Service (unbuilt)
   │  imports only from
   ▼
@/repositories  (factory barrel — reads FEATURE_FLAGS.USE_MOCK_DATA)
   │
   ├─ AuthRepository / DoctorRepository / BookingRepository / QueueRepository /
   │  WaitlistRepository / NotificationRepository / ProfileRepository   (interfaces)
   │
   ├─ Http<Domain>Repository   (implements interface, calls @/api's apiClient)
   └─ Mock<Domain>Repository   (implements interface, returns @/data fixtures)
```

Each `Http*Repository` method:

1. Calls `apiClient.request<RawShape>(documentedPath, method, { body, isPublic? })`.
2. Passes the response through `assertSuccessResponse()` (generic 2xx gate).
3. Extracts exactly the documented success-shape field(s) (e.g. `body.data.token`,
   `body.notifications`) and returns them as the domain type Section 6 declares.

No method branches on the *business* meaning of a response (no B6-code interpretation, no
message localization, no decision-making) — this is intentionally left to a future Service
layer, per Section 6's own "Repositories are data-shape translators, not decision-makers."

## Repository Contracts

Every interface below is copied, method-for-method, from
`docs/engineering/Sprint-0-Engineering-Design.md` Section 6:

```typescript
interface AuthRepository {
  sendOtp(phone: string): Promise<SendOtpResult>; // F01
  verifyOtp(payload: VerifyOtpPayload): Promise<AuthTokens>; // F01
  refresh(refreshToken: string): Promise<AuthTokens>; // F01
}

interface DoctorRepository {
  search(params: DoctorSearchParams): Promise<DoctorSearchResult>; // F02/F03
  getById(id: string): Promise<Doctor>; // F05
}

interface BookingRepository {
  create(payload: CreateBookingPayload): Promise<QueueToken>; // F08
  cancel(tokenId: string): Promise<void>; // F11
  getMyBookings(): Promise<QueueToken[]>; // F10
}

interface QueueRepository {
  getTokenStatus(tokenId: string): Promise<QueueToken>; // F09
}

interface WaitlistRepository {
  join(doctorId: string): Promise<void>;
  claim(doctorId: string): Promise<WaitlistClaimResult>; // F12
}

interface NotificationRepository {
  getInbox(): Promise<Notification[]>; // F17
  markRead(ids?: string[]): Promise<void>; // F17
  getUnreadCount(): Promise<number>; // F17
}

interface ProfileRepository {
  update(payload: Partial<UserProfile>): Promise<UserProfile>; // F14
  deactivate(): Promise<void>; // F18
}
```

## Repository Implementations

| Method | Http implementation | Reason |
|---|---|---|
| `AuthRepository.sendOtp/verifyOtp/refresh` | Real (`/api/v1/auth/*`) | Fully documented, flat responses |
| `DoctorRepository.search` | Real (`/api/v1/patient/search`) | Fully documented, flat response |
| `DoctorRepository.getById` | `NotImplementedError` | F05 endpoint not itemized in the API Contract |
| `BookingRepository.create/cancel/getMyBookings` | Real (`/api/patient/book-appointment`, `/api/patient/queue/cancel-token`, `/api/patient/my-bookings`) | Fully documented |
| `QueueRepository.getTokenStatus` | `NotImplementedError` | Only documented transport is SSE, incompatible with a one-shot `Promise` |
| `WaitlistRepository.join` | `NotImplementedError` | Design doc itself flags this endpoint as undocumented |
| `WaitlistRepository.claim` | Real (`/api/patient/queue/claim-waitlist`) | Fully documented, both 200-status variants handled by returning the raw inner `data` object |
| `NotificationRepository.getInbox/markRead/getUnreadCount` | Real (`/api/notifications`, `/api/notifications/mark-read`, `/api/notifications/unread-count`) | Fully documented |
| `ProfileRepository.update` | `NotImplementedError` | F14 endpoint not documented (same gap M4 flagged for `src/api/endpoints/profile/`) |
| `ProfileRepository.deactivate` | Real (`/api/patient/delete-data`) | Fully documented |

Every `Mock*Repository` returns a typed fixture from `src/data/` after an `mockDelay()`-simulated
latency, including for the 3 methods whose *real* transport doesn't exist yet — mocking those
doesn't require a real endpoint, so `MockDoctorRepository.getById` and
`MockProfileRepository.update` still throw/resolve consistently with their `Http*` counterpart's
documented gap (`getById` throws to match; `update`/`join`/`claim` resolve since a mock response
shape needs no real URL).

## API Types (`src/types/`)

Three types are **complete**, backed by a fully itemized contract shape:
`SendOtpResult`, `VerifyOtpPayload`, `AuthTokens` (F01), `UserProfile` (from `verify-otp`'s `user`
object), `WaitlistClaimResult` (F12's two itemized variants), `CreateBookingPayload` (F08's
request body), `DoctorSearchParams`/`DoctorSearchResult` (F02/F03's query params and response
envelope).

Three types are **deliberately partial** — built only from fields either document actually
confirms, flagged rather than guessed further:

- **`Doctor`** — `docs/11-API-Contract.md` describes F02/F03's doctor objects only as "shape
  from `mapPrismaDoctorToUI`," without itemizing fields. Built from the pre-existing
  `DoctorCardDoctor` UI type (`src/components/molecules/DoctorCard.tsx`), minus that type's
  UI-specific formatting (pre-formatted time strings, `QueueStatusBadgeStatus`) which belongs to
  presentation, not the domain model.
- **`QueueToken`** — every F08/F09/F10/F11/F12 section references `<QueueToken>` as a return
  shape without ever itemizing its fields. Only `id`/`status` are asserted (status is implied by
  every section's error/state language, e.g. "not in a cancellable state").
- **`Notification`** — F17's `GET /api/notifications` section describes its payload only as
  "`<Notification rows, newest first>`." Only `id` is asserted; a read-state field's existence is
  implied by `markRead`/`unread-count`, but its exact name is not documented.

## Endpoint Organization / Error Mapping

No new endpoint URLs were invented anywhere. Every real `Http*Repository` call site cites the
exact path from `docs/11-API-Contract.md` in a code comment or inline. No repository-level error
translation scheme is documented (no `RepositoryError`), so none was built beyond
`assertSuccessResponse()`'s generic 2xx gate — a thrown `NetworkError`/`ConfigurationError`/
`UnknownError` from the API Foundation (M4) propagates through a repository method unchanged;
interpreting *why* a call failed (the 13 B6 booking codes, bilingual messages) remains a
Service-layer concern for a future milestone.

## Architecture Impact

- `src/types/` went from a single unrelated file (`accessibility.ts`) to also holding the 7
  domains' core models — the folder's documented purpose ("Shared domain types... no functions,
  no classes with behavior") is unchanged; every new file is a plain interface.
- `src/data/` grew from one file to seven; all pre-existing exports (`MOCK_DOCTOR`) are
  untouched.
- `src/repositories/` is now populated (was `.gitkeep`-only scaffolding since M1).
- `eslint-plugin-boundaries`'s `repository` element type (already configured, unused until this
  milestone) is now exercised: `repository → api/util/core` is allowed; `repository → service/
  hooks/store/components/app` remains disallowed and was never attempted.

## Dependency Graph

```
repository → api    (apiClient, ApiResponse<T>)
repository → core   (AppError, UnknownError)
repository → types  (unclassified by boundaries — domain models)
repository → data   (unclassified by boundaries — Mock* fixtures)
repository → constants (unclassified by boundaries — FEATURE_FLAGS)
```

No `repository → service/hooks/store/components/app` import exists anywhere in the new code.

## Public API Surface

```typescript
import {
  authRepository,
  doctorRepository,
  bookingRepository,
  queueRepository,
  waitlistRepository,
  notificationRepository,
  profileRepository,
  type AuthRepository,
  type DoctorRepository,
  type BookingRepository,
  type QueueRepository,
  type WaitlistRepository,
  type NotificationRepository,
  type ProfileRepository,
} from '@/repositories';
```

No other module in this milestone imports a concrete `Http*`/`Mock*` file directly except each
domain's own `index.ts` and the top-level factory.

## Error Strategy

- Transport-level errors (`NetworkError`/`ConfigurationError`/`UnknownError`) are thrown by the
  API Foundation (M4) and propagate through repository methods unchanged.
- `assertSuccessResponse()` throws `UnknownError` for any non-2xx HTTP status, since no
  documented mapping from status/body to a specific error exists at this layer.
- `NotImplementedError` (new, repository-scoped, extends `AppError`) is thrown by the 4 methods
  with no representable real endpoint.
- No repository-specific error class was added to `core/errors` — Milestone 4's
  `NetworkError`/`ConfigurationError`/`UnknownError` remain the complete set there; this
  milestone's own instructions did not ask for a new Core Error type.

## Validation Results

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run lint` | ✅ 0 errors, 0 boundary violations (8 pre-existing warnings in `Input.tsx`/`OTPInput.tsx`, unrelated to this milestone) |
| `npm run format:check` | ✅ All files match Prettier style |
| `npx expo-doctor` | ⚠️ 1 pre-existing failure (`react-native-worklets`/`react-native-reanimated` minor/patch drift) — present since M1, unrelated to this milestone |
| `npx expo export --platform android` | ✅ Bundled successfully (3459 modules) |
| `npx expo export --platform ios` | ✅ Bundled successfully (3368 modules) |

## Build Status

Both Android and iOS Metro bundles exported successfully with no new errors or warnings.

## TypeScript Status

Clean — `npx tsc --noEmit` reports 0 errors across the whole project after this milestone's
changes.

## Lint Status

Clean — 0 errors, 0 `eslint-plugin-boundaries` violations. The 8 remaining warnings
(`react-native/no-inline-styles` in `Input.tsx`, `@typescript-eslint/array-type` +
`react-hooks/refs` in `OTPInput.tsx`) all pre-date this milestone.

## Expo Status

`expo-doctor`: 19/20 checks pass. The 1 failure is the same `react-native-worklets 0.11.1` (vs.
expected `0.10.0`) / `react-native-reanimated 4.5.2` (vs. expected `4.5.0`) drift flagged
identically in M1, M2, M3, and M4's reports — not introduced by this milestone.

## Remaining Risks

1. **`QueueRepository.getTokenStatus` has no working real implementation.** F09's only
   documented backend transport is SSE; the design's own Repository interface assumes a
   one-shot Promise. Whoever builds Sprint 1's real-time token tracking needs to either
   (a) get a polling-GET alternative documented and built, or (b) redesign this method's
   transport (e.g. an `onUpdate` callback/observable instead of a `Promise`) — a Repository
   *interface* change, which this milestone was told not to invent unilaterally.
2. **`Doctor`, `QueueToken`, `Notification` are partial types.** Extending them once the real
   backend field lists are confirmed will be a type-only, additive change (existing consumers
   using only the currently-declared fields won't break), but every place a future milestone
   destructures one of these needs to re-check field availability first.
3. **`DoctorRepository.getById` (F05) and `ProfileRepository.update` (F14) have no backend
   endpoint at all today** — both already flagged by M4's report for the equivalent `src/api/
   endpoints/` gap; this milestone surfaces the same two gaps one layer up.
4. **`WaitlistRepository.join`'s endpoint is undocumented** — flagged by the Engineering Design
   itself (Section 6, citing `15-Known-Gaps.md` §2.1), not newly discovered here.

## Technical Debt

- `Doctor`/`QueueToken`/`Notification`'s partial field lists (see Remaining Risks #2).
- No repository-level retry/caching/offline logic exists yet — explicitly out of this milestone's
  scope (React Query, a future milestone, is expected to own retry/caching at the Feature/State
  layer per Section 4).
- `assertSuccessResponse()`'s 2xx gate is a blunt instrument; once Services exist and need
  specific error codes (the 13 B6 booking codes), the Service layer will need its own
  status/body inspection on top of what a repository returns today.

## Rollback Plan

Revert this milestone's single commit. `src/types/`, `src/data/`, and `src/repositories/` return
to their pre-M5 state (an unrelated `accessibility.ts`, `mockDoctor.ts` only, and
`.gitkeep`-only scaffolding, respectively). No other milestone's files are touched by this
change, so no other milestone is affected by a revert.

## Ready For Review

**YES**
