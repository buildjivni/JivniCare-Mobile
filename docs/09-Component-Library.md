# Document 09: Component-Library.md
**Version:** V1.3.0 | **Date:** 2026-07-19 | **Status:** LOCKED
**Supersedes:** V1.2.0 — `DoctorCard` (Section 2.1) extended for the premium-redesign pass
(Founder directive, 2026-07-19): added a full-width CTA `Button` row (`bookAppointmentLabel`
prop, "Book Appointment" default) that becomes disabled/"Currently Closed" when `isClosed` is
true, and switched the documented time-row example to the short-form "Booking: {time}" /
"OPD: {time}" strings — see that section's inline note for the full diff. V1.2.0 — `DoctorCard`
(Section 2.1) props updated for the Availability & Live
Status Overhaul (Founder directive, 2026-07-19): `clinicName`/`city` removed, `bookingTime` /
`opdTime` / `isLive` / `isClosed` added — see that section's inline note for the full diff and
open questions. V1.1.0 superseded V1.0.0 — every interface below now includes accessibility
props (`accessibilityLabel`/`accessibilityRole`/`accessibilityHint`) and explicit interaction
states (pressed/focus), closing the gap flagged in the readiness audit where accessibility
requirements lived in `08-Design-System.md` but weren't part of the actual component contracts.

**Platform:** React Native (Expo) | **Language:** TypeScript

---

## 0. Shared Accessibility Base

Every interactive atom/molecule below extends this base — it's written once here instead of
repeated 20 times, but it is NOT optional on any component that renders a pressable element.

```typescript
interface AccessibleProps {
  accessibilityLabel: string;       // REQUIRED on every pressable/interactive element —
                                     // what a screen reader announces. Must be the Hindi OR
                                     // English string currently active per Zustand's language
                                     // state, sourced from 10-UX-Writing-Guide.md — never a
                                     // hardcoded English string regardless of app language.
  accessibilityRole?: 'button' | 'link' | 'image' | 'header' | 'checkbox' | 'radio' |
                       'text' | 'adjustable' | 'search' | 'none';
  accessibilityHint?: string;       // optional — what happens on activation, when the label
                                     // alone doesn't make it obvious (e.g. a Danger button's
                                     // label is "Cancel Booking"; hint could clarify
                                     // "double tap to cancel your appointment")
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;                 // set true during Loading states (Section on interaction
                                     // states below) so screen readers announce "busy"
  };
  testID?: string;                  // for E2E test targeting, per 03-testing-guidelines.md's
                                     // patterns on the web side — carry the same convention
                                     // to mobile rather than inventing a new one
}
```

## 0.1 Shared Interaction States

Every atom below has, at minimum, these states — listed once here rather than repeated:

```
default   → resting appearance, per Design-System.md's base spec for that component
pressed   → per Design-System.md Button System's per-variant "Pressed:" line (opacity/background
            shift, NO scale transform — scale transforms cause visible jank on the low-end
            Android devices named in User-Personas.md's primary personas)
focus     → 2px outline per Design-System.md's per-variant "Focus:" line — relevant for
            external keyboard/switch-control accessibility navigation, not just mouse users
disabled  → opacity 0.5, no pointer events, accessibilityState.disabled: true
loading   → spinner replaces label OR appears alongside it (component-specific, noted per atom
            below), accessibilityState.busy: true, disabled interaction during this state
```

---

## 1. ATOMS (Foundation Components)

### 1.1 Button
```typescript
interface ButtonProps extends AccessibleProps {
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;       // use Design-System.md's Icon Library — Lucide, not emoji
  rightIcon?: React.ReactNode;
}

// Interaction states: default/pressed/focus/disabled/loading — all per Section 0.1.
// accessibilityRole is always 'button' unless the button navigates (then 'link').
// accessibilityState.busy must be true while loading is true.

// Usage:
<Button
  variant="primary" size="large" fullWidth onPress={handleBook}
  accessibilityLabel="Book Appointment Now"
  accessibilityHint="Proceeds to booking confirmation"
>
  Book Appointment Now
</Button>

<Button
  variant="danger" size="medium" onPress={handleCancel}
  accessibilityLabel="Cancel Booking"
  accessibilityHint="Cancels your appointment, cannot be undone"
>
  Cancel Booking
</Button>
```

