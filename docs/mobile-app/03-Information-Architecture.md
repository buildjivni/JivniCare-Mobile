# JivniCare Patient Mobile App
# Information Architecture

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines the complete information architecture (IA) of the JivniCare Patient Mobile App.

It specifies:

- Screen hierarchy
- Navigation relationships
- User journeys
- Feature grouping
- Navigation rules

This document is the foundation for routing, navigation, state management, and implementation.

---

# IA Principles

The application must:

- Be easy to understand.
- Require minimal navigation.
- Avoid duplicate entry points.
- Keep important actions within 2–3 taps.
- Maintain a predictable navigation structure.

---

# Application Structure

```
JivniCare Patient App

├── Authentication
│   ├── Splash
│   ├── Onboarding
│   ├── Mobile Number
│   ├── OTP Verification
│   └── Session Restore
│
├── Main Application
│   ├── Home
│   ├── Bookings
│   ├── My Queue
│   └── More
│
└── Secondary Screens
    ├── Search
    ├── Doctor Listing
    ├── Doctor Profile
    ├── Token Booking
    ├── Booking Success
    ├── Notification Center
    ├── Saved Doctors
    ├── Booking History
    ├── Family Members
    ├── Settings
    ├── Help Center
    ├── Privacy
    └── Terms
```

---

# Authentication Flow

```
Splash

↓

First Launch?

↓

Yes
↓

Onboarding

↓

Login

↓

OTP

↓

Home
```

Returning user

```
Splash

↓

Session Valid

↓

Home
```

Expired session

```
Splash

↓

Login

↓

OTP

↓

Return to Previous Screen
```

---

# Main Navigation

Bottom Navigation contains only four primary destinations.

```
Home

Bookings

My Queue

More
```

Rules

- Bottom navigation must remain persistent.
- Do not duplicate these items elsewhere.
- Active tab must always be visible.
- Bottom navigation hides while scrolling down and reappears on upward scroll where applicable.

---

# Home Architecture

```
Home

├── Header
│   ├── Location
│   ├── Search
│   ├── Notifications
│   ├── Saved
│   └── Profile
│
├── Greeting
│
├── Specialties
│
├── Active Queue Card
│
├── Recommended Doctors
│
├── Nearby Doctors
│
├── Nearby Clinics
│
└── Recently Viewed
```

Business Rule

If there is no active booking, the **Active Queue Card** is replaced with relevant recommendations.

---

# Search Architecture

```
Search

├── Search Field
├── Voice Search
├── Recent Searches
├── Popular Searches
├── Symptoms
├── Specialties
└── Results
```

Search supports

- Doctor
- Clinic
- Hospital
- Specialty
- Symptom
- Disease
- Location

---

# Doctor Discovery Flow

```
Home

↓

Search

↓

Doctor Listing

↓

Doctor Profile

↓

Book Token
```

Alternative

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

# Doctor Profile Architecture

```
Doctor Profile

├── Doctor Information
├── Clinic Information
├── Availability
├── Queue Summary
├── Consultation Details
├── Reviews
└── Sticky Book Token Button
```

---

# Booking Flow

```
Doctor Profile

↓

Book Token

↓

Booking Confirmation

↓

Booking Success

↓

Live Queue
```

Users never select a time slot.

---

# Live Queue Flow

```
Booking Success

↓

Live Queue

↓

Queue Updates

↓

Visit Completed
```

Live Queue displays

- Now Serving
- Your Token
- Patients Ahead
- Estimated Arrival Window
- Queue Status

---

# Bookings Module

```
Bookings

├── Upcoming
├── Completed
├── Cancelled (Future)
└── Booking Details
```

---

# My Queue Module

```
My Queue

├── Active Queue
├── Queue Progress
├── Queue Status
├── Arrival Estimate
└── Queue Actions
```

Queue actions

- Call Clinic
- Get Directions
- Share Booking

---

# More Module

```
More

├── My Profile
├── Family Members
├── Saved Doctors
├── Notifications
├── Booking History
├── Settings
├── Help
├── Privacy Policy
├── Terms
└── Logout
```

---

# Family Flow

```
Profile

↓

Family Members

↓

Add Member

↓

Save

↓

Available During Booking
```

---

# Notification Flow

```
Push Notification

↓

Notification Center

↓

Relevant Screen
```

Examples

Queue notification

↓

Live Queue

Booking notification

↓

Booking Details

Doctor notification

↓

Doctor Profile

---

# Settings Flow

```
Settings

├── Language
├── Notifications
├── Permissions
├── Privacy
├── About
└── App Version
```

---

# Help Flow

```
Help

├── FAQ
├── Contact Support
├── Report Issue
├── Call Clinic
└── Legal Information
```

---

# Deep Link Support

Supported destinations

```
Doctor Profile

Queue Tracking

Booking Details

Notification

Referral

QR Code
```

Every deep link must resolve directly to its destination after authentication.

---

# Global Navigation Rules

Users can always return to

- Home
- Previous Screen

Never trap users inside a workflow.

---

# Modal Navigation

Bottom Sheets

Used for

- Filters
- Family Selection
- Permissions
- Quick Actions

Dialogs

Used only for

- Confirmation
- Critical Alerts
- Destructive Actions

---

# Screen Priority

Tier 1

- Home
- Search
- Doctor Profile
- Book Token
- Live Queue

Tier 2

- Bookings
- Notifications
- Saved Doctors

Tier 3

- Settings
- Help
- Legal

---

# Maximum Navigation Depth

Preferred

```
3 Levels
```

Absolute Maximum

```
4 Levels
```

Never exceed four navigation levels.

---

# Navigation Consistency Rules

Developers must not

- Introduce hidden routes.
- Create duplicate navigation paths.
- Add undocumented screens.
- Modify bottom navigation.
- Reorder primary destinations.

---

# Acceptance Criteria

Information Architecture is complete when

- Every screen belongs to one logical module.
- Every user flow is documented.
- Navigation hierarchy is consistent.
- Deep links are defined.
- Maximum navigation depth is respected.
- Every screen has a predictable entry point.

---

# Related Documents

- 00-README.md
- 02-Design-Principles.md
- 04-Navigation-System.md
- 05-User-Flows.md
- 06-Screen-Specifications.md

---

End of Document