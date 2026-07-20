# Sprint 0 — Milestone 4: API Foundation — Implementation Report

**Date:** 2026-07-20
**Scope:** The non-endpoint half of `src/api/` — a generic HTTP client, request/response
type infrastructure, interceptor *architecture* (no interceptor logic), transport-level error
mapping, and endpoint-folder placeholders — no feature APIs, no business logic, no repositories,
no services, no screen integration, per the milestone's explicit instructions.
**References:** `docs/engineering/Sprint-0-Engineering-Design.md` Sections 2, 5, 19, 20;
`docs/implementation/M3-Core-Foundation-Report.md`; `docs/11-API-Contract.md` (the project's
locked API specification — see Section 9, API Contract Cross-Check, for the required
conflict-check).

---

## 1. Executive Summary

Built `src/api/`'s transport-foundation layer: `ApiClient`/`apiClient` (a generic, typed `fetch`
wrapper using `core/config` for its base URL/timeout and `core/network`'s types for its
request/response shapes), an interceptor *registry* with zero interceptors registered, transport
error mapping into `core/errors` (plus one new class, `UnknownError`, added to that module), three
new generic API types (`ApiErrorResponse`, `PaginatedResponse<T>`, `RequestOptions`), and six
`export {}` placeholder folders under `src/api/endpoints/` matching this milestone's own named
list. Nothing calls the client, nothing implements an endpoint function, and nothing integrates
with a screen — `apiClient` has zero consumers anywhere in the codebase after this milestone,
exactly as instructed. Cross-checked `docs/11-API-Contract.md` against
`docs/engineering/Sprint-0-Engineering-Design.md` before writing any code, per this milestone's
explicit "if the API Contract conflicts with the Engineering Design, STOP and report" instruction
— found no blocking conflict (Section 9 below details why).

---

## 2. Files Created

### `src/api/` — API Client, Error Mapping, Interceptors, Types

| File | Contents |
|---|---|
| `client.ts` | `ApiClient` class + default `apiClient` instance — `request<T>(path, method, options)`: merges default/per-request headers, runs it through the (empty) request-interceptor pipeline, `fetch`es with an `AbortController`-based timeout, runs the result through the (empty) response-interceptor pipeline, and maps any thrown transport failure via `mapTransportError` |
| `errors.ts` | `assertValidBaseUrl()` (fails fast on a malformed base URL → `ConfigurationError`); `mapTransportError()` (abort/timeout/network failure → `NetworkError`; anything else → `UnknownError`) |
| `interceptors/registry.ts` | `registerRequestInterceptor()`/`registerResponseInterceptor()` + `runRequestInterceptors()`/`runResponseInterceptors()` — an ordered pipeline, both arrays starting (and staying) empty |
| `interceptors/index.ts` | Barrel, documents the four anticipated future interceptors (auth, logging, retry, refresh-token) per Section 5 |
| `types/common.ts` | `ApiErrorResponse`, `PaginatedResponse<T>`, `RequestOptions`; re-exports `core/network`'s `ApiResponse`/`HttpMethod` rather than redefining them |
| `types/index.ts` | Barrel |
| `endpoints/auth/index.ts` | `export {}` placeholder — future F01 home |
| `endpoints/doctor/index.ts` | `export {}` placeholder — future F02/F03 home |
| `endpoints/booking/index.ts` | `export {}` placeholder — future F08 home |
| `endpoints/queue/index.ts` | `export {}` placeholder — future F09/F11/F12 home |
| `endpoints/profile/index.ts` | `export {}` placeholder — flags that `docs/11-API-Contract.md` documents no profile-edit endpoint at all yet |
| `endpoints/notifications/index.ts` | `export {}` placeholder — future F17 home |
| `index.ts` | Top-level barrel — `@/api` |

### `src/core/errors/` — one addition to the existing M3 module

| File | Contents |
|---|---|
| `UnknownError.ts` | Extends `AppError` — catch-all for a transport failure that isn't confidently `NetworkError` or `ConfigurationError` |

### `docs/implementation/M4-API-Foundation-Report.md` — this report.

