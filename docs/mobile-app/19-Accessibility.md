# JivniCare Patient Mobile App
# Accessibility

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines the Accessibility Standards for the JivniCare Patient Mobile App.

The objective is to ensure the application is usable by the widest possible range of users, including people with:

- Low Vision
- Blindness
- Hearing Impairment
- Limited Mobility
- Cognitive Disabilities
- Temporary Disabilities
- Elderly Users

Accessibility is a core product requirement, not an optional enhancement.

---

# Accessibility Philosophy

Every patient should be able to:

- Find a doctor
- Book a token
- Track their queue
- Manage their profile

without unnecessary barriers.

Accessibility must never be sacrificed for visual design.

---

# Compliance Standard

The application must comply with:

**WCAG 2.2 Level AA**

Where platform guidelines are stricter:

- Android Accessibility Guidelines
- Apple Human Interface Accessibility Guidelines

those guidelines take precedence.

---

# Accessibility Principles

The application follows four principles:

Perceivable

↓

Operable

↓

Understandable

↓

Robust

---

# Screen Reader Support

Every interactive element must include:

Accessible Label

Accessible Role

Accessible Hint

Accessible State

Example

```
Book Token

Role:
Button

Hint:
Books a queue token for this doctor.
```

Never expose icon names.

---

# Semantic Components

Every component must expose semantic meaning.

Examples

Button

Heading

Search Field

Text Field

Checkbox

Switch

Dialog

Image

List

List Item

Tab

Navigation

---

# Images

Decorative Images

↓

Hidden from screen readers

Informational Images

↓

Require descriptive alternative text

Example

Good

```
Doctor profile photograph
```

Bad

```
Image123.png
```

---

# Icons

Icons must never be the only communication method.

Every icon requires:

Visible label

or

Accessible label

---

# Touch Targets

Minimum touch area

48dp × 48dp

Preferred

56dp × 56dp

Small icons require invisible touch padding.

---

# Typography

Support

Dynamic Font Scaling

Large Accessibility Fonts

System Font Scaling

Text must never become unreadable.

---

# Color Contrast

Minimum

4.5 : 1

Large Text

3 : 1

Interactive controls must always remain distinguishable.

---

# Color Usage

Never rely only on color.

Example

Bad

Green = Success

Red = Error

Good

Green + Icon + Label

Red + Icon + Label

---

# Forms

Every field requires

Label

Placeholder (optional)

Validation

Accessible Error Message

Required Indicator

---

# Validation Errors

Errors must:

Identify the field

Explain the problem

Explain recovery

Good

```
Enter a valid mobile number.
```

Bad

```
Validation Failed
```

---

# Focus Order

Focus must follow visual order.

Top

↓

Bottom

Left

↓

Right

Never trap keyboard focus.

---

# Focus Indicators

Focused elements require visible indicators.

Do not remove focus outlines.

---

# Keyboard Navigation

Supported

Tab

Shift + Tab

Enter

Space

Arrow Keys (where applicable)

Escape (Dialogs)

---

# Dialog Accessibility

Opening

↓

Focus moves into dialog

Closing

↓

Focus returns to previous control

Dialogs must trap focus until dismissed.

---

# Bottom Sheet Accessibility

When opened

↓

Screen reader announces

↓

Focus moves inside

↓

Swipe navigation remains logical

---

# Search Accessibility

Search field must announce:

Search Doctors

Search Clinics

Search Symptoms

Suggestions must be individually accessible.

---

# Queue Accessibility

Important queue changes must be announced.

Examples

```
Only two patients ahead.

Your consultation is approaching.
```

Announcements should avoid excessive repetition.

---

# Notification Accessibility

Critical notifications should use platform accessibility announcements.

Users should not need to open the notification to understand urgency.

---

# Motion Accessibility

Respect system preference:

Reduce Motion

If enabled

↓

Minimize animations

↓

Preserve essential transitions

---

# Haptic Feedback

Haptics should:

Support interactions

Never be required

Users must receive visual feedback as well.

---

# Audio

Future audio features require:

Captions

Alternative interaction

Volume independence

---

# Language

Use plain, understandable language.

Avoid medical jargon where unnecessary.

Prefer

```
Skin Doctor
```

instead of

```
Dermatologist

```

where appropriate for user understanding (while still supporting the medical term).

---

# Reading Level

Target

Approximately Grade 8 reading level.

Healthcare information should remain simple and clear.

---

# Time Limits

Users must have enough time to:

Read

Understand

Respond

Avoid unnecessary countdown pressure except for security-related actions (e.g., OTP expiry).

---

# Accessibility States

Every component supports

Default

Focused

Pressed

Disabled

Loading

Error

Selected

---

# Accessibility Testing

Every release must verify

Screen Reader

Keyboard Navigation

Touch Target Size

Contrast Ratio

Dynamic Font Scaling

Reduced Motion

Landscape Mode (where supported)

Dark Mode (future)

---

# Supported Assistive Technologies

Android

TalkBack

Voice Access

Switch Access

iOS

VoiceOver

Switch Control

AssistiveTouch

---

# Accessibility Checklist

Every screen must satisfy

✓ Labels

✓ Roles

✓ Hints

✓ Focus Order

✓ Touch Targets

✓ Contrast

✓ Dynamic Text

✓ Screen Reader Support

✓ Accessible Errors

✓ Keyboard Navigation

---

# Accessibility Exceptions

If any feature cannot fully comply:

The limitation must be:

Documented

Reviewed

Approved

No undocumented accessibility exceptions are permitted.

---

# Analytics

Track

Accessibility Mode Enabled

Dynamic Font Usage

Screen Reader Usage (where privacy-safe)

Reduced Motion Enabled

Accessibility Errors

No personally identifiable accessibility data should be collected.

---

# Security

Accessibility must never expose:

Authentication Tokens

Sensitive Health Information

Private Backend Data

Accessibility announcements should respect device privacy settings.

---

# Developer Rules

Developers must never:

Use icon-only actions without labels.

Depend solely on color.

Remove focus indicators.

Ignore dynamic text scaling.

Create inaccessible custom components.

Skip accessibility testing.

---

# Acceptance Criteria

Accessibility implementation is complete when:

✓ WCAG 2.2 AA requirements are satisfied.

✓ Screen readers work across all primary flows.

✓ Dynamic text scaling is supported.

✓ Touch targets meet minimum size.

✓ Keyboard navigation functions correctly.

✓ Critical workflows are fully accessible.

✓ Accessibility testing passes before release.

---

# Related Documents

07-Component-System.md

08-Design-Tokens.md

09-Motion-System.md

17-Error-Handling.md

18-Offline-Strategy.md

21-Performance.md

22-Security.md

23-Developer-Guidelines.md

25-Design-Freeze-v1.0.md

---

End of Document