# Document 08: Design-System.md
**Version:** V1.3.0 | **Date:** 2026-07-19 | **Status:** LOCKED
**Supersedes:** V1.2.0 — Doctor Card layout diagram (Card System section) updated for the
premium-redesign pass's new CTA Button row and short-form time strings; Icon Library's `Clock`
row's "Used In" column extended to cover DoctorCard's Booking/OPD row. V1.1.0 — brand logos,
icons, and file assets moved to `08.1-Brand-Assets.md`; this document retains design tokens and
UI system specs only.
**Brand assets:** See `08.1-Brand-Assets.md` for all logo, icon, wordmark, and favicon usage.

---

## 🎨 DESIGN PHILOSOPHY

**Minimalism:** Flat, high-contrast, soft rounded corners.
**NOT:** Neumorphism, claymorphism, skeuomorphism.
**Goal:** Maximum readability in bright sunlight (rural outdoor use), minimal cognitive load for semi-literate users.

---

## 🌈 COLOR PALETTE

### Primary Colors
| Token | Hex | Usage | WCAG on White |
|-------|-----|-------|---------------|
| `--color-primary` | #5696C7 | Buttons, links, active states | AA (4.5:1 with #2B6CB0 text) |
| `--color-primary-dark` | #2B6CB0 | Primary text on white | AA |
| `--color-secondary` | #4B9F5F | Success, positive actions | AA (4.5:1 with #2F855A text) |
| `--color-secondary-dark` | #2F855A | Secondary text on white | AA |
| `--color-navy` | #1B3F6B | Headers, brand text, authority | AAA |

### Neutral Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-background` | #F8F9FA | App background |
| `--color-surface` | #FFFFFF | Cards, sheets, inputs |
| `--color-text-primary` | #1F2937 | Headlines, body text |
| `--color-text-secondary` | #6B7280 | Subtitles, hints, disabled |
| `--color-text-tertiary` | #9CA3AF | Placeholders, timestamps |
| `--color-border` | #E5E7EB | Dividers, input borders |
| `--color-border-focus` | #5696C7 | Focused input border |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | #16A34A | Success states, verified badge |
| `--color-warning` | #F59E0B | Warning, break status |
| `--color-error` | #DC2626 | Errors, danger actions, cancel |
| `--color-info` | #3B82F6 | Informational |
| `--color-emergency` | #DC2626 | Emergency tokens, badges |

### Status Colors
| Status | Background | Text | Icon |
|--------|-----------|------|------|
| AVAILABLE | #16A34A | #FFFFFF | 🟢 |
| ON_BREAK | #F59E0B | #FFFFFF | 🟡 |
| BUSY | #EA580C | #FFFFFF | 🟠 |
| OFFLINE | #6B7280 | #FFFFFF | ⚫ |
| CALLED | #16A34A | #FFFFFF | 🟢 |
| WAITING | #F59E0B | #FFFFFF | 🟡 |
| COMPLETED | #6B7280 | #FFFFFF | ✅ |
| CANCELLED | #DC2626 | #FFFFFF | ❌ |
| NO_SHOW | #6B7280 | #FFFFFF | ⚫ |
| EXPIRED | #6B7280 | #FFFFFF | ⏰ |

### Dark Mode (Admin/Doctor Dashboard Only)
| Token | Light | Dark |
|-------|-------|------|
| Background | #F8F9FA | #111827 |
| Surface | #FFFFFF | #1F2937 |
| Text Primary | #1F2937 | #F9FAFB |
| Text Secondary | #6B7280 | #D1D5DB |
| Border | #E5E7EB | #374151 |

> Dark mode is explicitly scoped to the (out-of-scope-for-this-app) Admin/Doctor web dashboards.
> The patient mobile app does not need a dark mode for V1 — do not build a dark-mode toggle into
> `09-Component-Library.md`'s Settings screen (S14) unless a founder decision adds it.

---

## 🔤 TYPOGRAPHY

### Font Family
- **Primary:** System default (San Francisco on iOS, Roboto on Android)
- **Fallback:** Inter (if custom font loaded)
- **Hindi:** System default (Noto Sans Devanagari on Android, Kohinoor on iOS)

