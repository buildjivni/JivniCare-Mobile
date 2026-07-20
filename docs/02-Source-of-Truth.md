# Document 02: Source-of-Truth.md
**Version:** V1.1.0 | **Date:** 2026-07-16 | **Status:** FINAL
**Supersedes:** V1.0.0 (2026-07-15) — updated after the `11-API-Contract.md` verification pass
found 6 additional corrections and 2 open backend-build items.

---

## 1. Document Authority Hierarchy

When conflicts arise, resolve in this order:

```
TIER 1 (Highest Authority):
├── Product-Vision.md          → Why we exist — never contradicts mission
├── 30 Founder Decisions       → Locked choices, documented in PRD.md Section 3
└── Live Code (github.com/buildjivni/jivnicare) → Ground truth for "what currently exists,"
                                                    but NOT for "what should be built" — a
                                                    locked Founder Decision can deliberately ask
                                                    for something the current code doesn't do yet
                                                    (e.g. the 15-min/top-3 waitlist window is a
                                                    locked decision the code hasn't implemented
                                                    yet — that's a backlog item, not a doc error)

TIER 2 (Implementation Authority):
├── PRD.md                     → What we build (F01-F19)
├── Business-Rules.md          → How system behaves
└── API-Contract.md            → Exact endpoint specifications

TIER 3 (Reference):
├── Mobile-UX-Spec.md          → Screen designs
├── Design-System.md           → Visual tokens
├── Component-Library.md       → Reusable components
├── Backend-Spec.md            → Schema + security consolidated
└── UX-Writing-Guide.md        → All strings

TIER 4 (Process):
├── AI-Development-Rules.md    → How AI tools work
├── Feature-Dependencies.md    → Build order
└── Known-Gaps.md              → What's NOT in V1, and what's built-but-undocumented
```

**Rule:** If Tier N contradicts Tier N-1 → Tier N-1 wins. Always.

**Rule (added V1.1.0):** If a Tier 2/3 document states something as a *locked decision* that
disagrees with what the live code currently does, that is not automatically a documentation
error — check `14-Feature-Dependencies.md` Phase 0 first. If the gap is listed there as a
pending backend build item, the document is correct and the code needs to catch up, not the
other way around.

---

## 2. Deprecated Documents (DO NOT USE)

These are documents from **before** this 15-doc set existed (the original web-platform doc set
and its early mobile-planning drafts). None of them should be read by an AI agent building the
mobile app — everything usable from them has been folded into the 15 docs below.

| Document | Status | Reason | Replacement |
|----------|--------|--------|-------------|
| `JivniCare-Mobile-PRD-TRD-v1.md` | ❌ DEPRECATED | 2 unverified claims (20 specialties, wrong filters) | `PRD.md` Section 4 (F04) |
| `04-trd.md` (original web TRD, Section 3) | ❌ DEPRECATED | Folder structure outdated — only 3 doctor pages exist, not 7 | `Backend-Spec.md` |
| `03-search-engine.md` (original web spec) | ❌ DEPRECATED | Lists 20 specialties, code has 30; filter list doesn't match code | `PRD.md` F04, `Backend-Spec.md` Search section |
| `02-security-access.md` (original web spec) | ❌ DEPRECATED | Wrong cookie name (`jvc_session`), wrong verification status (`APPROVED`), stray `/api/v1/` reference | `Backend-Spec.md` Section 3 |
| `04-trd.md` (Waitlist section) | ❌ DEPRECATED | Said FIFO AUTO-BOOK; actual code is Broadcast+Claim | `Business-Rules.md` Section 3 |
| `04-trd.md` (Emergency Tokens) | ❌ DEPRECATED | Said E1/E2 display strings only; actual DB uses 9001/9002 base integers | `Business-Rules.md` Section 6 |
| `04-trd.md` (District Scope) | ❌ DEPRECATED | Said 2-district hard limit; actual code supports all 37 Bihar districts + Deoghar | `PRD.md` Section 2.2, `Product-Vision.md` Section 6.1 note |
| `06-web-flow.md` (Flow A3, "+Add Doctor") | ❌ DEPRECATED | Describes an admin-onboarding flow that was never built | `Product-Vision.md` Non-Goal, `PRD.md` Out of Scope |
| `05-prd.md` (original web PRD, Section 6.2/6.3 role descriptions) | ❌ DEPRECATED | Describes an emergency-approval-queue workflow; actual code is a direct toggle | `Business-Rules.md` Rule E3 |
| `09-payment-system.md` (original web spec) | ❌ DEPRECATED | Doctor-facing "₹29 savings" framing was corrected by `JivniCare-V1-Master-Plan.md` | `Business-Rules.md` Section 7 |

