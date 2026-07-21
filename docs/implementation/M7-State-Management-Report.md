# M7 — State Management Implementation Report

**Date:** 2026-07-20
**Branch:** `audit-prep`
**Milestone:** Sprint 0, Milestone 7 (State Management)

## Executive Summary

This milestone's instructions requested stores for 7 domains: Auth, Doctor, Booking, Queue,
Waitlist, Profile, Notification. Cross-checking `docs/engineering/Sprint-0-Engineering-Design.md`
against that list found **only 4 documented Zustand slices in the entire document** — `authStore`,
`languageStore`, `uiStore`, `bookingDraftStore` — matching Phase 0.7's own roadmap line exactly
("Scaffold `src/store/` (4 Zustand slices)"). Doctor, Queue, Waitlist, Profile, and Notification
have **zero** documented Zustand stores anywhere: Section 4's explicit rule — "React Query and
Zustand never duplicate the same data... If a value is fetched from the backend, it lives in
React Query's cache and nowhere else" — assigns all five domains' data to React Query, not
Zustand. Per this milestone's own "If a documented store does not exist, STOP instead of
inventing it" instruction, none of the five was built.

"Booking" resolves to the one documented Booking-adjacent slice, `bookingDraftStore` — narrowly
scoped to pre-confirm draft selection, not a general booking-history store (which is also
React-Query-owned). `languageStore` and `uiStore` were built even though neither literal name
appears in this milestone's 7-domain request, because both are genuinely documented, in-scope
Phase-0.7 slices — omitting them would under-deliver "the State Management layer" the Objective
section asked for while over-indexing on a domain-name list that doesn't fully match the actual
architecture.

All 4 stores communicate with Services (or Core) only, per the State Rules; none imports
`api/`, `repositories/`, `components/`, `hooks/`, or `app/`.

## Documentation Cross-Check (Read First)

Read only the two documents specified:

1. `docs/engineering/Sprint-0-Engineering-Design.md`
2. `docs/implementation/M6-Service-Foundation-Report.md`

No additional documentation was required — Section 4 (State Ownership) and Section 2's folder
tree fully specify all 4 stores' fields, persistence, and Service/Core touchpoints. The one gap
found (5 of 7 requested domains have no documented store) is reported above and in the design
doc's M7 status block, rather than worked around by inventing a store or fully halting the
milestone — the 4 stores that do exist are unambiguous and fully buildable.

## Files Created

| File | Exports |
|---|---|
| `src/store/authStore.ts` | `useAuthStore`, `AuthStoreState` |
| `src/store/languageStore.ts` | `useLanguageStore`, `Language`, `LanguageStoreState` |
| `src/store/uiStore.ts` | `useUiStore`, `UiStoreState`, `UiToast`, `UiBanner` |
| `src/store/bookingDraftStore.ts` | `useBookingDraftStore`, `BookingDraftStoreState` |
| `src/store/index.ts` | barrel — the only import path a future Feature/hook is meant to use |

## Files Modified

- `docs/engineering/Sprint-0-Engineering-Design.md` — added an M7 status block.
- `src/constants/storageKeys.ts` — added one new key, `AUTH_SESSION_CACHE`, for `authStore`'s
  persistence (additive only; no existing key changed).
- `src/store/.gitkeep` — deleted (folder now populated).

## Store Architecture

```
Feature / Hook (unbuilt)
   │  imports only from
   ▼
@/store   (4 independent Zustand slices — no factory, no cross-slice reads/writes)
   │
   ├─ authStore          → AuthService.logout()          + AsyncStorageAdapter (persist)
   ├─ languageStore       → AsyncStorageAdapter (persist)   [no Service — none exists to call]
   ├─ uiStore             → core/network's subscribeToConnectivity  [Core, not Service]
   └─ bookingDraftStore   → (no Service/Core dependency — pure ephemeral draft state)
```

Each store is created with `zustand`'s `create()`; `authStore`/`languageStore` additionally use
the `persist` + `createJSONStorage` middleware, backed by `core/storage`'s `AsyncStorageAdapter`
(Milestone 3) — never `SecureStoreAdapter`, per Rules SEC1–SEC3 (no token-shaped data is ever
persisted by a store).

## Store Ownership Matrix

| Store | Persistent State | Session State | UI State | Derived State |
|---|---|---|---|---|
| `authStore` | `isAuthenticated`, `user` (AsyncStorage, via `persist`) | — | — | — |
| `languageStore` | `language` (AsyncStorage, via `persist`) | — | — | — |
| `uiStore` | — | `isOnline` (resets each launch, fed by `core/network`) | `toasts`, `banners` (ephemeral queues) | — |
| `bookingDraftStore` | — | `doctorId`, `date`, `isEmergency`, `consentAccepted` (cleared via `reset()` on submit/unmount) | — | — |

No field is duplicated across two stores, and no store holds server-fetched data (doctor lists,
booking history, queue/waitlist/notification state) — that remains explicitly React Query's job
per Section 4, unaffected by this milestone.

