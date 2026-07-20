# Sprint 0 — Milestone 3: Core Foundation — Implementation Report

**Date:** 2026-07-20
**Scope:** Reusable, app-wide infrastructure under `src/core/` (`config/`, `logger/`, `storage/`,
`network/`) plus a new `src/core/errors/` module, documented-only `src/constants/` additions, and
four generic `src/utils/` helper files — no business logic, no API implementation, no
repositories, no feature implementation, per the milestone's explicit instructions.
**References:** `docs/engineering/Sprint-0-Engineering-Design.md` Sections 2, 5, 11, 12, 13, 14,
16, 19, 20; `docs/implementation/M2-Theme-Foundation-Report.md`; `README.md`'s "Environment
Variables" section.

---

## 1. Executive Summary

Built the remaining Core Layer infrastructure Sprint 0 calls for: a typed, environment-aware
configuration module (`core/config`), a pluggable console-backed logger (`core/logger`), generic
storage adapters for `expo-secure-store`/`AsyncStorage` (`core/storage`), and network
infrastructure types plus a NetInfo connectivity wrapper (`core/network`). A new
`core/errors/` module implements the five error classes this milestone's own instructions named
(`AppError`/`NetworkError`/`ValidationError`/`StorageError`/`ConfigurationError`) — a hierarchy
this design document does not itself document, added because M3's own scope explicitly requested
it. `src/constants/` and `src/utils/` gained only the subset of Sections 11/12's catalogued files
that are genuinely generic/documented and not feature- or business-rule-specific. `core/i18n/`
was deliberately left untouched — see Section 9 (Problems Encountered) for why. Three new
Expo-supported native dependencies were installed (`expo-secure-store`,
`@react-native-async-storage/async-storage`, `@react-native-community/netinfo`) to make the
storage/connectivity adapters real rather than placeholder types. No API requests are made, no
backend is called, no repository/service/feature code was touched, and no existing component was
modified.

---

## 2. Files Created

### `src/core/config/` — Environment Configuration

| File | Contents |
|---|---|
| `env.ts` | `AppEnvironment` (`'development' \| 'staging' \| 'production'`) resolved from `EXPO_PUBLIC_APP_ENV` or `__DEV__`; `APP_ENV`/`IS_DEV`/`IS_STAGING`/`IS_PROD`; `API_BASE_URL` (placeholder per-environment URLs, overridable via `EXPO_PUBLIC_API_BASE_URL` — the exact variable name `README.md` already plans); `API_TIMEOUT_MS` (10 000, per Section 5) |
| `index.ts` | Barrel — the one import point, `@/core/config` |

### `src/core/logger/` — Logging Abstraction

| File | Contents |
|---|---|
| `types.ts` | `LogLevel`; `LoggerProvider` interface (the pluggable seam) |
| `providers/consoleProvider.ts` | `consoleLoggerProvider` — thin `console.*` wrapper, the only file allowed to call `console.*` directly |
| `providers/noopProvider.ts` | `noopLoggerProvider` — silent, the production default |
| `logger.ts` | `logger.debug/info/warn/error(...)`; `setLoggerProvider()` to swap providers later |
| `index.ts` | Barrel — `@/core/logger` |

### `src/core/storage/` — Storage Abstraction

| File | Contents |
|---|---|
| `types.ts` | `StorageAdapter` interface (`getItem`/`setItem`/`removeItem`/`clear`) — generic, no auth/token knowledge |
| `secureStoreAdapter.ts` | `SecureStoreAdapter` — wraps `expo-secure-store`; `clear()` throws (no native "clear all" API) |
| `asyncStorageAdapter.ts` | `AsyncStorageAdapter` — wraps `@react-native-async-storage/async-storage` |
| `index.ts` | Barrel — `@/core/storage` |

### `src/core/network/` — Network Foundation