---

## 3. Corrections Log (found during `11-API-Contract.md` verification, 2026-07-16)

These are **not** deprecations of a whole document — they're specific line-level corrections
inside the *current* 15-doc set, found by reading the live route files directly rather than
trusting the prior draft. Each has been applied to the doc listed; this table exists so nobody
"corrects" it back to the wrong value later.

| # | Document | Was (v1.0.0 draft) | Now (v1.1.0, corrected) | Verified via |
|---|---|---|---|---|
| 1 | `Business-Rules.md` Rule S4, `PRD.md` Decision #5 | Access token: 15 minutes | **30 minutes** | `signToken(..., "30m")` in `refresh-token.ts` |
| 2 | `Business-Rules.md` Rule B3 | Field named `idempotencyKey` | **`requestId`** | Zod schema in `book-appointment/route.ts` |
| 3 | `Business-Rules.md` Rule D3 | "OTP verification required" (was previously unverified against code) | **Confirmed as a locked decision (2026-07-16): OTP stays required.** Code does not implement this yet — tracked as Phase 0 item P0-3 in `Feature-Dependencies.md`. This is the one item in this table that is a build task, not a text fix. | `delete-data/route.ts` has no OTP check today |
| 4 | `PRD.md` F13 field list | "Name, Phone, District, Speciality" | Also includes **roleInterest, source, lastStepCompleted** | `leadSchema` in `public/lead/route.ts` |
| 5 | `Business-Rules.md` Section 12 (rate limits) | Missing `/api/v1/patient/search` | Added — shares `publicSearchRatelimit` with `/api/public/search` | `v1/patient/search/route.ts` |
| 6 | `Mobile-UX-Spec.md` S12 vs `UX-Writing-Guide.md` Section 10 | Button read "Book Now" in one doc, "Book with Dr. [Name]" in the other | Standardized on **"Book with Dr. [Name]"** in both | Cross-doc consistency pass |
| 7 | `Business-Rules.md` Rule W1 | Ambiguous on whether "top 3 / 15-min" was current behavior or a new target | Clarified: **this is a locked decision for what V1 mobile must build**, not a description of what the code does today (code currently does top-2 / ~30-min) — tracked as Phase 0 item P0-5 | `queueService.ts` vs `Business-Rules.md`/`PRD.md` Decision #3 |
| 8 | *(new finding, no prior doc claim to correct)* | — | `ConsentLog` (F19) has **zero backend implementation** — schema exists, no route writes to it | grep across `src/app/api`, zero matches |
| 9 | *(new finding)* | — | `GET /api/patient/my-bookings` has **no pagination** — returns full booking history every call | `my-bookings/route.ts` |
| 10 | *(new finding)* | — | `POST /api/patient/queue/claim-waitlist`'s "slot already taken" response is **HTTP 200**, not an error status — client must check the inner `data.isTaken` field | `claim-waitlist/route.ts` |

---

## 4. Living Documents vs Static Documents

### Living (Update as code evolves):
- `API-Contract.md` — Add new `/api/v1/` routes here as the backend team builds them
- `Known-Gaps.md` — Move items from "Open" to "Resolved" as Phase 0 items land
- `Backend-Spec.md` — Schema changes must sync here