### Type Scale
| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-hero` | 32px | 1.2 | 700 | Splash headline |
| `text-headline` | 24px | 1.2 | 700 | Screen titles |
| `text-title` | 18px | 1.3 | 600 | Card titles, section headers |
| `text-body-large` | 16px | 1.5 | 400 | Primary body, buttons |
| `text-body` | 14px | 1.5 | 400 | Secondary body, descriptions |
| `text-caption` | 12px | 1.4 | 400 | Timestamps, hints, labels |
| `text-token-hero` | 72px | 1.0 | 700 | Token number display |

### Typography Rules
- Minimum readable size: 12px (captions)
- Body text: 14-16px
- Headlines: 18-32px
- Line height body: 1.5 (readability)
- Line height headlines: 1.2 (compact)
- Bold for headlines and CTAs only
- Regular weight for body (reduces visual noise)

---

## 📐 SPACING SCALE

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Icon padding, tight gaps |
| `space-2` | 8px | Inline spacing, small gaps |
| `space-3` | 12px | Card internal padding |
| `space-4` | 16px | Standard padding, section gaps |
| `space-5` | 20px | Large gaps |
| `space-6` | 24px | Screen padding, large sections |
| `space-8` | 32px | Hero spacing, major sections |
| `space-12` | 48px | Splash screen, empty states |

### Layout Grid
- **Base unit:** 4px
- **Screen padding:** 16px horizontal
- **Card padding:** 16px all sides
- **Section gap:** 24px
- **List item gap:** 12px

---

## 🔲 RADIUS SCALE

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 8px | Chips, badges, small buttons |
| `radius-md` | 12px | Buttons, inputs, cards |
| `radius-lg` | 16px | Cards, modals, bottom sheets |
| `radius-xl` | 24px | Bottom sheets, large containers |
| `radius-2xl` | 32px | Hero containers, splash |
| `radius-full` | 9999px | Pills, avatars, circular buttons |

---

## 🌫️ ELEVATION & SHADOWS

| Token | Shadow | Usage |
|-------|--------|-------|
| `shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | Subtle borders |
| `shadow-md` | 0 4px 6px rgba(0,0,0,0.1) | Cards, buttons |
| `shadow-lg` | 0 10px 15px rgba(0,0,0,0.1) | Modals, bottom sheets |
| `shadow-xl` | 0 20px 25px rgba(0,0,0,0.15) | Full-screen modals |

---

## 🎯 BUTTON SYSTEM

### Primary Button
```
Background: --color-primary (#5696C7)
Text: #FFFFFF
Border-radius: 12px (radius-md)
Height: 48px (minimum)
Padding: 16px horizontal
Font: text-body-large (16px), weight 600
Touch target: 48×48px minimum
Disabled: opacity 0.5, no pointer events
Loading: Spinner + reduced opacity
Pressed: opacity 0.85, no scale transform (avoid layout shift on rural low-end devices)
Focus (external keyboard/accessibility nav): 2px outline in --color-border-focus, 2px offset
```

### Secondary Button
```
Background: transparent
Border: 1px solid --color-primary
Text: --color-primary
Border-radius: 12px
Height: 48px
Pressed: background --color-primary at 8% opacity
Focus: 2px outline in --color-border-focus, 2px offset
```

### Danger Button
```
Background: --color-error (#DC2626)
Text: #FFFFFF
Border-radius: 12px
Height: 48px
Pressed: opacity 0.85
Focus: 2px outline in --color-error, 2px offset
```

### Ghost Button
```
Background: transparent
Text: --color-primary
Height: 44px
Padding: 8px 12px
Pressed: background --color-primary at 8% opacity
```

### Icon Button
```
Size: 44×44px minimum (accessibility)
Background: transparent or --color-surface
Border-radius: 999px (circular)
Icon size: 24px
Pressed: background --color-text-tertiary at 10% opacity
```

---

## 📝 INPUT SYSTEM

### Text Input
```
Background: --color-surface (#FFFFFF)
Border: 1px solid --color-border (#E5E7EB)
Border-radius: 12px
Height: 48px
Padding: 12px 16px
Font: text-body (14px)
Focus: Border → --color-border-focus (#5696C7), shadow-sm
Error: Border → --color-error, error text below
Disabled: Background → #F3F4F6, text → --color-text-tertiary
```

