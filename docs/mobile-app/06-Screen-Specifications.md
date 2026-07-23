# JivniCare Patient Mobile App
# Screen Specifications

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines every screen in the Patient Mobile App.

For every screen it specifies:

- Purpose
- Entry Points
- Layout
- Components
- User Actions
- Business Rules
- Loading State
- Empty State
- Error State
- Navigation
- Analytics
- Acceptance Criteria

Developers must implement screens exactly as documented.

---

# Screen Inventory

Authentication

- Splash
- Onboarding
- Login
- OTP

Main

- Home
- Search
- Doctor Listing
- Doctor Profile
- Book Token
- Booking Success
- Live Queue
- Bookings
- Notifications
- Saved Doctors
- Family Members
- Profile
- Settings
- Help

---

# Screen 01 — Splash

## Purpose

Initialize application.

## Responsibilities

- Check session
- Load configuration
- Verify authentication
- Prepare application

## User Actions

None.

## Duration

Maximum 2 seconds.

## Navigation

Authenticated

↓

Home

Unauthenticated

↓

Onboarding / Login

---

# Screen 02 — Onboarding

## Purpose

Explain product value.

## Pages

1.

Find Verified Doctors

2.

Book Queue Token

3.

Track Live Queue

## CTA

Get Started

## Business Rules

Shown only once.

---

# Screen 03 — Login

## Purpose

Authenticate user.

## Components

- Mobile Number
- Continue Button

## Validation

Valid mobile number only.

## CTA

Continue

---

# Screen 04 — OTP

## Components

- OTP Input
- Resend Timer
- Verify Button

## Rules

OTP auto-read supported.

Retry supported.

Maximum retry limit configurable.

---

# Screen 05 — Home

## Purpose

Primary dashboard.

## Layout

Header

↓

Greeting

↓

Specialties

↓

Active Queue Card

↓

Recommended Doctors

↓

Nearby Doctors

↓

Nearby Clinics

↓

Recently Viewed

## Header

Contains

- Location
- Search
- Notifications
- Saved
- Profile

## Primary CTA

Search Doctor

## Business Rules

If active booking exists

↓

Show Queue Card

Otherwise

↓

Show Recommendations

---

## Loading

Skeleton

---

## Empty

Show Recommendations

---

## Error

Retry

---

# Screen 06 — Search

## Components

Search Bar

Voice Search

Recent Searches

Popular Searches

Results

## Supports

Doctor

Clinic

Hospital

Specialty

Disease

Symptom

Location

## Filters

Availability

Experience

Gender

Fee

Distance

---

# Screen 07 — Doctor Listing

## Components

Doctor Cards

Sort

Filters

Pagination

## Doctor Card

Doctor Photo

Doctor Name

Specialty

Hospital

Experience

Fee

Queue Status

Book Token

---

# Screen 08 — Doctor Profile

## Sections

Doctor

Clinic

Experience

Education

Languages

Consultation Fee

Queue Summary

Reviews

Sticky Book Token Button

## Primary CTA

Book Token

---

# Screen 09 — Book Token

## Components

Family Member

Symptoms (Optional)

Booking Summary

Confirm Button

## Rules

No Time Slots.

No Calendar.

No Date Selection.

Queue Token Only.

---

# Screen 10 — Booking Success

## Components

Success Icon

Doctor

Clinic

Token Number

Patients Ahead

ETA

Queue Status

## Primary CTA

Track Live Queue

## Secondary CTA

Home

---

# Screen 11 — Live Queue

## Hero Information

Now Serving

↓

Your Token

↓

Patients Ahead

↓

ETA

↓

Queue Status

↓

Last Updated

## Actions

Call Clinic

Directions

Share

Refresh

---

# Screen 12 — Bookings

## Tabs

Upcoming

Completed

Cancelled (Future)

## Booking Card

Doctor

Clinic

Date

Status

View Details

---

# Screen 13 — Notifications

## Categories

Today

Yesterday

Older

## Notification Card

Title

Description

Timestamp

Unread Indicator

---

# Screen 14 — Saved Doctors

## Layout

Doctor Card List

## Empty State

Explore Doctors

---

# Screen 15 — Family Members

## Components

Member List

Add Member

Edit Member

Delete Member

## Maximum Members

10

---

# Screen 16 — Profile

## Components

Photo

Name

Phone

Quick Links

---

# Screen 17 — Settings

## Options

Language

Notifications

Permissions

Privacy

About

App Version

---

# Screen 18 — Help

## Components

FAQ

Support

Report Issue

Call Clinic

Legal

---

# Global Loading State

Every screen

↓

Skeleton

↓

Content

Never blank.

---

# Global Empty States

Bookings

↓

Book Token

Saved Doctors

↓

Explore Doctors

Notifications

↓

No Notifications

Queue

↓

No Active Queue

---

# Global Error States

Network Error

↓

Retry

Server Error

↓

Retry

Permission Denied

↓

Open Settings

Unknown Error

↓

Home

---

# Analytics Events

Track

- Screen Open
- Screen Close
- CTA Click
- Scroll Depth
- Booking Started
- Booking Completed

---

# Accessibility

Minimum touch target

48dp

Readable fonts

Screen reader support

Dynamic text support

---

# Acceptance Criteria

Every screen must include:

- Loading State
- Empty State
- Error State
- Offline State
- Navigation
- Analytics
- Accessibility

No screen is considered complete without these states.

---

# Related Documents

- 04-Navigation-System.md
- 05-User-Flows.md
- 07-Component-System.md

---

End of Document