### Static (Locked for V1):
- `Product-Vision.md` — Mission doesn't change mid-build
- `30 Founder Decisions` (`PRD.md` Section 3) — Locked unless founder explicitly overrides
- `Business-Rules.md` — Core rules stable for V1 (Rule *numbers/values* are locked — see Rule
  added in Section 1 above for how to handle a rule the code hasn't caught up to yet)

---

## 5. Cross-Reference Map

| Topic | Primary Source | Secondary Sources |
|-------|---------------|-------------------|
| Auth Flow (incl. Bearer-token migration status) | `Backend-Spec.md` Section 3 | `PRD.md` F01, F18; `API-Contract.md` "Mobile Blockers" |
| Booking Logic | `Business-Rules.md` Section 1 | `PRD.md` F07-F08; `API-Contract.md` F08 |
| Queue State Machine | `Business-Rules.md` Section 2 | `Backend-Spec.md` Section 4 |
| Waitlist mechanics + open numbers question | `Business-Rules.md` Section 3 | `API-Contract.md` F12; `Feature-Dependencies.md` P0-5 |
| Search Scoring | `Backend-Spec.md` Section 6 | `PRD.md` F02-F03; `API-Contract.md` F02/F03 |
| Payment Display | `Business-Rules.md` Section 7 | `PRD.md` F08 |
| Mobile Screens + per-screen states | `Mobile-UX-Spec.md` | `Design-System.md` |
| Component Specs | `Component-Library.md` | `Design-System.md` |
| Hindi Strings | `UX-Writing-Guide.md` | `Mobile-UX-Spec.md` (per screen) |
| Rate Limits | `Business-Rules.md` Section 12 | `API-Contract.md` (per endpoint) |
| Offline Behavior | `Mobile-UX-Spec.md` Section 8 | `Known-Gaps.md` |
| Build order / what blocks what | `Feature-Dependencies.md` | `API-Contract.md` "Mobile Blockers" |
| What's not built yet at all (not deferred — just missing) | `Known-Gaps.md` | `Feature-Dependencies.md` Phase 0 |

---

## 6. Emergency Protocol

```
SCENARIO: AI tool finds contradiction during development

STEP 1: STOP — Do not implement
STEP 2: Check this file → Is one doc marked DEPRECATED (Section 2)?
STEP 3: Check the Corrections Log (Section 3) — has this already been resolved?
STEP 4: Check hierarchy (Section 1) → Which tier wins?
STEP 5: If the conflict is "doc says X, code does Y" — check Feature-Dependencies.md Phase 0.
         If X is a listed Phase 0 item, the doc is right and code needs to catch up.
         If X is NOT listed anywhere, this is a genuinely new finding — do not guess which
         side is correct.
STEP 6: If still unclear → Flag in Known-Gaps.md with file/line citations (per
         AI-Development-Rules.md Rule 6)
STEP 7: Notify founder → Wait for decision
STEP 8: Document resolution → Update affected docs AND this file's Corrections Log
```

---

## 7. Change Log

| Date | Change | By | Affected Docs |
|------|--------|-----|---------------|
| 2026-07-15 | Initial documentation set created | AI + Founder | All 15 docs |
| 2026-07-15 | 30 Founder Decisions locked | Founder | `PRD.md` Section 3 |
| 2026-07-15 | Deprecated original web-doc-set entries | Audit | `Source-of-Truth.md` |
| 2026-07-16 | `API-Contract.md` built from direct code read — 6 corrections + 3 new findings applied across `Business-Rules.md`, `PRD.md`, `Mobile-UX-Spec.md`, `UX-Writing-Guide.md` | Audit | See Section 3 above |
| 2026-07-16 | Deactivation OTP requirement confirmed as locked decision; tracked as Phase 0 backend build (P0-3) rather than removed from docs | Founder | `Business-Rules.md` Rule D3, `Feature-Dependencies.md` |
| 2026-07-16 | Waitlist "top 3 / 15-min" confirmed as a forward-looking locked decision, not a description of current code | Audit | `Business-Rules.md` Rule W1, `Feature-Dependencies.md` P0-5 |
| 2026-07-16 | Document set expanded to 15/15: `API-Contract.md`, `AI-Development-Rules.md`, `Feature-Dependencies.md` added; `Backend-Spec.md` and `Known-Gaps.md` pending | AI | Documentation-Index.md |

---

*Authority: Tier 1 | Last Updated: 2026-07-16*