### 1.2 Input
```typescript
interface InputProps extends AccessibleProps {
  type: 'text' | 'phone' | 'otp' | 'email' | 'search' | 'multiline';
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;                   // REQUIRED conceptually — if omitted, accessibilityLabel
                                     // on the base props MUST carry the same information, since
                                     // a screen-reader user needs to know what the field is for
                                     // even if there's no visible <label> equivalent
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
}

// Interaction states: default/focus/disabled from Section 0.1 (no "pressed" — not a pressable);
// additionally: filled (has a value), error (red border, error text announced via
// accessibilityLiveRegion="polite" so a screen reader speaks the error without the user
// needing to re-focus the field)

// Usage:
<Input
  type="phone" value={phone} onChangeText={setPhone}
  placeholder="98765 43210" label="Phone Number" error={phoneError}
  accessibilityLabel="Phone Number"
  accessibilityHint="Enter your 10 digit mobile number"
/>
```

### 1.3 OTPInput
```typescript
interface OTPInputProps extends AccessibleProps {
  length: number; // default: 6
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  autoFocus?: boolean;
}

// Behavior:
// - Each box: 48×56px
// - Auto-advance on digit entry
// - Backspace moves to previous
// - Paste support (auto-distributes)
// - Shake animation on error (respect prefers-reduced-motion per Design-System.md — fall back
//   to a red-border-only error indication with no shake if reduced motion is on)
// Accessibility: each digit box gets its own accessibilityLabel ("Digit 1 of 6", etc.);
// the group itself has accessibilityRole="text" with a combined label read on focus entry
// ("Enter 6 digit OTP, currently 3 digits entered")
```

### 1.4 Checkbox
```typescript
interface CheckboxProps extends AccessibleProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

// accessibilityRole: 'checkbox' (always — do not override)
// accessibilityState.checked must reflect the `checked` prop exactly

// Usage:
<Checkbox
  checked={consent} onToggle={() => setConsent(!consent)}
  label="I agree to Terms of Use"
  accessibilityLabel="I agree to Terms of Use and Privacy Policy"
/>
```

### 1.5 Toggle/Switch
```typescript
interface ToggleProps extends AccessibleProps {
  value: boolean;
  onToggle: () => void;
  label?: string;
  disabled?: boolean;
}
// accessibilityRole: 'switch' equivalent — React Native's Switch component handles this
// natively; if building custom, set accessibilityRole to the closest available ('adjustable')
// and accessibilityState.checked to `value`
```

### 1.6 Badge
```typescript
interface BadgeProps extends AccessibleProps {
  variant: 'verified' | 'earlyPartner' | 'status' | 'notification';
  status?: 'available' | 'onBreak' | 'busy' | 'offline' | 'called' | 'waiting';
  text: string;
  icon?: React.ReactNode;           // Lucide icon per Design-System.md, NOT the emoji from the
                                     // copy string — see Design-System.md's Icon Library note on
                                     // the emoji-vs-icon split
}
// Badges are informational, not interactive — accessibilityRole: 'text', and the
// accessibilityLabel should speak the FULL meaning, not just the badge text (e.g. a "🟢 LIVE ·
// 5 ahead" badge's accessibilityLabel should be "Available now, 5 patients ahead", not the
// literal visual text with emoji)

// Usage:
<Badge variant="verified" text="Verified" accessibilityLabel="Verified doctor" />
<Badge variant="status" status="available" text="LIVE · 5 ahead" accessibilityLabel="Available now, 5 patients ahead" />
<Badge variant="earlyPartner" text="⭐ Early Partner" accessibilityLabel="Early Partner doctor" />
```

### 1.7 Avatar
```typescript
interface AvatarProps extends AccessibleProps {
  source?: string; // URL or local path
  size: 'small' | 'medium' | 'large' | 'xlarge';
  fallback?: string; // Initials or icon
  status?: 'online' | 'offline' | 'busy';
}
// accessibilityRole: 'image'; accessibilityLabel should describe whose avatar it is
// ("Dr. Rajesh Sharma's photo"), not just "avatar"

// Sizes: small 32×32px / medium 48×48px / large 64×64px / xlarge 80×80px
```

### 1.8 Icon
```typescript
interface IconProps {
  name: string; // Lucide icon name — see Design-System.md's Icon Library table for the
                // canonical mapping of which named icon to use where; do not introduce a new
                // icon name without adding it to that table first (per
                // 13-AI-Development-Rules.md Rule 2)
  size?: number; // default: 24
  color?: string; // default: currentColor
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill';
  accessibilityLabel?: string; // REQUIRED when the icon is the ONLY content of a pressable
                                // (e.g. an icon-only button) — omit only when the icon is
                                // purely decorative and sits next to text that already
                                // conveys the same meaning (in which case set
                                // accessibilityElementsHidden={true} on the icon itself)
}
```

