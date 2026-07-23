# JivniCare Patient Mobile App
# Offline Strategy

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines the Offline Strategy for the JivniCare Patient Mobile App.

The objective is to provide the best possible experience during poor or unavailable network connectivity while ensuring that healthcare-critical information remains accurate.

The application should remain useful whenever possible, but it must never display misleading medical or queue information.

---

# Offline Philosophy

Offline mode is a degraded experience, not a broken experience.

The application must:

- Continue functioning where safe
- Prevent unsafe actions
- Preserve user data
- Synchronize automatically after reconnection

Patient safety always takes priority over convenience.

---

# Connectivity States

The application supports four connectivity states.

```
Online

↓

Weak Network

↓

Offline

↓

Reconnecting
```

Every screen must react appropriately.

---

# Network Detection

The application continuously monitors:

- Internet Availability
- Connection Quality
- API Reachability

Backend availability is more important than internet availability.

---

# Offline Banner

Whenever the application loses connectivity:

Display

```
You're offline.

Some features are temporarily unavailable.
```

Banner remains visible until connection is restored.

---

# Offline Indicator

Show a global offline indicator.

Never hide connectivity status from the user.

---

# Offline Capabilities

Available Offline

- View Cached Profile
- View Family Members
- View Saved Doctors
- View Booking History (cached)
- View Recently Viewed Doctors
- View App Settings
- Change Language
- Read Cached Notifications

---

# Online-Only Features

Require active internet connection.

- Book Token
- Live Queue
- Search
- Doctor Availability
- Queue Position
- ETA
- Notification Synchronization
- Session Validation

Attempting these features while offline should display an informative message.

---

# Cache Strategy

The application may cache:

Doctor Details

Specialties

Profile

Family Members

Saved Doctors

Booking History

Settings

Recent Searches

---

# Never Cache

Never persist

Live Queue

ETA

Queue Position

Authentication Secrets

OTP

Realtime Availability

Temporary Booking Requests

Healthcare-critical live data must never be considered valid offline.

---

# Offline Queue Behavior

If connection is lost during queue tracking

↓

Display

Last Known Queue Information

↓

Mark as

Outdated

↓

Show

Last Updated Timestamp

↓

Wait for Reconnection

Never estimate queue movement locally.

---

# Offline Booking

Booking is not supported while offline.

Display

```
Internet connection required to book a consultation.
```

No local booking queue is maintained.

---

# Offline Search

Search is unavailable.

Display

```
Search requires an internet connection.
```

Offer

Retry

Return Home

---

# Cached Screens

The following screens may open from cache:

Home (partial)

Doctor Profile (cached)

Saved Doctors

Booking History

Profile

Settings

Family Members

Every cached screen must display a freshness indicator if data may be outdated.

---

# Freshness Indicator

Example

```
Last updated

2 minutes ago
```

or

```
Last synchronized

Today at 10:35 AM
```

---

# Background Synchronization

When connectivity returns

↓

Synchronize

Profile

↓

Notifications

↓

Bookings

↓

Doctor Details

↓

Queue

↓

UI Refresh

Synchronization order is controlled by priority.

---

# Synchronization Priority

Priority 1

Authentication

Priority 2

Queue

Priority 3

Bookings

Priority 4

Notifications

Priority 5

Profile

Priority 6

Cached Reference Data

---

# Conflict Resolution

Backend always wins.

If cached data differs

↓

Replace Local Cache

↓

Update UI

Frontend must never attempt to merge healthcare-critical records.

---

# Reconnection Flow

```
Offline

↓

Connection Restored

↓

Validate Session

↓

Synchronize Data

↓

Refresh UI

↓

Hide Offline Banner
```

---

# Weak Network Mode

If network quality is poor

Display

```
Connection is unstable.

Some updates may be delayed.
```

Reduce unnecessary requests.

Maintain responsive UI.

---

# Retry Strategy

Automatic Retry

Realtime Queue

Notification Sync

Session Refresh

Manual Retry

Search

Bookings

Doctor Listing

Retry intervals are backend controlled.

---

# Failed Synchronization

If synchronization fails

↓

Keep Existing Cache

↓

Display Retry

↓

Retry Later

Never erase valid cached data because of temporary failures.

---

# Offline Forms

Temporary UI input may remain in memory during short interruptions.

Critical submissions such as bookings must not be auto-submitted without user confirmation after reconnection.

---

# Storage Policy

Persist Locally

Language

Preferences

Family Members

Saved Doctors

Profile

Recent Searches

Booking History

Do Not Persist

OTP

Authentication Secrets

Queue State

ETA

Realtime Tokens

---

# Session Handling

If the application reconnects

↓

Validate Authentication

If expired

↓

Redirect Login

↓

Resume Previous Flow

---

# Notification Behavior

Push notifications depend on operating system delivery.

Unread notification synchronization resumes after reconnection.

---

# Error Handling

Offline

↓

Cached Data

↓

Retry

↓

Reconnect

↓

Synchronize

Every offline error must provide a clear recovery action.

---

# User Experience Guidelines

Never:

Show outdated queue information as current.

Pretend booking succeeded.

Estimate consultation time offline.

Hide synchronization failures.

Always:

Clearly indicate offline state.

Explain unavailable features.

Restore data automatically.

---

# Performance

Cache reads should be immediate.

Background synchronization must not block UI interaction.

Synchronization should update only changed data.

---

# Security

Sensitive information stored offline must use secure platform storage where applicable.

Authentication secrets must never remain after logout.

---

# Accessibility

Offline status changes must be announced to assistive technologies.

Examples

Connection Lost

Connection Restored

Synchronization Complete

---

# Analytics

Track

Offline Started

Offline Ended

Synchronization Started

Synchronization Completed

Synchronization Failed

Offline Feature Used

Reconnect Success

---

# Developer Rules

Developers must never:

Allow bookings while offline.

Calculate queue locally.

Display stale queue as live.

Persist sensitive authentication data.

Ignore synchronization conflicts.

Backend remains the source of truth.

---

# Acceptance Criteria

Offline Strategy implementation is complete when:

✓ Offline state is clearly communicated.

✓ Cached data remains usable.

✓ Live healthcare data is never fabricated.

✓ Synchronization is automatic.

✓ Backend always wins conflicts.

✓ Sensitive data is protected.

✓ User experience remains predictable.

---

# Related Documents

11-Queue-System.md

13-Authentication.md

15-API-Contracts.md

16-State-Management.md

17-Error-Handling.md

19-Accessibility.md

21-Performance.md

22-Security.md

23-Developer-Guidelines.md

25-Design-Freeze-v1.0.md

---

End of Documents