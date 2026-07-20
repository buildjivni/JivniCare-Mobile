# JivniCare Mobile — AI Development Rules
**Version:** V1.0.0 | **Date:** 2026-07-16 | **Status:** LOCKED
**Audience:** Any AI coding agent (Antigravity, Cursor, Claude Code, etc.) working on this repo.
**Authority:** Tier 4 (Process) per `02-Source-of-Truth.md` — but violating these rules is what
causes Tier 1–3 documents to drift out of sync with code, which is the root problem this whole
documentation set exists to prevent. Treat these as load-bearing, not optional.

---

## Why this document exists

Three separate audits of this codebase (a doc-vs-doc audit, a doc-vs-code audit, and this
documentation-readiness audit) found the same root pattern over and over: a document said one
thing, the code did another, and nobody had marked either one as authoritative. Every single one
of those drift incidents was avoidable with five habits. This document is those five habits,
made explicit and non-negotiable.

---

## RULE 1: Never Guess

If a business rule, field name, response shape, or UI behavior is not written down in a Tier 1–3
document, **do not infer it from a similar-looking pattern elsewhere in the codebase and proceed
silently.** Stop and do one of:
- Search the live code yourself (you have repo access — use it, the way this document's own
  content was produced) and cite what you found.
- If the code and the docs disagree, follow `02-Source-of-Truth.md`'s Emergency Protocol: flag
  it, don't silently pick a side.
- If neither the code nor the docs answer the question, write the assumption down explicitly in
  your output (a comment, a PR description, a `Known-Gaps.md` entry) — an unstated assumption is
  how a 15-word-limit turned into a 20-word field name mismatch turned into a silently-dropped
  idempotency key (see `11-API-Contract.md`'s Corrections table for a real example: the docs said
  `idempotencyKey`, the code says `requestId` — guessing which one to send would have shipped a
  booking flow with no working duplicate-protection, with no error, no warning, nothing).

**Concrete example from this codebase:** `05-Business-Rules.md` Rule D3 says account deactivation
requires OTP verification. The actual `/api/patient/delete-data` route has no OTP check at all.
An agent building the mobile S16 screen who trusted the doc without checking the route would ship
a UI that asks for an OTP the backend never validates — the OTP field would be decorative. The
correct move when you hit this is not to guess which one is right; it's to flag the contradiction
per Rule 5 below and wait for a decision.

---

## RULE 2: Never Create New UI Outside the Component Library

Every screen must be built from the atoms/molecules/organisms defined in
`09-Component-Library.md`, styled with the tokens in `08-Design-System.md`. If a screen seems to
need a component that doesn't exist yet:
1. Check if an existing component can be composed/configured to do the job (most cases).
2. If genuinely new, propose the addition to `09-Component-Library.md` as an actual doc edit —
   with the same prop/behavior/state/accessibility structure as every other entry — **before**
   writing the screen that uses it.
