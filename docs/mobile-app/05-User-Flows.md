# JivniCare Patient Mobile App
# User Flows

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines every primary user journey inside the JivniCare Patient Mobile App.

It ensures developers implement identical workflows without making assumptions.

Every flow is considered the official product behavior.

---

# Flow Design Principles

Every user flow must:

- Require minimum taps
- Have one clear primary action
- Prevent user confusion
- Recover gracefully from errors
- Never reach a dead end

---

# User Flow Index

1. First Launch
2. Login
3. Returning User
4. Home Exploration
5. Doctor Search
6. Doctor Discovery
7. Doctor Profile
8. Token Booking
9. Booking Success
10. Live Queue
11. Queue Notifications
12. Booking History
13. Family Member Booking
14. Saved Doctors
15. Profile
16. Logout

---

# Flow 1 — First Launch

```
App Install

↓

Splash

↓

Onboarding

↓

Login

↓

OTP

↓

Home
```

Business Rules

- Onboarding shown only once.
- Skip unavailable.
- User must complete login.

---

# Flow 2 — Returning User

```
Splash

↓

Session Valid

↓

Home
```

If session expired:

```
Splash

↓

Login

↓

OTP

↓

Return To Intended Screen
```

---

# Flow 3 — Home Exploration

```
Home

↓

Browse Specialties

↓

Recommended Doctors

↓

Nearby Doctors

↓

Doctor Profile
```

Alternative

```
Home

↓

Search

↓

Doctor Listing
```

---

# Flow 4 — Search Doctor

```
Home

↓

Search

↓

Suggestions

↓

Results

↓

Doctor Profile
```

Search Supports

- Doctor
- Clinic
- Hospital
- Specialty
- Symptom
- Disease
- Location

---

# Flow 5 — Browse By Specialty

```
Home

↓

Specialty

↓

Doctor Listing

↓

Doctor Profile
```

---

# Flow 6 — Doctor Profile

```
Doctor Listing

↓

Doctor Profile

↓

Read Details

↓

Book Token
```

Available Information

- Doctor
- Clinic
- Fee
- Experience
- Queue Summary
- Reviews

---

# Flow 7 — Token Booking

```
Doctor Profile

↓

Book Token

↓

Select Family Member

↓

Symptoms (Optional)

↓

Confirm Booking
```

Rules

No Time Slot Selection.

No Calendar.

No Date Picker.

Only Queue Token.

---

# Flow 8 — Booking Success

```
Booking Complete

↓

Booking Success

↓

Track Queue
```

Screen Displays

- Token Number
- Queue Position
- Patients Ahead
- ETA
- Doctor
- Clinic

Primary CTA

Track Live Queue

Secondary CTA

Go Home

---

# Flow 9 — Live Queue

```
Track Queue

↓

Live Queue

↓

Queue Updates

↓

Visit Complete
```

Live Queue Shows

- Now Serving
- Your Token
- Patients Ahead
- ETA
- Queue Status
- Last Updated

Actions

- Call Clinic
- Directions
- Share Booking

---

# Flow 10 — Queue Notification

```
Push Notification

↓

Open App

↓

Live Queue
```

Examples

"Only 5 patients ahead."

↓

Open Queue

---

# Flow 11 — Booking History

```
Bookings

↓

Completed

↓

Booking Details
```

User can review previous visits.

No editing allowed.

---

# Flow 12 — Family Member Booking

```
Book Token

↓

Choose Family Member

↓

Confirm

↓

Booking Success
```

If member unavailable

↓

Add Member

↓

Continue Booking

---

# Flow 13 — Saved Doctors

```
Saved Doctors

↓

Doctor Profile

↓

Book Token
```

---

# Flow 14 — Notification Center

```
Notifications

↓

Select Notification

↓

Relevant Screen
```

Queue

↓

Live Queue

Booking

↓

Booking Details

Doctor

↓

Doctor Profile

---

# Flow 15 — Profile

```
More

↓

Profile

↓

Settings

↓

Help

↓

Legal
```

---

# Flow 16 — Logout

```
More

↓

Logout

↓

Confirmation

↓

Login
```

Rules

Confirmation required.

Session cleared.

Cached sensitive data removed.

---

# Error Recovery Flows

## Invalid OTP

```
OTP

↓

Error

↓

Retry

↓

Success
```

---

## Network Error

```
Action

↓

Network Error

↓

Retry

↓

Continue
```

---

## Queue Closed

```
Book Token

↓

Queue Closed

↓

Doctor Profile
```

---

## Permission Denied

```
Feature

↓

Permission Needed

↓

Settings

↓

Continue
```

---

# Empty State Flows

No Bookings

↓

Find Doctors

No Saved Doctors

↓

Explore Doctors

No Queue

↓

Home

---

# Deep Link Flows

Doctor Link

↓

Doctor Profile

Queue Link

↓

Live Queue

Booking Link

↓

Booking Details

Notification Link

↓

Target Screen

If authentication required

↓

Login

↓

Resume Flow

---

# Flow Completion Rules

Every user flow must end with one of:

- Home
- Queue
- Booking History
- Profile

Users must never become trapped inside a workflow.

---

# UX Success Criteria

A patient should be able to:

- Login in under 1 minute.
- Find a doctor in under 30 seconds.
- Book a token in under 20 seconds.
- Understand queue status immediately.
- Reach the clinic at the correct time.

---

# Developer Rules

Developers must not:

- Add undocumented steps.
- Change flow order.
- Introduce extra confirmation screens.
- Ask for unnecessary information.
- Skip required validation.

Every implemented flow must exactly match this specification.

---

# Related Documents

- 03-Information-Architecture.md
- 04-Navigation-System.md
- 06-Screen-Specifications.md
- 11-Queue-System.md
- 13-Authentication.md

---

End of Document