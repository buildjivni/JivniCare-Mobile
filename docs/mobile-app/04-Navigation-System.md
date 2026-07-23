# JivniCare Patient Mobile App
# Navigation System

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines the complete navigation behavior of the JivniCare Patient Mobile App.

It specifies:

- Bottom Navigation
- Header Navigation
- Back Navigation
- Deep Links
- Navigation Rules
- Route Protection
- Transition Rules

No navigation should be implemented outside this specification.

---

# Navigation Philosophy

Navigation should always answer three questions:

1. Where am I?
2. Where can I go?
3. How do I go back?

The user should never feel lost.

---

# Navigation Architecture

```
Authentication

↓

Main Application

↓

Secondary Screens

↓

Dialogs / Bottom Sheets
```

Navigation should always move between these layers in a predictable manner.

---

# Primary Navigation

Bottom Navigation is the primary navigation method.

Only four tabs are allowed.

```
🏠 Home

📋 Bookings

🎫 My Queue

☰ More
```

These tabs are fixed.

They cannot be reordered.

They cannot be hidden.

---

# Home Tab

Purpose

Starting point of the application.

Contains:

- Search
- Specialties
- Recommendations
- Active Queue
- Nearby Doctors
- Nearby Clinics

---

# Bookings Tab

Purpose

Manage all patient bookings.

Contains

- Upcoming
- Completed
- Booking Details

---

# My Queue Tab

Purpose

Quick access to active queue.

Contains

- Queue Progress
- Now Serving
- Patients Ahead
- ETA
- Queue Actions

Business Rule

If no active queue exists:

Display Empty State.

---

# More Tab

Contains

- Profile
- Family Members
- Saved Doctors
- Notifications
- Booking History
- Settings
- Help
- Privacy
- Terms
- Logout

---

# Header Navigation

The Home screen header contains:

```
Location

Search

Notifications

Saved Doctors

Profile
```

Rules

Search opens Search Screen.

Notifications open Notification Center.

Saved opens Saved Doctors.

Profile opens More → Profile.

---

# Search Navigation

Accessible from

- Home
- Doctor Listing
- Empty States

Search always opens as a full screen.

---

# Secondary Navigation

Secondary screens are pushed onto the navigation stack.

Example

```
Home

↓

Doctor Listing

↓

Doctor Profile

↓

Book Token
```

Back returns to previous screen.

---

# Modal Navigation

Bottom Sheets are used for:

- Filters
- Family Selection
- Permissions
- Quick Actions

Dialogs are used for:

- Confirmation
- Critical Alerts
- Logout
- Booking Cancel (future)

---

# Back Navigation Rules

Android

System Back

↓

Previous Screen

iOS

Swipe Back

↓

Previous Screen

---

# Root Screen Behavior

If user is on

Home

Bookings

My Queue

More

Pressing Back exits the application (Android).

No confirmation dialog.

---

# Booking Navigation

```
Doctor Profile

↓

Book Token

↓

Booking Success

↓

Live Queue
```

Back Rules

Booking Success

↓

Back disabled

Reason

Prevent duplicate booking.

Users continue using:

Track Queue

Go Home

---

# Live Queue Navigation

Allowed

```
Live Queue

↓

Doctor Profile

↓

Clinic Directions

↓

Call Clinic
```

Not Allowed

Returning to Booking Screen.

---

# Authentication Guard

Protected Screens

- Home
- Search
- Doctor Profile
- Bookings
- Queue
- Profile

If session expires:

```
Login

↓

OTP

↓

Return to Intended Screen
```

---

# Deep Link Navigation

Supported

```
Doctor

↓

Doctor Profile

Queue

↓

Live Queue

Booking

↓

Booking Details

Notification

↓

Target Screen
```

If authentication required

↓

Login First

↓

Continue Automatically

---

# Notification Navigation

Queue Notification

↓

Live Queue

Booking Confirmation

↓

Booking Details

Doctor Update

↓

Doctor Profile

---

# Empty State Navigation

Example

No Saved Doctors

↓

Explore Doctors

No Bookings

↓

Find Doctors

No Queue

↓

Go Home

Every empty state should provide one clear CTA.

---

# Error Navigation

Network Error

↓

Retry

Server Error

↓

Retry

Permission Error

↓

Open Settings

No dead ends.

---

# Route Protection

Unauthorized users cannot access:

- Bookings
- Queue
- Saved
- Profile

They must be redirected to Login.

---

# Duplicate Navigation Prevention

The application must never create duplicate entry points.

Example

Settings

Only accessible through

More

NOT through Home.

---

# Scroll Behavior

When scrolling down

- Bottom Navigation hides.
- Header becomes compact.
- Specialty labels collapse into icons.

When scrolling up

- Bottom Navigation reappears.
- Header expands.

Animation must be smooth.

---

# Transition Rules

Default Screen Transition

300ms

Bottom Sheet

Slide Up

Dialog

Fade

Back Navigation

Reverse Animation

Animations must remain consistent throughout the application.

---

# Navigation Analytics

Track:

- Screen Open
- Screen Close
- Tab Switch
- Search Open
- Booking Flow Start
- Queue Open
- Back Navigation
- Deep Link Open

---

# Accessibility

Bottom Navigation

Minimum touch target

48dp

Icons

Readable

Labels always visible.

No icon-only navigation.

---

# Developer Rules

Developers must never:

- Add undocumented screens.
- Change tab order.
- Create hidden routes.
- Duplicate navigation paths.
- Bypass authentication guards.

Navigation changes require documentation updates first.

---

# Acceptance Criteria

Navigation is complete when:

- Every screen has one defined entry point.
- Every screen has a defined exit path.
- Back navigation behaves consistently.
- Authentication guards work correctly.
- Deep links resolve properly.
- No duplicate navigation exists.

---

# Related Documents

- 03-Information-Architecture.md
- 05-User-Flows.md
- 06-Screen-Specifications.md
- 13-Authentication.md

---

End of Document