`.gitkeep` placeholders deleted from `src/api/endpoints/` and `src/api/interceptors/` (M1's
skeleton folders — each is no longer empty).

---

## 3. Files Modified

| File | Change |
|---|---|
| `src/core/errors/index.ts` | Added one export line for the new `UnknownError` class (see Section 9, item 2, for why this counts as "modifying a previous milestone" and why it was done anyway) |
| `docs/engineering/Sprint-0-Engineering-Design.md` | Added an M4 status block (same pattern as M1–M3's) |

No component, screen, service, repository, store, or `core/config`/`core/logger`/`core/storage`/
`core/network` file was touched.

---

## 4. API Architecture

```
src/api/
├── client.ts
├── errors.ts
├── types/
│   ├── common.ts
│   └── index.ts
├── interceptors/
│   ├── registry.ts
│   └── index.ts
├── endpoints/
│   ├── auth/index.ts
│   ├── doctor/index.ts
│   ├── booking/index.ts
│   ├── queue/index.ts
│   ├── profile/index.ts
│   └── notifications/index.ts
└── index.ts
```

**Dependency direction:** `src/api/**` imports only from `@/core/**` (`api → core`, the one
allowed direction per `eslint.config.js`'s `boundaries/dependencies` policy — verified: `npm run
lint` reports zero boundary violations). Nothing in `src/api/` imports from `repositories/`,
`services/`, `features/`, `store/`, or `components/`.

`ApiClient` wraps the platform `fetch` API directly — no Axios or other HTTP library was added,
matching Section 5's explicit "no heavyweight HTTP library needed at this endpoint count"
decision.

---

## 5. Request Pipeline

- **Default headers:** `ApiClientConfig.defaultHeaders` (sourced from `core/network`'s
  `NETWORK_CONFIG.defaultHeaders`), merged with any per-request `RequestOptions.headers`.
- **Request configuration:** `core/network`'s `RequestConfig` type (`method`, `headers`,
  `timeoutMs`, `signal`) — reused, not redefined, per the "Uses Core Network types" requirement.
- **Request context:** `RequestOptions.isPublic` — the flag a future auth interceptor will read
  to decide whether to skip attaching a Bearer token (Section 5: "Public endpoints... explicitly
  opt out of the auth-header interceptor"). Nothing reads it yet.
- **Future auth header injection:** the request pipeline runs every registered request
  interceptor (`runRequestInterceptors`) before `fetch` is called — the seam a future auth
  interceptor plugs into. **No authentication is injected** — the registry is empty.
- **Timeout:** implemented via `AbortController` + `setTimeout(() => controller.abort(), timeoutMs)`,
  defaulting to `core/config`'s `API_TIMEOUT_MS` (10s), overridable per-request.

---

## 6. Response Pipeline

- **Typed success responses:** `ApiClient.request<TData>()` returns `core/network`'s
  `ApiResponse<TData>` (`{ data, status }`) — generic over whatever type the future caller
  expects.
- **Typed error responses:** `ApiErrorResponse` (`status`, `code?`, `message`, `retryable`) is
  reserved for a future envelope-normalizing response interceptor to construct — not built here
  (see Section 8).
- **Response transformation hooks:** `runResponseInterceptors()` — every registered response
  interceptor runs against the raw `ApiResponse` before `request()` returns it. Empty registry;
  no transformation happens.
- **No business mapping:** a non-2xx HTTP response that `fetch` itself didn't throw on is
  returned as an ordinary, typed `ApiResponse` (whatever JSON body came back, verbatim) — nothing
  in this milestone inspects `status`/`data` to decide what it means. Per
  `docs/11-API-Contract.md`'s Response Envelope section, some endpoints wrap errors as
  `{success:false, error}` and others return flat JSON — interpreting either is deliberately left
  to a future Repository/Service layer, not this Foundation layer.

---

## 7. Interceptor Design

`src/api/interceptors/registry.ts` is an ordered-registration pipeline — `registerRequestInterceptor()`/
`registerResponseInterceptor()` push onto two arrays; `runRequestInterceptors()`/
`runResponseInterceptors()` fold every registered interceptor over the config/response in
registration order. **Both arrays start empty and nothing in this milestone calls either
`register*` function** — per "Create interceptor architecture only... Do NOT implement their
logic."

Four future interceptors are documented (not built) per Section 5's Interceptors table:

| Interceptor | Future responsibility |
|---|---|
| Auth | Attach `Authorization: Bearer <token>`; skip when `RequestOptions.isPublic` |
| Logging | Dev-only request/response logging via `core/logger` |
| Retry | One automatic retry for idempotent GETs on network failure only (never on 429/503) |
| Refresh-token | Silent 401 → `AuthService.refresh()` → replay the original request once |

---

## 8. API Types

| Type | Source | Notes |
|---|---|---|
| `ApiResponse<T>` | Re-exported from `core/network` (M3) | Not redefined — "Uses Core Network types" |
| `HttpMethod` | Re-exported from `core/network` (M3) | Same |
| `ApiErrorResponse` | New | `{status, code?, message, retryable}` — mirrors Section 5's documented (not-yet-built) `ApiError` shape; reserved, not constructed by anything in this milestone |
| `PaginatedResponse<T>` | New | `{items, page, limit, hasMore, total?}` — generic; field names mirror `docs/11-API-Contract.md`'s F02/F03 Search response shape without being a Doctor-specific DTO |
| `RequestOptions` | New | `{headers?, timeoutMs?, signal?, body?, isPublic?}` — the per-request config `ApiClient.request()` accepts |

**Serialization (Section 8 of this milestone's scope):** not built. `docs/engineering/Sprint-0-Engineering-Design.md`
does not document any serialization helper anywhere (confirmed by grepping the full document for
"serializ"/"encode"/"decode" — zero matches); this milestone's own instruction gates it on "only
if documented." `ApiClient.request()` still does the one universally-needed step —
`JSON.stringify(options.body)` when a body is present — inline, since that's an unavoidable part
of making any HTTP POST/PATCH work at all, not a reusable "helper" beyond that.

---

## 9. Error Mapping

`src/api/errors.ts` maps two categories of transport-level failure — never HTTP status codes or
response bodies — into `core/errors` types:

| Failure | Mapped to | Why |
|---|---|---|
| Malformed/empty `baseUrl` (checked via `new URL()` before any `fetch` call) | `ConfigurationError` | A configuration mistake, not a runtime network condition |
| `AbortError` (timeout or caller-cancelled) | `NetworkError` (`retryable: true`) | A network-adjacent failure that's typically safe to retry |
| Any other `TypeError` from `fetch` itself | `NetworkError` (`retryable: true`) | `fetch` throws a bare `TypeError` for connectivity failures (offline, DNS, connection refused); the base URL was already validated, so this is assumed to be connectivity, not configuration |
| Anything else (e.g. malformed response body that fails to parse) | `UnknownError` | New class (Section 3) — a deliberate catch-all rather than mis-filing an unclassified failure as `NetworkError` |

**Feature-specific errors are explicitly not implemented** — the 13 named B6 booking codes, F12's
`isTaken` race-condition flag, and every other documented business-error shape in
`docs/11-API-Contract.md` stay out of this file, per "Do not implement feature-specific errors."

### API Contract Cross-Check (required by this milestone)

Read `docs/11-API-Contract.md` in full and checked every discrepancy it raises against
`docs/engineering/Sprint-0-Engineering-Design.md` before writing any code. **No blocking conflict
found** — every major discrepancy the contract surfaces was already anticipated and reconciled by
the design document's existing Section 5 text:

| Contract says | Design doc (Section 5) already says | Conflict? |
|---|---|---|
| Blocker 1: almost every patient route is cookie-only today, not Bearer-compatible | "This client-side design is correct regardless of the backend's current Blocker 1 state... the mobile client always sends Bearer tokens per the locked platform decision; the backend catching up... is an external dependency... not a reason to design the client differently" | No — already explicitly addressed and resolved in the design doc |
| 4+ endpoints (`send-otp`, `verify-otp`, `refresh`, `v1/patient/search`) return flat JSON, not the `{success,data}` envelope | "Converts both documented envelope shapes (flat vs. `{success,data}`, per `11-API-Contract.md`'s explicit warning that 4+ endpoints are flat) into one consistent `Result<T>`... via a per-endpoint adapter, never a blanket parser" | No — the design doc cites this exact contract warning by name |
| Business-Rules' field name `idempotencyKey` is wrong; the real field is `requestId` | Section 5's Interceptors table already names the field `requestId` | No — design doc already uses the corrected name |
| Access token is 30 minutes, not the 15 minutes Business-Rules/PRD state | Design doc's Service-layer table already says "30-min access token lifecycle" | No — design doc already has the corrected value |
| Blockers 2/3, F19's missing backend, F12's expiry-window/top-2-vs-3 inconsistencies | Not specific to API *architecture* — these are backend-completeness gaps and inter-document (Business-Rules/PRD) corrections, not Engineering-Design conflicts | No — out of this milestone's architectural scope; flagged in the new `endpoints/queue/index.ts`/`booking/index.ts` placeholder comments for whoever builds those domains next |

Since none of this milestone's actual deliverables (a generic client, empty interceptor registry,
generic types, transport error mapping, placeholder folders) depend on resolving Blocker 1–3 or
F19, none of these open items blocked writing this milestone's code — they're carried forward as
risks (Section 12) for the milestones that will.

---

## 10. Endpoint Organization

`src/api/endpoints/{auth,doctor,booking,queue,profile,notifications}/index.ts` — exactly the six
folders this milestone's own Section 7 named (not Section 2's slightly different repository-layer
list, which also includes `waitlist/`; this milestone's explicit list was followed rather than
guessing an extra folder in). Each is a single `export {}` placeholder with a doc comment naming
the F-number(s) it will eventually implement and any relevant contract caveat. No endpoint
function, no fetch call, no repository/service reference exists in any of them.

`profile/index.ts`'s comment flags a genuine gap: `docs/11-API-Contract.md` documents no
patient profile-edit endpoint at all (unlike the other five domains) — noted rather than guessed
at, so whoever builds that domain knows to get it documented first.

---

## 11. Architecture Impact

- `src/api/` now has real files for the first time (M1 only scaffolded the two subfolders as
  empty `.gitkeep` skeletons). `src/repositories/`, `src/services/`, `src/features/`, `src/store/`,
  and every screen remain exactly as they were — no dependency graph edge points *into* `src/api/`
  yet from any of them.
- `core/errors` grew by one class (`UnknownError`) — a minimal, explicitly-requested addition
  (Section 9, item 2) rather than a restructuring of M3's work.
- The `boundaries/dependencies` ESLint rule (Section 23.4) now has real `api`-type files to
  enforce against for the first time; verified clean (Section 4).

---

## 12. Dependency Changes

**None.** No new npm package was installed for this milestone — `ApiClient` uses the platform
`fetch`/`AbortController`, both already globally available in the RN/Hermes environment (and
typed via `expo/tsconfig.base`'s `"lib": ["DOM", "ESNext"]`), consistent with Section 5's "no
heavyweight HTTP library needed" decision.

---

## 13. Validation Results

### Lint Status

`npm run lint` → **exit 0. 0 errors, 8 warnings.** Identical warning count/content to the
M1–M3 baseline — **zero new warnings**, and zero `boundaries/dependencies` violations for the
newly-populated `api`-type files.

### TypeScript Status

`npx tsc --noEmit` → **0 errors.**

### Format Status

`npm run format:check` (`prettier --check .`) → **all matched files use Prettier code style.**

### Expo Status

| Check | Result |
|---|---|
| `npx expo-doctor` | ⚠️ 19/20 checks passed — same single pre-existing failure as M1–M3 (`react-native-worklets`/`react-native-reanimated` minor/patch drift, not introduced by this milestone) |
| `npx expo export --platform android` | ✅ Bundled successfully (3459 modules — unchanged from M2/M3, since nothing imports any `src/api/` file yet) |
| `npx expo export --platform ios` | ✅ Bundled successfully (3368 modules — likewise unchanged) |

### Build Status

Both platform exports succeed with the app's rendered output byte-for-byte unaffected — no
component, screen, or provider tree was touched, and `apiClient` has zero consumers anywhere in
the codebase.

---

## 14. Remaining Risks

1. **The three API Contract blockers (cookie-vs-Bearer auth, Turnstile on lead capture, missing
   OTP-on-deactivation) and F19's missing consent-capture backend are unresolved backend gaps** —
   none block this milestone's foundation work (Section 9), but every one of them will block the
   *specific* endpoint/domain that depends on it once `endpoints/auth`, `booking`, `queue`, etc.
   move past their placeholder stage.
2. **`profile/index.ts` has no documented endpoint to build against at all** — flagged in Section
   10; needs a documentation or backend follow-up before real work starts there.
3. **`core/errors` vs. the future `src/api/errors.ts::ApiError`** (flagged as TD-M3-2) is now
   slightly more concrete: this milestone's `errors.ts` deliberately does *not* build `ApiError`
   (Section 9's "Do not implement feature-specific errors" + the design doc's own narrower scope
   for that class) — the two error surfaces (`core/errors`' transport errors vs. a future
   business/HTTP-status `ApiError`) still need explicit reconciliation from whoever builds
   `src/api/`'s actual endpoint-calling code.
4. **`ApiClient.request()` has never been executed against a real or mock server** — by design
   (no consumer exists), but it means the timeout/`AbortController`/interceptor-pipeline logic has
   only been exercised by `tsc`/bundling, not a real HTTP round-trip. The first real endpoint
   function is the first integration test.
5. **F12's two flagged contract inconsistencies (claim-window timer value; top-2-vs-top-3
   waitlist broadcast) remain unresolved** — noted in `endpoints/queue/index.ts`'s placeholder
   comment; carried forward, not this milestone's to fix.

---

## 15. Technical Debt

| # | Item | Source | Notes |
|---|---|---|---|
| TD-M4-1 | `src/api/errors.ts::ApiError` (the HTTP-status/response-code class Section 5 documents) not built | Explicitly out of scope ("Do not implement feature-specific errors") | See Remaining Risks #3 |
| TD-M4-2 | `src/api/queryClient.ts` not built | React Query is out of scope for this milestone | Build alongside the state-layer milestone that adopts React Query |
| TD-M4-3 | No real request has ever been sent through `ApiClient` | No consumer exists yet, by design | See Remaining Risks #4 |
| TD-M4-4 | `endpoints/profile/`'s target endpoint is undocumented | `docs/11-API-Contract.md` gap, not this milestone's to fix | See Remaining Risks #2 |
| TD-M4-5 | Response envelope normalization (flat vs. `{success,data}`) not implemented | A future response interceptor's job (Section 5), deliberately left as architecture-only this milestone | See Section 6 |
| TD-M3-1…6 | Carried over from M3 | `M3-Core-Foundation-Report.md` | Unchanged by this milestone |

---

## 16. Rollback Plan

This milestone is additive only, with one small exception (a new export line in an existing M3
file). No existing runtime behavior changed — no consumer anywhere calls anything this milestone
built. To roll back:

1. `git revert` this milestone's commit (single commit, `[M4] API Foundation`).
2. No `npm install` is needed (no dependency changes — Section 12).
3. No data migration, no state to unwind — reverting is a clean, zero-side-effect operation.

---

## 17. Ready for Review

**YES.**

`npm run lint` (exit 0, 0 new warnings, 0 boundary violations), `npx tsc --noEmit` (0 errors),
`npm run format:check` (clean), and both platform export builds all succeed with the app's output
unaffected. The required API-Contract-vs-Engineering-Design cross-check (Section 9) found no
blocking conflict — every discrepancy the contract raises was already reconciled in the design
document itself, and none of the genuinely open backend gaps (the three blockers, F19, F12's two
inconsistencies) affect what this Foundation-only milestone actually builds. Every file maps to
an explicit instruction in this milestone's scope; the one addition to a previous milestone's
module (`core/errors/UnknownError.ts`) is minimal, explicitly named by this milestone's own
instructions, and documented transparently rather than silently made.
