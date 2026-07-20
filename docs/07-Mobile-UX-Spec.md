# Document 07: Mobile-UX-Spec.md
**Version:** V1.3.0 | **Date:** 2026-07-19 | **Status:** LOCKED
**Supersedes:** V1.2.0 — DoctorCard Component Spec extended (Founder directive, 2026-07-19,
"premium booking-platform redesign" pass) with an explicit CTA Button row ("Book Appointment" /
disabled "Currently Closed"), switched its documented time-row example to the short-form
"Booking: {time}" / "OPD: {time}" strings, and clarified that the new button's disabled state is
additive to — not a replacement for — the existing "card remains fully tappable" navigation
behavior. See that section's "CTA BUTTON ROW" subsection for the full diff. V1.2.0 added a new
"DoctorCard Component Spec" section (Founder directive, 2026-07-19) covering the Blue Tick / Live
Dot / Closed-State grayscale overhaul; see that section's own note on a screen-numbering mismatch
in the originating request. V1.1.0 superseded V1.0.0 — Section "STATE MANAGEMENT" expanded from 5
to all 16 screens; S12's button text
corrected to match `10-UX-Writing-Guide.md` (see `02-Source-of-Truth.md` Corrections Log #6).
S16 flow updated to reflect the confirmed locked decision that OTP stays required for
deactivation (backend build tracked in `14-Feature-Dependencies.md` P0-3).

---

## 📱 SCREEN INVENTORY (16 Patient Screens)

| # | Screen | Purpose | Auth Required | Status | Owner | Primary API | Entry Points |
|---|--------|---------|---------------|--------|-------|--------------|---------------|
| S01 | Splash/Onboarding | Brand intro, value prop | No | Pending | Founder (solo) | none | App launch |
| S02 | Language Selection | Choose Hindi/English | No | Pending | Founder (solo) | none (local state) | First launch only |
| S03 | Phone Login | Enter phone number | No | Pending | Founder (solo) | `POST /api/v1/auth/send-otp` | Onboarding, Settings logout |
| S04 | OTP Verification | Enter 6-digit OTP | No | Pending | Founder (solo) | `POST /api/v1/auth/verify-otp` | Phone Login |
| S05 | Home/Search | Search doctors, specialties | No | Pending | Founder (solo) | `GET/POST /api/v1/patient/search` | Login success, Back nav |
| S06 | Search Results | Doctor cards with filters | No | Pending | Founder (solo) | `GET/POST /api/v1/patient/search` | Home search |
| S07 | Doctor Profile | Full profile + booking CTA | No | Pending | Founder (solo) | doctor detail (see `Backend-Spec.md`) | Search results |
| S08 | Booking Confirmation | Token preview + confirm | Yes | Pending | Founder (solo) | `POST /api/patient/book-appointment` **+ new consent endpoint (F19, not yet built)** | Doctor profile |
| S09 | Token Tracking | Live queue position | Yes | Pending | Founder (solo) | `GET /api/patient/bookings/stream` (needs Bearer support + FCM, see Blockers) | Booking success, My Bookings |
| S10 | My Bookings | Active + past bookings | Yes | Pending | Founder (solo) | `GET /api/patient/my-bookings` | Home, Bottom nav |
| S11 | Cancel Confirmation | Confirm cancellation | Yes | Pending | Founder (solo) | `POST /api/patient/queue/cancel-token` | Token tracking |
| S12 | Waitlist Join | Join when queue full | Yes | Pending | Founder (solo) | `POST /api/patient/queue/claim-waitlist` | Booking blocked |
| S13 | Profile Edit | Edit name, email, location | Yes | Pending | Founder (solo) | new endpoint (F14, not yet built on web either) | Settings |
| S14 | Settings | Language, notifications, logout | Yes | Pending | Founder (solo) | none (local + logout) | Bottom nav |
| S15 | Notification Inbox | All notifications | Yes | Pending | Founder (solo) | `GET /api/notifications`, `PATCH /mark-read`, `GET /unread-count` | Bottom nav, Push tap |
| S16 | Data Deletion | Deactivate account (OTP-gated) | Yes | Pending | Founder (solo) | `POST /api/patient/delete-data` **+ OTP step (P0-3, not yet built)** | Settings (hidden) |

> **"Status" column note:** every screen is "Pending" because this is a fresh React Native
> build — none of these screens exist yet in the mobile codebase. This column exists so that as
> development proceeds, this table becomes the single place to update to "In Progress" / "Built"
> / "QA'd" rather than tracking status in a separate spreadsheet that can drift out of sync.

---

## 🧭 NAVIGATION STRUCTURE

### Bottom Tab Bar (5 tabs)
```
┌─────────────────────────────────────────┐
│  🏠 Home    📋 Bookings    🔔 Notifs   ⚙️ Settings  │
└─────────────────────────────────────────┘
```

- **Home (S05):** Search, featured doctors, specialties
- **Bookings (S10):** My Bookings (active + past)
- **Notifications (S15):** In-app notification inbox
- **Settings (S14):** Profile, language, data deletion

### Stack Navigation
```
Home Stack:
  S05 Home → S06 Search Results → S07 Doctor Profile → S08 Booking → S09 Token Tracking
  S05 Home → S12 Waitlist Join

Bookings Stack:
  S10 My Bookings → S09 Token Tracking → S11 Cancel Confirmation

Auth Stack (modal):
  S03 Phone Login → S04 OTP Verification
```

---

## 🎨 SCREEN SPECIFICATIONS

### S01 — Splash/Onboarding
```
LAYOUT:
  Full screen, centered content
  Background: --color-background (#F8F9FA)
  
CONTENT:
  [JivniCare Logo] — 120×120px, centered
  "JivniCare" — Headline (32px, --color-navy)
  "Book Doctor Appointments" — Subtitle (18px, --color-text-secondary)
  
  3 onboarding slides (swipeable):
    1. "Find doctors near you" + illustration
    2. "Book token from home" + illustration
    3. "Track queue live" + illustration
  
  [Get Started] — Primary button (full width, 16px radius)
  
NAVIGATION:
  Swipe right → next slide
  Tap [Get Started] → S02 Language Selection (first time) or S05 Home (returning)
  
STATES:
  Loading: none (all content bundled locally, no network call on this screen)
  Empty: not applicable
  Error: not applicable (no network dependency)
  Offline: fully functional offline — this screen has zero network dependency
  First launch: Show all 3 slides
  Returning user: Skip to S05 (if logged in) or S03 (if logged out)
```

### S02 — Language Selection (MANDATORY)
```
LAYOUT:
  Full screen, centered
  Background: --color-background
  
CONTENT:
  "Choose your language" / "Apni bhasha chunein"
  — Headline (24px, --color-text-primary)
  
  Two large cards (vertical stack):
    ┌─────────────────────────────┐
    │  🇮🇳  हिंदी                │
    │      Hindi                  │
    └─────────────────────────────┘
    ┌─────────────────────────────┐
    │  🇬🇧  English               │
    │      अंग्रेज़ी              │
    └─────────────────────────────┘
  
  Card style: 16px radius, 1px border (--color-primary), 44px min height
  Selected: Fill --color-primary, white text
  
  [Continue] — Primary button (disabled until selection)
  
NAVIGATION:
  Tap language card → select (visual feedback)
  Tap [Continue] → S03 Phone Login
  
STATES:
  Loading: none (local state only, no network call)
  Empty: not applicable
  Error: not applicable
  Offline: fully functional offline — selection is written to Zustand + secure storage locally
  
RULE: Cannot skip. Cannot go back. Choice persists in Zustand + secure storage (not AsyncStorage
  for the auth-adjacent flag, per Business-Rules.md Rule SEC1 — language preference itself is
  not a security-sensitive value and MAY use AsyncStorage/Zustand persistence; only tokens are
  restricted to Keychain/Keystore).
```

### S03 — Phone Login
```
LAYOUT:
  Full screen, keyboard-aware
  Background: --color-background
  
CONTENT:
  "Enter your phone number" / "Apna phone number daalein"
  — Headline (24px)
  
  "We will send you an OTP" / "Hum aapko OTP bhejenge"
  — Subtitle (14px, --color-text-secondary)
  
  Phone input:
    [+91 ▼] [__________] — 10 digits, numeric keyboard
    Prefix: +91 (fixed, non-editable)
    Validation: Starts with 6-9, exactly 10 digits (matches server-side /^[6-9]\d{9}$/)
    Error: "Please enter a valid 10-digit number"
  
  [Send OTP] — Primary button
    Loading state: Spinner + "Sending..." (button disabled during request)
    Disabled: Until valid phone entered
  
  Rate limit message (if exceeded — server returns 429):
    "Too many attempts. Try after X minutes." (see UX-Writing-Guide.md Section 3)
  
NAVIGATION:
  Tap [Send OTP] → S04 OTP Verification
  Back button → S02 (first time) or exit app
  
STATES:
  Loading: button spinner as above, input disabled during request
  Empty: not applicable (this screen IS the empty/entry state)
  Error: inline validation error below input (400), OR rate-limit banner (429), OR
    "SMS service unavailable, try again shortly" (503/500) per API-Contract.md F01
  Offline: disable [Send OTP], show "No internet connection" banner (per
    UX-Writing-Guide.md Section 16); do NOT auto-retry per Business-Rules.md Rule O2
  
RULE: No social login for patients. Phone OTP only.
```

### S04 — OTP Verification
```
LAYOUT:
  Full screen, keyboard-aware
  Background: --color-background
  
CONTENT:
  "Enter OTP" / "OTP daalein" — Headline (24px)
  "Sent to +91 XXXXXX7890" — Subtitle (14px)
  
  OTP Input:
    6 boxes, each 48×56px, 12px radius
    Auto-focus first box
    Auto-advance on digit entry
    Backspace moves to previous
    Paste support (full 6 digits)
    Error: Red border + shake animation
  
  [Verify OTP] — Primary button
    Loading state: Spinner (button disabled during request)
    Disabled: Until 6 digits entered
  
  Resend section:
    "Resend OTP in 30s" — countdown timer
    After 30s: "Resend OTP" text button → re-calls S03's send-otp request
  
  Test OTP (dev only):
    "Test OTP: 123456" — only if NEXT_PUBLIC_ENABLE_TEST_OTP=true
  
NAVIGATION:
  Tap [Verify OTP] → success → check `needsProfile` in response → S13 Profile Edit
    (if true) or S05 Home (if false)
  Back button → S03 Phone Login
  
STATES:
  Loading: spinner on button, inputs disabled during verification
  Empty: not applicable
  Error: shake animation + red border + "Invalid OTP. Try again." (401), OR
    "OTP expired. Request a new one." (401 with expired-specific message), OR
    rate-limit banner (429), OR "Verification service unavailable" (503/500)
  Offline: disable [Verify OTP], show offline banner; do NOT auto-retry
  
RULE: Auto-read OTP from SMS (Android). iOS = manual entry.
```

### S05 — Home/Search
```
LAYOUT:
  Full screen, scrollable
  Safe area top/bottom
  
HEADER (sticky):
  "JivniCare" — Logo text (20px, --color-navy)
  Location pill: "📍 Jamui, Bihar" (tap to change)
  
SEARCH BAR:
  Full width, 12px radius
  Placeholder: "Search doctor or symptom..." / "Doctor ya lakshan search karein..."
  Icon: 🔍 left, microphone right (V1.1)
  Height: 48px
  
SPECIALTY GRID (horizontal scroll):
  "Popular Specialties" — Section title (18px, bold)
  Chips: 6 specialties shown (Tier 1), "View All →"
  Chip: Icon + Name, 8px radius, 44px height
  
FEATURED DOCTORS (vertical list):
  "Doctors near you" — Section title
  Doctor cards (see Component Library)
  Pull-to-refresh supported
  
BOTTOM NAV:
  Home | Bookings | Notifications | Settings
  
NAVIGATION:
  Tap search bar → S06 Search Results
  Tap specialty chip → S06 with filter applied
  Tap doctor card → S07 Doctor Profile
  Tap location pill → District selector bottom sheet
  
STATES:
  Loading: skeleton doctor cards (3-4 shimmer placeholders) while featured list loads
  Empty: "No doctors in your area yet" / "Doctors are joining soon" + [Notify Me] button
    (captures phone → feeds into F13 lead capture flow)
  Error: "Something went wrong" banner + [Retry] button, cached featured list (if any) still
    shown below the error banner rather than blanking the screen
  Offline: cached featured doctors shown (per Business-Rules.md Rule O1, 7-day cache) with a
    "Reconnecting..." banner if cache is >5 min stale; search bar remains tappable but search
    itself will show the offline state on S06 when submitted
```

### S06 — Search Results
```
LAYOUT:
  Full screen
  
HEADER:
  Back button | Search input (pre-filled) | Filter icon
  
FILTER BAR (horizontal scroll, sticky below header):
  Chips: Specialty | Availability | Max Fee | Min Experience
  Active filters: Filled --color-primary, white text
  Inactive: Outlined, --color-text-secondary
  "Clear All" text button (if any active)
  
RESULTS LIST:
  Doctor cards (vertical scroll)
  
PAGINATION:
  Infinite scroll, 15 per page (confirmed server-side default limit)
  Loading spinner at bottom while fetching next page
  
NAVIGATION:
  Tap filter chip → Bottom sheet with options
  Tap doctor card → S07 Doctor Profile
  Tap [Request a Doctor] → Lead capture form (modal) — see F13, blocked by Turnstile until
    P0-2 lands (Feature-Dependencies.md); build the UI regardless, but expect it to fail until
    the backend mobile-compatible path exists
    
STATES:
  Loading: skeleton doctor card list (5-6 shimmer placeholders) on initial load; a smaller
    inline spinner at the bottom of the list on subsequent-page loads
  Empty (no results for query): "No doctors found for '{query}'" + [Request a Doctor]
  Empty (filters too tight): "No doctors match these filters" + [Clear Filters]
  Empty (no doctors in area yet): "Doctors joining soon in {district}" + [Get Notified]
  Error: "Search failed. Please try again." banner + [Retry] — matches API-Contract.md F02/F03's
    500 response text exactly
  Offline: last cached result set for the same query shown with a "Reconnecting..." banner;
    a genuinely new query while offline shows the offline banner instead of an empty state
    (don't imply "no doctors" when the real reason is no connection)
```

### S07 — Doctor Profile
```
LAYOUT:
  Full screen, scrollable
  
ABOVE FOLD (no scroll needed):
  ┌────────────────────────────────────────┐
  │ [Clinic Photo Slider] — swipe, 3 max   │
  │ Page dots indicator                    │
  ├────────────────────────────────────────┤
  │ [Avatar] [🟢 Status dot]             │
  │ Dr. Rajesh Sharma                      │
  │ General Physician · 15 yrs exp         │
  │ [✓ Verified] [⭐ Early Partner]        │
  │                                        │
  │ 🏥 Sharma Clinic, Rajendra Nagar, Jamui │
  │                                        │
  │ 💰 ₹500 Consultation Fee               │
  │                                        │
  │ [Queue Badge: 🟢 LIVE · 5 ahead]     │
  │                                        │
  │ 👥 234 patients served via JivniCare   │
  │                                        │
  │ [Book Appointment Now] — Full width    │
  └────────────────────────────────────────┘
  
BELOW FOLD:
  About the Doctor (collapsible)
  Education & Qualifications
  Expertise Tags (chips)
  Diseases Treated (chips)
  Languages Spoken (chips)
  Clinic Section (address, owner, timing)
  [Share Profile] button
  Emergency info (if enabled)
  
NAVIGATION:
  Tap [Book Appointment Now] → S08 (if logged in) or S03 (if not)
  Tap [Share Profile] → Share sheet (WhatsApp, copy link)
  Swipe photos → Clinic photo slider
  Back button → S06 or S05
  
STATES:
  Loading: skeleton profile (avatar circle, text bars, button placeholder) while data loads
  Empty: not applicable (a doctor profile either loads or errors)
  Error: "Profile not found" + [Search other doctors] button (matches
    UX-Writing-Guide.md Section 16's specific copy for this case) — this happens if the doctor
    was de-verified between search results loading and the profile tap
  Offline: cached profile shown (per Rule O1) with "Reconnecting..." banner if stale; the
    [Book Appointment Now] CTA should still be tappable but will surface S08's offline state
    immediately on tap rather than letting the user fill the whole flow first
```

### S08 — Booking Confirmation
```
LAYOUT:
  Full screen, scrollable
  
CONTENT:
  "Book Appointment" / "Appointment book karein" — Headline
  
  Doctor summary card:
    Avatar + Name + Specialty + Clinic
  
  Token preview (railway style):
    ┌────────────────────────────────────────┐
    │         Your Token                     │
    │                                        │
    │         #[X]                           │
    │                                        │
    │  ██████░░░░░░  X of Y slots           │
    │  5 patients ahead of you              │
    └────────────────────────────────────────┘
  
  Fee breakdown:
    Consultation Fee:          ₹500
    Platform Convenience Fee:  ~~₹29~~  FREE 🎉
    ───────────────────────────────
    Total Payable:             ₹500
    
    💊 Pay at Clinic / Hospital
    "No online payment required. Pay directly when you visit."
    
    🎉 "You're saving ₹29 — Early Access Benefit"
  
  Consent checkbox:
    ☑ "I understand JivniCare is a booking platform, not a medical provider. I will pay at clinic."
    ⚠️ This checkbox currently has nowhere to submit its confirmation to — F19's ConsentLog
    write path does not exist yet (Feature-Dependencies.md P0-4). Build the UI now; wire the
    actual submission once the backend endpoint lands. Do not silently skip writing consent —
    flag it in code as a TODO tied to P0-4 rather than quietly dropping the requirement.
    
  [Confirm Booking] — Primary button (disabled until checkbox checked)
  
BLOCKED STATES (each maps to a specific server error code — see Business-Rules.md Rule B6):
  Queue full (QUEUE_FULL/DAILY_LIMIT_REACHED) → "No slots today" + [Join Waitlist]
  Already booked (ALREADY_BOOKED) → "You already have a booking"
  3-limit reached (DAILY_LIMIT_REACHED, patient-level) → "Max 3 active bookings today"
  Doctor offline (DOCTOR_NOT_ACCEPTING) → "Doctor not accepting bookings"
  Clinic closed (CLINIC_CLOSED_TODAY/CLINIC_CLOSED_ON_THIS_DAY) → "Clinic is closed today"
  
NAVIGATION:
  Tap [Confirm Booking] → Loading → Success animation → S09 Token Tracking
  Tap [Join Waitlist] → S12 Waitlist Join
  
STATES:
  Loading: button spinner + "Booking..." during the request; the token preview numbers shown
    before confirming are an ESTIMATE (computed client-side from the doctor's current queue
    count) — the real token number comes back in the API response and may differ by 1-2 if
    another patient booked in the meantime; do not present the pre-confirm number as final
  Empty: not applicable
  Error: one of the 13 named blocked-state messages above (400), OR duplicate-request message
    if a requestId collision occurs (409 — should be rare/silent since it means the same tap
    was processed twice, in which case show the SAME success screen, not an error), OR
    "Something went wrong" (500)
  Offline: [Confirm Booking] disabled with offline banner; explicitly NO auto-retry
    (Business-Rules.md Rule O2) — this is the single highest-risk screen for silent duplicate
    bookings if that rule is ever violated, given it's a real money/appointment transaction
```

### S09 — Token Tracking
```
LAYOUT:
  Full screen, centered content
  Background: --color-background
  
CONTENT:
  HERO:
    "Your Token" / "Aapka token" — Label (14px)
    "#8" — Number (72px, bold, --color-navy)
  
  DOCTOR INFO:
    "Dr. Rajesh Sharma"
    "General Physician"
  
  QUEUE STATUS:
    ┌────────────────────────────────────────┐
    │  5 patients ahead                      │
    │  Currently serving: #3                 │
    └────────────────────────────────────────┘
  
  PROGRESS:
    ████████░░░░░░  3 of 8
    
  LOCATION:
    📍 Sharma Clinic, Rajendra Nagar, Jamui
    [Get directions ↗] — subtle text link
  
  STATUS BADGE:
    🟡 Waiting — "Aapki baari aa rahi hai"
    🟢 Called — "Your Turn!"
    ✅ Completed — "Visit Complete"
    ⚫ No Show — "Marked as No Show"
    ❌ Cancelled — "Booking Cancelled"
    ⏰ Expired — "Token Expired"
  
  ACTIONS:
    [Cancel Booking] — Danger button (only if cancellable per Business-Rules.md Rule C1)
    [Share Status] — Secondary button (WhatsApp)
  
  AUTO-UPDATE:
    Silent refresh every 30 seconds + FCM push for instant updates
    
NAVIGATION:
  Tap [Cancel Booking] → S11 Cancel Confirmation
  Tap [Share Status] → Share sheet
  Back button → S10 My Bookings
  
STATES:
  Loading: token-number placeholder (skeleton block where "#8" goes) on initial screen load
  Empty: not applicable
  Error: "Token not found" — this happens if the token was somehow deleted/invalid; offer
    [Back to My Bookings] rather than a generic retry, since retrying a lookup for a token that
    genuinely doesn't exist will never succeed
  Offline: "Reconnecting..." banner + last known position shown (per Rule O1); [Cancel Booking]
    should be disabled while offline (cancelling is a write op, no auto-retry per Rule O2) —
    show it greyed out with a tooltip/toast explaining why, rather than hiding it entirely
    (hiding it would make the user think cancellation is permanently unavailable)
```

### S10 — My Bookings
```
LAYOUT:
  Full screen
  
TABS:
  [Active] | [Past]
  
ACTIVE TAB:
  Cards for: BOOKED, AWAITING_ARRIVAL, PAYMENT_PENDING, READY, CALLED, IN_CONSULTATION
  Each card:
    Token #, Doctor name, Clinic, Status badge
    [Track] button → S09
    [Cancel] button → S11 (if cancellable)
  
PAST TAB:
  Cards for: COMPLETED, NO_SHOW, CANCELLED, EXPIRED
  Each card:
    Token #, Doctor name, Date, Status badge
    [View Details] → S09 (read-only)
  
EMPTY STATE:
  "No bookings yet" / "Abhi koi booking nahi hai"
  [Find a Doctor] → S05
  
NAVIGATION:
  Tap [Track] → S09
  Tap [Cancel] → S11
  Tap card → S09
  
STATES:
  Loading: skeleton card list (3-4 shimmer placeholders) on initial load; pull-to-refresh shows
    a standard native refresh spinner, not a full skeleton replace
  Empty: "No bookings yet" + [Find a Doctor] — shown per-tab (Active tab and Past tab can be
    empty independently; a user with only past bookings sees Active tab's empty state while
    Past tab shows their history)
  Error: "Failed to load" banner + [Retry]; if a cached list exists, show it below the banner
    rather than blanking the screen
  Offline: cached full booking list shown (this endpoint has no pagination — see
    API-Contract.md F10 — so the entire cached history is what's available offline) with
    "Reconnecting..." banner if stale
    
⚠️ Note for engineering: `GET /api/patient/my-bookings` returns the patient's ENTIRE booking
  history in one unbounded response (confirmed, no pagination exists server-side). The
  Active/Past split above is a CLIENT-SIDE filter over that single list, not two separate API
  calls. For a long-time user this means one large payload on every screen load — acceptable
  for V1 given expected volumes, but flagged in Known-Gaps.md as a scaling concern.
```

### S11 — Cancel Confirmation
```
LAYOUT:
  Modal / Bottom sheet
  
CONTENT:
  "Cancel Booking?" / "Booking cancel karein?"
  "Your appointment with Dr. [Name], Token #[X] will be cancelled."
  "No refund needed — you pay at clinic."
  
  [Keep Booking] — Secondary button
  [Yes, Cancel] — Danger button
  
NAVIGATION:
  Tap [Keep Booking] → Dismiss modal
  Tap [Yes, Cancel] → Loading → Success toast → S10 My Bookings
  
STATES:
  Loading: [Yes, Cancel] shows spinner, both buttons disabled during the request
  Empty: not applicable
  Error: "This booking can no longer be cancelled" (409 — token moved to a non-cancellable
    state, e.g. doctor already called it, between opening this modal and confirming) + dismiss
    → refresh S09/S10 to show the current real status; OR "Something went wrong" (500)
  Offline: [Yes, Cancel] disabled with offline banner in the modal; do not allow queuing this
    as a background write per Rule O2 — the user must retry manually once reconnected
```

### S12 — Waitlist Join
```
LAYOUT:
  Full screen or modal
  
CONTENT:
  "Queue is Full" / "Queue bhara hua hai"
  
  Same-specialty suggestion (if available):
    "Dr. [Name] — [Specialty] — [X slots available]"
    [Book with Dr. Name] — Primary — CORRECTED 2026-07-16: standardized to this exact text,
      matching 10-UX-Writing-Guide.md (previous draft had a mismatch — "Book Now" in one doc,
      "Book with Dr. Name" in the other; this is now the single source of truth for the string)
    [Stay on Waitlist] — Secondary
  
  Waitlist form:
    "Notify me when Dr. [Name] has slots"
    Phone: [pre-filled if logged in]
    [Join Waitlist] — Primary button
  
  Info:
    "You will be notified when a slot opens. First to claim gets it."
    
NAVIGATION:
  Tap [Book with Dr. Name] → S08 for that doctor
  Tap [Join Waitlist] → Success toast → S10 My Bookings
  
STATES:
  Loading: [Join Waitlist] shows spinner during request
  Empty: not applicable (this screen only renders when the queue-full blocked state fires)
  Error: "Something went wrong" + [Retry]
  Offline: [Join Waitlist] disabled with offline banner; no auto-retry
  
  NOTE — this screen is distinct from the CLAIM flow: when a slot actually opens and the user
  gets an FCM push (WAITLIST_CLAIM), tapping it deep-links to a claim action that calls
  POST /api/patient/queue/claim-waitlist. That endpoint's "already taken" response is HTTP 200
  with `data.isTaken: true` (see API-Contract.md F12) — the claim result screen (likely a modal
  reusing S11's visual pattern) MUST check this inner field, not just HTTP status, or a lost
  race will incorrectly show a success state.
```

### S13 — Profile Edit
```
LAYOUT:
  Full screen, form
  
CONTENT:
  "Edit Profile" / "Profile edit karein"
  
  Form fields:
    Name: [__________]
    Email: [__________] (optional)
    Location: [District selector]
    Language: [Hindi / English]
    Profile Photo: [Upload / Camera]
  
  [Save Changes] — Primary button
  
NAVIGATION:
  Tap [Save Changes] → API call → Success toast → S14 Settings (or S05 Home if reached via
    F01's needsProfile:true redirect on first login)
  Back button → S14 Settings (or blocked/warned if reached via the mandatory first-login path
    and required fields are incomplete — Name is required, per PRD F14)
  
STATES:
  Loading: [Save Changes] shows spinner, form disabled during request
  Empty: not applicable (pre-filled with existing values where available; blank for new users
    routed here via needsProfile:true)
  Error: field-level validation errors inline (e.g. invalid email format), OR
    "Failed to save changes" banner + [Retry] for server errors
  Offline: per Rule O2, form data is NOT auto-queued for later submission — show offline banner
    and disable [Save Changes]; the user's typed input remains in the form (not lost) so they
    can submit once reconnected, they just can't submit while offline
    
⚠️ Note for engineering: F14 has NO existing backend endpoint (never built on web either — see
  PRD F14 "STATUS: GAP"). This screen's [Save Changes] action needs a new endpoint built before
  it can function beyond local state.
```

### S14 — Settings
```
LAYOUT:
  Full screen, grouped list
  
CONTENT:
  PROFILE SECTION:
    [Avatar] Name, Phone
    [Edit Profile →] — S13
  
  PREFERENCES:
    Language: [Hindi ▼] → Bottom sheet
    Notifications: [Toggle ON/OFF]
  
  SUPPORT:
    Help & Support →
    Terms of Use →
    Privacy Policy →
    Refund & Cancellation →
    Medical Disclaimer →
  
  DANGER ZONE (at bottom):
    [Deactivate Account] — subtle, requires OTP confirmation → S16
    [Logout] — red text
  
NAVIGATION:
  Tap items → respective screens/webviews
  Tap [Logout] → Confirmation → S03 Phone Login
  
STATES:
  Loading: none — this screen is entirely local state + navigation, no network call on load
  Empty: not applicable
  Error: not applicable (no data fetch on this screen itself)
  Offline: fully functional offline except the webview links (Terms/Privacy/etc.), which should
    show a standard offline state if tapped without connectivity
```

### S15 — Notification Inbox
```
LAYOUT:
  Full screen, list
  
CONTENT:
  "Notifications" — Title
  
  List items:
    [Icon] Title
         Message preview
         Time (2h ago)
    [●] Unread indicator
  
  ACTIONS:
    Swipe left → Mark as read (calls `PATCH /api/notifications/mark-read` with this
      notification's id in the `ids` array)
    Tap → Mark as read + navigate to relevant screen
  
  [Mark All as Read] — top right (calls the same endpoint with no `ids` — marks all unread)
  
NAVIGATION: per notification type, deep-links as defined in PRD/Business-Rules Section 10
  
STATES:
  Loading: skeleton list items (3-4 shimmer rows) on initial load
  Empty: "No notifications yet" + bell icon illustration
  Error: "Something went wrong" + [Retry]; badge count (from `/unread-count`) should still be
    shown from cache even if the full list fails to load, rather than both failing together
  Offline: cached notification list shown with "Reconnecting..." banner; mark-as-read actions
    while offline should update the LOCAL read state optimistically for UI responsiveness but
    must re-sync with the server once reconnected — do not let a swipe-to-dismiss silently fail
    to persist
```

### S16 — Data Deletion
```
LAYOUT:
  Full screen, warning style
  Background: subtle red tint
  
CONTENT:
  ⚠️ Warning icon
  "Deactivate Account?" / "Account deactivate karein?"
  
  "Your account will be deactivated. You will not be able to:
   - Book appointments
   - View your booking history
   - Receive notifications"
  
  "Your data will be retained for 30 days, after which it may be permanently deleted."
  
  OTP confirmation:
    "Enter OTP sent to +91 XXXXXX7890"
    [______] — 6 digits
    ⚠️ CONFIRMED 2026-07-16 as a locked decision (see Business-Rules.md Rule D3): this OTP step
    IS required and this screen should be built exactly as shown. The backend does not enforce
    it yet — see Feature-Dependencies.md Phase 0, item P0-3. Build this screen now; do not
    remove the OTP step to match the current (temporary) backend gap.
  
  [Cancel] — Secondary
  [Deactivate] — Danger (disabled until OTP verified)
  
NAVIGATION:
  Tap [Deactivate] → API call → Success → S03 Phone Login (all data cleared locally)
  
STATES:
  Loading: [Deactivate] shows spinner during request, OTP input disabled
  Empty: not applicable
  Error: "Invalid OTP. Try again." (once the backend OTP check exists), OR
    "Something went wrong" (500) for any other failure
  Offline: entire screen's actions disabled with offline banner; this is an irreversible-feeling
    action for the user, so do not allow any queued/background attempt — require them to be
    online and retry deliberately
    
⚠️ Note for engineering: per `Business-Rules.md` Rule D7, users should be able to reactivate
  within 30 days by logging in again — this reactivation logic was NOT found in the login path
  during the API-Contract verification pass (Feature-Dependencies.md P0-6). Confirm or build
  this before this screen's copy ("Your data will be retained for 30 days...") becomes a
  promise the backend doesn't keep.
```

---

## 🩺 DOCTOR CARD COMPONENT SPEC — Availability & Live Status Overhaul (added 2026-07-19)

> ⚠️ **Screen-numbering mismatch, flagged per `13-AI-Development-Rules.md` Rule 1/Rule 5:** the
> founder directive that produced this section referenced "Section S03 / Doctor Card." In this
> document's actual Screen Inventory (top of file), **S03 is Phone Login**, not a doctor card
> screen — there is no dedicated "Doctor Card" screen number. `DoctorCard` is a MOLECULE
> (`09-Component-Library.md` Section 2.1) rendered inside S05 (Home) and S06 (Search Results).
> Rather than silently overwriting S03's Phone Login spec, or silently guessing a different
> screen number, this content is placed here as its own named section and cross-referenced from
> S05/S06 above. If "S03" meant something else specifically, flag it for a founder follow-up.

### Business Rules Backing This Spec
See `05-Business-Rules.md` Section 16 ("Doctor Availability & Booking Automation") for the
underlying `bookingStartTime` / `opdStartTime` / `closingTime` / `isLive` model this UI reflects.
That section is itself flagged as not-yet-reconciled with the existing Section 9 queue-status
model — this UI spec inherits the same caveat: `DoctorCard` now carries the OLD `queueStatus`
prop (drives the existing `QueueStatusBadge` — "LIVE · 5 ahead" etc.) AND the NEW `isLive` /
`isClosed` props (drives the treatment below) as two separate, independently-driven inputs. See
`15-Known-Gaps.md` Section 2.3.

### Visual Model (social-media "Blue Tick" + "Green Dot" / food-delivery "Grayscale Closed")
```
IDENTITY ROW:
  [Avatar]  Dr. Rajesh Sharma [BadgeCheck ✓, blue] [● green dot]
            General Physician

  - Blue Tick: Lucide `BadgeCheck` icon, color --color-primary (#5696C7), ~16px, placed
    immediately after the doctor's name — REPLACES the old pill-shaped green "Verified" Badge
    in THIS component specifically. This is a DoctorCard-only substitution: the `Badge` atom's
    `verified` variant (green pill, `08-Design-System.md` Badge System) is UNCHANGED for any
    other consumer of that atom. Rendered only when `doctor.isVerified` is true.
  - Live Indicator: 8px filled circle, --color-success (#16A34A), placed directly beside the
    name (not on the Avatar — distinct from the Avatar atom's own `status` dot used on S07).
    Rendered only when `doctor.isLive` is true. This is IN ADDITION to the Closed State
    treatment below, not a substitute for it: when NOT live, the card shows neither the green
    dot NOR full color (see Closed State).
  - REMOVED — Clinic Name display: the previous "🏥 [Clinic Name], [City]" address row is
    removed from DoctorCard entirely. Clinic name/address is no longer shown on this card in
    any form. (It remains visible on the full S07 Doctor Profile screen, which this change does
    not touch.)

TIME ROW (replaces the old computed "Next Available" string):
  "Booking: 7:00 AM"          "OPD: 10:00 AM"

  - Both strings are ALWAYS shown together, sourced from `10-UX-Writing-Guide.md` Section 22.
    The **short-form pair** ("Booking: {time}" / "OPD: {time}") is this component's chosen
    presentation as of the 2026-07-19 premium-redesign pass — each paired with a small Lucide
    `Clock` icon (already in `08-Design-System.md`'s Icon Library, "Time/expiry" purpose; that
    table's "Used In" column is updated to add DoctorCard alongside its existing S09 usage rather
    than introducing a second, undocumented icon for the same meaning) for a tighter, two-column
    layout instead of two stacked full sentences. The long-form pair ("Booking starts at: {time}"
    / "OPD opens at: {time}") remains documented and valid for any other consumer that needs a
    more explicit sentence — Section 22's note that a component picks "one or the other" per fit
    still holds; this is DoctorCard's pick, not a deprecation of the long-form strings.
  - This is a deliberate two-string replacement of the old single computed "Next Available"
    value — the whole point of the train-ticketing model (Business-Rules.md Rule DA1) is that
    these two times can legitimately differ, so collapsing them back into one string would hide
    exactly the information this feature exists to show.

FEE + EXPERIENCE ROW (layout updated 2026-07-19, premium-redesign pass): Experience moved UP
onto the specialty line directly under the name ("General Physician · 12 yrs exp" — a single
combined line, mirroring the reference image's "Senior Cardiologist · 15 Yrs Exp" treatment) so
this row can be a dedicated, prominent fee callout instead of splitting attention two ways:
  Consultation Fee                                                          ₹500
  - Label ("Consultation Fee") in text-caption/body-secondary styling; value in
    text-title-ish weight, `--color-secondary` (#4B9F5F), right-aligned — matching the reference
    image's bold, brand-colored fee display. `doctor.experience` itself is UNCHANGED as a data
    field; only its display position moved, per this row's new fee-focused framing.

CTA BUTTON ROW (added 2026-07-19, premium-redesign pass):
  [============ Book Appointment ============]     (live / not closed)
  [============ Currently Closed  ===========]     (isClosed — disabled, grayscale-desaturated)

  - A full-width primary `Button` (atom, `09-Component-Library.md` Section 1.1) rendered as the
    card's final row, below the Fee + Experience row. Label defaults to the canonical
    "Book Appointment" string (`10-UX-Writing-Guide.md` line ~194 — distinct from S07's
    "Book Appointment Now" entry CTA; this is the card-level string, not a rename of that one).
  - This is an ADDITIVE element, not a replacement for the card's own navigation. It does not
    change the "NAVIGATION: unchanged — tap anywhere on the card → S07" rule below: the outer
    card container is still a single tappable region that opens S07, exactly as before this
    button existed. The button is a second, nested tap target reusing the SAME callback the
    card already exposes (`onPress`) — this component still does not have a separate "confirm
    booking" action of its own; that remains S07/S08's job per the Open Items note below.
  - When `doctor.isClosed` is true: the button's label switches to "Currently Closed"
    (`10-UX-Writing-Guide.md` Section 22) and it renders `disabled`, per `09-Component-Library.md`
    Section 0.1's standard disabled treatment (reduced opacity, `accessibilityState.disabled:
    true`, no pointer events) — layered on top of, not instead of, the card-level `grayscale
    opacity-60` treatment.
  - IMPORTANT — this DOES NOT change the existing Closed State note (below) that "the card
    remains fully tappable... actually blocking a booking attempt is S07/S08's job." That note
    was, and remains, about the outer card's navigation tap target. The NEW button is a distinct,
    narrower disabled control that only blocks the button's own tap — tapping elsewhere on the
    grayed-out card still navigates to S07 unchanged. This distinction is spelled out here
    precisely so a future reader doesn't read the two notes as contradicting each other.

CLOSED STATE (`doctor.isClosed` true, i.e. `isLive` false):
  - The ENTIRE card container (not just an inner badge/element) applies:
      - Grayscale filter (full desaturation) — Tailwind `grayscale`
      - 60% opacity — Tailwind `opacity-60`
    This matches the food-delivery-app "restaurant closed" convention referenced in the
    founder's directive.
  - The green Live dot does NOT render in this state (it's gated on `isLive`, which is false by
    definition here).
  - The Blue Tick verification icon STILL renders if `doctor.isVerified` is true — verification
    is independent of live/closed status (a verified doctor who's currently closed is still
    verified). The grayscale filter desaturates it along with everything else; it is not hidden.
  - The card remains fully tappable in this state (still navigates to S07) — grayscale/opacity
    is a VISUAL-ONLY treatment, not a disabled-interaction state. Actually blocking a booking
    attempt is S07/S08's job, via the existing `BOOKING_NOT_STARTED` / `BOOKING_FINISHED`
    blocked-state messages (`05-Business-Rules.md` Rule B6) — do not duplicate that blocking
    logic at the card level.
  - Any CTA text rendered inside the card in this state must use the new "Currently Closed"
    string (`10-UX-Writing-Guide.md` Section 22) — this is a DIFFERENT string from the existing
    "Currently Unavailable · Get Notified" Queue Status Badge text (Section 5), which belongs to
    the OLD `queueStatus` OFFLINE state. Do not use the two interchangeably until
    `15-Known-Gaps.md` Section 2.3's model-unification question is resolved.

NAVIGATION: unchanged — tap anywhere on the card → S07 Doctor Profile.

ACCESSIBILITY: the card's single summary `accessibilityLabel` (per
`09-Component-Library.md` Section 2.1) must be updated to speak live/closed status and the two
new time strings, and must NOT mention clinic name (since it's no longer shown), e.g.:
  "Dr. Rajesh Sharma, General Physician, verified, live now, booking starts at 7:00 AM, OPD
  opens at 10:00 AM, ₹500 fee"
  — or, when closed: "...verified, currently closed, booking starts at 7:00 AM, OPD opens at
  10:00 AM, ₹500 fee" (grayscale/opacity is a sighted-only visual cue; a screen reader user must
  get the same "closed" information from the label, not from a filter they can't perceive).
  The nested CTA Button carries its OWN `accessibilityLabel`/`accessibilityState.disabled`
  independent of the card's label — "Book Appointment with Dr. Rajesh Sharma" (enabled) or
  "Currently closed — booking unavailable" with `disabled: true` (closed state) — since it is
  now a separate focusable control a screen-reader user can Tab/swipe to on its own.
```

### Open Items (flagged, not silently resolved)
```
- `bookingStartTime` / `opdStartTime` / `closingTime` / `isLive` are NOT confirmed to exist in
  the live schema/API yet (see Business-Rules.md Section 16's intro note) — this is a
  frontend-first, backend-pending build, the same pattern already used elsewhere in this doc set
  (e.g. the Waitlist 15-minute window, P0-5). Build the UI now against mock/prop data; wire it to
  a real endpoint once `11-API-Contract.md` documents a matching field.
- This spec does not attempt to unify the OLD `queueStatus` prop with the NEW `isLive`/
  `isClosed` model — see `15-Known-Gaps.md` Section 2.3 for that open question.
- The new CTA Button (2026-07-19 premium-redesign pass) reuses the card's existing single
  `onPress` callback rather than introducing a separate "confirm/start booking" callback —
  DoctorCard still has no direct booking-submission action of its own; both the card tap and the
  button tap only navigate to S07. If a future requirement needs the button to jump straight into
  S08/BookingWidget instead of S07, that needs a new `onBookPress` prop — flagged here rather than
  built speculatively now. See `15-Known-Gaps.md` Section 2.3 for the tracking entry.
```

---

## 🤲 GESTURES & INTERACTIONS

| Gesture | Screen | Action |
|---------|--------|--------|
| Pull down | S05, S06, S10, S15 | Refresh |
| Swipe right | S01 | Next onboarding slide |
| Swipe left | S15 notification | Mark as read |
| Swipe | S07 clinic photos | Photo carousel |
| Tap | S06 filter chip | Open filter bottom sheet |
| Long press | S09 token number | Copy token number |
| Pinch | S07 clinic photo | Zoom (V1.1) |

---

## 🔗 DEEP LINKING

### Universal Links
```
jivnicare.com/doctors/[slug]     → Open doctor profile (S07)
jivnicare.com/token/[id]          → Open token tracking (S09)
jivnicare.com/bookings             → Open My Bookings (S10)
jivnicare.com/search?q=[query]    → Open search results (S06)
```

### Push Notification Deep Links
```
booking_confirmed → S09 /token/[id]
token_called      → S09 /token/[id]
queue_update      → S09 /token/[id]
doctor_status      → S07 /doctors/[slug]
waitlist_claim     → S12 claim action (see S12's note on the isTaken response check)
system              → S15 /notifications
```

---

## 🔄 STATE MANAGEMENT SUMMARY (all 16 screens)

Full per-screen detail is in each screen's own spec above (Section "SCREEN SPECIFICATIONS").
This table is a quick-reference index only — treat the screen-level spec as authoritative if
this summary and that section ever disagree (unlikely, since this table was generated FROM
those sections, but flag it in `Known-Gaps.md` if you spot a drift).

| Screen | Loading | Empty | Error | Offline |
|--------|---------|-------|-------|---------|
| S01 | none (local) | n/a | n/a | fully functional |
| S02 | none (local) | n/a | n/a | fully functional |
| S03 | button spinner | n/a | inline validation / rate-limit / 503 | disabled + banner |
| S04 | button spinner | n/a | shake + invalid/expired/rate-limit | disabled + banner |
| S05 | skeleton cards | "No doctors yet" + Notify Me | banner + Retry, cache shown below | cached + Reconnecting banner |
| S06 | skeleton list | 3 variants (no results / filters too tight / area none yet) | "Search failed" + Retry | cached result + Reconnecting banner |
| S07 | skeleton profile | n/a | "Profile not found" + Search others | cached + Reconnecting banner |
| S08 | button spinner + Booking... | n/a | 13 named blocked-states + duplicate-request handling | disabled, NO auto-retry |
| S09 | number placeholder | n/a | "Token not found" + Back to My Bookings | cached position + Reconnecting, Cancel disabled |
| S10 | skeleton cards | "No bookings yet" (per-tab) + Find a Doctor | "Failed to load" + Retry, cache shown | cached full list + Reconnecting |
| S11 | button spinner | n/a | "No longer cancellable" (409) / generic 500 | disabled, no queuing |
| S12 | button spinner | n/a | generic + Retry | disabled, no auto-retry |
| S13 | button spinner | n/a (pre-filled or blank) | inline validation / save failed | disabled, input preserved |
| S14 | none (local) | n/a | n/a | fully functional except webviews |
| S15 | skeleton rows | "No notifications yet" | banner + Retry, badge from cache | cached list + Reconnecting, optimistic read-state |
| S16 | button spinner | n/a | invalid OTP / generic | fully disabled, no queuing |

---

Last updated: 2026-07-16 | JivniCare Mobile V1.0
