# Sprint 0 — Milestone 2: Theme Foundation — Implementation Report

**Date:** 2026-07-20
**Scope:** The application's visual design-token system and a global Theme Provider only — no
business logic, backend, feature implementation, navigation, or screen redesign, per the
milestone's explicit instructions.
**References:** `docs/engineering/Sprint-0-Engineering-Design.md` Section 8 ("Theme
Architecture"), `docs/08-Design-System.md`, `docs/08.1-Brand-Assets.md`,
`docs/implementation/M1-Engineering-Foundation-Report.md`.

---

## 0. Pre-Milestone Correction (Engineering Safety)

Before starting M2, a repository-state check found that the M1 Engineering Foundation *code*
deliverable (folder skeleton, ESLint/Prettier config, import-path fixes, README update) was
**not actually committed** — only M1's *documentation* had been committed and pushed
(`8182c64`, `[DOCS] Add Engineering Audit and Sprint 0 Documentation`). This contradicted this
milestone's framing that "Milestone 1 has been completed, reviewed, approved, committed, and
pushed." Flagged to the user rather than guessed at; the user confirmed committing the M1 code
now, as its own dedicated commit, before starting M2. This was done first:

- Commit `22d63b2`, message `[M1] Engineering Foundation`, 57 files changed — exactly the file
  set already documented in `M1-Engineering-Foundation-Report.md`/`M1-Documentation-Commit-Report.md`.
  Pushed to `audit-prep`.

M2's own work (below) starts from a clean, fully-committed M1 baseline.

---

## 1. Executive Summary

Built the complete Theme Foundation: a `src/core/theme/` module containing every design token
category the milestone's scope listed (Colors, Typography, Spacing, Border Radius, Shadows/
Elevation, Opacity), a global `ThemeProvider` + `useTheme()` hook wired into the app root, and a
clean `@/core/theme` barrel export. Every JS-level hardcoded hex color found across the
10 previously-audited component files (plus `app/_layout.tsx`) was migrated to import from this
new token module. No screen was redesigned, no layout changed, and no new color was introduced —
every value traces back to `docs/08-Design-System.md`.

---

## 2. Files Created

### `src/core/theme/tokens/` (design tokens — single source of truth)

| File | Contents |
|---|---|
| `colors.ts` | Every hex value from `08-Design-System.md`'s Color Palette, Status Colors, and Badge System tables, as named constants (`PRIMARY`, `SECONDARY`, `TEXT_TERTIARY`, `STATUS_*`, `EARLY_PARTNER_GRADIENT_*`, etc.) plus a `COLORS` aggregate object |
| `typography.ts` | The 7-row Type Scale (`HERO`/`HEADLINE`/`TITLE`/`BODY_LARGE`/`BODY`/`CAPTION`/`TOKEN_HERO`) as `{ fontSize, lineHeight, fontWeight }` objects |
| `spacing.ts` | `SPACE_1`…`SPACE_12` (4/8/12/16/20/24/32/48px) |
| `radius.ts` | `RADIUS_SM/MD/LG/XL/2XL/FULL` (8/12/16/24/32/9999px) |
| `elevation.ts` | `SHADOW_SM/MD/LG/XL` — cross-platform (`Platform.OS === 'android' ? {elevation} : {shadow...}`) RN style objects |
| `opacity.ts` | Named opacity constants gathered from the Button/Card/Bottom-Sheet specs (`disabled`, `pressed`, `pressedTint`, `iconPressedTint`, `closed`, `backdrop`) |

### `src/core/theme/` (architecture)