---

## 2. MOLECULES (Composite Components)

### 2.1 DoctorCard
```typescript
interface DoctorCardProps extends AccessibleProps {
  doctor: {
    id: string;
    name: string;
    specialty: string;
    experience: number;
    consultationFee: number;
    profilePhoto?: string;
    isVerified: boolean;
    isEarlyPartner: boolean;
    queueStatus: 'available' | 'onBreak' | 'busy' | 'offline';
    patientsAhead?: number;
    patientsServed: number;
    // Added 2026-07-19 — see 05-Business-Rules.md Section 16 (Doctor Availability & Booking
    // Automation) and 07-Mobile-UX-Spec.md's DoctorCard Component Spec:
    bookingTime: string;   // pre-formatted display string, e.g. "7:00 AM" (from bookingStartTime)
    opdTime: string;       // pre-formatted display string, e.g. "10:00 AM" (from opdStartTime)
    isLive: boolean;       // automated/manual live status per Business-Rules.md Rules DA2-DA4
    isClosed: boolean;     // drives the grayscale/opacity Closed State treatment; kept as an
                            // explicit sibling prop rather than deriving `!isLive` inline in
                            // every consumer, since a future intermediate state (e.g. "closing
                            // soon") may need to diverge from a strict isLive negation —
                            // flagged, not resolved, see 15-Known-Gaps.md Section 2.3
  };
  onPress: () => void;
  // Added 2026-07-19 (premium-redesign pass) — localized CTA button labels, sourced from
  // 10-UX-Writing-Guide.md's canonical "Book Appointment" string — NOT the S07 entry CTA's
  // "Book Appointment Now" variant, a different string for a different screen.
  bookAppointmentLabel?: string;   // default: "Book Appointment"
  closedButtonLabel?: string;      // default: "Currently Closed" (Section 22)
}

// ⚠️ Updated 2026-07-19 (Founder directive) — summary of the diff from the prior version:
//   - REMOVED `clinicName` and `city` — the Clinic Name/address display requirement was
//     removed from DoctorCard entirely (still shown, unaffected, on the full S07 profile).
//   - ADDED `bookingTime` / `opdTime` / `isLive` / `isClosed` (above) — this is a SEPARATE
//     status model from the existing `queueStatus` prop, which is UNCHANGED and still drives
//     `QueueStatusBadge`; see 15-Known-Gaps.md Section 2.3 for the open question of whether the
//     two models should eventually be unified.
//   - Verification display CHANGED, for this component only, from the shared `Badge` atom's
//     `verified` variant (green pill, 08-Design-System.md Badge System) to a direct Lucide
//     `BadgeCheck` icon in `--color-primary` (#5696C7) rendered next to the name. The `Badge`
//     atom's `verified` variant is untouched for any other consumer.
//   - ADDED a Live Indicator: an 8px filled circle in `--color-success` (#16A34A) next to the
//     name, rendered only when `isLive` is true.
//
// ⚠️ Updated again 2026-07-19 (Founder directive, "premium booking-platform redesign" pass) —
// summary of THIS diff on top of the one above:
//   - ADDED a full-width CTA `Button` (atom, Section 1.1) as the card's final row —
//     `bookAppointmentLabel` (default "Book Appointment"). Reuses the card's own `onPress`
//     callback (no new `onBookPress` prop — see 07-Mobile-UX-Spec.md's Open Items note for why
//     that was a deliberate scope decision, not an oversight).
//   - When `isClosed` is true, this button's label switches to `closedButtonLabel` (default
//     "Currently Closed") and it renders `disabled` (Section 0.1's standard disabled treatment).
//     This is layered ON TOP OF the existing card-level `grayscale opacity-60` — it does NOT
//     change the outer card's own tap-to-navigate behavior, which stays enabled/tappable in the
//     Closed State exactly as the note below already specifies.
//   - Time row's documented example switched from the long-form sentence pair to the short-form
//     "Booking: {time}" / "OPD: {time}" pair, each with a small `Clock` icon accent — see
//     Design-System.md's Icon Library `Clock` row and 07-Mobile-UX-Spec.md's "CTA BUTTON ROW"
//     subsection for the full rationale on both.
//   - `experience` moved from the old "[Fee] [Experience]" row onto the specialty line
//     ("Specialty · N yrs exp"); the old row is now a dedicated "Consultation Fee" callout — see
//     Mobile-UX-Spec.md's updated "FEE + EXPERIENCE ROW" note. `experience` remains the same
//     field on `DoctorCardDoctor`, only its rendered position changed.
//
// Layout: See Design-System.md Section "Card System" — NOTE that doc's Doctor Card ASCII
// diagram has been updated to match (clinic row removed, time row added, CTA button row added);
// flagged here so the two docs don't silently drift again.
// Height: no longer a fixed 120px — the time row and CTA button row add height; the card
// (outside the button) remains tappable regardless of height.
// CLOSED STATE: when `isClosed` is true, the entire card container applies Tailwind
// `grayscale opacity-60` — see 07-Mobile-UX-Spec.md's DoctorCard Component Spec for the full
// visual spec, including why the Blue Tick still renders (desaturated) in this state. The CTA
// Button additionally becomes `disabled` in this state (see diff above) — the outer card's own
// tap target does NOT become disabled; only the nested button does.
// accessibilityRole: 'button' (unchanged, on the outer card). accessibilityLabel must now
// include live/closed status and the two time strings, and must NOT mention clinic name, e.g.
// "Dr. Rajesh Sharma, General Physician, verified, live now, booking starts at 7:00 AM, OPD
// opens at 10:00 AM, ₹500 fee" (or "...currently closed..." when isClosed is true) — see
// Mobile-UX-Spec.md's Component Spec Accessibility note for the full rationale. The nested CTA
// Button carries its own independent `accessibilityLabel`/`accessibilityState.disabled`.
// Interaction states: default/pressed/focus per Section 0.1 on the outer card (unchanged, no
// loading/disabled state at the card level); the nested CTA Button additionally has its own
// disabled state per Section 0.1, scoped to itself only.
```