## Service Dependencies

| Store | Service called | Why |
|---|---|---|
| `authStore` | `AuthService.logout()` | Clears `AuthService`'s in-memory token cache + `SecureStore` before this store clears its own session flag/user cache |
| `languageStore` | *(none)* | `SettingsService` (Section 7's documented owner of "language-toggle orchestration") was excluded from Milestone 6's 7-service list; `core/i18n` was never built (Milestone 3). Neither dependency exists, so `setLanguage()` only does what this store alone owns. |
| `uiStore` | *(none — Core only)* | `isOnline` is fed by `core/network`'s `subscribeToConnectivity` (Core layer, explicitly permitted alongside Services for the State layer) |
| `bookingDraftStore` | *(none)* | Pure pre-submit draft state; the actual `BookingService.book()` call is a future Feature-hook's job, per Section 4's own "...before `BookingService.book()` fires" phrasing |

## Public API Surface

```typescript
import {
  useAuthStore,
  useLanguageStore,
  useUiStore,
  useBookingDraftStore,
  type AuthStoreState,
  type LanguageStoreState,
  type Language,
  type UiStoreState,
  type UiToast,
  type UiBanner,
  type BookingDraftStoreState,
} from '@/store';
```

## Architecture Impact

- `src/store/` is now populated (previously `.gitkeep`-only).
- `eslint-plugin-boundaries`'s `store` element type (configured since M1, unused until now) is
  now exercised: `store → service/util/core` is allowed and used (`authStore` → `service`;
  `uiStore` → `core`); `store → api/repository/component/hook/app` was never attempted.
- `core/network/connectivity.ts`'s (Milestone 3) explicitly-deferred `uiStore` wiring is now
  closed.
- One new, additive `STORAGE_KEYS` entry (see Files Modified).

## Validation Results

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run lint` | ✅ 0 errors, 0 boundary violations (8 pre-existing warnings in `Input.tsx`/`OTPInput.tsx`, unrelated to this milestone) |
| `npm run format:check` | ✅ All files match Prettier style |
| `npx expo-doctor` | ⚠️ 1 pre-existing failure (`react-native-worklets`/`react-native-reanimated` version drift) — present since M1, unrelated |
| `npx expo export --platform android` | ✅ Bundled successfully (3459 modules — unchanged from M6, since nothing in `app/` imports `@/store` yet) |
| `npx expo export --platform ios` | ✅ Bundled successfully (3368 modules — unchanged from M6) |

## Build Status

Both Android and iOS Metro bundles exported successfully with no new errors or warnings. Module
counts are identical to M6's export, confirming no screen/UI code was touched.

## TypeScript Status

Clean — `npx tsc --noEmit` reports 0 errors across the whole project after this milestone's
changes.

## Lint Status

Clean — 0 errors, 0 `eslint-plugin-boundaries` violations. The 8 remaining warnings all pre-date
this milestone (unchanged from M6's report).

## Expo Status

`expo-doctor`: 19/20 checks pass. The 1 failure is the same `react-native-worklets`/
`react-native-reanimated` version-drift flagged identically in M1–M6's reports — not introduced
by this milestone.

## Remaining Risks

1. **Doctor, Queue, Waitlist, Profile, Notification have no client-state store at all.** If a
   future Feature layer needs any ephemeral, non-server-fetched UI state for these domains (e.g.
   a doctor-search filter draft, analogous to `bookingDraftStore`), no such slice exists yet and
   none should be invented without it first being documented, per this milestone's own rule.
2. **`authStore`'s persisted cache and `AuthService`'s in-memory token cache are two separate
   pieces of state that must stay in sync.** Nothing in this milestone wires app-startup
   rehydration of `AuthService`'s in-memory token from `SecureStore` — that bootstrap sequencing
   is `app/_layout.tsx`-level screen integration, out of this milestone's scope.
3. **`languageStore`/`uiStore` were built without an explicit go-ahead in the 7-domain list.**
   If the user's intent was strictly "only these 7 domains, nothing else," these two should be
   reverted; this report flags the decision prominently so it can be reviewed either way.

## Technical Debt

- `languageStore.setLanguage()` does not sync `core/i18n` (doesn't exist) or trigger any
  re-render of translated strings — purely a persisted preference flag until a future milestone
  builds the i18n layer `SettingsService` was meant to orchestrate.
- `uiStore`'s toast/banner shape (`{id, message}`) is deliberately minimal — neither is itemized
  beyond "toast queue, global banners" anywhere in the Engineering Design.
- No app-startup bootstrap wires `authStore`'s rehydrated `isAuthenticated` state back into
  `AuthService`'s in-memory access-token cache (see Remaining Risk #2).

## Rollback Plan

Revert this milestone's single commit. `src/store/` returns to `.gitkeep`-only, and
`storageKeys.ts` loses its one additive `AUTH_SESSION_CACHE` key. No other milestone's files are
touched, so no other milestone is affected by a revert.

## Ready For Review

**YES**