| File | Contents |
|---|---|
| `theme.ts` | `Tokens` interface assembling all 6 token files; `Theme { light, dark }` structure with `dark` initially equal to `light` (Section 8's Dark Mode Strategy) |
| `ThemeProvider.tsx` | React Context + `useTheme()` hook; mounted once at the app root |
| `index.ts` | Barrel — re-exports `ThemeProvider`, `useTheme`, `THEME`, `Tokens`/`Theme` types, and every named token constant, so consumers do `import { useTheme, PRIMARY, ... } from '@/core/theme'` without knowing the internal file layout |

### `docs/implementation/M2-Theme-Foundation-Report.md` — this report.

`src/core/theme/.gitkeep` (M1's placeholder) was deleted — the directory is no longer empty.

---

## 3. Files Modified

| File | Change |
|---|---|
| `app/_layout.tsx` | Wrapped the app in `<ThemeProvider>`; replaced the local `HEADER_COLORS` hex literals and the header title's hardcoded `fontSize: 18, fontWeight: '600'` with `@/core/theme` imports (`SURFACE`, `NAVY`, `PRIMARY`, `BACKGROUND`, `TITLE`) |
| `src/components/atoms/Input.tsx` | `COLOR_BORDER_FOCUS`/`COLOR_ERROR`/`COLOR_TEXT_TERTIARY` now alias theme tokens instead of hex literals |
| `src/components/atoms/Button.tsx` | `VARIANT_ICON_COLOR` map now references `WHITE`/`PRIMARY`/`TEXT_PRIMARY` tokens |
| `src/components/atoms/Badge.tsx` | Verified/Early-Partner icon colors and the Early-Partner gradient's two `<Stop>` colors now reference tokens |
| `src/components/atoms/Avatar.tsx` | Fallback `User` icon color now references `TEXT_SECONDARY` |
| `src/components/molecules/QueueStatusBadge.tsx` | All 4 status icon colors now reference `WHITE` |
| `src/components/organisms/WaitlistForm.tsx` | Success-state `CheckCircle` colors now reference `SUCCESS`/`WHITE` |
| `src/components/molecules/BookingWidget.tsx` | Error-state `AlertTriangle` color now references `ERROR` |
| `src/components/molecules/DoctorCard.tsx` | `BadgeCheck`/`Clock` icon colors now reference `PRIMARY`/`TEXT_SECONDARY`; the manual `Platform.OS === 'android' ? {elevation:4} : {shadow...}` block was replaced with `ELEVATION.md` (same numeric values — this is the exact migration Section 8 names `DoctorCard.tsx` as the reference case for) |

---

## 4. Theme Structure

```
src/core/theme/
├── tokens/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── radius.ts
│   ├── elevation.ts
│   └── opacity.ts
├── theme.ts            # Tokens + Theme{light,dark} assembly
├── ThemeProvider.tsx    # Context + useTheme()
└── index.ts             # public barrel (@/core/theme)
```

This matches Section 8's target layout exactly (a `tokens/` subfolder plus `ThemeProvider.tsx`
at the `core/theme/` root), rather than the flatter "example" file list in this milestone's own
instructions — the instructions explicitly said to "follow the Engineering Design exactly," and
the two describe the same six token categories, just at slightly different nesting.

---

## 5. Design Tokens

| Category | Source | Token file |
|---|---|---|
| Colors | `08-Design-System.md` Color Palette / Status Colors / Badge System tables | `colors.ts` |
| Typography (size/weight/line-height) | `08-Design-System.md` Type Scale table | `typography.ts` |
| Spacing Scale | `08-Design-System.md` Spacing Scale table | `spacing.ts` |
| Border Radius | `08-Design-System.md` Radius Scale table | `radius.ts` |
| Shadows / Elevation | `08-Design-System.md` Elevation & Shadows table | `elevation.ts` |
| Opacity | Gathered from Button/Card/Bottom-Sheet specs (no single named table exists) | `opacity.ts` |
| Z-Index | **Not defined anywhere** in `08-Design-System.md` or Section 8's own token-file table — skipped per this milestone's own "if defined" qualifier | — |

---

## 6. Brand Color Verification

Every color in `colors.ts` was cross-checked against `docs/08-Design-System.md`'s tables and
`tailwind.config.js`'s existing `theme.extend.colors` (already a verified 1:1 map of that same
doc, per the Architecture Audit). No new color was introduced; no existing value was changed.

One pre-existing, explicitly-flagged conflict from `docs/08.1-Brand-Assets.md` was resolved the
way that document itself instructs, not guessed: that document's "Primary Green" (`#529C60`)
differs from `08-Design-System.md`'s `--color-secondary` (`#4B9F5F`). Per
`08.1-Brand-Assets.md`'s own note, `colors.ts`'s `SECONDARY` uses `#4B9F5F` (the UI-component
token value) — `#529C60` remains reserved for already-exported brand asset files only, unchanged
by this milestone.

The Early-Partner badge gradient (`linear-gradient(135deg, #F59E0B, #D97706)`) is the one
gradient this migration touches — it is explicitly defined in `08-Design-System.md`'s Badge
System table (not invented), and was already implemented via `react-native-svg` in `Badge.tsx`
prior to this milestone; only its two hardcoded stop-colors were migrated to tokens.

---

## 7. Hardcoded Values Replaced