### 2.2 TokenCard
```typescript
interface TokenCardProps extends AccessibleProps {
  token: {
    id: string;
    tokenNumber: number;
    doctorName: string;
    specialty: string;
    clinicName: string;
    status: TokenStatus;
    type: 'online' | 'walkin';
  };
  onTrack: () => void;
  onCancel?: () => void;
}

// Layout: See Design-System.md Card System
// Cancel button only shown for cancellable states (per Business-Rules.md Rule C1) — when
// hidden, do not leave an empty gap; reflow the Track button, and ensure the card's overall
// accessibilityLabel doesn't mention a Cancel action that isn't actually present
```

### 2.3 OTPInputBox
```typescript
interface OTPInputBoxProps extends AccessibleProps {
  phone: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onChangePhone: () => void;
  error?: string;
  countdown: number; // seconds remaining
  maxAttempts: number;
  attemptsUsed: number;
}
// Combines: OTPInput + Resend timer + Error message
// The countdown timer text ("Resend OTP in 30s") should update via an accessibilityLiveRegion
// with a "polite" (not "assertive") interruption level — a screen reader announcing every
// single second would be unusable; announce only when it flips from counting to "Resend OTP"
// being tappable
```

### 2.4 BottomSheet
```typescript
interface BottomSheetProps extends AccessibleProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'small' | 'medium' | 'large' | 'full';
  showHandle?: boolean;
}

// Usage: Filters, actions, confirmations
// Animation: Slide up 300ms, spring physics (respect prefers-reduced-motion → cross-fade
// instead of slide when enabled)
// Backdrop: Tap to dismiss
// Accessibility: on open, focus MUST move into the sheet (first focusable element or the
// title if present) and MUST be trapped inside the sheet until closed (a screen-reader/
// keyboard user should not be able to tab back to content behind the backdrop); on close,
// focus returns to whatever element opened the sheet
```

### 2.5 FilterChip
```typescript
interface FilterChipProps extends AccessibleProps {
  label: string;
  active: boolean;
  onPress: () => void;
  onClear?: () => void; // Shows X when active
}

// Size: Small button (36px height — note this is BELOW the 44px minimum touch target rule;
// per Design-System.md Section "Touch Targets," the chip's tappable hit-slop must be padded
// out to 44px even though its visual height stays 36px, using React Native's hitSlop prop —
// do not shrink the actual touch target to match the visual size)
// Active: Primary background, white text, accessibilityState.selected: true
// Inactive: Outline style, accessibilityState.selected: false
// accessibilityRole: 'button'
```

