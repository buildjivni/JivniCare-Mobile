# JivniCare Mobile — Sprint 0 Engineering Design Document

**Status:** DRAFT — for founder/engineering review. **Implementation is NOT yet approved.**
**Author:** AI Engineering Audit (Sprint 0 planning pass)
**Date:** 2026-07-20
**Revision:** v1.1 — added Section 23 (Layer Dependency Graph), Section 24 (Feature Dependency
Matrix), Section 25 (End-to-End Data Flow Diagrams), Section 26 (Definition of Done per Sprint 0
task), and Section 27 (Sprint 0 Readiness Score & Remaining Blockers), per review feedback. No
change was made to Sections 1–22 (v1.0) — this revision is purely additive.
**Type:** Architecture design only — **no source code was written or modified to produce this
document, in v1.0 or this v1.1 revision.** Every recommendation below is a blueprint for the next
development phase, not a description of work already done.

**Source-of-truth priority used while writing this document** (per `02-Source-of-Truth.md`
Section 1):

1. `/docs` (PRD, Business Rules, API Contract, Backend Spec, Mobile UX Spec, Design System,
   Component Library, UX Writing Guide, Feature Dependencies, Known Gaps, Source of Truth)
2. Existing mobile code (`app/`, `src/`) as of `audit-prep` branch, commit
   `df4085f11f8957d8cab72b98282360d0a3858b36`
3. `/docs/audit` (Architecture Audit `02.1`, UI/UX Compliance Audit `02.2`, Documentation
   Traceability Matrix `02.3`, Code Quality Audit `02.4`, Performance Audit `02.5`)

No business requirement in this document is invented — every rule, field, endpoint, and string
referenced below is cited to an existing doc or audit finding. Where this document proposes a
_technical_ pattern not yet specified anywhere (e.g. "use React Query"), it is presented as an
architectural recommendation for review, not a retroactive claim that it's already decided.

---

## 1. Executive Summary

### Current Architecture

The mobile codebase (as confirmed across all 5 audit reports in `/docs/audit`) is a **single-layer
Presentation scaffold**: 3 Expo Router screens (`app/index.tsx`, `app/doctor/[id].tsx`,
`app/booking/[id].tsx`) call directly into a well-built, atomic-design component library
(`src/components/{atoms,molecules,organisms}/`) that renders hardcoded mock data
(`src/data/mockDoctor.ts`). There is no state-management layer in use (Zustand is installed,
unused), no API/network layer, no service layer, no repository layer, no shared
hooks/utils/constants folders, no i18n, no navigation shell beyond a flat stack, and no test/lint
tooling.

### Architecture Problems (consolidated from `02.1`, `02.3`, `02.4`, `02.5`)

1. **No architectural seam exists for the features that are about to be built.** Every screen that
   doesn't exist yet (13 of 16) has no established pattern to follow for data-fetching, error
   handling, or state ownership — the first developer to build one will invent the pattern
   ad hoc unless one is designed now.
2. **No language architecture exists**, despite `04-PRD.md` F15 and `05-Business-Rules.md` Rule
   ACC6 both locking bilingual (Hindi + English) support as a _mandatory, launch-blocking_
   requirement. Every string in the app today is hardcoded English.
3. **No auth/session/token architecture exists**, despite `05-Business-Rules.md` Rules SEC1–SEC3
   locking Keychain/Keystore-only token storage as a security requirement.
4. **The one "core transaction" component built so far (`BookingWidget`) models a booking system
   (time slots) that contradicts the documented queue-token system** (`05-Business-Rules.md`
   Rules B1–B10, `11-API-Contract.md` F08) — this must be resolved architecturally, not just
   noted, before Sprint 1 booking work begins.
