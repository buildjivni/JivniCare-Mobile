# JivniCare Patient Mobile App
# State Management

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines the complete State Management Architecture of the JivniCare Patient Mobile App.

The objective is to ensure every screen displays a consistent, synchronized and predictable view of application data.

The state architecture must remain scalable, testable and maintainable.

---

# State Management Principles

The application follows these principles:

- Single Source of Truth
- Unidirectional Data Flow
- Immutable State
- Backend Owns Business Data
- UI Owns Presentation State
- Predictable State Transitions
- Offline-First Cache (where applicable)

---

# Recommended Architecture

```
Backend APIs
        │
        ▼
Network Layer
        │
        ▼
Query / Cache Layer
        │
        ▼
Global Store
        │
        ▼
Feature Stores
        │
        ▼
UI Components
```

Business data should flow only from top to bottom.

---

# State Categories

Global App State

Authentication State

Profile State

Family State

Doctor State

Search State

Booking State

Queue State

Notification State

Settings State

UI State

---

# Global App State

Contains

- App Version
- Environment
- Feature Flags
- Connectivity
- Maintenance Status
- Supported API Version

Accessible from the entire application.

---

# Authentication State

Stores

- Authentication Status
- Current User
- Session Status
- Token Expiry
- Refresh Status

Never expose

- Access Token
- Refresh Token
- OTP

---

# User State

Contains

- Name
- Mobile Number
- Avatar
- Preferred Language
- Notification Preferences

Loaded immediately after authentication.

---

# Family State

Contains

- Family Member List
- Selected Member
- Active Booking Patient

Shared across booking screens.

---

# Doctor State

Contains

Doctor Details

Doctor Availability

Queue Summary

Clinic Details

Saved Status

Avoid duplicate doctor objects.

Reference by ID wherever possible.

---

# Search State

Contains

Current Query

Recent Searches

Applied Filters

Sort Order

Results

Pagination

Loading State

Error State

Recent searches may be cached locally.

Search results should not persist indefinitely.

---

# Booking State

Contains

Active Booking

Booking History

Booking Status

Booking Details

Current Booking ID

Only one active booking per queue.

---

# Queue State

Contains

Queue ID

Token Number

Queue Position

Patients Ahead

ETA

Queue Status

Last Updated

Realtime Connection Status

Queue State is read-only from the frontend.

---

# Notification State

Contains

Notification List

Unread Count

Read Status

Last Sync Time

---

# Settings State

Contains

Language

Notification Preferences

Permission Status

App Preferences

Persist locally.

---

# UI State

Contains

Dialog Visibility

Bottom Sheet State

Snackbar Queue

Loading Indicators

Selected Tabs

Search Focus

Scroll Position

Never place business logic here.

---

# Data Ownership

Backend owns

Queue

Booking

Authentication

Doctor Availability

ETA

Search Ranking

Frontend owns

Navigation

Dialogs

Bottom Sheets

Animations

Temporary Inputs

Selection State

---

# Data Flow

```
Backend

↓

API Response

↓

Validation

↓

Store Update

↓

UI Re-render
```

Components must never update business state directly.

---

# Single Source of Truth

Each entity must have exactly one authoritative state.

Examples

Doctor

↓

Doctor Store

Booking

↓

Booking Store

Queue

↓

Queue Store

Never duplicate business objects.

---

# State Synchronization

Whenever backend data changes

↓

Update Store

↓

Re-render affected screens

↓

Leave unaffected screens untouched

Avoid unnecessary re-renders.

---

# Optimistic Updates

Allowed

Save Doctor

Remove Saved Doctor

Update Preferences

Not Allowed

Booking

Queue

ETA

Authentication

Queue Position

Critical healthcare data must wait for backend confirmation.

---

# Cache Strategy

Safe to Cache

Doctor Details

Specialties

Saved Doctors

Profile

Family Members

Settings

Recent Bookings

Never Cache

Live Queue

ETA

Authentication Secrets

OTP

Realtime Availability

---

# Refresh Strategy

Automatic

Queue

Notifications

Authentication Session

Manual

Doctor List

Bookings

Search Results

Refresh interval must be controlled by backend.

---

# Loading State Model

Each feature must support

Idle

↓

Loading

↓

Success

↓

Refreshing

↓

Empty

↓

Error

No screen should remain without a defined state.

---

# Error Recovery

If refresh fails

↓

Keep previous valid state

↓

Display Retry

↓

Recover automatically after successful response

Never remove valid business data because of a temporary failure.

---

# Offline Recovery

Offline

↓

Cached Data

↓

Reconnect

↓

Background Sync

↓

State Updated

---

# Logout Reset

Logout clears

Authentication

Profile

Queue

Bookings

Notifications

Family

Temporary UI State

Retain only safe local preferences such as language.

---

# Derived State

Allowed

Unread Count

Display Name

Doctor Full Name

Saved Status

Not Allowed

ETA

Queue Position

Consultation Order

Booking Decision

Derived business logic belongs to backend.

---

# Immutable Updates

Business state must be immutable.

Every update creates a new state.

Never mutate existing objects.

---

# Conflict Resolution

If multiple updates arrive

↓

Newest backend version wins

Frontend never attempts to merge healthcare-critical state.

---

# Performance Guidelines

Normalize collections.

Avoid duplicate objects.

Lazy load large datasets.

Memoize expensive calculations.

Subscribe only to required state.

Avoid full application re-renders.

---

# State Persistence

Persist

Language

Theme (Future)

Notification Preferences

Saved Search History

Do Not Persist

Loading States

Dialogs

Temporary Forms

Queue State

Authentication Secrets

---

# Realtime Synchronization

Queue

↓

Realtime Update

↓

Queue Store

↓

Queue Screen

Notification

↓

Notification Store

↓

Badge Count

Realtime events always overwrite stale local state.

---

# Security Rules

Never store

OTP

Authentication Tokens

Private Keys

Sensitive medical information in insecure storage

Clear sensitive state immediately after logout.

---

# Accessibility

Important state changes should be announced.

Examples

Queue Updated

Booking Confirmed

Network Restored

Session Expired

---

# Analytics

Track

State Initialized

State Updated

Cache Restored

Offline Recovery

Sync Success

Sync Failure

State Reset

---

# Developer Rules

Developers must never

Create multiple sources of truth

Store duplicate entities

Mutate global state

Calculate backend-owned values

Mix UI state with business state

---

# Acceptance Criteria

State Management implementation is complete when

✓ Every entity has one owner.

✓ Queue remains synchronized.

✓ Business state is immutable.

✓ Offline recovery works.

✓ Logout clears sensitive state.

✓ Components remain stateless wherever possible.

✓ Backend remains authoritative.

---

# Related Documents

11-Queue-System.md

13-Authentication.md

14-Notification-System.md

15-API-Contracts.md

17-Error-Handling.md

18-Offline-Strategy.md

23-Developer-Guidelines.md

25-Design-Freeze-v1.0.md

---

End of Document