**Replaced (JS-level color literals and one inline shadow-style object):** every `color="#..."`
icon prop, every `stopColor="#..."` gradient stop, and every JS constant holding a raw hex string
across `app/_layout.tsx`, `Input.tsx`, `Button.tsx`, `Badge.tsx`, `Avatar.tsx`,
`QueueStatusBadge.tsx`, `WaitlistForm.tsx`, `BookingWidget.tsx`, and `DoctorCard.tsx` — this is
the exact file list Section 8's "Eliminating Hardcoded Colors" migration checklist names (minus
`OTPInput.tsx`, see below). `DoctorCard.tsx`'s manual per-platform shadow object was replaced with
`ELEVATION.md`.

**Deliberately NOT touched (Tailwind/NativeWind `className` arbitrary values):** things like
`text-[18px]`, `leading-[23px]`, `rounded-[20px]`, `gap-4`, `shadow-md`, and `OTPInput.tsx`'s
`bg-[#EFF6FF]` were left exactly as they were. Rewriting these to consume the new tokens would
mean editing the `className` string on nearly every `Text`/`View` in every audited component —
a much larger, redesign-adjacent change than "connect the theme system," and a real risk to "the
UI should remain visually identical" if any value were mistyped along the way. This is flagged
here as a deliberate scope boundary, not an oversight — see Remaining Risks.

Also not touched: `tailwind.config.js` itself. It is already a verified 1:1 map of
`08-Design-System.md`'s colors (confirmed again in this milestone), so it was left as the
independently-maintained Tailwind-side source rather than risking a regenerate-from-`colors.ts`
build step (Section 8 mentions this as a future possibility, not a requirement) this milestone
didn't need in order to connect the JS-level theme system.

**Icons (`icons.ts`):** Section 8's token-file table also names an `icons.ts` (a Lucide icon
name registry). This milestone's own "Design Tokens" checklist (Colors/Typography/Spacing/
Radius/Shadows/Opacity/Z-Index) does not include icons, so it was intentionally not built here —
flagged as a scope decision, not an omission, to avoid expanding beyond the given checklist.

---

## 8. Architecture Decisions

1. **`tokens/` subfolder, matching Section 8's literal layout** — chosen over this milestone's
   own flatter "example" file list, since the instructions said to follow the Engineering Design
   "exactly." Both describe the same 6 token categories.