### 2.6 QueueStatusBadge
```typescript
interface QueueStatusBadgeProps extends AccessibleProps {
  status: 'available' | 'onBreak' | 'busy' | 'offline';
  patientsAhead?: number;
  breakMessage?: string;
  onPress?: () => void;
}

// Dynamic content based on status (see UX-Writing-Guide.md Section 5 for exact bilingual
// strings — do not hardcode English fallback text here, source it from that doc):
// AVAILABLE: "🟢 LIVE · 5 ahead" | ON_BREAK: "🟡 On Break · Back soon" |
// BUSY: "🟠 Queue Full · Join Waitlist" | OFFLINE: "⚫ Currently Unavailable · Get Notified"
// accessibilityRole: 'button' if onPress is provided (BUSY/OFFLINE states are typically
// tappable to jump to waitlist/notify actions), otherwise 'text'
```

### 2.7 NotificationItem
```typescript
interface NotificationItemProps extends AccessibleProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: 'booking' | 'queue' | 'system' | 'waitlist';
    read: boolean;
    createdAt: Date;
  };
  onPress: () => void;
  onDismiss: () => void;
}

// Swipe right: Mark as read (calls PATCH /api/notifications/mark-read per API-Contract.md F17)
// Swipe left: Delete (client-side dismiss; confirm this doesn't need a server call — the API
// as documented doesn't expose a delete endpoint, only mark-read — so "swipe left to delete"
// should hide the item locally, not attempt a DELETE request that doesn't exist)
// Tap: Navigate to relevant screen (mark as read as a side effect of the tap, same endpoint)
// accessibilityState.selected reflects `read` inverted (unread items get a distinct
// accessibility hint: "unread notification, double tap to view and mark as read")
```

### 2.8 EmptyState
```typescript
interface EmptyStateProps extends AccessibleProps {
  illustration: string; // Illustration name or component
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}
// accessibilityRole: 'text' for the state itself; if onAction is provided, that inner button
// gets its own accessibilityRole: 'button' and accessibilityLabel matching actionLabel
```

### 2.9 LoadingSkeleton
```typescript
interface LoadingSkeletonProps {
  variant: 'doctorCard' | 'tokenCard' | 'list' | 'profile' | 'notificationRow';
  count?: number;
}
// Shimmer animation — respect prefers-reduced-motion (fall back to a static gray placeholder,
// no shimmer motion, when enabled)
// accessibilityLabel: "Loading" (single announcement per group, not per shimmer row — a
// screen reader should not announce "Loading" 5 times for 5 skeleton cards)
// accessibilityState.busy: true on the containing group
```

---

## 3. ORGANISMS (Complex Components)

### 3.1 SearchBar
```typescript
interface SearchBarProps extends AccessibleProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onSubmit: () => void;
  placeholder?: string;
  showMic?: boolean;
}

// Features: Debounced search (300ms), Clear button (X) when text entered, Auto-focus on
// screen load, search icon left (Lucide `Search`), mic icon right (V1.1 — greyed out/disabled
// in V1, per Design-System.md's Icon Library note; if rendered disabled, its
// accessibilityState.disabled must be true and accessibilityHint should say "coming soon"
// rather than leaving a silently-broken control)
// accessibilityRole: 'search' on the container
```

### 3.2 FilterPanel (Bottom Sheet)
```typescript
interface FilterPanelProps extends AccessibleProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    specialties: string[];
    availability: 'any' | 'today' | 'tomorrow';
    maxFee: 'any' | 'under500' | 'under1000';
    minExperience: 'any' | '5plus' | '10plus' | '15plus';
  };
  onApply: (filters: FilterState) => void;
  onReset: () => void;
}

// Sections: 1. Specialties (multi-select chips, tier-grouped) 2. Availability (radio, 3
// options) 3. Max Fee (radio, 3 options) 4. Min Experience (radio, 4 options)
// Footer: [Reset All] [Apply Filters]
// Extends BottomSheet's accessibility behavior (focus trap, return-focus-on-close) — see
// Section 2.4
```