5. **Duplicated logic and hardcoded values** (phone validation implemented twice, the primary
   brand color hardcoded in 4+ files, a `DoctorCard` radius that doesn't match any design token)
   have no shared home to be consolidated into.
6. **No safety net** (ESLint, tests, CI, `ErrorBoundary`) exists to catch regressions as the team
   moves from a 3-screen scaffold to a 16-screen, multi-developer(-agent) build.

### Architecture Strengths (to preserve, not rebuild)

1. **Atomic Design layering is genuinely correct** — zero upward/lateral import violations found
   across all 10 existing components (`02.1` Section 7).
2. **Design token discipline for color is excellent** — `tailwind.config.js` is a verified 1:1 map
   of every color in `08-Design-System.md`.
3. **Accessibility props (`AccessibleProps`) are consistently applied** to every interactive
   component, and the one animation in the app correctly respects `prefers-reduced-motion`.
4. **Every deviation from spec found anywhere in the codebase is already self-documented** in code
   comments and/or `15-Known-Gaps.md` — an unusually strong "flag, don't guess" discipline that
   this design document explicitly builds on rather than overrides.
5. **TypeScript strictness is total**: zero `any`, zero compile errors, well-typed discriminated
   unions for error codes and statuses.

### Target Architecture

A **layered, feature-oriented architecture** with 10 explicit layers (Section 3), a **React
Query (server state) + Zustand (client state) split** (Section 4), a **Repository Pattern**
abstracting the documented API Contract behind swappable mock/real implementations (Section 6),
a **centralized theme/token module** eliminating hardcoded values (Section 8), a **route-grouped
Expo Router navigation shell** supporting auth-gating and a bottom tab bar (Section 9), and a
**first-class i18n architecture** built now, before more English-only strings accumulate
(Section 18).

### Reason for Proposed Architecture

Every choice below is justified by a documented requirement or an audit-confirmed gap, not by
generic "best practice" alone:

| Decision driver                                         | Source                                                                                                                                                                                                              |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server-state/client-state split (React Query + Zustand) | `04-PRD.md` Section 6 already names Zustand as the chosen state library; React Query is the natural pairing for the extensive server-state surface documented in `11-API-Contract.md` (18 endpoints across F01–F19) |
| Repository Pattern with mock/real swap                  | `14-Feature-Dependencies.md`'s own explicit guidance: "build UI now against the contract, wire later" — a repository interface is the mechanical way to do this without a rewrite                                   |
| i18n architecture built now                             | `04-PRD.md` F15 and `05-Business-Rules.md` Rule ACC6 lock bilingual support as mandatory; `02.3`/`02.4` both confirm zero i18n exists today — this is the highest-risk gap to leave until later                     |
| Route groups + protected routes                         | `09-Component-Library.md` Section 7's documented `AuthStack`/`MainTabs` hierarchy has no code equivalent yet; retrofitting after 16 screens exist is costlier than building it now with 3                           |
| Centralized theme/token module                          | `02.1`/`02.4` both independently found the same hardcoded-color problem (TD4) — a single module is the direct fix                                                                                                   |
| Secure token storage architecture designed now          | `05-Business-Rules.md` Rules SEC1–SEC3 are locked and currently unenforceable (no auth code exists to violate them yet, but none exists to satisfy them either)                                                     |

---

## 2. Folder Structure

```
jivnicare-mobile/
├── app/                              # PRESENTATION LAYER — Expo Router file-based routes only
│   ├── (auth)/                       # Public/unauthenticated route group
│   │   ├── _layout.tsx               # Auth stack layout (no tab bar)
│   │   ├── splash.tsx                # S01
│   │   ├── language.tsx              # S02 (mandatory, blocks everything below)
│   │   ├── phone-login.tsx           # S03
│   │   └── otp-verify.tsx            # S04
│   ├── (app)/                        # Protected route group — guarded by auth state
│   │   ├── _layout.tsx               # Auth guard + redirect-to-(auth) if unauthenticated
│   │   ├── (tabs)/                   # Bottom tab navigator
│   │   │   ├── _layout.tsx           # Tab bar definition (Home/Bookings/Notifications/Settings)
│   │   │   ├── index.tsx             # S05 Home
│   │   │   ├── bookings.tsx          # S10 My Bookings
│   │   │   ├── notifications.tsx     # S15 Notification Inbox
│   │   │   └── settings.tsx          # S14 Settings
│   │   ├── search.tsx                # S06 Search Results (pushed from Home, not a tab)
│   │   ├── doctor/[id].tsx           # S07 Doctor Profile
│   │   ├── booking/[id].tsx          # S08 Booking Confirmation
│   │   ├── token/[id].tsx            # S09 Token Tracking
│   │   ├── waitlist/[id].tsx         # S12 Waitlist Join
│   │   ├── profile-edit.tsx          # S13 Profile Edit
│   │   └── data-deletion.tsx         # S16 Data Deletion
│   ├── (modals)/                     # Modal-presentation route group
│   │   ├── filter-panel.tsx          # FilterPanel bottom sheet
│   │   └── cancel-confirmation.tsx   # S11 Cancel Confirmation
│   ├── _layout.tsx                   # Root layout: ThemeProvider, QueryClientProvider,
│   │                                  # LanguageProvider, ErrorBoundary, SafeAreaProvider
│   └── +not-found.tsx                # 404 fallback route
│
├── src/
│   ├── core/                         # CORE LAYER — zero-dependency foundational infrastructure
│   │   ├── theme/                    # ThemeProvider + all design tokens (Section 8)
│   │   ├── i18n/                     # LanguageProvider, string resources, t() hook (Section 18)
│   │   ├── storage/                  # SecureStore + AsyncStorage wrappers (never raw calls elsewhere)
│   │   ├── network/                  # NetInfo wrapper, connectivity singleton
│   │   ├── logger/                   # logger.ts (Section 14) — the ONLY sanctioned logging surface
│   │   └── config/                   # env/config loader (Section 11), feature flags
│   │
│   ├── api/                          # API LAYER — the ONLY layer allowed to call fetch/network
│   │   ├── client.ts                 # Base HTTP client (timeout, headers, base URL from core/config)
│   │   ├── interceptors/             # Auth-attach, envelope-normalize, 401-refresh, logging
│   │   ├── endpoints/                # One file per F-number group, matches 11-API-Contract.md exactly
│   │   ├── errors.ts                 # ApiError type + 13 B6 code taxonomy + generic fallback mapping
│   │   └── queryClient.ts            # React Query client + persister config (Section 4)
│   │
│   ├── repositories/                 # REPOSITORY LAYER — one interface + impl(s) per domain
│   │   ├── auth/
│   │   ├── doctor/
│   │   ├── booking/
│   │   ├── queue/
│   │   ├── waitlist/
│   │   ├── notification/
│   │   └── profile/
│   │       ├── <Domain>Repository.ts       # interface
│   │       ├── Http<Domain>Repository.ts   # real implementation (calls src/api)
│   │       └── Mock<Domain>Repository.ts   # mock implementation (uses src/data fixtures)
│   │
│   ├── services/                     # SERVICE LAYER — business orchestration, zero React/RN imports
│   │   ├── AuthService.ts
│   │   ├── DoctorService.ts
│   │   ├── BookingService.ts
│   │   ├── QueueService.ts
│   │   ├── NotificationService.ts
│   │   ├── ProfileService.ts
│   │   ├── SettingsService.ts
│   │   └── AnalyticsService.ts
│   │
│   ├── features/                     # FEATURE LAYER — domain-scoped hooks + view-models
│   │   ├── auth/hooks/                       # useAuth, useSendOtp, useVerifyOtp
│   │   ├── search/hooks/                     # useDoctorSearch, useSpecialtyFilter
│   │   ├── doctor-profile/hooks/              # useDoctorProfile
│   │   ├── booking/hooks/                     # useBookingFlow, useConsent
│   │   ├── queue/hooks/                       # useQueueStatus, useTokenTracking
│   │   ├── waitlist/hooks/                    # useWaitlist
│   │   ├── my-bookings/hooks/                 # useMyBookings, useCancelBooking
│   │   ├── notifications/hooks/               # useNotificationInbox
│   │   ├── profile/hooks/                     # useProfileEdit
│   │   └── settings/hooks/                    # useSettings, useLanguageToggle, useLogout
│   │
│   ├── store/                        # STATE LAYER (client state only — see Section 4)
│   │   ├── authStore.ts              # isAuthenticated, user profile cache (NEVER the raw token)
│   │   ├── languageStore.ts          # 'hi' | 'en', persisted
│   │   ├── uiStore.ts                # isOnline, toast queue, global banners
│   │   └── bookingDraftStore.ts      # ephemeral in-progress booking selection (pre-confirm)
│   │
│   ├── components/                   # COMPONENT LAYER — pure presentation, per Atomic Design
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   ├── templates/                # NEW — ScreenContainer, AuthScreenTemplate, ListScreenTemplate
│   │   ├── layout/                   # Header, BottomTabBar, ScreenWrapper
│   │   ├── animation/                # FadeIn, SlideUp, Shake, Pulse (Reanimated-backed)
│   │   └── utility/                  # ErrorBoundary, NetworkStatus, Toast, ConfirmationDialog
│   │
│   ├── hooks/                        # Cross-cutting hooks NOT tied to one feature (Section 10)
│   ├── utils/                        # UTILITY LAYER — pure functions, zero React/RN imports (Section 12)
│   ├── constants/                    # Section 11
│   ├── types/                        # Shared domain types (doctor.ts, booking.ts, api.ts, queue.ts, ...)
│   └── data/                         # Mock fixtures ONLY — never imported outside Mock*Repository files
│
├── assets/                           # unchanged — brand assets (see 08.1-Brand-Assets.md)
├── docs/                             # unchanged — documentation set + /audit + /engineering
├── __tests__/                        # NEW — cross-cutting integration tests (Section 17)
└── e2e/                              # NEW (future) — Detox/Maestro E2E specs (Section 17)
```

### Folder Responsibilities & Restrictions

| Folder              | Responsibility                                                                                            | NOT allowed inside it                                                                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`              | Route registration, screen composition (assemble Templates + Features), navigation params                 | Business logic, direct `fetch`/API calls, Zustand store definitions, raw styling beyond layout composition, mock data imports                                         |
| `src/core/`         | Foundational, app-wide infrastructure with **zero** dependency on any other `src/` folder except `utils/` | Feature-specific logic, API endpoint knowledge, React Query, Zustand stores                                                                                           |
| `src/api/`          | HTTP transport, request/response shape, auth-header attachment, envelope normalization                    | Business rules (e.g. deciding _which_ error message to show), UI, Zustand/React Query hook definitions                                                                |
| `src/repositories/` | Translating API responses into domain-typed data; the mock/real swap point                                | Business rules beyond data-shape mapping, UI, direct Zustand access                                                                                                   |
| `src/services/`     | Business orchestration, business-rule application (13 B6 codes, cancellable-state checks, etc.)           | React/React Native imports, JSX, direct `fetch` calls (must go through a Repository), Zustand/React Query hook calls                                                  |
| `src/features/`     | React Query/hook composition per domain, screen-agnostic view-model logic                                 | Cross-feature imports (a `booking` feature must not import from `search`'s internals — share via `components`/`utils`/`types` instead), raw `fetch` calls             |
| `src/store/`        | Zustand slices for **client state only** (Section 4)                                                      | Server data (doctor lists, booking history — that's React Query's job), raw tokens (Keychain/Keystore only)                                                           |
| `src/components/`   | Presentation — receives data via props, renders UI, calls callback props on interaction                   | API calls, Zustand/React Query hooks (aside from `core/theme`'s `useTheme()` and `core/i18n`'s `t()`), business-rule branching beyond simple prop-driven conditionals |
| `src/hooks/`        | Framework-level reusable hooks with no domain knowledge (`useDebounce`, `useNetworkStatus`)               | Domain-specific logic (that belongs in `src/features/<domain>/hooks/`)                                                                                                |
| `src/utils/`        | Pure, framework-agnostic helper functions                                                                 | React/React Native imports, side effects, network calls                                                                                                               |
| `src/constants/`    | Static configuration values, enums, lookup tables                                                         | Logic/functions beyond trivial lookups, environment secrets                                                                                                           |
| `src/types/`        | Shared TypeScript types/interfaces for domain models and API shapes                                       | Runtime code (no functions, no classes with behavior)                                                                                                                 |
| `src/data/`         | Mock fixtures for `Mock*Repository` implementations only                                                  | Direct imports from `app/` or `src/components/` (this is the exact pattern the Architecture Audit flagged — mock data must be repository-gated, not screen-imported)  |

---

## 3. Layered Architecture

### The 10 Layers

```
┌─────────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER  (app/)                                       │
│   ↓ composes                                                      │
│ TEMPLATE LAYER  (src/components/templates)                        │
│   ↓ composes                                                      │
│ COMPONENT LAYER  (src/components/{atoms,molecules,organisms,...}) │
└─────────────────────────────────────────────────────────────────┘
        ↑ props/callbacks only — never calls down past here
┌─────────────────────────────────────────────────────────────────┐
│ FEATURE LAYER  (src/features/<domain>/hooks)                      │
│   ↓ calls                                                         │
│ STATE LAYER  (React Query hooks + src/store Zustand slices)       │
│   ↓ (React Query's queryFn/mutationFn calls into)                 │
│ SERVICE LAYER  (src/services)                                     │
│   ↓ calls                                                         │
│ REPOSITORY LAYER  (src/repositories)                               │
│   ↓ calls                                                          │
│ API LAYER  (src/api)                                               │
└─────────────────────────────────────────────────────────────────┘
        ↕ everyone may call down into
┌─────────────────────────────────────────────────────────────────┐
│ UTILITY LAYER  (src/utils)   |   CORE LAYER  (src/core)            │
│ (both are "leaf" layers — nothing above depends on their internals,│
│  they depend on nothing above them)                                │
└─────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer        | Responsibility                                                                                                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Presentation | Route registration, screen-level composition, reading navigation params, delegating everything else to Templates/Features                                                                                                          |
| Template     | Reusable screen skeletons (e.g. `ScreenContainer` wrapping the currently-copy-pasted `ScrollView` + `px-4 py-6` pattern found in `02.1`/`02.4`; `ListScreenTemplate` standardizing loading/empty/error/offline slotting)           |
| Component    | Pure, prop-driven UI — the existing atomic-design library, extended with Templates/layout/animation/utility components per `09-Component-Library.md`'s full inventory                                                              |
| Feature      | Domain-scoped hooks that compose React Query + Zustand + Services into a screen-ready API (e.g. `useDoctorSearch()` returns `{results, isLoading, error, loadMore}`)                                                               |
| Service      | Business-rule orchestration on top of Repositories — e.g. `BookingService.book()` calls `BookingRepository.create()`, then maps a thrown 13-code error to the correct `UX-Writing-Guide.md` string and decides `dailyLimitContext` |
| Repository   | Data-access abstraction; converts API responses to domain types; the mock/real swap boundary                                                                                                                                       |
| API          | HTTP transport, auth headers, timeouts, envelope normalization, request cancellation                                                                                                                                               |
| State        | React Query (server state) + Zustand (client state) — see Section 4 for the full ownership split                                                                                                                                   |
| Utility      | Pure helper functions (formatting, validation, date/phone/queue math) with zero side effects                                                                                                                                       |
| Core         | Theme, i18n, secure storage, network detection, logging, config — foundational, imported by everything, imports nothing feature-specific                                                                                           |

### Dependency Rules

**Allowed direction (top calls down, never the reverse):**

```
Presentation → Template → Component → Core/Utility
Presentation → Feature → State → Service → Repository → API → Core/Utility
Feature → Component (for feature-specific composite views, if any)
Any layer → Core, Utility  (leaf layers, always allowed)
```

**Forbidden direction:**

- Component → Feature / Service / Repository / API (components must stay prop-driven; if a
  component "needs data," the screen/feature above it must fetch and pass it down)
- Service → Component / Feature / Presentation (Services must never import React/React Native)
- Repository → Service / Feature / Component / Presentation
- API → Repository / Service / Feature / Component / Presentation
- Utility → anything above it (Utility must never import React Native, Zustand, or React Query)
- Core → Feature / Service / Repository / API (Core is foundational; it cannot know about domain
  concepts like "a doctor" or "a booking")
- **Feature → Feature** (cross-feature imports are forbidden; two features that need to share
  logic must lift that logic into `utils/`, `types/`, or a shared hook in `src/hooks/`)
- `src/data/` (mock fixtures) → anything outside `Mock*Repository` implementations

This mirrors and formalizes the one dependency rule the current codebase already gets right
(components never import from `app/`) and extends it to every new layer being introduced.

---

## 4. State Management Design

### State Ownership Table

| State type                              | Owner                                                                                             | Persisted?                                                        | Example                                                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Server state (remote data)              | **React Query**                                                                                   | Query cache only, optionally persisted 7 days per Rule O1         | Doctor search results, doctor profile, my-bookings list, notification inbox, queue/token status |
| Auth session flag                       | **Zustand** (`authStore`)                                                                         | Yes — `isAuthenticated`/user-profile-cache only, via AsyncStorage | `{ isAuthenticated: boolean, user: PublicUserProfile                                            | null }` |
| Raw tokens (access/refresh)             | **Neither** — `expo-secure-store` only, accessed exclusively through `AuthService`/`core/storage` | Yes — Keychain/Keystore                                           | Per Rule SEC1–SEC3, tokens must NEVER enter Zustand/AsyncStorage/React Query cache              |
| Language preference                     | **Zustand** (`languageStore`)                                                                     | Yes — AsyncStorage (non-sensitive, per S02's rule carve-out)      | `'hi' \| 'en'`                                                                                  |
| Network connectivity                    | **Zustand** (`uiStore`)                                                                           | No                                                                | `isOnline: boolean`, fed by a `core/network` NetInfo listener                                   |
| Toast/banner queue                      | **Zustand** (`uiStore`)                                                                           | No                                                                | Ephemeral UI notifications                                                                      |
| In-progress booking draft (pre-confirm) | **Zustand** (`bookingDraftStore`)                                                                 | No (cleared on submit/unmount)                                    | Selected doctor + consent-checkbox state before `BookingService.book()` fires                   |
| Ephemeral component state               | **Local `useState`**                                                                              | No                                                                | Form input values, focus/pressed visual flags, animation triggers                               |

**Rule: React Query and Zustand never duplicate the same data.** If a value is fetched from the
backend, it lives in React Query's cache and nowhere else — Zustand never holds a second copy of
"the current doctor list," even as a convenience cache, to avoid the two-sources-of-truth bugs
this split is specifically designed to prevent.

### React Query Configuration

- **Query key factory** (`src/constants/queryKeys.ts`): namespaced, hierarchical keys —
  `['doctors', 'search', params]`, `['doctors', 'detail', id]`, `['bookings', 'my-bookings']`,
  `['queue', 'token', tokenId]`, `['notifications', 'inbox']` — enabling targeted invalidation.
- **`staleTime`/`gcTime` per domain volatility:**
  | Data                  | staleTime        | Rationale                                                                         |
  | --------------------- | ---------------- | --------------------------------------------------------------------------------- |
  | Doctor search results | 60s              | Matches `05-Business-Rules.md` Section 12's own `s-maxage=60` cache-header intent |
  | Doctor profile        | 5 min            | Changes infrequently (verification status, fee)                                   |
  | Queue/token status    | 0 (always stale) | Driven by 30s polling + FCM invalidation per Rule Q9/F09                          |
  | My Bookings           | 30s              | Balances freshness against the unbounded-payload cost flagged in `02.5`           |
  | Notification inbox    | 30s              | Matches the documented 30s background-refresh cadence (Rule O4)                   |
- **Offline persistence:** `@tanstack/query-async-storage-persister` (or equivalent) persists the
  query cache to AsyncStorage with a 7-day max age, directly implementing Rule O1 ("Cache last-known
  state locally... Cache duration: 7 days").
- **Mutations never persisted, never auto-retried:** every `useMutation` (book, cancel, claim
  waitlist, profile save, deactivate) is configured with `retry: false` and is NOT included in the
  persisted cache — implementing Rule O2 exactly ("NO auto-retry, optimistic UI update, explicit
  [Retry] button on failure").

### Zustand Configuration

- One slice per concern (`authStore`, `languageStore`, `uiStore`, `bookingDraftStore`) rather than
  one monolithic store — keeps `02.1`'s "state ownership" clarity intact as more slices are added.
- Persistence via Zustand's `persist` middleware backed by AsyncStorage for `languageStore` (and
  the non-token parts of `authStore`) — **never** for anything token-shaped, per Rule SEC1.
- Selectors used for any derived value (e.g. `useIsBookingBlocked()`) rather than components
  subscribing to the whole store, to avoid unnecessary re-renders as more slices are added.

### Data Flow (example: Doctor Search)

```
S06 screen (Presentation)
  → useDoctorSearch(filters)                         [Feature hook]
    → useQuery({ queryKey: ['doctors','search',filters], queryFn })  [State layer]
      → DoctorService.search(filters)                [Service layer]
        → DoctorRepository.search(filters)            [Repository layer]
          → api.get('/v1/patient/search', params)     [API layer]
            → fetch() → backend
          ← raw flat JSON response (per 11-API-Contract.md's documented shape)
        ← normalized DoctorSearchResult[] (typed, per src/types/doctor.ts)
      ← cached in React Query, exposed as { results, isLoading, error, hasMore }
  ← S06 renders DoctorCard list via FlatList (Section 15)
```

### Cache Invalidation Rules

- On successful `BookingService.book()` → invalidate `['bookings','my-bookings']` and
  `['doctors','detail', doctorId]` (queue counts shift).
- On successful `QueueService.cancel()` → invalidate the same two keys, plus `['queue','token',
tokenId]`.
- On successful `NotificationService.markRead()` → invalidate `['notifications','inbox']` and
  `['notifications','unread-count']`.
- On **logout** → clear the entire React Query cache AND all persisted Zustand slices except
  `languageStore` (language preference should survive logout, per its non-security-sensitive
  status) — implements Rule O4's "clear cache on logout."
- **Pull-to-refresh always bypasses `staleTime`** (`refetch({ throwOnError: false })` with a
  forced network request) — implements the several screens' documented "pull-to-refresh always
  fetches fresh" behavior (Rule O4).

### Offline Considerations

- `core/network`'s connectivity listener feeds `uiStore.isOnline`, which every screen's Template
  layer reads to decide whether to show the "Reconnecting..." banner (Rule O1) or fully disable
  write actions (Rule O2).
- React Query's `networkMode: 'offlineFirst'` (queries) serves cached data immediately when
  offline rather than showing a loading spinner indefinitely.
- Mutations use `networkMode: 'online'` (the default) so they fail fast and visibly rather than
  silently queuing — consistent with Rule O2's explicit rejection of write-op auto-retry as a
  duplicate-booking risk.

---

## 5. API Architecture

### API Client

A single `src/api/client.ts` wrapping the platform `fetch` API (no heavyweight HTTP library
needed at this endpoint count) with:

- Base URL sourced from `core/config` (environment-specific, never hardcoded)
- Default `Content-Type: application/json` header
- A configurable per-request timeout (default 10s, per `11-API-Contract.md` F01's own recommended
  client timeout)

### Authentication

- A request interceptor attaches `Authorization: Bearer <accessToken>` by reading from
  `AuthService`'s in-memory token cache (populated from `expo-secure-store` at app startup) —
  avoiding a SecureStore read on every single request.
- Public endpoints (send-otp, verify-otp, search, lead capture) explicitly opt out of the
  auth-header interceptor via an endpoint-level flag, since `11-API-Contract.md` confirms these
  require `Auth: none`.
- **This client-side design is correct regardless of the backend's current Blocker 1 state**
  (7 patient routes are cookie-only today, per `11-API-Contract.md`/`12-Backend-Spec.md`) — the
  mobile client always sends Bearer tokens per the locked platform decision; the backend catching
  up (`14-Feature-Dependencies.md` P0-1) is an external dependency tracked in Section 21's Risk
  Register, not a reason to design the client differently.

### Interceptors

| Interceptor                  | Responsibility                                                                                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Request: auth-attach         | Adds Bearer token (skipped for public endpoints)                                                                                                                                                                    |
| Request: idempotency-attach  | Generates and attaches a UUID `requestId` on every mutating POST that documents one (per Rule B3 — booking, and any future endpoint that adopts the same pattern)                                                   |
| Response: envelope-normalize | Converts both documented envelope shapes (flat vs. `{success,data}`, per `11-API-Contract.md`'s explicit warning that 4+ endpoints are flat) into one consistent `Result<T>` before it reaches the Repository layer |
| Response: 401-refresh        | On a 401, attempts one silent token refresh via `AuthService.refresh()` and replays the original request once; on refresh failure, clears the session and routes to `(auth)`                                        |
| Response: 429-surface        | Maps rate-limit responses to a typed `RateLimitError` carrying the retry-relevant context, for Services to turn into the correct UX-Writing-Guide copy ("Too many requests. Please wait.")                          |
| Response: dev-logging        | In development builds only, logs request/response pairs via `core/logger` (never raw `console.*` — see Section 14)                                                                                                  |

### Error Handling

A single `ApiError` class (in `src/api/errors.ts`) normalizes every failure mode:

```
ApiError {
  status: number;              // HTTP status
  code?: BookingErrorCode | OtpVerifyErrorCode | string;  // one of the documented named codes, if applicable
  message: string;             // server-provided or generic fallback
  retryable: boolean;          // false for all 4xx except 429; true for network/5xx
}
```

Services receive this typed error and are responsible for mapping `code` to the exact bilingual
string from `10-UX-Writing-Guide.md` — the API layer itself never renders or chooses user-facing
copy.

### Retry Policy

| Request type           | Policy                                                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET (idempotent reads) | 1 automatic retry on network failure only — **never** on 429/503 (per `11-API-Contract.md` F01's own explicit recommendation)                                                          |
| POST/PATCH (mutations) | **Zero** automatic retries (Rule O2) — always surfaced as an explicit `[Retry]` action the user taps, reusing the same `requestId` so a retried booking remains idempotent server-side |
| Refresh-token calls    | 0 automatic retries — a failed refresh always routes to re-login, never silently retries against a possibly-revoked token                                                              |

### Timeout Policy

- Default: 10s for all endpoints (matches F01's guidance)
- Overridable per-request for future higher-latency operations (e.g. profile-photo upload, not
  yet documented/built)
- Search requests: same 10s default — no special-casing needed given the documented `<2s` P95
  target in `04-PRD.md` Section 7

### Response Normalization

Each entry in `src/api/endpoints/` declares its own envelope shape (flat vs. wrapped) as
documented per-endpoint in `11-API-Contract.md` — the normalizer is **not** a single blanket
parser (the API Contract explicitly warns against this exact mistake), but a per-endpoint adapter
that always returns the same `Result<T>` shape to the Repository layer regardless of which raw
shape the backend used.

### Request Cancellation

- React Query automatically supplies an `AbortSignal` to every `queryFn`; `src/api/client.ts`
  threads this through to the underlying `fetch` call.
- For any manually-triggered call outside React Query (rare, but possible for one-off actions),
  Services use an explicit `AbortController` — directly closing the two unmount-safety gaps
  flagged in `02.4`/`02.5` (the Home and Booking screens' uncancelled `setTimeout`-based mocks).

### Future Backend Integration Strategy

1. Build every `Http*Repository` now, against the documented contract in `11-API-Contract.md` —
   do not wait for the 6 Phase-0 backend blockers (P0-1 through P0-6) to land.
2. Gate real-vs-mock repository selection behind one `core/config` flag
   (`USE_MOCK_DATA`), settable per-domain if needed (e.g. search could go "real" before booking,
   since search has no P0 blocker while booking needs P0-1).
3. Track each of the 6 Phase-0 items as an external dependency (Section 21) — the mobile
   architecture does not need to change once they land; only the config flag flips.
4. `AuthService` is the one exception that must be feature-complete (not just contract-shaped)
   before _any_ other repository can go "real," since every other domain requires a Bearer token.

---

## 6. Repository Pattern

### Repository Responsibilities

- The **only** layer permitted to import from `src/api/`.
- Converts raw, envelope-normalized API responses into typed domain models
  (`src/types/doctor.ts`, `booking.ts`, etc.) — Services never see a raw API response shape.
- Owns the mock/real implementation swap — this is the mechanical answer to
  `14-Feature-Dependencies.md`'s "build now, wire later" guidance.
- Does **not** apply business rules (e.g. "is this token cancellable" is a Service concern, not a
  Repository concern) — Repositories are data-shape translators, not decision-makers.

### Repository Interfaces (one per domain, matching `11-API-Contract.md`'s F-groupings)

```typescript
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
  join(doctorId: string): Promise<void>; // (join step — undocumented endpoint, see 15-Known-Gaps.md §2.1)
  claim(doctorId: string): Promise<WaitlistClaimResult>; // F12
}

interface AuthRepository {
  sendOtp(phone: string): Promise<SendOtpResult>; // F01
  verifyOtp(payload: VerifyOtpPayload): Promise<AuthTokens>; // F01
  refresh(refreshToken: string): Promise<AuthTokens>; // F01
}

interface NotificationRepository {
  getInbox(): Promise<Notification[]>; // F17
  markRead(ids?: string[]): Promise<void>; // F17
  getUnreadCount(): Promise<number>; // F17
}

interface ProfileRepository {
  update(payload: Partial<UserProfile>): Promise<UserProfile>; // F14 (endpoint not yet built — see Section 21)
  deactivate(): Promise<void>; // F18
}
```

### Repository Implementations

- `Http<Domain>Repository` — calls `src/api/endpoints/<domain>.ts`.
- `Mock<Domain>Repository` — returns fixtures from `src/data/`, with artificial latency (via a
  shared, cancellable `mockDelay(ms, signal)` utility — directly fixing the two uncancelled
  `setTimeout` patterns found in `02.4`) to keep loading-state UI honest during development.
- Selection: a small factory (`src/repositories/index.ts`) reads `core/config`'s `USE_MOCK_DATA`
  flag and exports the chosen implementation — Services import from this factory, never directly
  from a concrete `Http*`/`Mock*` file.

### How Services Consume Repositories

Simple module-level dependency (no DI container needed at this scale/team size):

```typescript
// src/services/BookingService.ts
import { bookingRepository } from '@/repositories';

export const BookingService = {
  async book(payload: CreateBookingPayload): Promise<QueueToken> {
    // business-rule layering happens here, not in the repository:
    // - decide dailyLimitContext (doctor-level vs patient-level, per 15-Known-Gaps.md §2.2)
    // - map thrown ApiError.code to the exact 10-UX-Writing-Guide.md string
    return bookingRepository.create(payload);
  },
};
```

### How UI Consumes Services

UI **never** imports a Service directly. The Feature layer's hooks are the only consumers:

```typescript
// src/features/booking/hooks/useBookingFlow.ts
export function useBookingFlow(doctorId: string) {
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => BookingService.book(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings', 'my-bookings'] }),
  });
}
```

The Booking screen (`app/(app)/booking/[id].tsx`) calls `useBookingFlow(id)` and renders based on
`{data, error, isPending}` — it never knows a Repository or Service exists.

### Future Scalability

- A future backend migration (e.g. splitting Search into its own service, or a GraphQL layer)
  requires only a new `Http*Repository` implementation satisfying the same interface — zero
  changes ripple upward into Service, Feature, or Component code.
- A future Doctor-side mobile app (`04-PRD.md` Section 1.2, "V1.1") could reuse every Repository
  interface as-is, since they're patient-app-agnostic data contracts — only the Service layer
  (business rules) and above would differ.

---

## 7. Service Layer

| Service               | Responsibilities                                                                                                                                                                                                    | Backing Business Rules / Features                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `AuthService`         | OTP send/verify orchestration, token refresh scheduling (30-min access token lifecycle), secure token persistence via `core/storage`, 2-session-limit-aware error handling, logout (clear session + caches)         | F01, Rules S1–S6, SEC1–SEC3                                                      |
| `DoctorService`       | Search parameter shaping (4-filter model), result mapping, profile fetch, `isLive`/`isClosed` presentational derivation (per Rule DA1–DA4, once backend fields exist)                                               | F02–F06, Business-Rules §16                                                      |
| `BookingService`      | 13-code (Rule B6) error mapping, `dailyLimitContext` disambiguation (per `15-Known-Gaps.md` §2.2), idempotent `requestId` generation, consent-checkbox gating (pending F19/P0-4)                                    | F07, F08, F19, Rules B1–B10                                                      |
| `QueueService`        | Token status polling orchestration (until FCM/F16 lands), cancellable-state check (Rule C1) before allowing a cancel action, cancellation-error mapping                                                             | F09, F11, Rules Q1–Q9, C1–C5                                                     |
| `NotificationService` | Inbox fetch, mark-read (single + bulk), unread-count badge sourcing, FCM device-token registration/unregistration (once F16 lands)                                                                                  | F16, F17, Rules N1–N11                                                           |
| `ProfileService`      | Profile edit validation, save orchestration (flags the F14 missing-endpoint gap rather than pretending it's wired), read-only phone-field enforcement                                                               | F14                                                                              |
| `SettingsService`     | Language-toggle orchestration (writes to `languageStore` + `core/i18n`), logout trigger, deactivation flow orchestration (OTP-gated per the locked Rule D3 decision, flags the P0-3 backend gap)                    | F15, F18, Rules D1–D7                                                            |
| `AnalyticsService`    | Thin wrapper interface over Firebase Analytics (per `04-PRD.md` Section 6's platform decision) — event-name constants, no-op until the SDK is actually added, designed now so call sites don't need to change later | Cross-cutting (PRD Section 7 Success Criteria: crash-free rate, funnel tracking) |

**Design constraint (repeated from Section 3 for emphasis): no Service file may import `react`,
`react-native`, `expo-router`, Zustand, or React Query.** Services are plain
TypeScript modules/objects returning Promises — this is what makes them independently unit-testable
(Section 17) without any component-rendering harness.

---

## 8. Theme Architecture

### Theme Provider

`src/core/theme/ThemeProvider.tsx` — a React Context exposing a `useTheme()` hook that returns the
full token set below. Even though only a light theme ships in V1 (dark mode is explicitly
out-of-scope for the patient app per `08-Design-System.md`'s note), the token object is structured
as `{ light: Tokens, dark: Tokens }` from day one with `dark` initially equal to `light` — this
means adding a real dark mode later (if ever needed) is a data change, not an architecture change.

### Design Tokens (single source of truth, `src/core/theme/tokens/`)

| File            | Contents                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Fixes                                                                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `colors.ts`     | Every hex value from `08-Design-System.md`'s Color Palette, Status Colors, and Badge System tables, as named JS constants (`PRIMARY`, `PRIMARY_DARK`, `SECONDARY`, `TEXT_TERTIARY`, etc.)                                                                                                                                                                                                                                                                                      | Directly eliminates the `#5696C7`/`#6B7280` duplication found in 4+ files by `02.1`/`02.4` — every `color` prop on an Icon/ActivityIndicator imports from here instead of re-typing a hex string |
| `typography.ts` | The 7-row Type Scale table (`hero`/`headline`/`title`/`bodyLarge`/`body`/`caption`/`tokenHero`) as named constants (size, lineHeight, weight)                                                                                                                                                                                                                                                                                                                                  | Closes the "typography not tokenized" gap from `02.1` Section 6                                                                                                                                  |
| `spacing.ts`    | `space-1` through `space-12` (4/8/12/16/20/24/32/48px) as named constants                                                                                                                                                                                                                                                                                                                                                                                                      | Formalizes the values the codebase already uses correctly but only as anonymous arbitrary Tailwind values                                                                                        |
| `radius.ts`     | `radius-sm/md/lg/xl/2xl/full` (8/12/16/24/32/9999px)                                                                                                                                                                                                                                                                                                                                                                                                                           | Would have caught `DoctorCard`'s 20px-vs-16px mismatch (`02.2`/`02.4`) at the type level once components are migrated to reference this file instead of a literal                                |
| `elevation.ts`  | `shadow-sm/md/lg/xl` shadow definitions, with the existing `Platform.OS === 'android' ? {elevation} : {shadow...}` branching pattern (already correctly used in `DoctorCard.tsx`) centralized into one helper                                                                                                                                                                                                                                                                  | Removes the need for every card-like component to re-implement the iOS/Android shadow branch                                                                                                     |
| `icons.ts`      | A re-export map of every Lucide icon name from `08-Design-System.md`'s Icon Library table, **including the 2 icons (`Circle`, `Users`) the UI/UX Audit found used-but-undocumented** — this file is also where a new icon must be registered before use, operationalizing that doc's own "do not introduce a new icon without adding it to the table" rule at the type level (importing an icon not in this map is a lint-catchable error once ESLint is added per Section 20) |

`tailwind.config.js` continues to exist for `className`-based styling but is regenerated **from**
`colors.ts` (a small build-time step, e.g. a script that reads the TS token file and writes the
Tailwind config's `theme.extend.colors` block) rather than maintained as a second, independent
source of the same values — eliminating the risk of the two ever drifting.

### Dark Mode Strategy

Not built for V1 (confirmed out of scope). The `{light, dark}` token structure above is the entire
"strategy" — a future toggle is a matter of populating `dark` with real values and wiring a
`colorScheme` preference into `ThemeProvider`, with zero consumer-component changes required,
since every component already reads colors via `useTheme()`/token imports rather than hardcoded
values.

### Brand Color Management

`colors.ts`'s `PRIMARY` constant (`#5696C7`) is the single source for the brand color everywhere —
Tailwind's `primary` class, every icon `color` prop, and any future native-side branding (splash
screen, app icon background) all reference this one constant or its Tailwind-generated equivalent.

### Eliminating Hardcoded Colors

A migration checklist (to be executed as part of Sprint 0, Section 20) for every file the Code
Quality Audit (`02.4`) flagged: `Input.tsx`, `Button.tsx`, `Avatar.tsx`, `DoctorCard.tsx`,
`Badge.tsx`, `QueueStatusBadge.tsx`, `WaitlistForm.tsx`, `BookingWidget.tsx`, `OTPInput.tsx` — each
gets its raw hex `color="#..."` props replaced with an import from `core/theme/tokens/colors.ts`.

---

## 9. Navigation Architecture

### Expo Router Structure

See the full tree in Section 2. Summary of the grouping strategy:

| Group          | Purpose                                                                                                                      | Guard                                                                                                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `(auth)`       | S01–S04 — Splash, Language, Phone Login, OTP Verification                                                                    | None (public) — but S02's "cannot skip, cannot go back" rule (per `07-Mobile-UX-Spec.md`) is enforced in this group's own `_layout.tsx`, not left to individual screens |
| `(app)`        | S05–S16 (minus S01–04, S02, S11)                                                                                             | Root-level guard in `(app)/_layout.tsx`: reads `authStore.isAuthenticated`; if false, `<Redirect href="/(auth)/phone-login" />` before rendering any child route        |
| `(app)/(tabs)` | S05, S10, S14, S15 — the 4 bottom-tab destinations per `09-Component-Library.md` Section 7's documented `MainTabs` hierarchy | Inherits the parent `(app)` guard                                                                                                                                       |
| `(modals)`     | S11 Cancel Confirmation, FilterPanel                                                                                         | Presented via Expo Router's modal `presentation: 'modal'` screen option; same auth guard inherited from being nested under the protected tree                           |

### Protected Routes

- The guard lives in exactly one place (`(app)/_layout.tsx`), not per-screen — this directly
  closes the gap `02.1` Section 3 flagged ("no protected routes... no navigation seam prepared for
  when login is added").
- The guard also checks `languageStore`'s selection state: if no language has ever been chosen,
  redirect to `(auth)/language` even from a deep link, since S02 is documented as mandatory for
  _first launch_, not just the login flow.

### Public Routes

`(auth)/*` and any future public marketing/webview routes (Terms, Privacy, Refund policy — linked
from S14 Settings per its spec) render without the auth guard.

### Deep Linking

| Link                                                    | Route                                                                                                                                 | Guard behavior                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `jivnicare.com/doctors/[slug]`                          | `(app)/doctor/[id]`                                                                                                                   | If unauthenticated, the `(app)` guard redirects to `(auth)`, then (once implemented) resumes to the original deep-linked doctor profile post-login — this "resume after login" behavior is a Sprint 0 architectural decision to make now (Section 22), even though S07 doesn't require auth to _view_ per `14-Feature-Dependencies.md`'s permission table (only booking does) |
| `jivnicare.com/token/[id]`                              | `(app)/token/[id]`                                                                                                                    | Requires auth                                                                                                                                                                                                                                                                                                                                                                 |
| `jivnicare.com/bookings`                                | `(app)/(tabs)/bookings`                                                                                                               | Requires auth                                                                                                                                                                                                                                                                                                                                                                 |
| `jivnicare.com/search?q=[query]`                        | `(app)/search`                                                                                                                        | Public (search itself requires no auth per `14-Feature-Dependencies.md`'s permission matrix)                                                                                                                                                                                                                                                                                  |
| Push: `booking_confirmed`/`token_called`/`queue_update` | `(app)/token/[id]`                                                                                                                    | Requires auth (implies the notification was for a logged-in session already)                                                                                                                                                                                                                                                                                                  |
| Push: `doctor_status`                                   | `(app)/doctor/[id]`                                                                                                                   | Public                                                                                                                                                                                                                                                                                                                                                                        |
| Push: `waitlist_claim`                                  | Claim action (not a screen — deep-links into an action handler, per S12's documented note that this is distinct from the join screen) | Requires auth                                                                                                                                                                                                                                                                                                                                                                 |
| Push: `system`                                          | `(app)/(tabs)/notifications`                                                                                                          | Requires auth                                                                                                                                                                                                                                                                                                                                                                 |

`scheme: "jivnicare"` (already present in `app.json`) plus Expo Router's `linking` config
implements both the universal-link and custom-scheme fallback paths documented in
`04-PRD.md` Section 1.1 ("Deep linking (Universal Links + `jivnicare://` fallback)").

### Future Scalability

- The `(app)`/`(auth)`/`(modals)` split is intentionally generic enough to host a future
  Doctor-side app's own route groups in a _separate_ Expo project (per PRD's explicit "doubles
  blast radius" reasoning for keeping it a separate app in V1.1) — this document does not design
  for a shared-app multi-role navigator, since the PRD explicitly rejects that shape.
- Adding a 17th screen is always "add one file under the correct existing group" — no structural
  navigation change is anticipated to be needed as the remaining 13 screens are built.

---

## 10. Hooks Strategy

### Cross-Cutting Hooks (`src/hooks/`)

| Hook                          | Responsibility                                                                                                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `useNetworkStatus()`          | Thin wrapper over `core/network`'s NetInfo listener + `uiStore.isOnline`                                                                                                                         |
| `useReducedMotion()`          | Wraps `AccessibilityInfo.isReduceMotionEnabled()` (currently duplicated inline in `OTPInput.tsx` only — this hook generalizes that correct pattern for the `animation/` components in Section 2) |
| `useDebounce(value, delayMs)` | Generic debounce, needed immediately for `SearchBar`'s documented 300ms debounce (`09-Component-Library.md` Section 3.1)                                                                         |
| `useKeyboardVisible()`        | For keyboard-aware layouts (S03/S04/S13 forms)                                                                                                                                                   |
| `useAppState()`               | Foreground/background/killed detection — needed for F16's FCM handling requirements                                                                                                              |

### Feature Hooks (`src/features/<domain>/hooks/`)

| Hook                              | Domain         | Responsibility                                                                                                                        |
| --------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `useSendOtp()` / `useVerifyOtp()` | auth           | Wrap `AuthService` calls in `useMutation`                                                                                             |
| `useAuth()`                       | auth           | Exposes `{isAuthenticated, user, logout}` from `authStore`                                                                            |
| `useDoctorSearch(filters)`        | search         | `useInfiniteQuery` over `DoctorService.search`, 15/page per Rule per Decision #17                                                     |
| `useDoctorProfile(id)`            | doctor-profile | `useQuery` over `DoctorService.getById`                                                                                               |
| `useBookingFlow(doctorId)`        | booking        | `useMutation` over `BookingService.book`, exposes the 13-code error already mapped to display copy                                    |
| `useQueueStatus(tokenId)`         | queue          | `useQuery` with a 30s `refetchInterval` fallback (until FCM invalidation replaces polling, per F09)                                   |
| `useCancelBooking()`              | my-bookings    | `useMutation` over `QueueService.cancel`, invalidates `my-bookings` + the specific token query                                        |
| `useWaitlist(doctorId)`           | waitlist       | Join + claim mutations over `WaitlistRepository`/`WaitlistService`                                                                    |
| `useMyBookings()`                 | my-bookings    | `useQuery` over `BookingService.getMyBookings`, with client-side Active/Past split (per S10's documented client-side-filter behavior) |
| `useNotificationInbox()`          | notifications  | `useQuery` + `useMutation` (mark-read) pair                                                                                           |
| `useProfileEdit()`                | profile        | Form-state + save mutation                                                                                                            |
| `useLanguageToggle()`             | settings       | Reads/writes `languageStore` + `core/i18n`                                                                                            |
| `useLogout()`                     | settings       | Clears `authStore`, React Query cache, SecureStore tokens                                                                             |

### Naming Convention

- Always `use<Noun>` or `use<Verb><Noun>`, never abbreviated (`useDoctorSearch`, not `useDocSrch`).
- One hook per file, file name matches hook name exactly (`useDoctorSearch.ts`).
- Hooks returning a single mutation are named for the action (`useCancelBooking`), not the noun
  alone, to disambiguate from a same-domain query hook (`useMyBookings` vs. `useCancelBooking`,
  both in the same feature folder).
- Feature hooks never leak Repository/Service types directly — they return screen-ready shapes
  (already-formatted strings, already-mapped error messages) so Presentation/Component layers
  never need to know about `ApiError` or a raw `QueueToken` shape.

---

## 11. Constants Strategy

| Constant group | File                             | Contents                                                                                                                                                                                                                                                                                                                 |
| -------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Routes         | `src/constants/routes.ts`        | Typed route-builder functions (`doctorRoute(id)`, `bookingRoute(id)`, `tokenRoute(id)`) — closes the `02.1` TD8 finding (untyped, duplicated route strings) even before Expo Router's `experiments.typedRoutes` is enabled                                                                                               |
| API config     | `src/constants/api.ts`           | Base URL per environment, default timeout (10s), the rate-limit table from `05-Business-Rules.md` Section 12 mirrored client-side for pre-emptive UX (e.g. disabling a button locally after N rapid taps, matching the server's own limit, rather than only reacting to a 429 after the fact)                            |
| Business rules | `src/constants/businessRules.ts` | `BOOKING_ERROR_CODES` (13 values, already exists in `BookingWidget.tsx` — promoted here for app-wide reuse), `CANCELLABLE_STATUSES` (Rule C1), `MAX_ACTIVE_TOKENS_PER_DAY = 3` (Rule B1), `WAITLIST_BROADCAST_SIZE`/`WAITLIST_CLAIM_WINDOW_MIN` (flagged with a comment citing the P0-5 backend-mismatch until resolved) |
| Specialties    | `src/constants/specialties.ts`   | The 30-item, 4-tier list from `04-PRD.md` F04 — does not exist anywhere in code today                                                                                                                                                                                                                                    |
| Storage keys   | `src/constants/storageKeys.ts`   | Named AsyncStorage/SecureStore key strings (`'auth.accessToken'`, `'settings.language'`) — prevents typo-based key mismatches across `core/storage` call sites                                                                                                                                                           |
| Query keys     | `src/constants/queryKeys.ts`     | The React Query key factory referenced in Section 4                                                                                                                                                                                                                                                                      |
| Feature flags  | `src/constants/featureFlags.ts`  | `USE_MOCK_DATA`, `ENABLE_TEST_OTP` (per `07-Mobile-UX-Spec.md` S04's `NEXT_PUBLIC_ENABLE_TEST_OTP`-equivalent for mobile), `ENABLE_ANALYTICS`                                                                                                                                                                            |

### Configuration Strategy

- Environment-specific values (API base URL, feature-flag defaults) are read via `expo-constants`
  from `app.config.ts` (a dynamic config file replacing the current static `app.json`, allowing
  `process.env.EXPO_PUBLIC_*`-driven values per environment) — never hardcoded inline.
- Per the existing `README.md`'s own "Environment Variables (names only)" section, only
  `EXPO_PUBLIC_`-prefixed variables are ever used client-side (Expo's own convention for
  client-safe env vars) — no secret ever ships in the client bundle, consistent with Section 16.

---

## 12. Utilities Strategy

| File                      | Responsibility                                                                                                                                                                                                | Consolidates / Replaces                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `src/utils/phone.ts`      | `digitsOnly()`, `isPhoneValid()` (`/^[6-9]\d{9}$/`), `maskPhone()`, `formatPhoneDisplay()` (`+91 98765 43210` per `10-UX-Writing-Guide.md` Section 21 Rule 5)                                                 | The 2 independent phone implementations in `WaitlistForm.tsx` and `OTPInputBox.tsx` (`02.1` TD3, `02.4`) |
| `src/utils/format.ts`     | `formatFee()` (`₹` + `en-IN` locale grouping), `initialsFromName()`, `formatTokenNumber()` (`#12`)                                                                                                            | The 2 private helpers currently trapped in `DoctorCard.tsx`                                              |
| `src/utils/validation.ts` | `isNameValid()`, generic field-length/required validators                                                                                                                                                     | The private validators in `WaitlistForm.tsx`                                                             |
| `src/utils/date.ts`       | Relative-time formatting (`"2 min ago"`, `"Today"`, `"Tomorrow"` per `10-UX-Writing-Guide.md` Section 21 Rule 3)                                                                                              | Nothing yet exists — new, but immediately needed by S15 Notification Inbox and S09 Token Tracking        |
| `src/utils/queue.ts`      | Client-side display helpers only (e.g. formatting `"{n} patients ahead"` pluralization per Rule 21.2) — explicitly NOT a reimplementation of server-authoritative queue logic (Rules Q1–Q9 stay backend-only) | New                                                                                                      |
| `src/utils/string.ts`     | `snakeCaseToTitleCase()` (generalizes the private `formatErrorCodeLabel` in `app/booking/[id].tsx`), `truncateWithEllipsis()` (per Rule 21.7 — "Dr. Rajesh Shar..." not "Dr. Rajesh S...")                    | The private helper in the Booking screen                                                                 |
| `src/utils/a11y.ts`       | `buildAccessibilityLabel()` helpers for the recurring "compose a full sentence label from several fields" pattern already done ad hoc in `DoctorCard`'s accessibility label construction                      | New, formalizes an existing good pattern                                                                 |

**Rule (restated from Section 3): every file in `src/utils/` must be a pure function with zero
React Native imports** — this is what allows 100% of this layer to be unit-tested with plain Jest,
no rendering harness, and is the highest-ROI place to start Sprint 0's testing rollout (Section 17).

---

## 13. Error Handling Strategy

| Error class                                        | Where caught                                                                            | User-facing treatment                                                                                                                                                                                                                                                         | Source                                               |
| -------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Global/unexpected** (uncaught render errors)     | `src/components/utility/ErrorBoundary.tsx`, wrapping the root `_layout.tsx`'s `<Stack>` | "Something went wrong" + `[Retry]`, per `09-Component-Library.md` Section 6.1 — **this component does not exist yet; building it is a Sprint 0 blocking task** (Section 20), since its absence means any single render error currently crashes the whole app with no recovery |
| **API errors (named codes)**                       | Service layer, via the `ApiError.code` taxonomy                                         | Exact bilingual string per the 13-row table in `10-UX-Writing-Guide.md` Section 6 (already correctly implemented for booking; the pattern generalizes to any future named-code endpoint)                                                                                      | `11-API-Contract.md`, `05-Business-Rules.md` Rule B6 |
| **API errors (generic 4xx/5xx)**                   | API layer's `ApiError`, Service-layer fallback                                          | "Something went wrong" + `[Retry]` (per Section 16's fallback string)                                                                                                                                                                                                         | `10-UX-Writing-Guide.md` Section 16                  |
| **UI/validation errors**                           | Component-local state (unchanged from today's pattern — this is already done well)      | Inline field-level error text, `accessibilityLiveRegion="polite"` per `09-Component-Library.md` Section 1.2                                                                                                                                                                   | Existing pattern, preserved                          |
| **Network/offline errors**                         | `core/network` + React Query's `networkMode`                                            | Offline banner (Rule O1) for reads; disabled action + explicit `[Retry]` for writes (Rule O2) — never silent auto-retry                                                                                                                                                       | `05-Business-Rules.md` §13                           |
| **Rate-limit (429) errors**                        | API layer's interceptor → `RateLimitError`                                              | "Too many requests. Please wait." (Section 16 string), with retry-after context surfaced if the response provides it                                                                                                                                                          | `05-Business-Rules.md` §12                           |
| **Auth/session errors (401 after failed refresh)** | `AuthService`                                                                           | Silent session clear + redirect to `(auth)/phone-login` — no error toast needed, since this is an expected lifecycle event (expired session), not a user-caused failure                                                                                                       | Rules S1–S6                                          |

**Design principle:** every error-handling site maps to a _specific, already-documented_ string —
this design deliberately does not introduce a generic catch-all "toast the raw error message"
pattern anywhere, since `10-UX-Writing-Guide.md`'s own principles (Section 1: "EMPATHETIC...
ACTIONABLE") require never doing that.

---

## 14. Logging Strategy

### Development Logging

- `src/core/logger/logger.ts` exports `logger.debug/info/warn/error(...)` — thin wrappers over
  `console.*` that are **stripped entirely from production builds** via a Babel plugin
  (`babel-plugin-transform-remove-console` or equivalent, configured for production profiles
  only) — preserving the codebase's current, genuinely good "zero raw `console.*` calls" baseline
  (`02.4`) by making the _logger_ the only sanctioned surface, and making even that surface a
  no-op in production.
- API request/response interceptor logging (Section 5) goes through this logger exclusively.

### Production Logging

- In production, `logger.error(...)` calls are forwarded to the crash-reporting SDK (below)
  instead of `console.error` — same call site, different backend, zero call-site changes needed
  when the SDK is added.
- **No PII is ever logged** — phone numbers, names, and tokens are explicitly excluded from any
  log call's arguments (enforced by code review checklist in Section 19, not by tooling at this
  stage).

### Analytics

- `AnalyticsService` (Section 7) wraps Firebase Analytics (per `04-PRD.md` Section 6's platform
  decision — "Firebase (free tier)... Zero cost, FCM integration"), with a typed event-name
  constant list (`src/constants/analyticsEvents.ts`) rather than free-text event strings scattered
  through feature code — e.g. `AnalyticsService.track('booking_confirmed', {doctorId})`.
- No SDK integration work is proposed as part of Sprint 0 itself (out of scope per the "no code"
  instruction for this document) — this section designs the _interface_ so feature code written
  during Sprint 1+ can call `AnalyticsService.track(...)` immediately, with the SDK wiring landing
  independently without any call-site rework.

### Crash Reporting Preparation

- `core/logger` and `AnalyticsService` are designed as the two integration points a future
  Sentry/Firebase Crashlytics SDK would hook into — `logger.error` forwards uncaught exceptions
  and the `ErrorBoundary` (Section 13) forwards render-time errors to the same sink.
- This satisfies `04-PRD.md` Section 7's "Crash-free rate: >99%" success criterion's _prerequisite_
  (you cannot measure a crash-free rate without a crash reporter) without requiring the SDK
  decision to be made in Sprint 0.

---

## 15. Performance Strategy

_(Directly operationalizes `02.5-Performance-Audit.md`'s findings — see that report for full
risk detail; this section is the corresponding action plan.)_

| Area                        | Strategy                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Images**                  | Adopt `expo-image` (near-drop-in `Image` replacement) in `Avatar.tsx` and the future clinic-photo-slider component before any real `profilePhoto` URL is wired in — gets memory/disk caching and placeholder support for free, directly satisfying `04-PRD.md` F05's "images lazy-loaded" acceptance criterion                                                                               |
| **FlatList**                | Standardize on `FlatList` (or `@shopify/flash-list` for the heavier `DoctorCard` rows) as the only list primitive for S06 Search Results, S10 My Bookings, and S15 Notification Inbox — committed to _before_ any of these 3 screens are built, not retrofitted after                                                                                                                        |
| **Memoization**             | `DoctorCard`, `NotificationItem`, and `TokenCard` (once built) are wrapped in `React.memo` from their first version, given they will always be rendered inside a list — establishing this as a Component-Layer convention (Section 19) rather than an optimization pass later                                                                                                                |
| **Lazy loading**            | Continue relying on Expo Router's free per-route code-splitting; explicitly defer constructing heavy conditionally-rendered UI (e.g. `FilterPanel`'s bottom sheet contents) until it's actually opened, rather than mounting it hidden                                                                                                                                                       |
| **Bundle optimization**     | Resolve the `react-native-reanimated`/`react-native-worklets` unused-dependency question (Section 22 Decision Log) — either build the documented `FadeIn`/`SlideUp`/`Pulse` animation components against them now, or defer adding them until a concrete need exists; do not leave native modules installed-but-idle indefinitely                                                            |
| **Animation**               | Build `src/components/animation/*` against Reanimated (native-thread) rather than core `Animated` (JS-thread), given the target low-end Android hardware named in `06-User-Personas.md` — the one exception, `OTPInput`'s existing shake, may stay on core `Animated` since it's simple and already correctly implemented; new animation components should not repeat that choice by default |
| **Future pagination**       | Search Results (S06) uses real server-side pagination (`page`/`limit`, already supported per `11-API-Contract.md` F02/F03) via `useInfiniteQuery`. My Bookings (S10) has **no server-side pagination available** (`12-Backend-Spec.md` confirms this) — the client must virtualize the full unbounded list via `FlatList` rather than expect the backend to ever paginate it                 |
| **Unmount safety**          | Every async operation (Repository calls, the mock-delay helper) is cancellable via `AbortController`/React Query's built-in signal threading — closing the two flagged unmount-safety gaps at the architecture level rather than patching each call site individually                                                                                                                        |
| **Startup instrumentation** | Add a simple startup-time measurement (first-interactive timestamp delta) now, as a `logger.info` call with no other purpose than establishing a baseline against `04-PRD.md` Section 7's "<3s cold start" target before real initialization work (token restore, language read) is added to the startup path                                                                                |

---

## 16. Security Strategy

| Concern                                                   | Strategy                                                                                                                                                                                                                                                                                                                                                                                                                      | Rule Basis                                                                                                                                                                       |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Secure storage**                                        | `expo-secure-store` (Keychain on iOS, Keystore on Android) is the **only** sanctioned storage for access/refresh tokens, accessed exclusively through `core/storage`'s `secureStore` wrapper — no other file in the codebase calls `expo-secure-store` directly                                                                                                                                                               | Rules SEC1–SEC3                                                                                                                                                                  |
| **Token handling**                                        | `AuthService` owns the full token lifecycle: read-on-startup into an in-memory cache, attach-on-request (Section 5), silent refresh-on-401, single-use refresh-token rotation (server already implements rotation per `12-Backend-Spec.md` — client must never reuse a rotated-out refresh token, which the "replay once, then clear session on repeat 401" interceptor design in Section 5 satisfies)                        | Rules S5, SEC1–SEC3                                                                                                                                                              |
| **Sensitive data**                                        | Phone numbers, names, and tokens are never passed to `logger.*` calls (Section 14) or `AnalyticsService.track()` event payloads — enforced via code-review checklist (Section 19) since no automated PII-scrubbing tool is in scope for Sprint 0                                                                                                                                                                              | Implicit from Rules SEC1–SEC8 and general DPDP-Act awareness (`04-PRD.md` F18)                                                                                                   |
| **Session handling**                                      | Client gracefully handles a forced-logout-elsewhere scenario (the server's 2-concurrent-session FIFO eviction per Rule S2 means a 3rd login can silently invalidate this session) — a 401 on any authenticated call after a session was previously valid routes to `(auth)` without alarming copy, since this is an expected multi-device outcome, not an error                                                               | Rule S2                                                                                                                                                                          |
| **Environment variables**                                 | Only `EXPO_PUBLIC_`-prefixed variables are used client-side, sourced via `app.config.ts` (Section 11) — consistent with the current `README.md`'s "no env vars yet" state; no API key or secret is ever bundled client-side, since none of the documented endpoints require one (OTP/SMS provider secrets stay server-side per `11-API-Contract.md`)                                                                          | General security hygiene, no specific Rule number (not previously documented — flagged here as a Sprint 0 addition consistent with the project's "flag, don't guess" discipline) |
| **Turnstile / App Attest**                                | Not designed in this document — `05-Business-Rules.md` Rule SEC4 and `14-Feature-Dependencies.md` P0-2 flag this as an open backend-side decision (Turnstile-free mobile path vs. App Attest/Play Integrity); the mobile client's lead-capture (F13) and OTP (F01) repositories should be built with a `turnstileToken?: string` optional field so whichever solution is chosen doesn't require a Repository interface change | Rule SEC4, P0-2                                                                                                                                                                  |
| **Certificate pinning / auto-lock / screenshot blocking** | Explicitly deferred — `05-Business-Rules.md` Rules SEC6–SEC8 and `15-Known-Gaps.md` Section 1 both confirm these are V1.1 security-hardening items, not V1 launch blockers; not designed in this document to avoid scope creep beyond what's locked for V1                                                                                                                                                                    | Rules SEC6–SEC8                                                                                                                                                                  |

---

## 17. Testing Strategy

_(No test tooling exists today — confirmed by `02.4`. This section designs the strategy; adding
the tooling itself is a Sprint 0 task, Section 20.)_

### Unit Testing

- **Framework:** Jest via the `jest-expo` preset (the standard, zero-friction choice for an Expo
  SDK 57 project).
- **Priority target (highest ROI first):** `src/utils/` (pure functions, no mocking needed) →
  `src/services/` (mock the Repository layer, test business-rule branching — e.g. every one of the
  13 B6 codes maps to the correct string) → `src/repositories/` (test the mock implementations
  return contract-shaped data; test the real implementations' envelope-normalization logic against
  fixture HTTP responses).
- **Coverage target:** `04-PRD.md` Section 7's own locked success criterion — ">80% coverage for
  critical flows" — applied specifically to `services/` and `utils/`, not blanket-enforced on
  `components/` where snapshot tests provide more value than line coverage.

### Component Testing

- **Framework:** `@testing-library/react-native`.
- **Priority:** Atoms first (Button/Input/Badge/Avatar/OTPInput — cheap, high-value, catch
  accessibility-prop regressions like a missing `accessibilityLabel`), then Molecules
  (`DoctorCard`, `QueueStatusBadge`), focusing on interaction tests (press → callback fires,
  disabled → callback doesn't fire) over pixel-level snapshot tests, which are brittle against the
  ongoing typography/spacing tokenization work in Section 8.

### Integration Testing

- Feature-hook tests: render a hook via `@testing-library/react-hooks` (or React Query's own
  testing utilities) with a `Mock*Repository` swapped in, verifying the full
  Feature→State→Service→Repository chain produces the right `{data, error, isLoading}` shape for
  each of the 13 B6 codes and the offline/online branches.
- These tests are the primary regression net for the layering rules in Section 3 — a test that
  needs to mock React Native rendering to test business logic is a signal the logic leaked into
  the wrong layer.

### Future E2E Testing

- **Framework (recommended, not yet installed):** Detox or Maestro — either is compatible with
  Expo's managed workflow; final choice deferred to whoever owns CI infrastructure setup.
- **Scope (directly from `04-PRD.md` Section 7's own locked criterion):** "E2E tests pass for:
  Login → Search → Book → Track → Cancel" — this exact flow is the first E2E suite to write, once
  enough of Phase 1–4 (`14-Feature-Dependencies.md`) is built for it to be meaningful. Not a
  Sprint 0 deliverable itself (there's nothing to E2E-test yet), but the CI pipeline slot for it
  should exist from Sprint 0 (Section 20) even if it initially runs zero E2E specs.

---

## 18. Accessibility Strategy

| Concern                                | Strategy                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Basis                                                 |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Screen reader**                      | Continue the existing, correctly-applied `AccessibleProps` discipline for every new component; add the currently-missing pieces: `LoadingSkeleton`'s single-group announcement (not per-row), `BottomSheet`/`ConfirmationDialog`'s focus-trap + return-focus behavior, `Toast`'s `assertive`/`polite` split per type                                                                                                                                                    | `09-Component-Library.md` Sections 2.4, 2.9, 6.3, 6.4 |
| **Touch targets**                      | Maintain the existing 44px `hitSlop`-compensation pattern (`Button`'s `small` size); **fix** the Ghost-button height bug found in `02.4` (comment claims 44px, code doesn't enforce it) as part of the Theme migration in Section 8                                                                                                                                                                                                                                     | Rule ACC1                                             |
| **Dynamic font / system font scaling** | Verify (Sprint 0 QA task, not a code task) that the app's arbitrary-pixel Tailwind values (`text-[14px]`) still respect the OS-level font-scaling accessibility setting — React Native's `Text` scales `fontSize` by the system setting regardless of how the value was authored, so this should already work, but has never been manually verified per `05-Business-Rules.md` Rule ACC7 ("Respect system font size settings")                                          | Rule ACC7                                             |
| **Contrast**                           | Already compliant via the locked token values (`02.1` confirmed no component overrides them) — the Section 8 theme migration preserves this by construction, since it centralizes rather than changes any color value                                                                                                                                                                                                                                                   | Rule ACC2                                             |
| **Localization readiness**             | This is the least-ready accessibility dimension today (Rule ACC6, F15) — Section 22's i18n architecture decision is the direct fix; every string that currently exists as a literal in a component must migrate to a `t('key')` call sourced from `10-UX-Writing-Guide.md`'s tables, including every `accessibilityLabel` (per that doc's own Section 21 Rule 8 — accessibility labels must come from the same source as visible copy, in whichever language is active) | Rule ACC6, F15                                        |
| **Haptics**                            | Currently unimplemented (`expo-haptics` not a dependency) despite Rule ACC5 ("Error messages: Visual + audio + haptic") — flagged in `15-Known-Gaps.md` §2.2 already; adding `expo-haptics` and wiring it into the shared error-display pattern (Section 13) is a small, well-scoped Sprint 0/1 addition                                                                                                                                                                | Rule ACC5                                             |

---

## 19. Coding Standards

### Naming Conventions

| Element                   | Convention                                                                     | Example                                     |
| ------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------- |
| Components                | `PascalCase`, one per file                                                     | `DoctorCard.tsx`                            |
| Hooks                     | `use` + `PascalCase` noun/verb                                                 | `useDoctorSearch.ts`                        |
| Services                  | `PascalCase` + `Service` suffix                                                | `BookingService.ts`                         |
| Repositories              | `PascalCase` + `Repository` suffix, `Http`/`Mock` prefix for implementations   | `HttpBookingRepository.ts`                  |
| Zustand stores            | `camelCase` + `Store` suffix                                                   | `authStore.ts`                              |
| Types/interfaces          | `PascalCase`, no `I`-prefix                                                    | `DoctorCardProps`, not `IDoctorCardProps`   |
| Constants                 | `UPPER_SNAKE_CASE` for primitive values, `PascalCase` for lookup-table objects | `MAX_ACTIVE_TOKENS_PER_DAY`, `HEIGHT_CLASS` |
| Functions/variables       | `camelCase`                                                                    | `formatFee`, `isPhoneValid`                 |
| Files exporting one thing | File name matches the export name exactly                                      | `useAuth.ts` exports `useAuth`              |

### Folder Conventions

- One component per file; every component folder (`atoms/`, `molecules/`, etc.) has an `index.ts`
  barrel re-exporting the component and its types together (existing convention, preserved).
- Co-locate a type with its owning component **only if the type is not a shared domain model** —
  domain models (`Doctor`, `QueueToken`) live in `src/types/`, not inside a component file (fixes
  `02.1` TD9 — `DoctorCardDoctor` currently lives inside `DoctorCard.tsx`).
- No file should exceed ~300 lines as a soft guideline — a file approaching this is a signal to
  extract a sub-component or a helper into `utils/`.

### Import Conventions

- Always use the `@/*` absolute-path alias (already configured in `tsconfig.json`) — never a
  relative path traversing more than one directory up (`../../../foo` is disallowed; restructure
  or use the alias instead).
- Import order (enforced by ESLint once added, Section 20): external packages → `@/core` →
  `@/api`/`@/repositories`/`@/services` → `@/features`/`@/store` → `@/components` → `@/utils`/`@/types`/`@/constants`
  → relative imports (same-folder siblings only).
- No default exports for anything except Expo Router screen files (which Expo Router requires to
  be default exports) — every other module uses named exports, matching the existing convention.

### Component Conventions

- Every interactive component's props interface extends `AccessibleProps` (existing convention,
  preserved).
- Props interface is always named `<ComponentName>Props`.
- Default prop values are set via destructuring defaults in the function signature, not a
  `Component.defaultProps` assignment (existing convention, preserved — matches current code).
- A component only reads from `useTheme()`/`t()` (Core Layer) — never from a Zustand store or
  React Query hook directly (Section 3's Forbidden Direction rule).

### State Conventions

- One Zustand slice per bounded concern (Section 4); no slice may read or write another slice's
  internal state directly — cross-slice coordination happens in a Feature-layer hook, not inside
  a store definition.
- Every derived/computed value is a selector function, not duplicated state.
- React Query `queryKey`s are always built via the `queryKeys` factory (Section 11) — no inline
  array literals as query keys, to keep invalidation targeting reliable.

### Service Conventions

- No `react`/`react-native`/`expo-router` imports (Section 3).
- Every public method returns a `Promise` and throws a typed error (never a bare `Error` or a raw
  string) — always something instantiated from `src/api/errors.ts`'s taxonomy or a
  Service-specific subclass.
- One file per domain; a Service file may import other Services only for cross-domain
  orchestration that's genuinely business-rule-driven (e.g. `BookingService` may need
  `WaitlistService` for the same-specialty-suggestion flow, Rule W4) — this is allowed (Services
  may depend on sibling Services), unlike Features (which may not depend on sibling Features).

### Repository Conventions

- One interface + at least one (`Mock`) implementation per domain, always.
- Never throw a raw `fetch` error or an un-normalized response — always the shared `ApiError` type.
- A Repository method's return type is always a domain type from `src/types/`, never a raw API
  response shape.

---

## 20. Sprint 0 Implementation Plan

**Gate:** Feature development (Sprint 1: F15 Language Toggle, F01 Login, per
`14-Feature-Dependencies.md`'s own recommended Phase 1 order) **may not begin until Phases
0.1–0.9 below are complete.** Phase 0.10 (testing harness) is strongly recommended but not a hard
gate, since it can be finished in parallel with early Sprint 1 work without blocking it.

| Phase    | Task                                                                                                                                                                                                                                                                                   | Depends On                                       | Blocks Feature Dev?                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **0.1**  | Add ESLint + Prettier + a `lint`/`format` script; add Jest (`jest-expo`) + `@testing-library/react-native` + a `test` script                                                                                                                                                           | None                                             | ✅ Yes — establishes the safety net every later phase relies on                                                                         |
| **0.2**  | Scaffold `src/core/` (`theme/`, `i18n/`, `storage/`, `network/`, `logger/`, `config/`) per Sections 8, 14, 16, 18                                                                                                                                                                      | 0.1                                              | ✅ Yes                                                                                                                                  |
| **0.3**  | Extract design tokens (`colors.ts`/`typography.ts`/`spacing.ts`/`radius.ts`/`elevation.ts`/`icons.ts`) from the existing `tailwind.config.js` + component hardcodes; fix the `DoctorCard` radius mismatch and the Ghost-button height bug as part of this extraction                   | 0.2                                              | ✅ Yes — every new component built after this point should consume tokens, not hardcodes                                                |
| **0.4**  | Scaffold `src/api/` (client, interceptors, endpoint stubs matching every F01–F19 route in `11-API-Contract.md`, `errors.ts`, `queryClient.ts`)                                                                                                                                         | 0.2                                              | ✅ Yes                                                                                                                                  |
| **0.5**  | Scaffold `src/repositories/` — interfaces + `Mock*` implementations for all 7 domains (Section 6), backed by expanded `src/data/` fixtures (beyond today's single `mockDoctor.ts`)                                                                                                     | 0.4                                              | ✅ Yes                                                                                                                                  |
| **0.6**  | Scaffold `src/services/` — all 8 services (Section 7), each calling its corresponding Mock repository, with the 13 B6 codes and other business-rule mappings ported in from the existing `BookingWidget.tsx` logic                                                                     | 0.5                                              | ✅ Yes                                                                                                                                  |
| **0.7**  | Scaffold `src/store/` (4 Zustand slices) + wire `QueryClientProvider`/`ThemeProvider`/`LanguageProvider` into `app/_layout.tsx`                                                                                                                                                        | 0.4, 0.6                                         | ✅ Yes                                                                                                                                  |
| **0.8**  | Consolidate duplicated utilities into `src/utils/` (`phone.ts`, `format.ts`, `validation.ts`, `string.ts`); update the 2–3 existing components that currently duplicate this logic to import from the new shared location                                                              | 0.2                                              | ⚠️ Partial — not strictly blocking, but should land before Sprint 1 touches `WaitlistForm`/`OTPInputBox` again to avoid a 3rd duplicate |
| **0.9**  | Build the navigation shell: route groups (`(auth)`/`(app)`/`(tabs)`/`(modals)`), the auth guard in `(app)/_layout.tsx`, the bottom tab bar component (`src/components/layout/BottomTabBar.tsx`); migrate the 3 existing screens into the new group structure with zero behavior change | 0.7                                              | ✅ Yes — every Sprint 1+ screen needs a place to live                                                                                   |
| **0.9b** | Build `ErrorBoundary` (`src/components/utility/`) and wrap the root layout; build `Toast` and `NetworkStatus` utility components                                                                                                                                                       | 0.7                                              | ✅ Yes — foundational safety net, not feature-specific                                                                                  |
| **0.10** | Write one smoke unit test (`src/utils/phone.test.ts`) and one smoke component test (`Button.test.tsx`) proving the Jest/RTL pipeline from 0.1 actually works end-to-end; add a CI workflow (lint + typecheck + test on every PR)                                                       | 0.1, 0.8                                         | ⚪ Recommended, not blocking                                                                                                            |
| **0.11** | Resolve the `BookingWidget` naming collision and the time-slot-vs-token-model question (Section 22) — a founder/architecture decision, not code — before Sprint 1's booking work begins                                                                                                | None (can run in parallel with all of the above) | ✅ Yes, specifically for booking-related Sprint 1 work only                                                                             |

**Total Sprint 0 scope is architecture/infrastructure only** — no F01–F19 feature UI is built
during these phases; Phases 0.5/0.6's Mock repositories/services exist to be _ready_ for Sprint 1
to consume, not to power any new user-visible screen yet.

> **M1 (Engineering Foundation) status — 2026-07-20:** Phase 0.1's tooling half is done: ESLint
> (flat config, TypeScript/React Native/import/`eslint-plugin-boundaries` rules) and Prettier are
> installed and configured, with `lint`/`lint:fix`/`format`/`format:check`/`typecheck` scripts in
> `package.json`. Jest/`jest-expo`/RTL and the `test` script are **not** part of M1 (scoped out
> with the user; tracked as remaining Phase 0.1 work for a later milestone). Phase 0.2's
> `src/core/` (and every other Section 2 `src/` layer: `api/`, `repositories/`, `services/`,
> `features/*/hooks/`, `store/`, plus the new `components/{templates,layout,animation,utility}/`,
> `hooks/`, `utils/`, `constants/`) exist only as **directory skeletons** (a single `.gitkeep`
> each) — no theme tokens, API client, repositories, services, or Zustand slices are implemented
> yet. See `docs/implementation/M1-Engineering-Foundation-Report.md` for full details.

> **M2 (Theme Foundation) status — 2026-07-20:** Phase 0.3 is done for its token-extraction half:
> `src/core/theme/tokens/{colors,typography,spacing,radius,elevation,opacity}.ts`,
> `src/core/theme/theme.ts` (the `{light, dark}` Tokens structure), `ThemeProvider.tsx`, and the
> `@/core/theme` barrel are all implemented per Section 8, and `ThemeProvider` is wired into
> `app/_layout.tsx` (this milestone's slice of Phase 0.7, which otherwise remains unstarted —
> `QueryClientProvider`/`LanguageProvider` are not part of M2). Every JS-level hardcoded hex color
> Section 8's "Eliminating Hardcoded Colors" checklist names has been migrated to the new tokens.
> **Not** done as part of Phase 0.3: the `DoctorCard` radius mismatch and the Ghost-button height
> bug were deliberately left unfixed (fixing either changes rendered output, out of scope for a
> "UI stays visually identical" milestone); `icons.ts` was not built (outside this milestone's
> given Design Tokens checklist); `className`-level typography/spacing/radius/shadow values were
> not migrated (a much larger, redesign-adjacent change); `tailwind.config.js` was not regenerated
> from `colors.ts` (both remain independently hand-kept in sync). See
> `docs/implementation/M2-Theme-Foundation-Report.md` for full details.

> **M3 (Core Foundation) status — 2026-07-20:** Phase 0.2's remaining `src/core/` modules are
> done: `config/` (`env.ts` — typed `AppEnvironment`, `API_BASE_URL`, `API_TIMEOUT_MS`), `logger/`
> (`logger.debug/info/warn/error`, console-backed in development, silent in production, with a
> `setLoggerProvider` seam per Section 14), `storage/` (`StorageAdapter` interface +
> `SecureStoreAdapter`/`AsyncStorageAdapter`, generic only — no auth/token storage), and `network/`
> (NetInfo connectivity wrapper + request/response/interceptor **types**, per the folder tree's
> literal "NetInfo wrapper, connectivity singleton" description — no HTTP client, since Section 5's
> `src/api/client.ts` remains unbuilt and out of scope). A new `core/errors/` module
> (`AppError`/`NetworkError`/`ValidationError`/`StorageError`/`ConfigurationError`) was added — this
> hierarchy is **not** in this document's original Section 5/8 (which documents only the narrower,
> API-layer `ApiError`); it was added because M3's own instructions explicitly named it, and lives
> in `core/` since `network`/`storage`/`config` all need a shared error type. `src/constants/`
> gained `storageKeys.ts` and `featureFlags.ts` only (routes/api/businessRules/specialties/
> queryKeys were excluded as feature-specific, business-rule, or React-Query-dependent content,
> per M3's "no feature constants"/"no business logic" instructions). `src/utils/` gained
> `date.ts`/`string.ts`/`validation.ts`/`format.ts` (generic helpers only, matching M3's own 4
> named examples) — built as new standalone functions, **not** wired into `DoctorCard.tsx`/
> `WaitlistForm.tsx`'s existing private duplicates (that consumer migration is component-level
> work this milestone's "no feature implementation" scope doesn't cover). `core/i18n/` was
> **deliberately left untouched**: this document cites an "i18n architecture" at two different
> section numbers (line 141's "Section 18" and line 975's "Section 22"), and neither actually
> contains one — Section 18 is Accessibility Strategy and Section 22 (Phase 0.11) is the
> `BookingWidget` naming-collision decision; no concrete `LanguageProvider`/`t()`/string-resource
> design exists anywhere in this document to build against. See
> `docs/implementation/M3-Core-Foundation-Report.md` for full details.

> **M4 (API Foundation) status — 2026-07-20:** Phase 0.4's non-endpoint half of `src/api/` is
> done: `client.ts` (`ApiClient`/`apiClient` — a generic, typed `fetch` wrapper reading
> `API_BASE_URL`/`API_TIMEOUT_MS` from `core/config` and using `core/network`'s
> `RequestConfig`/`ApiResponse<T>`/`HttpMethod` types, per Section 5), `errors.ts`
> (`mapTransportError`/`assertValidBaseUrl` — transport-only mapping into `core/errors`, not
> `ApiError`), `interceptors/registry.ts` (an empty, four-slot-documented registration pipeline —
> no auth/logging/retry/refresh-token logic), and `types/common.ts` (`ApiErrorResponse`,
> `PaginatedResponse<T>`, `RequestOptions`, re-exporting `core/network`'s `ApiResponse<T>`).
> `endpoints/{auth,doctor,booking,queue,profile,notifications}/index.ts` are `export {}`
> placeholders only, per this milestone's own exact folder list (not Section 2's slightly
> different repository-layer list, which also has `waitlist/`). `errors.ts`'s `ApiError` class,
> `interceptors/*` implementations, `endpoints/*` functions, and `queryClient.ts` remain
> unbuilt — all explicitly out of this milestone's scope. A new `UnknownError` class was added
> to M3's `core/errors/` module (this milestone's own instruction named it alongside
> `NetworkError`/`ConfigurationError` as a "Core Error type"). Cross-checked
> `docs/11-API-Contract.md` against this document per this milestone's own instruction — no
> blocking conflict found; every discrepancy the contract raises (flat-vs-enveloped responses,
> `requestId` vs `idempotencyKey`, 30-min vs 15-min access token, cookie-vs-Bearer Blocker 1) was
> already anticipated and reconciled by this document's existing Section 5 text. See
> `docs/implementation/M4-API-Foundation-Report.md` for full details.

> **M5 (Repository Foundation) status — 2026-07-20:** Phase 0.5's `src/repositories/` is done:
> all 7 domains Section 6 documents (`Auth`/`Doctor`/`Booking`/`Queue`/`Waitlist`/`Notification`/
> `Profile`) have an interface + `Http*`/`Mock*` implementation pair, matching Section 6's own
> method signatures exactly — no speculative methods. A `src/repositories/index.ts` factory
> reads `FEATURE_FLAGS.USE_MOCK_DATA` (built ahead of time in M3) and exports the chosen
> implementation per domain; Services (unbuilt) are meant to import only from `@/repositories`.
> Of this milestone's four "Repository Base" examples (`BaseRepository`/`RepositoryResult`/
> `RepositoryError`/generic CRUD abstractions), **none are documented anywhere in this
> document** — Section 6's pattern is one bespoke interface per domain with no shared base
> class or result wrapper — so none were built, per "do not invent patterns not present in the
> design." The one genuinely-documented shared piece, `mockDelay(ms, signal)`, was built at
> `src/repositories/shared/mockDelay.ts`. `src/types/` gained six new domain-model files
> (`auth.ts`, `doctor.ts`, `booking.ts`, `waitlist.ts`, `notification.ts`, `profile.ts`) that
> Section 6's repository method signatures reference by name but this document never itemizes
> field-by-field; three of them (`Doctor`, `QueueToken`, `Notification`) are **deliberately
> partial types** built only from fields `docs/11-API-Contract.md` or an existing sibling UI type
> actually confirms — flagged as technical debt, not guessed further. `src/data/` gained one
> fixture file per domain for the new `Mock*Repository` implementations; the pre-existing
> `mockDoctor.ts` (a different, UI-shaped type) was left untouched. Four repository methods throw
> a new, repository-scoped `NotImplementedError` in their `Http*` implementation instead of
> calling a real endpoint: `DoctorRepository.getById` (F05 has no itemized endpoint),
> `WaitlistRepository.join` (this document's own Section 6 already flags this endpoint as
> undocumented), `ProfileRepository.update` (F14 has no documented endpoint, matching M4's same
> finding for `src/api/endpoints/profile/`), and — a genuine transport conflict found during this
> milestone's required cross-check — `QueueRepository.getTokenStatus` (F09's only documented
> transport is an SSE stream, which cannot be represented as the one-shot
> `Promise<QueueToken>` Section 6's interface requires; no simple polling GET is documented as an
> alternative). The other 9 methods call their exact documented endpoint via `apiClient`. No
> repository-level error-translation scheme is documented, so none was built beyond a generic
> `assertSuccessResponse` 2xx gate (`src/repositories/shared/`) — errors from the API Foundation
> propagate unchanged, translation of specific error codes remains a Service-layer concern.
> `consent/` and `lead/` (scaffolded by M1 but outside both this milestone's and Section 6's
> 7-domain list) were left untouched. See
> `docs/implementation/M5-Repository-Foundation-Report.md` for full details.

---

## 21. Risk Register

| #   | Risk                                                                                                                                                                                | Probability                                                  | Impact                                                                                                                                    | Mitigation                                                                                                                                                                                                                              |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | `BookingWidget`'s time-slot model is built further before the founder resolves it vs. the documented queue-token model                                                              | Medium                                                       | High — a full rebuild of the core transaction screen                                                                                      | Resolve as Sprint 0 Task 0.11, before any Sprint 1 booking work starts (Section 20)                                                                                                                                                     |
| R2  | Bilingual (F15) support is deferred again in favor of "faster" English-only feature work                                                                                            | Medium                                                       | High — F15 is launch-blocking per PRD; retrofitting i18n across 16 screens' worth of strings is far more expensive than building it first | Treat Section 18's i18n architecture as a Phase 0 (or immediate Sprint 1) task, not a "nice to have later"                                                                                                                              |
| R3  | The 6 backend Phase-0 blockers (P0-1–P0-6) are not prioritized by whoever owns backend work, stalling mobile's ability to go from mock to real data                                 | Medium                                                       | High — most of the app (F08–F18) is blocked on P0-1 alone                                                                                 | Mobile architecture is designed to be backend-agnostic (Repository mock/real swap) so mobile work is never blocked; escalate P0-1 specifically as the single highest-leverage backend task, per `11-API-Contract.md`'s own framing      |
| R4  | `react-native-reanimated`/`react-native-worklets` remain installed-but-unused indefinitely, adding native build cost for no benefit                                                 | Low                                                          | Low                                                                                                                                       | Decide in Sprint 0 (Section 22) whether to build the animation components against them now or remove them                                                                                                                               |
| R5  | No CI/lint/test safety net means a future contributor (human or AI agent) reintroduces a fixed issue (e.g. a 3rd duplicate phone-validation implementation) undetected              | High (without mitigation)                                    | Medium                                                                                                                                    | Section 20 Phase 0.1/0.10 — ESLint + Jest + CI from day one of Sprint 0, not deferred                                                                                                                                                   |
| R6  | The dual API response-envelope format (flat vs. wrapped, per `11-API-Contract.md`) causes a Repository bug where one endpoint's shape is assumed incorrectly                        | Medium                                                       | Medium                                                                                                                                    | Section 5's per-endpoint normalizer design (never a blanket parser) + unit tests per endpoint adapter (Section 17)                                                                                                                      |
| R7  | `GET /api/patient/my-bookings`'s unbounded response causes a real, user-visible slow-render once a patient accumulates a long history                                               | Low today, rising over time                                  | Medium                                                                                                                                    | `FlatList`/virtualization committed to from S10's first build (Section 15), not retrofitted                                                                                                                                             |
| R8  | Secure token storage is implemented incorrectly (e.g. a well-meaning contributor "temporarily" puts a token in AsyncStorage for debugging and it ships)                             | Low                                                          | Critical (security)                                                                                                                       | Section 16's "only `core/storage`'s `secureStore` wrapper may touch tokens" rule, enforced via code review checklist (Section 19) until a custom ESLint rule can be added                                                               |
| R9  | The auth-guard-redirect design (Section 9) doesn't correctly "resume" a deep link after login, degrading the documented deep-linking UX                                             | Medium                                                       | Low–Medium                                                                                                                                | Explicitly called out as a Sprint 0 design decision (Section 22) needing a concrete resume-token/redirect-param mechanism before Sprint 1's auth work is considered complete                                                            |
| R10 | Feature-layer hooks accumulate cross-feature imports over time (e.g. `booking` importing directly from `search`'s internals for convenience) despite the Forbidden Direction rule   | Medium                                                       | Medium                                                                                                                                    | Documented explicitly in Section 3 and Section 19; recommend a custom ESLint import-boundary rule (e.g. `eslint-plugin-boundaries`) once Phase 0.1's ESLint setup lands, to make this machine-enforced rather than review-enforced only |
| R11 | The Consent Capture (F19) backend gap (P0-4) means `ConsentCheckbox`'s state is built but has nothing to persist to, and this TODO gets silently dropped under future time pressure | Low (this project's track record of self-flagging is strong) | Medium (DPDP-Act-adjacent compliance risk)                                                                                                | Continue the existing "flag in code + Known-Gaps.md" discipline; `BookingService`'s design (Section 7) explicitly names this as a known pending item, not a silent no-op                                                                |

---

## 22. Decision Log

| #   | Decision                                | Chosen Approach                                                                                                                                                                      | Rejected Alternative(s)                                                                                                                                    | Why                                                                                                                                                                                                                                                                                                                                                   |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Server-state library                    | React Query (`@tanstack/react-query`)                                                                                                                                                | Redux Toolkit Query (RTK Query); rolling a custom `useEffect`-based fetch-and-cache hook per feature                                                       | RTK Query would require adopting all of Redux Toolkit for a project that's already committed to Zustand (`04-PRD.md` Section 6); a custom solution would re-invent caching/invalidation/offline-persistence that React Query provides out of the box, and is exactly the "ad hoc pattern per developer" outcome this whole document exists to prevent |
| D2  | Client-state library                    | Zustand (multiple slices)                                                                                                                                                            | Redux Toolkit; React Context + `useReducer`; MobX                                                                                                          | Zustand is already the locked platform decision (`04-PRD.md` Section 6: "Reuse web stores, minimal boilerplate") and is already an installed, if unused, dependency — no reason to introduce a second state library                                                                                                                                   |
| D3  | Data-access abstraction                 | Repository Pattern with interface + Mock/Http implementation pair                                                                                                                    | Calling `fetch` directly inside feature hooks; a single monolithic "ApiService" god-object                                                                 | `14-Feature-Dependencies.md`'s own explicit "build UI now against the contract, wire later" guidance requires a clean swap point; a monolithic API service would still couple every feature to the API layer directly, defeating the purpose                                                                                                          |
| D4  | Route structure                         | Expo Router route groups (`(auth)`/`(app)`/`(tabs)`/`(modals)`)                                                                                                                      | Keep the current flat `<Stack>` and add auth checks per-screen                                                                                             | Per-screen auth checks is exactly the pattern `02.1` flagged as a scalability risk once retrofitted after more screens exist; route groups centralize the guard in one place before the cost of migration grows                                                                                                                                       |
| D5  | Theme/token architecture                | TypeScript token modules as the source of truth, with `tailwind.config.js` generated from them                                                                                       | Keep `tailwind.config.js` as the sole source of truth and accept that `color` props (non-`className` contexts) must independently hardcode the same values | The current approach is exactly what produced the `#5696C7`-duplicated-in-4-files finding (`02.1`/`02.4`); a single TS source eliminates the class of bug entirely rather than requiring discipline to avoid it                                                                                                                                       |
| D6  | i18n architecture timing                | Build the `LanguageProvider`/`t()` architecture in Sprint 0, migrate existing strings immediately, and require every new string to go through it from Sprint 1 onward                | Ship English-only through several sprints and retrofit Hindi once the UI stabilizes                                                                        | F15 and Rule ACC6 are both locked, launch-blocking requirements — every sprint of English-only-string accumulation increases the retrofit cost; the "flag, don't guess" discipline already established in this codebase argues for treating a known-locked requirement as done-now rather than deferred                                               |
| D7  | Secure token storage                    | `expo-secure-store` exclusively, wrapped by `core/storage`, accessed only by `AuthService`                                                                                           | AsyncStorage with manual encryption; Zustand `persist` middleware for tokens                                                                               | Rules SEC1–SEC3 explicitly and specifically forbid AsyncStorage/Zustand for tokens; `expo-secure-store` is the direct, Expo-native implementation of "Keychain/Keystore" as those rules require, with zero custom-crypto risk                                                                                                                         |
| D8  | List virtualization                     | Commit to `FlatList`/`FlashList` from each list screen's first version                                                                                                               | Build with a plain `.map()` first, virtualize "later if it's slow"                                                                                         | `02.5` already identifies this as the single highest-severity forward-looking performance risk, specifically because one of the three affected screens (My Bookings) has a backend that cannot paginate — there is no safe "wait and see" here                                                                                                        |
| D9  | `BookingWidget` naming collision        | **Not resolved in this document** — flagged as a founder-level decision (Section 20 Task 0.11, Risk R1)                                                                              | Silently renaming one of the two components unilaterally                                                                                                   | Per `13-AI-Development-Rules.md`'s own "flag contradictions, don't silently resolve them" principle, already followed consistently everywhere else in this project's history (`15-Known-Gaps.md` §2.2) — this document intentionally does not break that discipline just because it's convenient to pick one here                                     |
| D10 | Reanimated/Worklets dependency fate     | **Not resolved in this document** — flagged as a Sprint 0 decision point (Section 15, Risk R4) between "adopt now for the documented animation components" and "remove until needed" | Leaving the question unaddressed indefinitely (the current state)                                                                                          | An explicit decision, either way, is better than continuing to carry a native dependency with zero current usage and no recorded reason                                                                                                                                                                                                               |
| D11 | Mock/Real repository toggle granularity | Per-domain feature flags (e.g. search can go "real" independently of booking) rather than one global `USE_MOCK_DATA` switch                                                          | A single global mock/real switch for the whole app                                                                                                         | Different domains clear their Phase-0 backend blockers at different times (search has none; booking needs P0-1) — a global switch would force an all-or-nothing cutover that doesn't match the backend's actual, staggered readiness                                                                                                                  |
| D12 | Testing tool selection                  | Jest (`jest-expo`) + `@testing-library/react-native` for unit/component; Detox/Maestro deferred for E2E                                                                              | Vitest; Enzyme; Appium                                                                                                                                     | `jest-expo` is the zero-config standard for Expo SDK 57 projects; Enzyme is unmaintained for current React versions; Detox/Maestro decision is explicitly deferred (Section 17) since no E2E-worthy flow exists yet to justify picking one now                                                                                                        |

---

## 23. Layer Dependency Graph

This section makes Section 3's dependency rules exhaustive and unambiguous by covering **every**
layer pair, split into the **Component Hierarchy** (how UI-only code is composed) and the
**Business Layer Hierarchy** (how data/logic flows), then unifying both into one system-level
graph and a full allowed/forbidden matrix.

### 23.1 Component Hierarchy (Atomic Design)

```
Presentation (app/*.tsx)
      │ composes
      ▼
Template  (src/components/templates)
      │ composes
      ▼
Organism  (src/components/organisms)
      │ composes
      ▼
Molecule  (src/components/molecules)
      │ composes
      ▼
Atom      (src/components/atoms)
      │ uses
      ▼
Core (theme tokens, icons) + Utility (formatters, validators)
```

- `Layout` (`Header`, `BottomTabBar`, `ScreenWrapper`), `Animation` (`FadeIn`, `SlideUp`, `Shake`,
  `Pulse`), and `Utility` components (`ErrorBoundary`, `Toast`, `NetworkStatus`,
  `ConfirmationDialog`) sit **alongside** Atoms/Molecules/Organisms at the same hierarchy depth —
  each may be composed by anything above it (Template/Presentation) and may itself only depend on
  Core/Utility, exactly like an Atom.
- A Molecule may compose a sibling Molecule (the one documented exception, per `02.1`'s
  verification: `DoctorCard` → `QueueStatusBadge`) but never an Organism or Template.
- **No Component-Hierarchy layer may import anything from the Business Layer Hierarchy below**
  (no `services/`, `repositories/`, `api/`, or direct React Query/Zustand hook usage) — a
  component's only inputs are props and `useTheme()`/`t()` from Core.

### 23.2 Business Layer Hierarchy (Data & Logic)

```
Presentation (app/*.tsx)
      │ calls
      ▼
Feature  (src/features/<domain>/hooks)
      │ calls
      ▼
State    (React Query hooks  +  src/store Zustand slices)
      │ queryFn / mutationFn calls into
      ▼
Service  (src/services)
      │ calls
      ▼
Repository (src/repositories)
      │ calls
      ▼
API      (src/api)
      │ calls
      ▼
Backend  (out of scope — external system)

      (in parallel, at every level:)
Utility (src/utils)  +  Core (src/core)  ← leaf layers, depended on by everything above,
                                            depend on nothing above themselves
```

- **Services may depend on sibling Services** (Section 19's Service Conventions — e.g.
  `BookingService` calling `WaitlistService` for the same-specialty-suggestion flow, Rule W4).
  This is the one explicitly allowed _lateral_ dependency in the entire graph.
- **Features may NOT depend on sibling Features** (Section 3's Forbidden Direction) — this is the
  business-hierarchy mirror of "no lateral Organism→Organism imports" in the component hierarchy.

### 23.3 Unified System Graph

The Feature layer is the single bridge between the two hierarchies — it is the only layer
permitted to import from **both** sides:

```
                         ┌─────────────────────────┐
                         │   Presentation (app/)    │
                         └────────────┬─────────────┘
                     composes ▼                  ▼ calls
        ┌────────────────────────┐      ┌──────────────────────┐
        │   Template             │      │   Feature             │
        └────────────┬────────────┘      └──────────┬────────────┘
             composes ▼                    calls     ▼
        ┌────────────────────────┐      ┌──────────────────────┐
        │ Organism/Molecule/Atom  │◄─────│   State                │
        │ Layout/Animation/Util   │ props│ (React Query + Zustand)│
        └────────────┬────────────┘      └──────────┬────────────┘
                      │                              │ calls
                      │                    ┌──────────────────────┐
                      │                    │   Service              │
                      │                    └──────────┬────────────┘
                      │                              │ calls
                      │                    ┌──────────────────────┐
                      │                    │   Repository           │
                      │                    └──────────┬────────────┘
                      │                              │ calls
                      │                    ┌──────────────────────┐
                      │                    │   API                  │
                      │                    └──────────┬────────────┘
                      │                              │ calls
                      │                          [ Backend ]
                      ▼                              ▼
              ┌─────────────────────────────────────────────┐
              │        Utility   +   Core   (leaf layers)      │
              └─────────────────────────────────────────────┘
```

Read the arrows as "may call/import." The Component-Hierarchy branch (left) and the
Business-Hierarchy branch (right) never touch each other directly — a Component never calls a
Service, and a Service never renders a Component. Data crosses from right to left **only** as
props, always mediated by the Feature layer handing already-fetched, already-typed data down to
a Template/Component tree via the Presentation layer.

### 23.4 Full Allowed/Forbidden Dependency Matrix

| From Layer ↓ / May depend on → | Presentation | Template | Component*                                                | Feature                  | State                 | Service                    | Repository               | API | Utility            | Core                      |
| ------------------------------ | ------------ | -------- | --------------------------------------------------------- | ------------------------ | --------------------- | -------------------------- | ------------------------ | --- | ------------------ | ------------------------- |
| **Presentation**               | —            | ✅       | ✅                                                        | ✅                       | ❌ (only via Feature) | ❌                         | ❌                       | ❌  | ✅                 | ✅                        |
| **Template**                   | ❌           | —        | ✅                                                        | ❌                       | ❌                    | ❌                         | ❌                       | ❌  | ✅                 | ✅                        |
| **Component\***                | ❌           | ❌       | ✅ (siblings/children only, no lateral Organism↔Organism) | ❌                       | ❌                    | ❌                         | ❌                       | ❌  | ✅                 | ✅ (theme/i18n only)      |
| **Feature**                    | ❌           | ❌       | ✅ (composite views only)                                 | ❌ (no sibling Features) | ✅                    | ✅ (indirectly, via State) | ❌                       | ❌  | ✅                 | ✅                        |
| **State** (RQ/Zustand)         | ❌           | ❌       | ❌                                                        | ❌                       | —                     | ✅                         | ❌                       | ❌  | ✅                 | ✅                        |
| **Service**                    | ❌           | ❌       | ❌                                                        | ❌                       | ❌                    | ✅ (siblings allowed)      | ✅                       | ❌  | ✅                 | ✅                        |
| **Repository**                 | ❌           | ❌       | ❌                                                        | ❌                       | ❌                    | ❌                         | ❌ (siblings not needed) | ✅  | ✅                 | ✅                        |
| **API**                        | ❌           | ❌       | ❌                                                        | ❌                       | ❌                    | ❌                         | ❌                       | —   | ✅                 | ✅                        |
| **Utility**                    | ❌           | ❌       | ❌                                                        | ❌                       | ❌                    | ❌                         | ❌                       | ❌  | ✅ (sibling utils) | ❌                        |
| **Core**                       | ❌           | ❌       | ❌                                                        | ❌                       | ❌                    | ❌                         | ❌                       | ❌  | ✅                 | ✅ (sibling core modules) |

_\*"Component" collapses Atom/Molecule/Organism/Layout/Animation/Utility-Component into one row/column for matrix readability — the intra-Component rules from Section 23.1 (Atom→Molecule→Organism direction, one sibling-Molecule exception) still apply underneath this collapsed cell._

**Enforcement note:** this matrix is currently a code-review checklist item (Section 19), not a
machine-enforced rule. Section 20 Task 0.10/R10 (Risk Register) recommends adding
`eslint-plugin-boundaries` (or an equivalent import-boundary linter) once ESLint is installed
(Task 0.1), configured directly from this matrix, so violations become build failures rather than
review misses.

---

## 24. Feature Dependency Matrix

For every documented feature (`04-PRD.md` F01–F19), this table lists every architectural piece
that feature needs, per this design's layer inventory (Sections 6–9). **Two services and one
repository not previously named in Section 6/7 were identified while building this matrix**
(`LeadService`/`LeadRepository` for F13, and `ConsentRepository` for F19) — flagged here per this
project's own "flag, don't silently patch an earlier section" discipline, rather than quietly
editing Sections 6/7 without a note.

| F#  | Feature                           | Required Service(s)                                                   | Required Repository(ies)                                                    | Required API(s)                                                                                                                                                          | Required State                                                                                  | Required Reusable Components                                                                                        | Required Route(s)                                                                               | Blocking Dependencies                                                                                                                                                  |
| --- | --------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F01 | Phone OTP Login/Signup            | `AuthService`                                                         | `AuthRepository`                                                            | `POST /api/v1/auth/send-otp`, `/verify-otp`, `/refresh`                                                                                                                  | `authStore` (Zustand) + SecureStore tokens; RQ mutations for send/verify                        | `Input`, `Button`, `OTPInputBox`                                                                                    | `(auth)/phone-login`, `(auth)/otp-verify`                                                       | None — fully buildable against the real API today (no P0 blocker)                                                                                                      |
| F02 | Doctor Search                     | `DoctorService`                                                       | `DoctorRepository`                                                          | `GET/POST /api/v1/patient/search`                                                                                                                                        | RQ `useInfiniteQuery` (`['doctors','search',filters]`)                                          | `SearchBar`, `DoctorCard`, `LoadingSkeleton`, `EmptyState`                                                          | `(app)/(tabs)/index` (entry), `(app)/search`                                                    | None                                                                                                                                                                   |
| F03 | Search Filters                    | `DoctorService` (shared with F02)                                     | `DoctorRepository`                                                          | Same search endpoint, filter params                                                                                                                                      | Local/feature filter-selection state; RQ key includes filters                                   | `FilterPanel`, `FilterChip`, `BottomSheet`                                                                          | `(modals)/filter-panel`                                                                         | F04 (specialty option list feeds the Speciality filter)                                                                                                                |
| F04 | Speciality List                   | _(none — static data)_                                                | _(none — static constant)_                                                  | _(none)_                                                                                                                                                                 | _(none, `src/constants/specialties.ts`)_                                                        | `SpecialitySelector`                                                                                                | Embedded in Search/FilterPanel, no dedicated route                                              | None                                                                                                                                                                   |
| F05 | Doctor Profile Page               | `DoctorService`                                                       | `DoctorRepository`                                                          | Doctor-detail read (endpoint **not itemized** in `11-API-Contract.md` — flagged there as needing a follow-up read of the SSE `send()` payload/ a dedicated detail route) | RQ `useQuery(['doctors','detail',id])`                                                          | `DoctorCard`, `Avatar`, `Badge`, `QueueStatusBadge`, `LoadingSkeleton`                                              | `(app)/doctor/[id]`                                                                             | None for read; the "Book Appointment Now" CTA on this screen additionally needs F08                                                                                    |
| F06 | Live Queue Status Badge           | `DoctorService`/`QueueService`                                        | `DoctorRepository`                                                          | None dedicated — SSE→FCM per `04-PRD.md` F06                                                                                                                             | RQ, invalidated by FCM push (F16) or 30s poll fallback                                          | `QueueStatusBadge`                                                                                                  | Embedded in S05/S07, no dedicated route                                                         | F16 (Push Notifications) for true real-time; degrades to polling without it                                                                                            |
| F07 | Railway-Style Booking Flow        | `BookingService`                                                      | `BookingRepository`                                                         | None itself (client-computed preview); needs F19's consent write path                                                                                                    | `bookingDraftStore` (Zustand, ephemeral) + RQ (doctor queue count for the preview calc)         | `BookingWidget` (organism, token-based per doc contract), `ConsentCheckbox`                                         | `(app)/booking/[id]`                                                                            | **F19 (Consent Capture) — P0-4** — the consent checkbox has nowhere to submit; also blocked by the `BookingWidget` naming-collision/time-slot decision (Section 22 D9) |
| F08 | Book Appointment                  | `BookingService`                                                      | `BookingRepository`                                                         | `POST /api/patient/book-appointment`                                                                                                                                     | RQ mutation, invalidates `['bookings','my-bookings']` + `['doctors','detail',id]`               | `BookingWidget`, `Button`, `Toast`                                                                                  | `(app)/booking/[id]` → success → `(app)/token/[id]`                                             | **P0-1 (Bearer auth)**, **P0-4 (consent)**, F14 (if `needsProfile:true` redirect fires first)                                                                          |
| F09 | Token Status Tracking             | `QueueService`                                                        | `QueueRepository`                                                           | `GET /api/patient/bookings/stream` (needs Bearer + FCM rework)                                                                                                           | RQ with 30s `refetchInterval` fallback + FCM invalidation                                       | `QueueTracker`, `Badge`                                                                                             | `(app)/token/[id]`                                                                              | **P0-1**; F16 (FCM) for true real-time instead of polling                                                                                                              |
| F10 | My Bookings                       | `BookingService`                                                      | `BookingRepository`                                                         | `GET /api/patient/my-bookings`                                                                                                                                           | RQ (unbounded list; client-side Active/Past filter, per S10's own documented client-side split) | `TokenCard`, `LoadingSkeleton`, `EmptyState`, `FlatList`                                                            | `(app)/(tabs)/bookings`                                                                         | **P0-1**; virtualization (Section 15) required given no server-side pagination exists                                                                                  |
| F11 | Cancel Token                      | `QueueService`                                                        | `BookingRepository` (cancel method)                                         | `POST /api/patient/queue/cancel-token`                                                                                                                                   | RQ mutation, invalidates `my-bookings` + the specific token query                               | `ConfirmationDialog`, `Button`                                                                                      | `(modals)/cancel-confirmation`                                                                  | **P0-1**                                                                                                                                                               |
| F12 | Join Waitlist                     | `QueueService` (waitlist responsibilities)                            | `WaitlistRepository`                                                        | `POST /api/patient/queue/claim-waitlist` (claim step); **no documented endpoint for the join step itself**                                                               | RQ mutation + local form state                                                                  | `WaitlistForm` (with `collectName={false}` to match S12's one-field spec)                                           | `(app)/waitlist/[id]`                                                                           | **P0-5** (broadcast size/timer mismatch); the undocumented join endpoint (`15-Known-Gaps.md` §2.1)                                                                     |
| F13 | Lead Capture ("Request a Doctor") | **`LeadService`** _(new — not in Section 7's original 8; added here)_ | **`LeadRepository`** _(new)_                                                | `POST /api/public/lead`                                                                                                                                                  | RQ mutation + local form state                                                                  | New Lead Capture form organism (not yet named in `09-Component-Library.md` — flagged as a doc gap, not invented UI) | `(modals)/lead-capture` _(new — not yet in Section 2's folder tree; add when F13 is scheduled)_ | **P0-2** (Turnstile mobile-compatible path)                                                                                                                            |
| F14 | Patient Profile Edit              | `ProfileService`                                                      | `ProfileRepository`                                                         | New endpoint — **not built on web either** (`04-PRD.md` F14 "STATUS: GAP")                                                                                               | RQ mutation + local form state                                                                  | `ProfileForm`, `Avatar`, `Input`                                                                                    | `(app)/profile-edit`                                                                            | Backend endpoint does not exist at all — not a P0-numbered item because it was never scoped as a Phase 0 fix; needs its own backend build task                         |
| F15 | Language Toggle                   | `SettingsService`                                                     | _(none — local-only)_                                                       | _(none)_                                                                                                                                                                 | `languageStore` (Zustand, persisted AsyncStorage) + `core/i18n`                                 | Language-selection cards (not yet a named component — new, small)                                                   | `(auth)/language`; toggle also surfaced in `(app)/(tabs)/settings`                              | **None** — no backend dependency; per `14-Feature-Dependencies.md`'s own Phase 1 order, this should be built _first_                                                   |
| F16 | Push Notifications (FCM)          | `NotificationService`                                                 | `NotificationRepository` (device-token registration)                        | Device-token storage endpoint **not documented anywhere in `11-API-Contract.md`** — flagged as a gap                                                                     | Device-registered flag in `uiStore`                                                             | _(none UI-specific until F17)_                                                                                      | _(none)_                                                                                        | Native FCM setup (`expo-notifications` + `google-services.json`/APNs config) — infra work, not just app code; undocumented backend storage endpoint                    |
| F17 | In-App Notifications              | `NotificationService`                                                 | `NotificationRepository`                                                    | `GET /api/notifications`, `PATCH /mark-read`, `GET /unread-count`                                                                                                        | RQ (`['notifications','inbox']`, `['notifications','unread-count']`)                            | `NotificationItem`, `LoadingSkeleton`, `EmptyState`, `FlatList`                                                     | `(app)/(tabs)/notifications`                                                                    | **P0-1**                                                                                                                                                               |
| F18 | Data Deletion Request             | `SettingsService`                                                     | `ProfileRepository` (deactivate method)                                     | `POST /api/patient/delete-data`                                                                                                                                          | RQ mutation                                                                                     | `ConfirmationDialog`, `OTPInputBox`                                                                                 | `(app)/data-deletion`                                                                           | **P0-1**; **P0-3** (OTP step not built); **P0-6** (30-day reactivation logic not confirmed)                                                                            |
| F19 | Consent Capture                   | `BookingService` (booking-time) / `AuthService` (signup-time)         | **`ConsentRepository`** _(new — not in Section 6's original 7; added here)_ | **None exist** — `12-Backend-Spec.md` confirms zero API routes reference the `ConsentLog` model                                                                          | Local/ephemeral checkbox state (component-local or `bookingDraftStore`)                         | `ConsentCheckbox`                                                                                                   | Embedded in `(auth)` signup flow and `(app)/booking/[id]` — no dedicated route                  | **P0-4** — zero backend exists; this is the single feature with no partial backend to build against at all                                                             |

### Cross-Feature Blocking Summary

| Blocker                                          | Features it blocks                                                                                                          |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **P0-1** (Bearer auth on 7 cookie-only routes)   | F08, F09, F10, F11, F12, F17, F18 — the largest single blocker, matching `14-Feature-Dependencies.md`'s own framing exactly |
| **P0-4** (ConsentLog has no backend)             | F07 (checkbox has nowhere to submit), F19 entirely                                                                          |
| **P0-2** (Turnstile mobile path)                 | F13                                                                                                                         |
| **P0-3** (Deactivation OTP not built)            | F18                                                                                                                         |
| **P0-5** (Waitlist broadcast/timer mismatch)     | F12                                                                                                                         |
| **P0-6** (30-day reactivation not confirmed)     | F18                                                                                                                         |
| F14's un-scoped missing endpoint                 | F14 itself, and indirectly F08 (the `needsProfile:true` redirect routes through F14)                                        |
| F16's undocumented device-token storage endpoint | F16 itself, and indirectly F06/F09 (both degrade to polling without it)                                                     |

---

## 25. End-to-End Data Flow Diagrams

Each diagram follows the same 8-stage template requested: **UI → State → Service → Repository →
API → Backend → Response → UI**. Steps are numbered in call order; the "Response → UI" stage is
split out explicitly to show what changes in the UI as a _result_ of the round trip, not just that
one occurred.

### 25.1 Login (F01)

```
 1. UI       — S03 Phone Login screen: user types a 10-digit number into `Input`, taps `Button`
               ("Send OTP"). Local validation (src/utils/phone.ts isPhoneValid) runs client-side
               first — invalid numbers never reach Step 2.
 2. State    — useSendOtp() (Feature hook) fires a React Query `useMutation`.
 3. Service  — AuthService.sendOtp(phone) is the mutationFn.
 4. Repository — AuthRepository.sendOtp(phone) — Http or Mock implementation, selected by
               core/config's USE_MOCK_DATA flag.
 5. API      — POST /api/v1/auth/send-otp via src/api/client.ts (no auth header — public endpoint
               per 11-API-Contract.md; 10s timeout; 1 network-failure-only retry).
 6. Backend  — 2Factor SMS dispatch; rate-limited (otpRatelimit, 5/15min per phone).
 7. Response — Flat JSON { message, sessionId, userExists } (NOT the {success,data} envelope —
               API layer's per-endpoint normalizer already knows this shape, per Section 5).
               sessionId is held in Feature-layer state (not persisted) for Step 8's next screen.
 8. UI       — Navigate to (auth)/otp-verify, passing sessionId as a route param. User enters the
               6-digit OTP into OTPInputBox.

 --- second round trip, same screen ---
 9. UI       — Tap "Verify" on OTPInputBox.
10. State    — useVerifyOtp() mutation.
11. Service  — AuthService.verifyOtp({phone, otp, sessionId}).
12. Repository — AuthRepository.verifyOtp(...).
13. API      — POST /api/v1/auth/verify-otp (public, no auth header).
14. Backend  — Validates OTP; creates User row if new; issues accessToken (30min)/refreshToken
               (30-day) with 2-concurrent-session FIFO eviction (Rule S2).
15. Response — Flat JSON { accessToken, refreshToken, expiresIn, userExists, needsProfile, user }.
               AuthService writes both tokens to expo-secure-store via core/storage (NEVER to
               Zustand/AsyncStorage, per Rule SEC1) and updates its in-memory token cache.
16. State    — authStore.isAuthenticated ← true, authStore.user ← the returned public profile
               (name/phone/role only — never the token itself).
17. UI       — (app)/_layout.tsx's auth guard re-evaluates, sees isAuthenticated=true, and either:
               (a) redirects to (app)/profile-edit if needsProfile===true (per F01's documented
               behavior), or (b) redirects to (app)/(tabs)/index (Home) otherwise.
```

### 25.2 Doctor Search (F02/F03)

```
1. UI        — S05 Home: user taps the SearchBar → navigates to (app)/search with an empty query,
               OR types directly and the SearchBar's built-in 300ms debounce (useDebounce, Section
               10) fires.
2. State     — useDoctorSearch(filters) → React Query useInfiniteQuery, key
               ['doctors','search', filters]. Filter selections (from FilterPanel) live in local
               feature state until "Apply Filters" commits them into this query key.
3. Service   — DoctorService.search(filters) is the queryFn.
4. Repository — DoctorRepository.search(filters) — maps filters to the documented query-param
               shape (query|q, speciality, availability, maxFee, minExperience, page, limit).
5. API       — GET /api/v1/patient/search (or POST — same handler) via src/api/client.ts; public,
               no auth header; publicSearchRatelimit (20/min) respected client-side by disabling
               the search input briefly if a 429 is ever returned (Section 13).
6. Backend   — Hard filter (VERIFIED + canShowOnPublic) always applied; 100-doctor safety cap
               before scoring; district/specialty/availability/fee/experience filters applied.
7. Response  — Flat JSON { results, total, isFuzzy, didYouMean, emptyMessage, page, limit,
               hasMore } — Repository maps each `results[]` entry into the typed `Doctor` domain
               shape (src/types/doctor.ts) before returning.
8. UI        — S06 renders `results` via a virtualized `FlatList` of `DoctorCard`s (Section 15);
               `hasMore` drives the infinite-scroll "load next page" trigger; `emptyMessage`
               (if present) selects which of S06's 3 documented empty-state variants to show
               instead of the list.
```

### 25.3 Booking (F07/F08)

```
 1. UI       — S07 Doctor Profile: user taps "Book Appointment Now" → navigates to S08
               (app)/booking/[id]. bookingDraftStore is populated with the doctorId.
 2. State    — S08 renders BookingWidget, fed by a useQuery(['doctors','detail',id]) already
               cached from S05/S06/S07 (no extra network call needed for the preview).
 3. Service  — (preview stage only, no network) BookingService computes the client-side ESTIMATED
               token number/patients-ahead from the cached doctor's current queue count — visibly
               marked "(estimated)" per 10-UX-Writing-Guide.md Section 6, since the real number
               may differ by 1-2 once confirmed.
 4. UI       — User checks the ConsentCheckbox (F19 — locally updates bookingDraftStore state;
               flagged in-code as pending P0-4's backend write path per Section 13's error
               philosophy: build the UI, don't silently drop the requirement). "Confirm Booking"
               becomes enabled only once checked.
 5. UI→State — Tap "Confirm Booking" → useBookingFlow(doctorId) mutation fires, generating a fresh
               UUID `requestId` (Rule B3) via the request-idempotency interceptor (Section 5).
 6. Service  — BookingService.book({doctorId, requestId, ...}) — this is where dailyLimitContext
               ('doctorLevel' vs 'patientLevel') gets decided if a DAILY_LIMIT_REACHED error comes
               back (per 15-Known-Gaps.md §2.2), and where any thrown ApiError.code is mapped to
               its exact 10-UX-Writing-Guide.md Section 6 string.
 7. Repository — BookingRepository.create(payload).
 8. API      — POST /api/patient/book-appointment, Bearer token attached (requires P0-1 to be
               live against the real backend — see Section 24's blocking dependencies for F08).
 9. Backend  — Row-locks the DailyQueue, validates against the 13 B6 conditions, checks Redis
               idempotency key, increments totalTokens, creates QueueToken, commits, then
               fire-and-forgets a Notification row + SMS.
10. Response — Success: { success:true, data:{ success:true, token: <QueueToken> } }. Failure:
               one of the 13 named codes (400) or a 409 (duplicate requestId — treated as success,
               NOT an error, per Section 13) or 500.
11. State    — On success: invalidate ['bookings','my-bookings'] and ['doctors','detail',id]
               (queue counts shifted); clear bookingDraftStore. On failure: mutation's `error`
               state is set; bookingDraftStore is NOT cleared (user's consent checkbox/selection
               persists so they don't have to redo it after e.g. a QUEUE_FULL error).
12. UI       — Success → navigate to (app)/token/[id] (S09) with the REAL token number (never the
               Step 3 estimate). Failure → BookingWidget displays the exact mapped string
               (e.g. "Queue just got full. Join Waitlist?") with the correct recovery action
               (e.g. a button routing to (app)/waitlist/[id] for QUEUE_FULL specifically).
```

### 25.4 Queue Update (F09)

```
1. UI        — S09 Token Tracking screen mounts for a given tokenId.
2. State     — useQueueStatus(tokenId) → useQuery(['queue','token',tokenId]), staleTime: 0,
               refetchInterval: 30_000 (the documented polling fallback) — this interval is
               DISABLED automatically once F16's FCM listener confirms it's receiving live
               TOKEN_CALLED/QUEUE_UPDATE pushes for this session (Section 15's "build against FCM
               from Phase 3, not a polling placeholder" guidance), falling back to polling only
               when FCM isn't available/registered.
3. Service   — QueueService.getTokenStatus(tokenId) is the queryFn.
4. Repository — QueueRepository.getTokenStatus(tokenId).
5. API       — GET /api/patient/bookings/stream-equivalent (the current SSE endpoint per
               11-API-Contract.md F09 needs a non-SSE mobile-viable replacement — this diagram
               assumes the Phase 3 polling/FCM-hybrid design from 14-Feature-Dependencies.md, not
               a literal SSE connection, since SSE requires Bearer + persistent-connection support
               neither of which exists yet).
6. Backend   — Reads current QueueToken.status + DailyQueue's currently-serving token number.
7. Response  — QueueToken with current `status`, position-relevant fields.
8. State     — React Query updates the cache for ['queue','token',tokenId]; if `status` changed
               to CALLED specifically, the Feature hook triggers an accessibilityLiveRegion
               "assertive" announcement (per 09-Component-Library.md Section 3.5's specific
               callout that TOKEN_CALLED warrants interrupting the screen reader).
9. UI        — QueueTracker re-renders: hero token number, "N patients ahead"/"serving #Y",
               progress bar, and the correct one of the 6 documented status-badge strings
               (Waiting/Called/Completed/No Show/Cancelled/Expired) — with [Cancel Booking]
               disabled automatically if the new status is non-cancellable (Rule C1).
```

### 25.5 Profile Update (F14)

```
1. UI        — S13 Profile Edit: ProfileForm pre-filled from authStore.user (name/email/location/
               language); Phone field rendered read-only with the "Phone number cannot be changed"
               accessibility hint (per 09-Component-Library.md Section 3.6).
2. UI        — User edits Name/Email/Location/Language, taps "Save Changes". Client-side
               validation (src/utils/validation.ts) runs first (e.g. email format) — invalid input
               never reaches Step 3.
3. State     — useProfileEdit() mutation fires.
4. Service   — ProfileService.update(payload) — this is also where the offline check happens
               (Rule O2: profile edits are explicitly NOT auto-queued while offline; the Service
               short-circuits with a typed "offline, cannot submit" error if uiStore.isOnline is
               false, rather than attempting and failing the network call).
5. Repository — ProfileRepository.update(payload).
6. API       — Would be a new endpoint — **F14 has no backend endpoint at all** (`04-PRD.md`
               "STATUS: GAP — never built on web"). This step is a documented dead end today: the
               Repository/Service/Feature chain above is buildable and testable now (against a
               Mock repository), but the Http implementation has no real endpoint to call until
               a backend engineer builds one — flagged explicitly rather than invented.
7. Backend   — N/A today (see Step 6).
8. Response  — N/A today; once built, expected to return the updated `User` row.
9. State     — Once wired: invalidate authStore.user (or directly update it from the response) so
               Settings/Profile screens reflect the change without a full re-fetch.
10. UI       — Success toast ("Profile updated") → navigate back to S14 Settings (or S05 Home, if
               reached via the mandatory F01 needsProfile:true first-login redirect). Failure:
               inline field errors (validation) or a "Failed to save changes" banner + [Retry]
               (server errors) — per Section 13's error taxonomy.
```

---

## 26. Definition of Done (Sprint 0 Tasks)

Applies the requested 5-criteria structure (Completion / Validation / QA / Documentation /
Performance) to every task in Section 20's implementation plan (0.1–0.11).

### 0.1 — Tooling & Safety Net (ESLint, Prettier, Jest, RTL)

- **Completion criteria:** `.eslintrc`/`eslint.config.*`, `.prettierrc`, and Jest config files
  exist; `npm run lint`, `npm run format`, and `npm run test` are all defined in `package.json`
  and exit 0 on the current (unmodified) codebase.
- **Validation criteria:** Running `npm run lint` against a deliberately-broken sample file (e.g.
  an unused import) produces a non-zero exit and a readable error; running `npm run test` against
  a trivial passing test produces a green result.
- **QA requirements:** A second engineer (or a fresh AI session with no memory of the setup)
  can clone the repo, run `npm install`, and successfully run all three scripts with no
  undocumented manual steps.
- **Documentation requirements:** `README.md`'s "Run Commands" section is updated to list
  `lint`/`format`/`test`; this Sprint 0 document's own Section 20 row is marked complete with a
  commit reference.
- **Performance requirements:** N/A (tooling task, not a runtime-performance task).

### 0.2 — Scaffold `src/core/`

- **Completion criteria:** `theme/`, `i18n/`, `storage/`, `network/`, `logger/`, `config/`
  subfolders exist, each with at least a placeholder module exporting the interface shape
  described in Sections 8/14/16/18 (implementations may be minimal/stubbed at this stage — this
  task is about establishing the _seam_, not full feature completeness).
- **Validation criteria:** Every other Sprint 0 task (0.3–0.9b) successfully imports from
  `src/core/*` with no circular-dependency errors (verified via `tsc --noEmit` and a manual import
  graph check, since the ESLint boundary rule from Section 23.4 may not be configured yet).
- **QA requirements:** Manually exercise `core/storage`'s SecureStore wrapper with a throwaway
  test value on both a real iOS simulator and a real Android emulator (Keychain/Keystore behavior
  differs by platform and must be confirmed on both, not assumed from one).
- **Documentation requirements:** Each `core/` subfolder has a short header comment stating its
  Section 3 "Forbidden Direction" constraint (Core must never import Feature/Service/Repository/
  API) so a future contributor sees the rule at the point of use, not only in this document.
- **Performance requirements:** `core/logger`'s production no-op path must add zero measurable
  overhead (verified by confirming the Babel console-strip plugin, Section 14, actually removes
  the calls from the production bundle — not just silences them at runtime).

### 0.3 — Extract Design Tokens

- **Completion criteria:** `colors.ts`/`typography.ts`/`spacing.ts`/`radius.ts`/`elevation.ts`/
  `icons.ts` exist under `core/theme/tokens/`; every hardcoded hex color identified in `02.4`
  (`Input.tsx`, `Button.tsx`, `Avatar.tsx`, `DoctorCard.tsx`, `Badge.tsx`, `QueueStatusBadge.tsx`,
  `WaitlistForm.tsx`, `BookingWidget.tsx`, `OTPInput.tsx`) is migrated to import from `colors.ts`;
  `DoctorCard`'s radius is corrected to 16px (or the doc updated, per Section 22 D5's spirit —
  whichever the founder confirms); the Ghost-button 44px height bug is fixed.
- **Validation criteria:** A repo-wide search for a raw 6-digit hex literal outside
  `core/theme/tokens/colors.ts` returns zero matches in `src/components/`.
- **QA requirements:** Visual regression check (manual screenshot comparison, since no automated
  visual-diff tool is in scope for Sprint 0) confirming no component's rendered appearance changed
  as a _side effect_ of the token migration — this task must be a refactor, not a redesign.
- **Documentation requirements:** `08-Design-System.md` is NOT modified (it's Tier 3, this is an
  implementation detail beneath it) — but this document's own Section 8 migration checklist is
  updated to check off each migrated file.
- **Performance requirements:** Zero bundle-size regression (token files are small, pure-constant
  modules — confirm via a before/after bundle size check if a bundle analyzer is available by this
  point, per Section 15).

### 0.4 — Scaffold `src/api/`

- **Completion criteria:** `client.ts`, `interceptors/`, `endpoints/` (one file per F-group,
  every endpoint from `11-API-Contract.md` represented as a typed function even if not yet called
  by anything), `errors.ts`, `queryClient.ts` all exist.
- **Validation criteria:** A unit test confirms the envelope-normalizer correctly parses BOTH
  documented shapes (flat and `{success,data}`) using fixture responses copied verbatim from
  `11-API-Contract.md`'s own documented examples for at least one flat endpoint (`verify-otp`) and
  one wrapped endpoint (`book-appointment`).
- **QA requirements:** Manually point the client at a local mock server (e.g. a simple JSON
  server) or the real staging backend if available, and confirm one real round trip (e.g.
  `send-otp`) succeeds end-to-end through the full interceptor chain.
- **Documentation requirements:** Each `endpoints/*.ts` file's function carries a comment citing
  its exact `11-API-Contract.md` section, matching the existing codebase's strong citation
  discipline.
- **Performance requirements:** Default timeout (10s) and the single-retry-on-network-failure
  policy (Section 5) are both covered by a unit test using a fake/delayed fetch, not just
  documented in prose.

### 0.5 — Scaffold `src/repositories/`

- **Completion criteria:** All 7 (now 9, per Section 24's `LeadRepository`/`ConsentRepository`
  additions) repository interfaces exist with at least a `Mock*` implementation each, backed by
  expanded fixtures in `src/data/` (more than today's single `mockDoctor.ts` — at minimum, a
  mock doctor _list_, a mock booking history, and mock notifications, since several Mock
  repositories need list-shaped data to be useful).
- **Validation criteria:** Every `Mock*Repository` method's return value satisfies its interface's
  declared return type with no `as any`/type-widening escape hatches (consistent with the
  codebase's existing zero-`any` discipline, per `02.4`).
- **QA requirements:** N/A beyond the validation above — Mock repositories have no external system
  to QA against.
- **Documentation requirements:** Each interface file documents which `11-API-Contract.md`
  F-number(s) it corresponds to, and — for `WaitlistRepository`/`ConsentRepository`/
  `LeadRepository` specifically — explicitly notes which methods have NO real backend yet
  (per Section 24's blocking-dependency findings), so nobody assumes `Http*` versions of those
  methods are usable without first checking Section 24/21.
- **Performance requirements:** `Mock*Repository`'s artificial latency uses the shared, cancellable
  `mockDelay(ms, signal)` utility (Section 6) — not a bare `setTimeout` — closing the two
  unmount-safety gaps from `02.4`/`02.5` at the root rather than leaving them to be rediscovered
  per-screen.

### 0.6 — Scaffold `src/services/`

- **Completion criteria:** All 8 original services plus `LeadService` (Section 24) exist, each
  calling its corresponding repository (via the mock/real factory, Section 6); the 13 B6 error
  codes and `dailyLimitContext` disambiguation logic currently living inside
  `BookingWidget.tsx` are ported into `BookingService` (the component itself is updated only to
  the extent of calling the service instead of containing the logic — a refactor explicitly
  scoped for Sprint 0, not a new feature).
- **Validation criteria:** A unit test per service confirms every one of the 13 B6 codes maps to
  the exact `10-UX-Writing-Guide.md` Section 6 string (this is the single highest-value test in
  the entire Sprint 0 test suite, given how central booking error handling is).
- **QA requirements:** Manual walkthrough confirming `BookingWidget` (post-refactor) still renders
  identically to its pre-refactor behavior for every one of the 13 error codes, using the existing
  dev-only Error Simulator UI (`app/booking/[id].tsx`) as the manual test harness.
- **Documentation requirements:** `15-Known-Gaps.md` §2.2's existing entries (about
  `dailyLimitContext`, the non-canonical `bookButtonLabel` default, etc.) are cross-referenced
  from `BookingService`'s own header comment, not duplicated or restated inconsistently.
- **Performance requirements:** No Service method may block the JS thread with synchronous heavy
  computation — all are `async` even where a specific implementation happens to resolve
  synchronously today (mock data), so no call site needs to change when they become real network
  calls.

### 0.7 — Scaffold `src/store/` + Provider Wiring

- **Completion criteria:** `authStore`, `languageStore`, `uiStore`, `bookingDraftStore` exist;
  `app/_layout.tsx` wraps its `<Stack>` in `QueryClientProvider` + a (stub, per 0.2) `ThemeProvider`
  - a (stub) `LanguageProvider`.
- **Validation criteria:** App boots with no runtime error on both iOS and Android after this
  wiring — a provider misconfiguration is the single most likely way this task could silently
  break the entire app, so this must be manually verified on-device/simulator, not just
  `tsc --noEmit`-checked.
- **QA requirements:** Confirm `languageStore`'s persisted value survives an app restart (kill and
  relaunch, not just a JS reload) on both platforms.
- **Documentation requirements:** A short "Provider Order" comment in `_layout.tsx` explaining why
  the providers are nested in the chosen order (e.g. `QueryClientProvider` must wrap anything using
  React Query hooks; `SafeAreaProvider` typically outermost) — this ordering is easy to get subtly
  wrong and costly to debug later.
- **Performance requirements:** Confirm the provider wiring itself adds no visible startup-time
  regression versus the pre-Sprint-0 baseline (ties into the Section 15 startup-instrumentation
  recommendation — measure before and after this task specifically).

### 0.8 — Consolidate Duplicated Utilities

- **Completion criteria:** `src/utils/phone.ts`, `format.ts`, `validation.ts`, `string.ts` exist
  per Section 12; `WaitlistForm.tsx` and `OTPInputBox.tsx` are updated to import
  `isPhoneValid`/`maskPhone` from the shared file instead of their own private copies;
  `DoctorCard.tsx` imports `formatFee`/`initialsFromName` from `format.ts`; `app/booking/[id].tsx`
  imports `snakeCaseToTitleCase` from `string.ts` instead of its private `formatErrorCodeLabel`.
- **Validation criteria:** A repo-wide search confirms zero remaining private/duplicate
  definitions of any of the above function names outside `src/utils/`.
- **QA requirements:** Manual confirmation that `WaitlistForm`'s and `OTPInputBox`'s phone-related
  behavior is unchanged post-migration (e.g. `OTPInputBox`'s masking still shows the same masked
  string for a sample phone number) — this is a pure refactor, behavior must not shift.
- **Documentation requirements:** `02.1`/`02.4`'s TD3 (phone duplication) and the private-helper
  findings are updated with a "Resolved in Sprint 0, see commit X" note, per this project's living-
  document convention (`02-Source-of-Truth.md` Section 4).
- **Performance requirements:** N/A (logic-equivalent refactor, no performance-relevant change
  expected).

### 0.9 — Navigation Shell (Route Groups + Auth Guard + Tab Bar)

- **Completion criteria:** `(auth)/`, `(app)/`, `(app)/(tabs)/`, `(modals)/` route groups exist per
  Section 2's tree; the 3 existing screens (`app/index.tsx`, `doctor/[id].tsx`, `booking/[id].tsx`)
  are moved into `(app)/` with zero JSX/behavior changes; `(app)/_layout.tsx`'s guard correctly
  redirects to `(auth)/phone-login` when `authStore.isAuthenticated` is false.
- **Validation criteria:** Manually toggle `authStore.isAuthenticated` (via a temporary dev-only
  toggle, removed before this task is marked done) and confirm the guard redirects correctly in
  both directions.
- **QA requirements:** Confirm the bottom tab bar renders correctly on both a small (iPhone SE-
  class) and large (tablet-width Android, even though `supportsTablet:false` — some Android
  devices still present a large window) screen size, given `08-Design-System.md`'s "Responsive
  Layout" expectations.
- **Documentation requirements:** This document's own Section 2 folder tree is confirmed accurate
  against the actual post-migration `app/` folder (if anything had to deviate from the plan during
  implementation, that deviation is noted here, not left as a silent drift between doc and code).
- **Performance requirements:** Confirm Expo Router's per-route code-splitting is still working
  post-migration (each route remains its own bundle chunk) — a common mistake when introducing
  route groups is accidentally creating a barrel `index.ts` that eagerly imports every screen.

### 0.9b — `ErrorBoundary` + `Toast` + `NetworkStatus`

- **Completion criteria:** All 3 components exist per their `09-Component-Library.md` Section 6
  contracts; `_layout.tsx` wraps the app in `ErrorBoundary`.
- **Validation criteria:** A deliberately-thrown error inside a test screen is caught by
  `ErrorBoundary` and renders the "Something went wrong" + `[Retry]` fallback instead of crashing
  the app — this must be manually verified by actually throwing an error, not inferred from code
  review alone.
- **QA requirements:** Confirm `Toast`'s `assertive`/`polite` accessibility split (Section 13) is
  audible correctly via VoiceOver (iOS) and TalkBack (Android) — both platforms, since screen
  reader behavior can differ.
- **Documentation requirements:** None beyond the existing component-contract citation convention.
- **Performance requirements:** `NetworkStatus`'s connectivity listener must not cause a
  re-render storm (confirm via React DevTools Profiler or a simple render-count log that toggling
  airplane mode on/off triggers exactly one re-render per state change, not multiple).

### 0.10 — Testing Harness Smoke Test + CI

- **Completion criteria:** `src/utils/phone.test.ts` and `Button.test.tsx` both exist and pass; a
  CI workflow file (e.g. `.github/workflows/ci.yml`) runs lint + `tsc --noEmit` + test on every PR.
- **Validation criteria:** Deliberately break one of the two smoke tests and confirm CI goes red;
  fix it and confirm CI goes green — proving the pipeline actually gates merges, not just that a
  config file exists.
- **QA requirements:** Confirm CI runs in a reasonable time (<5 minutes for this task's minimal
  suite) so it doesn't become a merge-velocity complaint later once more tests are added.
- **Documentation requirements:** `README.md` gains a CI status badge (once a CI provider is
  actually configured) or, at minimum, a "How to run CI checks locally" section.
- **Performance requirements:** N/A (infrastructure task).

### 0.11 — Resolve `BookingWidget` Naming Collision & Booking-Model Decision

- **Completion criteria:** A founder decision is recorded (in `15-Known-Gaps.md` and this
  document's Section 22, superseding D9) on: (a) whether `BookingWidget` is renamed, and (b)
  whether the booking model is time-slot-based (requiring a documented business-rule change) or
  queue-token-based (requiring `BookingWidget`'s slot-selection UI to be rebuilt).
- **Validation criteria:** N/A — this is a decision task, not a code task; "done" means a decision
  exists and is written down, not that code changed (code changes resulting from the decision are
  Sprint 1 work, tracked separately).
- **QA requirements:** N/A.
- **Documentation requirements:** `05-Business-Rules.md` and `09-Component-Library.md` are updated
  to reflect whichever model is chosen, following this project's existing amendment process
  (version bump, "Supersedes" note, per every other doc in `/docs`).
- **Performance requirements:** N/A.

---

## 27. Sprint 0 Readiness Score & Remaining Blockers

### Readiness Score: **84 / 100**

| Dimension                                                                | Score   | Rationale                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design completeness (Sections 1–22, plus this revision's Sections 23–26) | 23 / 25 | All 26 requested design artifacts now exist, each grounded in a specific doc/audit citation; the only reason this isn't 25/25 is that 2 named components discovered while building the Feature Dependency Matrix (`LeadService`, `ConsentRepository`) were additive corrections found _during_ this exercise rather than in the original pass — a sign the design is thorough but not yet exhaustively cross-checked a second time                                                                    |
| Decision closure                                                         | 14 / 20 | 10 of 12 Decision Log entries (Section 22) are fully resolved; 2 (D9 `BookingWidget` collision, D10 Reanimated fate) are explicitly and deliberately left open for founder input — correctly flagged rather than guessed, but they are real open items, not yet closed                                                                                                                                                                                                                                |
| Tooling/process readiness                                                | 15 / 20 | The plan for ESLint/Jest/CI (Task 0.1/0.10) is well-specified with concrete Definition-of-Done criteria (Section 26), but **none of it exists yet** — this is a plan score, not an execution score                                                                                                                                                                                                                                                                                                    |
| Backend-dependency risk                                                  | 12 / 20 | 6 Phase-0 backend items (P0-1–P0-6) plus 2 newly-surfaced gaps (F14's and F16's missing endpoints, Section 24) sit entirely outside mobile's control and block 12 of 19 features from going "real" — the mobile architecture correctly isolates this risk (mock/real swap) but cannot eliminate it                                                                                                                                                                                                    |
| Team/execution readiness                                                 | 20 / 25 | Section 20's phased plan has clear ordering and dependency mapping; the main gap is that **no task owner, estimate, or calendar sequencing exists** — this document deliberately provides dependency order, not time estimates (consistent with `14-Feature-Dependencies.md`'s own stated philosophy of "phase boundaries are dependency boundaries, not time estimates"), which is correct for a design doc but means a project-management pass still has to happen before Sprint 0 can be scheduled |

### Remaining Blockers Before Implementation

**Must resolve before Sprint 0 execution starts (founder/architecture-level):**

1. **D9 — `BookingWidget` naming collision & booking-model decision** (time-slot vs. queue-token).
   Blocks Task 0.11 and, transitively, any Sprint 1 work on F07/F08.
2. **D10 — Reanimated/Worklets dependency fate** (adopt now vs. remove). Low urgency but should
   not remain open indefinitely per Risk R4.
3. **Explicit approval to proceed past this design phase** — per the user's own instruction that
   "Implementation is NOT approved yet," this document itself is a blocker until sign-off is given.

**Must resolve before specific features can go "real" (backend-owned, not mobile-blocking for Sprint 0 itself):** 4. P0-1 (Bearer auth on 7 routes) — blocks F08, F09, F10, F11, F12, F17, F18 from using real data. 5. P0-2 (Turnstile mobile path) — blocks F13. 6. P0-3 (Deactivation OTP) — blocks F18. 7. P0-4 (ConsentLog backend) — blocks F07's consent checkbox and all of F19. 8. P0-5 (Waitlist broadcast/timer) — blocks F12. 9. P0-6 (30-day reactivation logic) — blocks part of F18. 10. F14's entirely-unscoped missing profile-edit endpoint (not even a P0-numbered item today —
needs to be added to a backend backlog explicitly, per Section 24's finding). 11. F16's undocumented device-token storage endpoint (same — newly surfaced by this revision's
Feature Dependency Matrix, not previously tracked in `15-Known-Gaps.md`).

**Process items, not architectural blockers, but required before Sprint 0 can be scheduled on a calendar:** 12. Assign task owners and estimates to Section 20's 11 tasks (explicitly out of scope for this
design document itself, per its "dependency order, not time estimates" approach). 13. Decide CI hosting (GitHub Actions vs. another provider) — Section 20 Task 0.10 assumes GitHub
Actions as an example but this was not confirmed against the actual repo host's capabilities. 14. Confirm whether items 10–11 above should be added to `15-Known-Gaps.md`/
`14-Feature-Dependencies.md` formally (updating Tier 4 docs) before or during Sprint 0 — this
document surfaces them but, per this project's own document-authority hierarchy
(`02-Source-of-Truth.md` Section 1), does not have the authority to amend those Tier-4 docs
itself.

---

_This document is a design blueprint only. No source files were created, modified, or refactored
in the production of this document, other than this document itself. Every folder, layer, and
component named above as "to be built" does not yet exist unless explicitly stated as already
present in the current codebase (cross-referenced throughout to `/docs/audit`)._