2. **`Theme { light, dark }` with `dark === light`** — implements Section 8's Dark Mode Strategy
   verbatim: a real dark theme later becomes a data change, not an architecture change. No dark
   mode UI or toggle was built (out of scope, confirmed by both `08-Design-System.md`'s note and
   this milestone's instructions).
3. **Named UPPER_SNAKE_CASE constants, not just a nested object** — every token file exports both
   individual constants (`PRIMARY`, `RADIUS_MD`, …) and a grouped object (`COLORS`, `RADIUS`, …).
   The former matches Section 8's own naming examples and lets components import only what they
   use (as done in this milestone's replacements); the latter is what `theme.ts`/`useTheme()`
   assembles into the Context value.
4. **`ThemeProvider` mounted once, at `app/_layout.tsx`'s root**, wrapping `SafeAreaProvider`/
   `Stack` — the same place `QueryClientProvider` etc. are named to go in Section 2's target
   `_layout.tsx` description, so later providers can nest alongside it without moving this one.
5. **`elevation.ts`'s `buildShadow()` helper takes raw numbers, not a `ShadowTier` enum** — kept
   deliberately simple (4 constants, no lookup-by-string API) since only 4 tiers exist and none
   of this milestone's consumers need to select a tier dynamically.
6. **Scope boundary at the JS/`className` line** — see Section 7. Chosen to satisfy "remove
   hardcoded values ONLY where required to connect the theme system" and "the UI should remain
   visually identical" simultaneously; a full `className`-level migration is flagged as follow-up
   work, not attempted here.

---

## 9. Problems Encountered

1. **M1's code deliverable was uncommitted despite this milestone's framing that M1 was
   "completed... committed, and pushed."** See Section 0 — flagged to the user rather than
   guessed at; resolved by committing it first (`22d63b2`), per the user's explicit direction,
   before any M2 work began.
2. **`docs/08.1-Brand-Assets.md`'s "Primary Green" vs. `08-Design-System.md`'s `--color-secondary`
   conflict** (Section 6) — already flagged and resolved by that document itself; not a new
   ambiguity, just verified and followed rather than re-litigated.
3. **One Prettier formatting violation** in `elevation.ts`'s `buildShadow()` parameter list
   (missing line-wrapping for a 4-parameter function signature) — caught by `npm run lint`,
   fixed with a scoped `prettier --write` over only this milestone's touched files (not a
   repo-wide `prettier --write .`, avoiding the accidental-reformat incident M1 had).

No other issues were encountered.

---

## 10. Validation Results

### Lint Status

`npm run lint` → **exit 0. 0 errors, 8 warnings.** Identical warning count and content to M1's
baseline (`Input.tsx`'s pre-existing inline style, `OTPInput.tsx`'s `array-type` and 6×
`react-hooks/refs` warnings) — **zero new warnings introduced** by this milestone's changes.

### TypeScript Status

`npx tsc --noEmit` → **0 errors.**

### Format Status

`npm run format:check` (`prettier --check .`) → **all matched files use Prettier code style.**

### Expo Status

| Check | Result |
|---|---|
| `npx expo-doctor` | ⚠️ 19/20 checks passed — same single pre-existing failure as M1 (`react-native-worklets`/`react-native-reanimated` minor/patch drift, already documented in M1's report; not introduced by this milestone) |
| `npx expo export --platform android` | ✅ Bundled successfully (3459 modules — up from M1's 3450, consistent with the ~9 new theme files added) |
| `npx expo export --platform ios` | ✅ Bundled successfully (3368 modules) |

---

## 11. Remaining Risks

1. **Tailwind/NativeWind `className` arbitrary values are not yet token-connected** (Section 7).
   `text-[18px]`, `rounded-[20px]`, `shadow-md`, etc. still exist as literal strings across the
   10 audited components. The new token module is the correct single source of truth for a future
   migration, but that migration (touching every affected `className`) was not performed here —
   recommend a dedicated, review-heavy follow-up milestone, ideally one component at a time with
   visual diffing, given the real risk of an accidental pixel-level regression.
2. **`OTPInput.tsx`'s `bg-[#EFF6FF]` (OTP focus background) remains a raw hex literal** inside a
   `className` string — same category as Risk 1, called out individually since it's the one
   color (not just typography/spacing/radius) still outside the token system.
3. **`icons.ts` (Lucide icon registry) was not built** — Section 8 of the Engineering Design doc
   names it as part of the theme token set; this milestone's own Design Tokens checklist did not
   list icons, so it was treated as out of scope rather than guessed into scope. If a future
   milestone needs it, `docs/08-Design-System.md`'s Icon Library table (already complete,
   including the 2 previously-undocumented icons `Circle`/`Users`) is ready to migrate directly.
4. **`tailwind.config.js` is still hand-maintained, not generated from `colors.ts`.** Both are
   currently value-identical (re-verified in this milestone), but nothing machine-enforces they
   stay that way. Section 8 names a future build-step as the fix; not attempted here since it
   wasn't required to connect the JS-level theme system this milestone actually needed.
5. **8 pre-existing lint warnings remain unfixed** (carried over from M1, unrelated to theming) —
   already tracked as technical debt in `M1-Engineering-Foundation-Report.md`.

---

## 12. Technical Debt

| # | Item | Source | Notes |
|---|---|---|---|
| TD-M2-1 | `className`-level typography/spacing/radius/shadow values not yet token-connected | This milestone's deliberate scope boundary | See Remaining Risks #1 |
| TD-M2-2 | `OTPInput.tsx`'s `bg-[#EFF6FF]` hex literal inside a `className` string | This milestone's deliberate scope boundary | See Remaining Risks #2 |
| TD-M2-3 | `icons.ts` Lucide registry not built | Out of this milestone's stated Design Tokens checklist | See Remaining Risks #3 |
| TD-M2-4 | `tailwind.config.js` not generated from `colors.ts` | Section 8 names this as a future step, not required for M2 | See Remaining Risks #4 |
| TD-M1-1…5 | Carried over from M1 | `M1-Engineering-Foundation-Report.md` | Unchanged by this milestone |

---

## 13. Ready for Review

**YES.**

`npm run lint` (exit 0, 0 new warnings), `npx tsc --noEmit` (0 errors), `npm run format:check`
(clean), and both platform export builds all succeed. The theme system is fully built, wired at
the app root, and every JS-level hardcoded color identified by the Architecture/Code-Quality
Audits has been migrated to it. Remaining risks (Section 11) are scope boundaries deliberately
chosen to protect "the UI should remain visually identical," not defects — flagged explicitly for
the next milestone's planning rather than silently left implicit.