3. Never invent a one-off visual pattern (a new button style, a new card layout, a new color not
   in `08-Design-System.md`'s palette) inline in a screen file "just this once." The original
   14-doc audit found a design spec for a `SpecialitySelect` dropdown component that was written
   but never built, and the actual code shipped a plain checkbox list instead, with nobody
   updating the doc. Undocumented one-offs are exactly how that happens — in either direction.

---

## RULE 3: Never Rename an API Field, Endpoint, or Response Shape to "Fix" It

If you notice an inconsistency — a response that isn't wrapped in the standard `{success, data}`
envelope when every other endpoint is, a field called `requestId` when the doc calls it
`idempotencyKey`, an endpoint at `/api/patient/book-appointment` when an older doc section says
`/api/patient/book` — **do not silently rename it to what "should" be consistent.** The live
endpoint is the one mobile has to call correctly; renaming it in your generated client code
doesn't fix the server, it just creates a new mismatch between your code and the real API.
Instead:
- Match the mobile client to what the server **actually** returns/expects, exactly as documented
  in `11-API-Contract.md` (or as you verify directly if that doc hasn't caught up yet).
- File the inconsistency as a correction candidate (see `11-API-Contract.md`'s own "Corrections
  needed in other docs" table for the format) rather than quietly working around it.
- If a genuine rename is warranted (e.g., standardizing all `/api/v1/` routes to the same
  envelope), that's a backend change requiring founder approval — not something to do
  unilaterally while building a mobile screen.

---

## RULE 4: Never Change a Business Rule's Number, Threshold, or Logic

Numbers in `05-Business-Rules.md` (session limits, rate limits, token expiries, retry counts,
day-open defaults) are locked decisions, not suggestions. If the live code disagrees with a
documented number — like the 30-minute vs 15-minute access token expiry found during the
`11-API-Contract.md` pass — **the fix is to correct the document to match verified reality, not
to change the code to match the document, and not to silently code to whichever number you
personally think is safer.** Business rule numbers often encode a tradeoff (a shorter access
token is more secure but requires more refresh calls; a smaller waitlist broadcast group is
fairer but slower to fill) that isn't yours to re-litigate mid-implementation. If a number seems
wrong, flag it — don't quietly "improve" it.

---

## RULE 5: Always Follow Source-of-Truth — and Say So When You Can't

When two documents disagree, resolve it using `02-Source-of-Truth.md`'s Tier hierarchy (Tier 1
wins over Tier 2, etc.) and its explicit Deprecated Documents table. When the *hierarchy itself*
doesn't resolve the conflict — e.g. two Tier-2 documents disagree with each other, or a document
disagrees with the live code and neither has been marked deprecated — **do not pick a side and
proceed as if it's settled.** Follow the Emergency Protocol exactly as written in
`02-Source-of-Truth.md` Section 6:
```
STOP → Check Source-of-Truth for a DEPRECATED marker → Check tier hierarchy →
If still unclear → Flag in Known-Gaps.md → Notify founder → Wait → Document the resolution
```
"Flag in Known-Gaps.md" is not optional busywork — it's what turns a one-off confusion into a
permanent, searchable record so the *next* agent (or the next you, in a new session) doesn't
re-discover the same contradiction from scratch. Every contradiction found across all three
audits so far exists because nobody wrote it down the first time it was noticed.

---

## RULE 6 (supplementary): Cite what you checked, not what you assumed

When you report that something "works" or "matches the spec," say specifically what you read to
confirm that — a file path, a function name, a line range. "I checked `refresh-token.ts` and the
access token is signed with a 30-minute expiry" is verifiable and falsifiable. "The token
expiry looks correct" is neither. This isn't pedantry — it's the only way a human reviewer (or a
different AI session later) can tell the difference between "verified" and "assumed to be fine."

---

## RULE 7 (supplementary): Prefer fixing the backend gap over working around it in the client

Three real mobile-blocking gaps were found while writing `11-API-Contract.md`: patient routes
that don't accept Bearer tokens, a lead-capture endpoint that requires a browser-only Turnstile
challenge, and a deactivation flow with no OTP step despite the doc and the UI screen both
assuming one exists. **The correct fix for all three is a small backend change** (wire the
existing `session.ts` Bearer-aware helper into the seven cookie-only routes; add a mobile
attestation path to the lead endpoint; either add the OTP check or update the doc+screen).
**The wrong fix is a mobile-side workaround** — e.g. having the mobile app fake a cookie header,
or skip lead-capture attribution because Turnstile is inconvenient, or silently drop the OTP step
from the S16 flow without updating `05-Business-Rules.md` Rule D3 to match. A workaround that
isn't documented as a deliberate decision is the same failure mode as everything else in this
document: an unwritten assumption that will contradict some other doc within a month.

---

## Pre-Flight Checklist (run this before writing code for any feature)

```
□ Have I read the feature's row in 04-PRD.md (Section 4, F01–F19)?
□ Have I read the matching rules in 05-Business-Rules.md?
□ Have I read the endpoint's real contract in 11-API-Contract.md — and if it's marked
  "not yet covered," have I gone and read the actual route file myself before writing
  client code against it?
□ Have I confirmed the screen's components all exist in 09-Component-Library.md?
□ Have I confirmed the screen's strings all exist in 10-UX-Writing-Guide.md — in both
  Hindi and English, matching the literal button/label text I'm about to render?
□ If I found ANY contradiction while doing the above — did I flag it (Known-Gaps.md) 
  instead of silently resolving it my own way?
```

---

*Rules Locked: 2026-07-16 | These rules apply to every AI session working in this repo, not just
the session that authored them.*