### OTP Input
```
6 boxes, each: 48×56px
Border-radius: 12px
Border: 1px solid --color-border
Focus: Border → --color-primary, background → #EFF6FF
Filled: Border → --color-primary
Error: Border → --color-error, shake animation
```

### Checkbox
```
Size: 20×20px
Border-radius: 4px
Unchecked: Border → --color-border
Checked: Background → --color-primary, white checkmark
Error: Border → --color-error
```

---

## 🃏 CARD SYSTEM

### Doctor Card
```
Background: --color-surface
Border-radius: 16px (radius-lg)
Padding: 16px
Shadow: shadow-md
Gap between elements: 12px

Layout (updated 2026-07-19, premium-redesign pass — see 09-Component-Library.md Section 2.1 and
07-Mobile-UX-Spec.md's DoctorCard Component Spec for the full rationale; this diagram was
flagged and corrected here rather than left silently stale):
  [Avatar 80px] [Name + Blue Tick + Live Dot] [Queue Badge]
                [Specialty · Experience]
                [Early Partner pill, if applicable]
  [Clock] Booking: {time}      [Clock] OPD: {time}
  Consultation Fee                                                    {fee}
  [======== Book Appointment / Currently Closed (disabled) ========]

  — "Clinic" row REMOVED (Clinic Name display requirement removed from this card entirely).
  — Time row uses the short-form "Booking: {time}" / "OPD: {time}" pair (rather than the
    long-form sentence pair) for a tighter two-column premium layout — both remain valid per
    10-UX-Writing-Guide.md Section 22; this is this card's chosen fit.
  — Experience moved onto the specialty line ("Specialty · N yrs exp"); the former Fee+Experience
    row is now a dedicated, prominent "Consultation Fee" callout (see Mobile-UX-Spec.md's
    updated "FEE + EXPERIENCE ROW" note) — `doctor.experience` data is unchanged, only its
    on-card position moved, to match the reference premium layout's fee emphasis.
  — CTA Button row ADDED — full-width primary `Button` atom, "Book Appointment" label; becomes
    disabled with a "Currently Closed" label when `doctor.isClosed` is true. Additive to (not a
    replacement for) the outer card's own tap-to-navigate behavior — see Mobile-UX-Spec.md's
    "CTA BUTTON ROW" subsection.
  — Closed State: entire card container gets `grayscale` + `opacity-60` (Tailwind), per the
    Component Spec's Closed State section. The CTA Button is independently `disabled` in this
    state on top of that container-level filter.
```

### Token Card
```
Background: --color-surface
Border-radius: 16px
Padding: 20px
Border-left: 4px solid status-color

Layout:
  [Token #] [Doctor] [Clinic]
  [Status Badge] [Time]
  [Track] [Cancel]
```

### Bottom Sheet
```
Background: --color-surface
Border-radius: 24px 24px 0 0 (radius-xl top)
Padding: 24px 16px
Max height: 85% of screen
Drag handle: 40×4px, --color-text-tertiary, centered
Backdrop: rgba(0,0,0,0.5)
```

---

## 🏷️ BADGE SYSTEM

