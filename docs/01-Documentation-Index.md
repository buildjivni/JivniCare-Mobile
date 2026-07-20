# Document 01: Documentation-Index.md
**Version:** V1.1.0 | **Date:** 2026-07-16 | **Status:** FINAL — all 15/15 documents complete

---

## Document Hierarchy

| # | Document | Purpose | Status |
|---|----------|---------|--------|
| 01 | **Documentation-Index.md** *(this file)* | Master index + navigation | ✅ Complete |
| 02 | **Source-of-Truth.md** | Document authority + deprecated docs + full corrections log | ✅ Complete (v1.1.0) |
| 03 | **Product-Vision.md** | Why we exist, who we serve | ✅ Complete |
| 04 | **PRD.md** | What we build (F01-F19), scope, 30 decisions (all corrected against live code) | ✅ Complete (v1.1.0) |
| 05 | **Business-Rules.md** | How the system behaves (booking, queue, payment, waitlist, sessions) | ✅ Complete (v1.1.0) |
| 06 | **User-Personas.md** | Patient, Doctor, Admin profiles | ✅ Complete |
| 07 | **Mobile-UX-Spec.md** | Screen-by-screen UI spec, all 16 screens' loading/empty/error/offline states | ✅ Complete (v1.1.0) |
| 08 | **Design-System.md** | Colors, tokens, typography, spacing, icon library | ✅ Complete (v1.1.0) |
| 09 | **Component-Library.md** | Reusable components, with accessibility props on every interface | ✅ Complete (v1.1.0) |
| 10 | **UX-Writing-Guide.md** | All Hindi + English strings, full 13-code error table | ✅ Complete (v1.1.0) |
| 11 | **API-Contract.md** | Every `/api/` endpoint the mobile app calls, verified against live code | ✅ Complete (v1.1.0) |
| 12 | **Backend-Spec.md** | Schema + Security + Auth + Search consolidated | ✅ Complete |
| 13 | **AI-Development-Rules.md** | Non-negotiable rules for any AI coding agent working in this repo | ✅ Complete |
| 14 | **Feature-Dependencies.md** | Build order, Phase 0 backend prerequisites, Screen→API→Model→Permission matrix | ✅ Complete (v1.1.0) |
| 15 | **Known-Gaps.md** | V2 deferrals, unverified items, accepted limitations, corrections history | ✅ Complete |

**Every document has been cross-checked against the live repository
(`github.com/buildjivni/jivnicare`), not just against each other.** Where a document's original
draft disagreed with what the code actually does, the correction is applied in the document
itself AND logged in `02-Source-of-Truth.md` Section 3, so the reasoning is traceable.

---

## Quick Navigation

### For Developers (start here)
1. **`13-AI-Development-Rules.md`** — read this FIRST, before touching any other doc or writing
   any code. It tells you how to behave when you hit a gap or contradiction.
2. **`14-Feature-Dependencies.md`** — Phase 0 backend prerequisites, then Phase 1-5 build order
3. **UI building:** `07-Mobile-UX-Spec.md` + `08-Design-System.md` + `09-Component-Library.md`
4. **API integration:** `11-API-Contract.md` (read the "Mobile Blockers" section before writing
   any network call — three real backend gaps affect almost every screen)
5. **Business logic:** `05-Business-Rules.md`
6. **Anything confusing or seemingly contradictory:** check `02-Source-of-Truth.md` first, then
   `15-Known-Gaps.md` — the answer is very likely already written down in one of the two.

### For Designers
- **Visual system:** `08-Design-System.md`
- **Screen flows + all states:** `07-Mobile-UX-Spec.md`
- **Copy/Strings:** `10-UX-Writing-Guide.md`

### For QA/Testers
- **What's actually built vs. blocked on backend work:** `14-Feature-Dependencies.md`'s
  Screen→API→Model→Permission matrix (Phase 0 blockers marked explicitly per row)
- **Acceptance criteria:** Each feature in `04-PRD.md` Section 4
- **Known issues / things that will fail until backend work lands:** `15-Known-Gaps.md`

### For Product Review
- **Scope lock:** `04-PRD.md` Section 1.1 (What's IN / OUT)
- **Decisions:** `04-PRD.md` Section 3 (30 Decisions — all verified against live code as of
  2026-07-16)
- **What's deliberately deferred:** `15-Known-Gaps.md` Section 1
- **What's a backend gap (not a documentation gap):** `15-Known-Gaps.md` Section 2

---

## Document Update Protocol

```
1. ANY change → Update Source-of-Truth.md's Corrections Log first
2. Cross-reference affected docs → Update them, citing the same correction
3. Bump the document's version number (v1.0.0 → v1.1.0) and note what changed at the top
4. Never delete a wrong claim — mark it corrected, with the old value visible for context
   (see how 02, 04, 05, 07, 08, 09, 10, 11, 14 all do this)
5. AI tools: If a contradiction is found → STOP → follow 13-AI-Development-Rules.md Rule 5's
   Emergency Protocol → flag in Known-Gaps.md → do not guess and proceed
```

---

## What changed in this pass (2026-07-16), for anyone who read the v1.0.0 drafts

The original 10-document draft (01-10) was solid but had not been checked against the live
codebase for its specific claims about "actual code" behavior. A verification pass reading the
real route files, schema, and middleware directly found:
- 3 cross-cutting backend gaps that block most of the app from working on mobile at all (see
  `11-API-Contract.md` "Mobile Blockers")
- 6 specific factual corrections (token expiry, field names, missing rate-limit entries, etc.)
- 1 completely missing feature backend (F19 Consent Capture has no implementation anywhere)
- 2 items that needed a founder decision rather than a guess (deactivation OTP — resolved:
  required; the district-scope note — resolved: technical capability is pan-Bihar, go-to-market
  focus stays narrower)

All of this is now folded into the 15 finished documents rather than living in a separate audit
report — that was the whole point of this pass: one clean, internally-consistent set an AI
coding agent can build from without hitting a contradiction.

---

## Contact
**Solo Founder:** [Your Name] | **Tech Lead:** AI-Assisted Development
**Repository:** github.com/buildjivni/jivnicare

---

*Last Updated: 2026-07-16 | Next Review: after Phase 0 backend items land*