### 3.3 SpecialitySelector
```typescript
interface SpecialitySelectorProps extends AccessibleProps {
  selected: string[];
  onSelect: (specialties: string[]) => void;
  multiSelect?: boolean;
  searchable?: boolean;
}

// Features: Tier-grouped list (Tier 1/2/3/4 per PRD.md F04's 30-item list — NOT the deprecated
// 20-item list), icons per specialty (Lucide, per Design-System.md), type-to-filter search,
// bottom sheet on mobile, checkmark for selected items
// Each tier group header has accessibilityRole: 'header' so screen reader users can navigate
// tier-to-tier rather than item-by-item through all 30
```

### 3.4 BookingWidget
```typescript
interface BookingWidgetProps extends AccessibleProps {
  doctor: Doctor;
  estimatedToken: number;           // client-side ESTIMATE — see 07-Mobile-UX-Spec.md S08's
                                     // note: the real token number comes back from the API and
                                     // may differ by 1-2 positions
  totalSlots: number;
  patientsAhead: number;
  consultationFee: number;
  onConfirm: () => void;
  onWaitlist: () => void;
  blocked?: boolean;
  blockReason?: string;             // one of the 13 named codes from Business-Rules.md Rule B6
                                     // — map each to its exact UX-Writing-Guide.md string, do
                                     // not paraphrase
}

// Layout: Token preview (hero) → Progress bar → Fee breakdown → Consent checkbox → Confirm
// button (disabled until consent) — NOTE: consent checkbox currently has no backend to submit
// to (F19 gap, see API-Contract.md) — build the UI, wire submission once P0-4 lands
// Interaction states include a distinct "estimate vs confirmed" visual treatment — the
// pre-confirm token number should be visually marked as provisional (e.g. "~#8" or an
// "estimated" caption) so users aren't surprised if the real number differs slightly
```

### 3.5 QueueTracker
```typescript
interface QueueTrackerProps extends AccessibleProps {
  token: QueueToken;
  doctor: Doctor;
  currentServing?: number;
  onCancel: () => void;
  onCallClinic: () => void;
}

// Layout: Token number (hero, 120px) → Doctor info → Queue status → Progress bar → Clinic
// info + directions → Actions (Cancel, Call)
// Auto-refresh: 30s polling + FCM (see API-Contract.md F09's Bearer-token blocker — this
// component's data source needs that fixed before it can function on mobile)
// Status changes should trigger an accessibilityLiveRegion announcement ("assertive" level is
// appropriate here specifically — TOKEN_CALLED is time-sensitive enough to warrant
// interrupting whatever the screen reader is currently saying)
```

### 3.6 ProfileForm
```typescript
interface ProfileFormProps extends AccessibleProps {
  user: User;
  onSave: (data: Partial<User>) => void;
  loading?: boolean;
}

// Fields: Name (required), Email (optional), Phone (read-only — accessibilityState.disabled
// true, with a hint explaining WHY it's read-only: "Phone number cannot be changed"), Location
// (optional), Preferred Language (dropdown), Avatar (tap to change)
// NOTE: no backend endpoint exists for this yet (F14 gap) — build the form, the save action
// will need to point at a new endpoint once built
```

### 3.7 ConsentCheckbox
```typescript
interface ConsentCheckboxProps extends AccessibleProps {
  checked: boolean;
  onToggle: () => void;
  variant: 'signup' | 'booking';
}

// Signup variant: "I agree to Terms of Use and Privacy Policy" / "I confirm I am booking for
// myself or as guardian"
// Booking variant: "I understand JivniCare is a booking platform..."
// NOTE: neither variant currently has a backend ConsentLog write path (F19 gap) — this
// component can and should be built now; its onToggle should still update local form state
// so the rest of the booking/signup flow works, but flag the missing persistence in code as a
// TODO tied to Feature-Dependencies.md P0-4, not silently pretend it's saved
```

### 3.8 WaitlistForm
```typescript
interface WaitlistFormProps extends AccessibleProps {
  name: string;
  onChangeName: (text: string) => void;
  phone: string;
  onChangePhone: (text: string) => void;
  collectName?: boolean;            // default true — see note below
  onSubmit: () => void;              // fires only after local validation passes
  loading?: boolean;
  submitError?: string;
  success?: boolean;
  position?: number;                 // waitlist position, once the backend returns one
  onSuccessNavigate?: () => void;
  // + copy props (headerTitle, infoText, nameLabel, phoneLabel, submitLabel, etc.), each
  // defaulted to the closest canonical string in 10-UX-Writing-Guide.md — see component source
  // (src/components/organisms/WaitlistForm.tsx) for the full prop list and per-prop citations.
}
```