| Type | Background | Text | Border-radius |
|------|-----------|------|---------------|
| Verified | #16A34A | #FFFFFF | 999px |
| Early Partner | linear-gradient(135deg, #F59E0B, #D97706) | #FFFFFF | 999px |
| Queue Status | status color | #FFFFFF | 8px |
| Emergency | #DC2626 | #FFFFFF | 8px |
| Notification | #DC2626 | #FFFFFF | 999px |

---

## 🔣 ICON LIBRARY

**Set:** `lucide-react-native` (Lucide icon set — consistent, MIT-licensed, tree-shakeable).
**Default size:** 24px. **Default color:** `currentColor` (inherits from parent text color).

| Icon Name (Lucide) | Used In | Purpose |
|---|---|---|
| `Search` | S05, S06 SearchBar | Search bar left icon |
| `Mic` | S05 SearchBar (V1.1, greyed/disabled in V1) | Voice search — placeholder only in V1 |
| `MapPin` | S05 header, S07, S09 | Location pill, clinic address |
| `ChevronLeft` | Header back button (all screens with `showBack`) | Navigation back |
| `X` | FilterChip clear, BottomSheet close, S05 clear-all | Dismiss/clear |
| `Filter` | S06 header | Open FilterPanel |
| `Check` | Checkbox checked state, Verified badge | Confirmation/verification |
| `CheckCircle2` | S09 Completed status, S16 | Completed state |
| `Clock` | S09 Expired status, loading contexts; DoctorCard Booking/OPD time row (added 2026-07-19, premium-redesign pass — small accent icon paired with each of the two short-form time strings, NOT a second undocumented icon for the same "time" meaning) | Time/expiry |
| `AlertTriangle` | S16 warning header, error banners | Warnings |
| `XCircle` | S09 Cancelled status | Cancelled state |
| `Bell` | S15 tab icon, empty-state illustration | Notifications |
| `BellOff` | Notification toggle OFF state (S14) | Notifications disabled |
| `Settings` | S14 tab icon | Settings |
| `User` | Avatar fallback, S13 | Profile |
| `Share2` | S07, S09 [Share] actions | Share sheet trigger |
| `Phone` | Call clinic action | Dial |
| `Navigation` | S09 [Get directions] | Maps deep link |
| `Star` | Early Partner badge (paired with the ⭐ emoji already in copy — use ONE, not both; see
  note below) | Early Partner |
| `Calendar` | Bookings tab icon | My Bookings |
| `RefreshCw` | Pull-to-refresh spinner fallback, [Retry] buttons | Retry/refresh actions |
| `CheckCircle` | WaitlistForm (Component-Library.md Section 3.8) success state | Waitlist join confirmation — distinct from `CheckCircle2` (S09/S16 completed state) already in this table; added 2026-07-19 rather than silently reusing `CheckCircle2` for a visually different request |
| `BadgeCheck` | DoctorCard (Component-Library.md Section 2.1) — "Blue Tick" verification icon, color --color-primary (#5696C7) | Added 2026-07-19 (Founder directive) — the social-media-style "Blue Tick," rendered directly next to the doctor's name. DoctorCard-specific: does NOT replace the `Check` icon used inside the shared `Badge` atom's green `verified` variant elsewhere in the app — see Component-Library.md Section 2.1's note on this being a component-scoped substitution, not a global one |

> **Emoji vs. icon-set conflict, flagged for a decision:** `10-UX-Writing-Guide.md` and
> `07-Mobile-UX-Spec.md` both use literal emoji (🟢, 🟡, ⭐, 💊, etc.) directly in copy strings
> for status badges and section labels. This works fine for platforms that render emoji
> consistently, but React Native's emoji rendering varies slightly by OS/device font, while a
> Lucide icon renders identically everywhere. **Recommendation:** keep emoji in Hindi/English
> *copy* where they read naturally as part of a sentence (e.g. "🎉 You're saving ₹29"), but use
> the Lucide icon set for anything that's a structural UI element (status badges, buttons, nav
> icons) rather than inline text. This isn't a contradiction to "fix" — it's a distinction this
> table is making explicit for the first time. Flag any screen where this split isn't obvious in
> `Known-Gaps.md` rather than guessing.

---

## ♿ ACCESSIBILITY

### Touch Targets
- **Minimum:** 44×44px (Apple HIG + WCAG 2.1)
- **Preferred:** 48×48px
- **Buttons:** 48px height minimum
- **Icon buttons:** 44×44px minimum
- **List items:** 48px height minimum

### Color Contrast
- **Normal text (14px+):** 4.5:1 minimum (WCAG AA)
- **Large text (18px+ bold):** 3:1 minimum
- **UI components:** 3:1 minimum
- **Focus indicators:** 3:1 minimum

### Screen Reader
- All images: alt text or aria-label
- All buttons: descriptive labels
- Form inputs: associated labels
- Status changes: announced via live region
- Error messages: associated with input

### Motion
- Respect `prefers-reduced-motion`
- Animations: 200-300ms, ease-out
- No flashing content (>3Hz)

---

## 📱 PLATFORM ADAPTATIONS

### iOS
- Safe area insets respected
- Status bar: dark content on light background
- Bottom home indicator: padding added
- Font: San Francisco system
- Scroll bounce: enabled

### Android
- Status bar: --color-navy background
- Navigation bar: gesture or 3-button
- Font: Roboto system
- Scroll physics: Android default
- Ripple effect: on all touchable elements

---

Last updated: 2026-07-16 | JivniCare Mobile V1.0
