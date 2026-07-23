# JivniCare Patient Mobile App
# Component System

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines every reusable UI component used throughout the JivniCare Patient Mobile App.

Its purpose is to ensure:

- UI consistency
- Faster development
- Better maintainability
- Reusable design
- Predictable interactions

No screen should create its own custom component if a reusable component already exists.

---

# Design Philosophy

Every component must be:

- Reusable
- Responsive
- Accessible
- Theme-aware
- State-driven
- Lightweight
- Performance optimized

---

# Component Categories

The design system contains six major groups.

```
Foundation

↓

Inputs

↓

Display

↓

Feedback

↓

Navigation

↓

Overlays
```

---

# Foundation Components

## Button

Variants

- Primary
- Secondary
- Outline
- Text
- Destructive
- Disabled

States

- Default
- Pressed
- Loading
- Disabled

Rules

Only one Primary Button per screen.

---

## Icon Button

Used for

- Search
- Notification
- Favorite
- Share
- Back

Sizes

- Small
- Medium
- Large

---

## Divider

Horizontal

Vertical

Inset

---

## Avatar

Types

Doctor

Patient

Family Member

Hospital

Fallback

Initial Letter

---

## Badge

Types

Success

Warning

Error

Info

Queue

Verified

---

# Input Components

## Search Bar

Features

Search Icon

Voice Search

Clear Button

Recent Search

Auto Suggestions

Placeholder

Examples

Search Doctor

Search Clinic

Search Hospital

Search Symptoms

---

## Text Field

Variants

Filled

Outlined

Read Only

States

Focused

Error

Disabled

---

## OTP Field

Features

Auto Read

Paste

Countdown

Resend

Auto Focus

---

## Dropdown

Used for

Language

Gender

Filters

Family Selection

---

## Filter Chips

Used for

Experience

Availability

Distance

Fee

Gender

Specialty

States

Selected

Unselected

Disabled

---

## Toggle Switch

Used for

Notifications

Dark Mode (Future)

Permissions

---

# Display Components

## Doctor Card

Purpose

Primary doctor listing component.

Contents

Doctor Image

Doctor Name

Specialty

Hospital

Experience

Consultation Fee

Queue Status

Verified Badge

Book Token Button

Rules

Used everywhere.

Never create another doctor card.

---

## Queue Card

Purpose

Live Queue Summary

Contents

Now Serving

Your Token

Patients Ahead

ETA

Queue Status

Last Updated

Actions

Track Queue

Directions

Call Clinic

---

## Clinic Card

Contains

Hospital Image

Clinic Name

Address

Distance

Open Status

Doctors Available

---

## Specialty Card

Contains

Icon

Name

Doctor Count

---

## Booking Card

Contains

Doctor

Hospital

Booking Status

Token

Date

Queue Status

CTA

View Details

---

## Family Member Card

Contains

Name

Relationship

Age

Gender

Edit

Delete

---

## Notification Card

Contains

Title

Description

Time

Unread Dot

Priority

---

## Review Card

Contains

Rating

Review

Patient Name

Date

---

# Feedback Components

## Snackbar

Types

Success

Warning

Error

Information

Duration

3 Seconds

---

## Toast

Used only for lightweight confirmations.

Example

Doctor Saved

---

## Banner

Types

Offline

Maintenance

Important Update

---

## Empty State

Includes

Illustration

Title

Description

CTA

Examples

No Bookings

No Queue

No Notifications

No Saved Doctors

---

## Error State

Contains

Illustration

Reason

Retry Button

---

## Skeleton Loader

Used for

Doctor List

Home

Queue

Bookings

Never use spinner-only loading.

---

# Navigation Components

## Bottom Navigation

Tabs

Home

Bookings

My Queue

More

Rules

Persistent

Responsive

Auto Hide on Scroll

---

## Header

Contains

Location

Search

Notification

Saved

Profile

---

## Breadcrumb

Not used in mobile.

---

## Tab Bar

Used in

Bookings

Notifications

History

---

# Overlay Components

## Bottom Sheet

Uses

Filters

Family Selection

Permissions

Quick Actions

Rules

Swipe to Close

---

## Dialog

Uses

Logout

Delete

Permission

Confirmation

Rules

Critical actions only.

---

## Full Screen Modal

Used for

Search

Authentication Recovery

---

# Queue Components

## Queue Progress

Contains

Progress Indicator

Patients Ahead

ETA

Now Serving

---

## Queue Status Chip

States

Open

Busy

Paused

Closed

Emergency

---

## Queue Timeline

Future Version

---

# Utility Components

Loading Indicator

Progress Bar

Step Indicator

Status Label

Section Header

Card Header

Tag

Pill

Divider

---

# Component Naming Convention

Example

```
BaseButton

DoctorCard

QueueCard

SearchBar

NotificationCard

FamilyCard

BookingCard

BottomNavigation

QueueStatusChip
```

Component names must remain consistent.

---

# Reuse Rules

Developers must:

Reuse existing components.

Do not duplicate UI.

Do not slightly modify components.

Extend only through documented variants.

---

# Accessibility

Every component must support:

48dp touch target

Keyboard navigation

Screen readers

Dynamic text scaling

High contrast mode

---

# Performance Rules

Components must:

Lazy load images.

Avoid unnecessary re-renders.

Support memoization where appropriate.

Keep animations lightweight.

---

# Analytics

Track interactions on:

Buttons

Search

Cards

Bookings

Queue

Navigation

---

# Acceptance Criteria

A component is complete only if it includes:

Visual Specification

Interaction Rules

States

Accessibility

Loading

Error Handling

Analytics

Responsiveness

---

# Related Documents

06-Screen-Specifications.md

08-Design-Tokens.md

09-Motion-System.md

23-Developer-Guidelines.md

---

End of Document