// Composes: Input (name + phone) + Button (primary submit) + Badge (position, success state)
// + Lucide `CheckCircle` (success icon — added to the Icon Library table below for this use).
//
// ⚠️ Added 2026-07-19, flagging two deviations from the locked spec rather than silently
// resolving them (per 13-AI-Development-Rules.md Rules 1/2/5 — see docs/15-Known-Gaps.md for
// the full entries):
//   1. `07-Mobile-UX-Spec.md` S12's documented Waitlist form has ONE field (Phone, pre-filled) —
//      no Name field. This component's `collectName` prop defaults to `true` to satisfy an
//      explicit build requirement that included a Name field; set it to `false` to render only
//      the field S12 actually specifies.
//   2. No documented endpoint exists for the *initial* join action this form performs —
//      `11-API-Contract.md` F12 (`POST /api/patient/queue/claim-waitlist`) is the CLAIM step for
//      when a slot opens, explicitly called out in S12 as "distinct from the CLAIM flow." This
//      component therefore never calls an API itself — it validates locally and calls the
//      parent's `onSubmit`, which stays a TODO tied to that backend gap.
// The Component Usage Matrix (Section 8) row for S12 is intentionally left unchanged (still
// "Button, Input" atoms, no organism) since adopting this organism for S12 is a founder-level
// UI decision, not something this addition should make unilaterally.
// accessibilityRole: 'header' on the title text; success state announces via
// accessibilityLiveRegion, same pattern as Toast's 'polite' success announcements (Section 6.3).

---

## 4. LAYOUT COMPONENTS

### 4.1 ScreenWrapper
```typescript
interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  refreshControl?: React.ReactNode;
  safeArea?: boolean;
  backgroundColor?: string;
}

// Features: Safe area insets (notch, home indicator), status bar styling, keyboard avoiding
// view, scroll view wrapper (optional)
// Every screen built with this wrapper should set accessibilityViewIsModal appropriately when
// used for a full-screen modal-style screen (e.g. S11, S16), so screen readers know not to
// navigate to content behind it
```

### 4.2 Header
```typescript
interface HeaderProps extends AccessibleProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

// Height: 56px
// Back button: 44×44px touch target, accessibilityLabel: "Go back" (localized per
// UX-Writing-Guide.md), accessibilityRole: 'button'
// Title: Centered, headline style, accessibilityRole: 'header' (lets screen reader users jump
// screen-to-screen by heading navigation)
```

### 4.3 BottomTabBar
```typescript
interface BottomTabBarProps extends AccessibleProps {
  tabs: {
    label: string;
    icon: string;
    badge?: number;
    route: string;
  }[];
  activeRoute: string;
  onTabPress: (route: string) => void;
}

// Height: 56px + safe area
// Active: Primary color + bold label, accessibilityState.selected: true
// Inactive: Gray + regular label, accessibilityState.selected: false
// Badge: Red dot with number — badge count MUST be included in the tab's accessibilityLabel
// (e.g. "Notifications, 3 unread"), not conveyed by color/visual dot alone
```

---

## 5. ANIMATION COMPONENTS

All animation wrapper components below MUST check `prefers-reduced-motion` (via React Native's
`AccessibilityInfo.isReduceMotionEnabled()`) and skip/shorten the animation accordingly — this
is not optional per-component, it's a blanket rule for this whole section.

### 5.1 FadeIn
```typescript
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}
```

### 5.2 SlideUp
```typescript
interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
}
```

### 5.3 Shake
```typescript
interface ShakeProps {
  children: React.ReactNode;
  trigger: boolean;
  onComplete?: () => void;
}
// Usage: Error states on OTP input — when reduced motion is on, replace with a static red
// border flash instead of a shake, per 09-Component-Library.md Section 1.3's note
```

### 5.4 Pulse
```typescript
interface PulseProps {
  children: React.ReactNode;
  active: boolean;
}
// Usage: Live queue badge, token called state
```

---

## 6. UTILITY COMPONENTS

### 6.1 ErrorBoundary
```typescript
// Catches React errors, shows friendly error screen
// "Something went wrong" + [Retry] button (per UX-Writing-Guide.md Section 16)
// The fallback screen itself must be fully accessible (it's often the LAST thing a user sees
// before giving up on the app) — accessibilityRole: 'alert' on the container so it's announced
// immediately
```