| File | Contents |
|---|---|
| `types.ts` | `HttpMethod`, `RequestConfig`, `ApiResponse<T>`, `RequestInterceptor`/`ResponseInterceptor` type placeholders |
| `config.ts` | `NETWORK_CONFIG` — default timeout (sourced from `core/config`) + default headers |
| `connectivity.ts` | `isConnected()`, `subscribeToConnectivity()` — `@react-native-community/netinfo` wrapper |
| `index.ts` | Barrel — `@/core/network` |

### `src/core/errors/` — Error Architecture (new module, see Section 8 below)

| File | Contents |
|---|---|
| `AppError.ts` | Base class — `message`, optional `code`, optional `cause` |
| `NetworkError.ts` | Extends `AppError`; adds `retryable` |
| `ValidationError.ts` | Extends `AppError`; adds `field` |
| `StorageError.ts` | Extends `AppError` |
| `ConfigurationError.ts` | Extends `AppError` |
| `index.ts` | Barrel — `@/core/errors` |

### `src/constants/`

| File | Contents |
|---|---|
| `storageKeys.ts` | `STORAGE_KEYS` — named key strings only (`auth.accessToken`, `auth.refreshToken`, `settings.language`); nothing reads/writes them |
| `featureFlags.ts` | `FEATURE_FLAGS` — `USE_MOCK_DATA`, `ENABLE_TEST_OTP` (dev-only), `ENABLE_ANALYTICS` (false) |

### `src/utils/`

| File | Contents |
|---|---|
| `date.ts` | `isToday()`, `isTomorrow()`, `formatRelativeTime()` |
| `string.ts` | `snakeCaseToTitleCase()`, `truncateWithEllipsis()` |
| `validation.ts` | `isRequired()`, `hasMinLength()`, `hasMaxLength()`, `isNameValid()` — generic only |
| `format.ts` | `initialsFromName()`, `formatCurrency()` (generic `Intl.NumberFormat` wrapper, defaults to `en-IN`/`INR`) |

### `docs/implementation/M3-Core-Foundation-Report.md` — this report.

`.gitkeep` placeholders deleted from `src/core/config/`, `src/core/logger/`,
`src/core/storage/`, `src/core/network/`, `src/constants/`, and `src/utils/` — each directory is
no longer empty. `src/core/i18n/`'s `.gitkeep` was **not** deleted (see Section 9).

---

## 3. Files Modified

| File | Change |
|---|---|
| `package.json` | Added 3 dependencies (Section 10) |
| `package-lock.json` | Lockfile update from the above |
| `app.json` | `expo-secure-store`'s config plugin auto-registered under `"plugins"` by `npx expo install` |
| `docs/engineering/Sprint-0-Engineering-Design.md` | Added an M3 status block (same pattern as M1/M2's) documenting what was and wasn't built, and flagging the i18n citation issue |

No component, screen, service, repository, or store file was touched.

---

## 4. Core Architecture

```
src/core/
├── config/
│   ├── env.ts
│   └── index.ts
├── logger/
│   ├── types.ts
│   ├── providers/
│   │   ├── consoleProvider.ts
│   │   └── noopProvider.ts
│   ├── logger.ts
│   └── index.ts
├── storage/
│   ├── types.ts
│   ├── secureStoreAdapter.ts
│   ├── asyncStorageAdapter.ts
│   └── index.ts
├── network/
│   ├── types.ts
│   ├── config.ts
│   ├── connectivity.ts
│   └── index.ts
├── errors/
│   ├── AppError.ts
│   ├── NetworkError.ts
│   ├── ValidationError.ts
│   ├── StorageError.ts
│   ├── ConfigurationError.ts
│   └── index.ts
├── theme/          # M2, untouched
└── i18n/           # untouched — .gitkeep only, see Section 9
```

Each module exposes a single clean barrel (`@/core/config`, `@/core/logger`, `@/core/storage`,
`@/core/network`, `@/core/errors`), matching `core/theme`'s existing M2 precedent — consumers
never need to know the internal file layout.

**Dependency direction:** `storage`/`network`/`logger` all import from `errors` and/or `config`
(`core → core`, allowed); nothing in `core/` imports from `api/`, `repositories/`, `services/`,
`features/`, `store/`, or `components/` (all forbidden per Section 2's Folder Responsibilities
table — "zero dependency on any other `src/` folder except `utils/`" — and confirmed zero here,
since this milestone didn't need `utils/` from `core/` either).

---

## 5. Configuration Layer

- **One import point:** everything is re-exported from `@/core/config`, per this milestone's
  explicit requirement.
- **Strongly typed:** `AppEnvironment` is a 3-value union, not a bare `string`.
- **No hardcoded URLs outside this module:** `API_BASE_URL` is the only place a base-URL literal
  exists in the codebase; every other file that needs it (e.g. the future `core/network`
  consumers) imports it from here.
- **No secrets/real credentials:** the per-environment URLs are placeholders
  (`https://api-{dev,staging}.jivnicare.example`, `https://api.jivnicare.example`) — `.example` is
  not a real, resolvable domain. `README.md`'s own "Environment Variables" section already states
  "None are currently required... no network calls or API base URL are wired up yet," confirming
  no real backend URL exists anywhere in this repo's documentation to use instead of a
  placeholder.
- **Dev/prod/staging ready:** `EXPO_PUBLIC_APP_ENV` can force any of the three; absent that, it
  falls back to RN's own `__DEV__` so a fresh checkout works with zero env-var setup.
- **`EXPO_PUBLIC_API_BASE_URL`** is honored as an override — the exact variable name `README.md`
  already documents as "planned."

---

## 6. Logger Design

- `logger.debug/info/warn/error(...)` — all four levels, per the requirement.
- **Console-backed:** the `consoleLoggerProvider` is a thin `console.*` wrapper; it is the only
  file permitted to call `console.*` directly, matching Section 14's "the logger [is] the only
  sanctioned surface" intent.
- **Pluggable for the future:** `setLoggerProvider()` is the single seam a Crashlytics/Sentry
  integration would use later — no call-site changes needed anywhere else when that happens. No
  external service is integrated now.
- **Production-quiet without a new build dependency:** Section 14 achieves zero production console
  output via a Babel plugin (`babel-plugin-transform-remove-console`). This milestone's own
  Logger requirements list doesn't ask for that plugin, so instead the *default provider* is
  environment-selected — `consoleLoggerProvider` in development, `noopLoggerProvider` (silent) in
  production — achieving the same observable outcome at the `LoggerProvider` level, with no new
  dependency. Flagged here as a deliberate implementation choice, not a silent scope change.

---

## 7. Storage Design

- **Interfaces + adapters, not a full storage system:** `StorageAdapter` is the single interface;
  `SecureStoreAdapter` and `AsyncStorageAdapter` are the two concrete implementations the
  milestone named. Both are generic key/string-value adapters with zero knowledge of auth, tokens,
  or any specific key — matching "Do NOT implement authentication storage. Do NOT store tokens."
  exactly.
- **`SecureStoreAdapter.clear()` throws** rather than silently no-op-ing, because
  `expo-secure-store` genuinely has no native "delete everything" API — documented as an explicit
  limitation in the code, not a bug.
- Both adapters wrap every underlying call in a `try/catch` that re-throws as a `StorageError`
  (Section 8's new error hierarchy), so a future consumer never has to catch a raw,
  library-specific exception type.
- **Nothing calls these adapters yet.** No `tokenStorage.ts`, no `AuthService` wiring — that
  remains a future milestone's job per Section 16.

---

## 8. Network Foundation

This milestone's "Network Foundation" checklist (base configuration, request/response types,
future interceptor structure, API error types, timeout configuration) overlaps two *different*
places in the design document: `core/network`'s own folder-tree description ("NetInfo wrapper,
connectivity singleton") and Section 5's separate `src/api/` layer (`client.ts`, `errors.ts`,
`interceptors/`). Since building an actual HTTP client class would mean building `src/api/`
— which the Engineering Rules explicitly forbid ("Never implement APIs") and which isn't named
anywhere in this milestone's own `src/core/` module list — this milestone built only:

- **`connectivity.ts`** — the literal, unambiguous `core/network` deliverable: a
  `@react-native-community/netinfo` wrapper (`isConnected()`, `subscribeToConnectivity()`). Not
  wired into a Zustand `uiStore` (out of scope; Zustand isn't part of Core Foundation).
- **`types.ts`** — `RequestConfig`, `ApiResponse<T>`, `HttpMethod`, and interceptor-hook type
  aliases (`RequestInterceptor`/`ResponseInterceptor`) — pure type declarations, zero runtime
  logic, so nothing here "is" an API client.
- **`config.ts`** — `NETWORK_CONFIG` (default timeout + default headers), sourced from
  `core/config` rather than duplicating the value.

**API error types** are satisfied by `core/errors`' new `NetworkError` class (Section 8 below),
not a separate `ApiError` — Section 5's `ApiError` (HTTP-status/response-code specific) remains
un-built and belongs to the future `src/api/errors.ts`, once that layer exists.

No `client.ts`, no `fetch` wrapper, no interceptor implementation, no endpoint code.

---

## 9. Problems Encountered

1. **`core/i18n` is listed as an M3 "example (only if documented)," but nothing documents it.**
   The design document cites an i18n architecture at two different section numbers — the folder
   tree (line 141) says "`i18n/` ... (Section 18)," and the Accessibility Strategy table
   (line 975) says "Section 22's i18n architecture decision" — and neither citation resolves to
   real content: Section 18 is actually "Accessibility Strategy" (no `LanguageProvider`/`t()`
   design in it), and Section 22 (Phase 0.11's "Section 22" reference) is actually the
   `BookingWidget` time-slot-vs-token-model naming-collision decision, not i18n. Grepping the
   entire document for `LanguageProvider`/`t('key')`/string-resource-format specifics turns up only
   *consumers* of a future i18n system (`languageStore`, `SettingsService`, `useLanguageToggle()`)
   — never its actual architecture. Since this milestone's own instructions independently gate
   every `core/` example on "only if documented," and there is no dedicated build section for it
   in this milestone's own numbered scope (unlike config/logger/storage/network, which each get
   one), `core/i18n/` was left as its `.gitkeep` skeleton rather than guessed into existence.
   Flagged here rather than silently skipped — a future milestone will need a real i18n design
   decision (or a corrected section citation) before building it, given D6 (line 1137) already
   locks "build the `LanguageProvider`/`t()` architecture in Sprint 0" as a project decision that
   this document just hasn't actually specified yet.
2. **The `AppError`/`NetworkError`/`ValidationError`/`StorageError`/`ConfigurationError` hierarchy
   this milestone's own instructions name isn't in the design document either** — it documents
   exactly one error class (`ApiError`, Section 5, scoped to `src/api/errors.ts`). Resolved by
   treating this milestone's own explicit, by-name request as sufficient authorization for new,
   well-scoped infrastructure (the instruction said "use inheritance *if documented*" — implying
   discretion over the inheritance shape where it isn't) — built as a new `core/errors/` module
   rather than guessed elsewhere, and flagged prominently rather than silently added.
3. **Overlap between "Network Foundation" (this milestone) and Section 5's `src/api/` layer**
   (out of scope) — resolved per Section 8 above: build only the parts assignable to
   `core/network` without constructing anything that functions as an HTTP client.
4. **`src/constants/`'s and `src/utils/`'s documented file catalogs (Sections 11/12) include
   several feature- or business-rule-specific files** (`routes.ts` names doctor/booking/token
   routes; `businessRules.ts`, `specialties.ts` are explicitly business/feature domains;
   `queryKeys.ts` only exists to support React Query, itself out of scope; `phone.ts`/`queue.ts`
   are phone-auth and queue domains respectively). Resolved by building only the subset that is
   both documented and generic, per this milestone's own "no feature constants"/"generic only"
   instructions — the exclusions are listed explicitly in Sections 2 above and 12
   (Technical Debt) rather than silently dropped.
5. **No new dependency was pre-approved for `storage`/`network`.** Building working adapters (not
   just paper interfaces) for "SecureStore, AsyncStorage" and a "NetInfo wrapper" required
   installing `expo-secure-store`, `@react-native-async-storage/async-storage`, and
   `@react-native-community/netinfo` — none were previously installed. All three are
   Expo-SDK-57-compatible, officially Expo-supported packages installed via `npx expo install`
   (which resolves the correct compatible version automatically), consistent with the milestone
   naming these exact two storage technologies and "NetInfo" by name. Flagged explicitly in
   Section 10 rather than silently added.

No other issues were encountered.

---

## 10. Dependency Changes

| Package | Version | Why |
|---|---|---|
| `expo-secure-store` | `~57.0.1` | Backs `SecureStoreAdapter` — the exact technology this milestone names ("SecureStore") |
| `@react-native-async-storage/async-storage` | `2.2.0` | Backs `AsyncStorageAdapter` — the exact technology this milestone names ("AsyncStorage") |
| `@react-native-community/netinfo` | `12.0.1` | Backs `core/network/connectivity.ts` — the exact technology the design doc's folder tree names ("NetInfo wrapper") |

All three installed via `npx expo install <pkg>`, which pins SDK-57-compatible versions
automatically (not manually guessed version numbers). `expo-secure-store` auto-registered its
config plugin in `app.json`'s `"plugins"` array (standard Expo behavior for this package — no
manual `app.json` edit was made). No Axios, no other HTTP library, no i18n library, no state
library was added — none of those were requested or needed by what this milestone actually
builds.

---

## 11. Validation Results

### Lint Status

`npm run lint` → **exit 0. 0 errors, 8 warnings.** Identical warning count/content to the M1/M2
baseline (`Input.tsx`'s pre-existing inline style; `OTPInput.tsx`'s `array-type` and 6×
`react-hooks/refs` warnings) — **zero new warnings** from any M3 file.

### TypeScript Status

`npx tsc --noEmit` → **0 errors.**

### Format Status

`npm run format:check` (`prettier --check .`) → **all matched files use Prettier code style.**

### Expo Status

| Check | Result |
|---|---|
| `npx expo-doctor` | ⚠️ 19/20 checks passed — same single pre-existing failure as M1/M2 (`react-native-worklets`/`react-native-reanimated` minor/patch drift, already documented, not introduced by this milestone) |
| `npx expo export --platform android` | ✅ Bundled successfully (3459 modules — unchanged from M2's count, since nothing in `app/` imports any new `core/`/`constants/`/`utils/` file yet — expected for pure, unconsumed infrastructure) |
| `npx expo export --platform ios` | ✅ Bundled successfully (3368 modules — likewise unchanged from M2) |

### Build Status

Both platform exports succeed with the app's rendered output byte-for-byte unaffected — no
component, screen, or provider tree was touched, and none of this milestone's new modules are
imported from `app/` yet.

---

## 12. Remaining Risks

1. **`core/i18n/` remains an empty skeleton** (Section 9, item 1) — the design document's i18n
   architecture citations are broken/unresolvable as written; a future milestone needs either a
   corrected section reference with real content, or a fresh design decision, before building it.
   This is a real risk given D6 already locks i18n as a Sprint-0-or-immediate-Sprint-1
   requirement and F15/Rule ACC6 are launch-blocking.
2. **The new `core/errors/` hierarchy and Section 5's future `ApiError` are two separate,
   unreconciled error shapes** (`NetworkError.retryable` vs. `ApiError.retryable`,
   `NetworkError.code` vs. `ApiError.code`). They're deliberately not the same class (Section 8),
   but whoever builds `src/api/` next should decide explicitly whether `ApiError` extends
   `AppError` or stays fully independent — not yet decided by any document.
3. **None of this milestone's modules have any consumer yet** — by design (Core Foundation, no
   feature implementation), but it means none of this code has been exercised at runtime beyond
   type-checking and a successful bundle. The first real consumer (e.g. `src/api/client.ts` reading
   `core/config`, or a future `AuthService` using `core/storage`) is the first real integration
   test.
4. **`formatCurrency()`/`initialsFromName()` are not wired into `DoctorCard.tsx`'s existing
   private duplicates** — same category of risk M2 flagged for theme tokens: the new utilities
   are correct and available, but the duplicated logic they're meant to eventually replace still
   exists independently in the component.
5. **8 pre-existing lint warnings remain unfixed** — unchanged, carried over from M1/M2.

---

## 13. Technical Debt

| # | Item | Source | Notes |
|---|---|---|---|
| TD-M3-1 | `core/i18n/` not built | Design doc's i18n architecture citations don't resolve to real content (Section 9) | See Remaining Risks #1 |
| TD-M3-2 | `core/errors` (new) vs. future `src/api/errors.ts::ApiError` not reconciled | Two separate error designs from two separate sources | See Remaining Risks #2 |
| TD-M3-3 | `src/constants/routes.ts`, `businessRules.ts`, `specialties.ts`, `queryKeys.ts` not built | Feature/business-rule/React-Query-specific, excluded per this milestone's own scope | Build alongside the features/state layer that actually needs them |
| TD-M3-4 | `src/utils/phone.ts`, `queue.ts`, `a11y.ts` not built | Domain-specific (phone/auth, queue, accessibility-label composition) or not named in this milestone's own utility examples | Build alongside the relevant feature milestone |
| TD-M3-5 | `formatCurrency()`/`initialsFromName()` not wired into `DoctorCard.tsx`'s existing private duplicates | Component-level consumer migration, out of this milestone's scope | See Remaining Risks #4 |
| TD-M3-6 | No Babel-level production console stripping (Section 14's `babel-plugin-transform-remove-console`) | Achieved the same outcome at the `LoggerProvider` level instead, without a new build dependency | Revisit if a future crash-reporting SDK integration wants call-site-level stripping too |
| TD-M1-1…5, TD-M2-1…4 | Carried over from M1/M2 | Prior reports | Unchanged by this milestone |

---

## 14. Rollback Plan

This milestone is additive only — no existing file's runtime behavior was changed (only
`package.json`/`package-lock.json`/`app.json` gained new entries, and the design doc gained a
new, clearly-delimited status block). To roll back:

1. `git revert` this milestone's commit (single commit, `[M3] Core Foundation`).
2. `npm install` to resync `node_modules` with the reverted `package.json`/`package-lock.json`.
3. No data migration, no state to unwind, no consumer code references any of these modules yet —
   reverting is a clean, zero-side-effect operation.

---

## 15. Ready for Review

**YES.**

`npm run lint` (exit 0, 0 new warnings), `npx tsc --noEmit` (0 errors), `npm run format:check`
(clean), and both platform export builds all succeed with the app's output unaffected. Every
module built maps to an explicit instruction in this milestone's scope; every exclusion
(`core/i18n`, `src/api/`, feature-specific constants/utils) is documented with its reasoning in
Sections 9 and 12–13 rather than silently dropped. The two genuine documentation ambiguities found
(i18n's broken section citations; the undocumented error-class hierarchy) were resolved using the
milestone's own explicit instructions and the design document's own self-qualifying language
("only if documented," "use inheritance if documented") rather than guessed past — flagged
explicitly for the next milestone's planning.