### 6.2 NetworkStatus
```typescript
// Monitors connectivity
// Shows offline banner when disconnected, auto-hides when reconnected
// accessibilityLiveRegion: "polite" — announce connectivity changes without interrupting
// whatever the user is currently doing
```

### 6.3 Toast
```typescript
interface ToastProps extends AccessibleProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onDismiss?: () => void;
}
// Position: Top (errors), Bottom (success)
// Auto-dismiss after 3s
// accessibilityLiveRegion: "assertive" for type='error', "polite" for 'success'/'info' — an
// error toast should interrupt; a success confirmation shouldn't
```

### 6.4 ConfirmationDialog
```typescript
interface ConfirmationDialogProps extends AccessibleProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'default';
}
// Same focus-trap/return-focus behavior as BottomSheet (Section 2.4)
// accessibilityRole: 'alert' on the container for variant='danger' (S11, S16 both use this)
```

---

## 7. COMPONENT HIERARCHY

```
App
├── Navigation
│   ├── AuthStack
│   │   ├── Splash (S01)
│   │   ├── LanguageSelection (S02)
│   │   ├── PhoneLogin (S03)
│   │   └── OTPVerification (S04)
│   └── MainTabs
│       ├── HomeStack
│       │   ├── Home (S05: ScreenWrapper + Header + SearchBar + DoctorCard)
│       │   ├── SearchResults (S06: DoctorCard list + FilterPanel)
│       │   ├── DoctorProfile (S07: QueueStatusBadge + BookingWidget)
│       │   ├── BookingConfirmation (S08: BookingWidget + ConsentCheckbox)
│       │   ├── TokenTracking (S09: QueueTracker)
│       │   └── WaitlistJoin (S12)
│       ├── BookingsStack
│       │   ├── MyBookings (S10: TokenCard list)
│       │   ├── TokenTracking (S09: QueueTracker)
│       │   └── CancelConfirmation (S11: ConfirmationDialog)
│       ├── NotificationsStack
│       │   └── NotificationInbox (S15: NotificationItem list)
│       └── SettingsStack
│           ├── Settings (S14: Toggle + list)
│           ├── ProfileEdit (S13: ProfileForm)
│           └── DataDeletion (S16: ConfirmationDialog + OTPInput)
├── Modals
│   ├── BottomSheet (FilterPanel, SpecialitySelector)
│   └── ConfirmationDialog (Cancel, Deactivate)
└── Overlays
    ├── Toast
    ├── NetworkStatus
    └── LoadingSkeleton
```

---

## 8. COMPONENT USAGE MATRIX

| Screen | Atoms | Molecules | Organisms |
|--------|-------|-----------|-----------|
| S01 Splash | Button | — | — |
| S02 Language Selection | Button | — | — |
| S03 Phone Login | Input, Button | OTPInputBox | — |
| S04 OTP Verification | Input, Button | OTPInputBox | — |
| S05 Home | Button, Icon, Badge | DoctorCard, LoadingSkeleton, EmptyState | SearchBar |
| S06 Search Results | Button, Icon, Badge | DoctorCard, FilterChip, LoadingSkeleton, EmptyState | SearchBar, FilterPanel |
| S07 Doctor Profile | Button, Icon, Badge, Avatar | QueueStatusBadge, LoadingSkeleton | BookingWidget |
| S08 Booking Confirmation | Button, Checkbox | — | BookingWidget, ConsentCheckbox |
| S09 Token Tracking | Button, Icon, Badge | — | QueueTracker |
| S10 My Bookings | Button, Icon, Badge | TokenCard, LoadingSkeleton, EmptyState | — |
| S11 Cancel Confirmation | Button | — | ConfirmationDialog |
| S12 Waitlist Join | Button, Input | — | — |
| S13 Profile Edit | Input, Button, Avatar | — | ProfileForm |
| S14 Settings | Toggle, Button, Icon | — | — |
| S15 Notifications | Icon, Badge | NotificationItem, LoadingSkeleton, EmptyState | — |
| S16 Data Deletion | Button, Input | OTPInputBox | ConfirmationDialog |

---

*Component Library Locked: 2026-07-15 | Corrected: 2026-07-16 | All components must match
Design-System tokens AND include the accessibility props from Section 0 — a PR/generation that
omits `accessibilityLabel` on a pressable is not spec-complete, per
13-AI-Development-Rules.md's Pre-Flight Checklist.*
