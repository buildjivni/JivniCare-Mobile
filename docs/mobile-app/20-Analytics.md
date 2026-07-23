# JivniCare Patient Mobile App
# Analytics

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines the Analytics Framework for the JivniCare Patient Mobile App.

Analytics exist to help understand:

- Product Usage
- User Behavior
- Feature Adoption
- Performance
- Funnel Drop-offs
- Reliability

Analytics must improve the product while respecting user privacy.

---

# Analytics Philosophy

Analytics should answer questions such as:

- How do users find doctors?
- Where do users abandon booking?
- How many bookings become completed consultations?
- How often is Live Queue used?
- Which features are valuable?

Analytics should never collect unnecessary personal information.

---

# Analytics Principles

Analytics must be

- Privacy First
- Event Driven
- Consistent
- Actionable
- Lightweight
- Versioned

---

# Event Naming Convention

All events follow:

```
<feature>_<action>
```

Examples

```
app_open

doctor_view

doctor_save

search_submit

booking_start

booking_complete

queue_open

queue_refresh
```

Event names must remain stable across releases.

---

# Event Structure

Every event contains

```
eventName

timestamp

sessionId

userId (anonymous/internal identifier)

screenName

platform

appVersion
```

Optional

```
metadata
```

---

# Session Analytics

Track

App Launch

App Close

Session Duration

Foreground

Background

Cold Start

Warm Start

---

# Authentication Analytics

Track

Login Started

OTP Requested

OTP Verified

OTP Failed

Session Restored

Logout

Session Expired

---

# Home Analytics

Track

Home Viewed

Specialty Clicked

Search Opened

Doctor Card Viewed

Recommendation Clicked

Nearby Clinic Viewed

---

# Search Analytics

Track

Search Opened

Query Submitted

Suggestion Selected

Recent Search Selected

Filter Applied

Sort Changed

No Results

Search Cleared

Doctor Selected

Never log sensitive symptom text verbatim.

Where possible, categorize queries instead.

---

# Doctor Analytics

Track

Doctor Viewed

Doctor Saved

Doctor Unsaved

Doctor Shared

Book Token Clicked

Directions Opened

Call Clinic

---

# Booking Funnel

Track

Booking Started

↓

Family Selected

↓

Booking Confirmed

↓

Token Generated

↓

Booking Success

↓

Queue Opened

↓

Consultation Completed

Every step should include timestamp.

---

# Queue Analytics

Track

Queue Opened

Queue Refreshed

Queue Updated

Queue Paused

Queue Resumed

Queue Completed

Queue Closed

Realtime Connected

Realtime Disconnected

---

# Notification Analytics

Track

Notification Received

Notification Opened

Notification Dismissed

Permission Granted

Permission Denied

Deep Link Opened

---

# Profile Analytics

Track

Profile Viewed

Profile Updated

Language Changed

Preference Changed

Family Added

Family Edited

Family Deleted

---

# Settings Analytics

Track

Notification Settings Changed

Permission Changed

Help Opened

Privacy Viewed

Terms Viewed

---

# Error Analytics

Track

Network Error

Validation Error

API Failure

Queue Failure

Search Failure

Authentication Failure

Crash

Recovery Success

Recovery Failure

---

# Performance Analytics

Track

App Startup Time

API Response Time

Screen Load Time

Queue Update Latency

Search Response Time

Image Load Time

Memory Warning

---

# Offline Analytics

Track

Offline Started

Offline Ended

Reconnect Success

Reconnect Failed

Cache Restored

Synchronization Started

Synchronization Completed

---

# Funnel Analytics

Primary Funnel

```
Home

↓

Search

↓

Doctor Viewed

↓

Book Token

↓

Booking Success

↓

Queue

↓

Consultation Completed
```

Measure conversion between every step.

---

# Feature Adoption

Measure

Saved Doctors

Family Members

Queue Tracking

Voice Search (Future)

Notifications Enabled

Location Enabled

---

# User Retention

Track

Daily Active Users

Weekly Active Users

Monthly Active Users

Repeat Booking Rate

Average Sessions

Session Frequency

---

# Business KPIs

Primary KPIs

Successful Bookings

Completed Consultations

Queue Tracking Usage

Doctor Discovery Success Rate

Search Success Rate

Booking Conversion Rate

Notification Engagement

---

# Operational Metrics

Monitor

Average Queue Size

Average Waiting Time

Average Booking Time

Average Search Time

Queue Refresh Success

Realtime Connection Health

---

# Screen Analytics

Every screen tracks

Screen Open

Screen Close

Time on Screen

Exit Method

CTA Click

Scroll Depth

---

# Privacy Rules

Never collect

OTP

Authentication Tokens

Medical Records

Prescription Data

Payment Information

Personal Health Information

Exact search text containing sensitive medical data unless explicitly anonymized.

---

# Data Retention

Analytics retention policy follows organizational compliance requirements.

Old analytics should be archived according to data governance policy.

---

# Sampling

Critical healthcare events

↓

Never sampled

High-volume UI events

↓

May be sampled if necessary.

Sampling rules are controlled centrally.

---

# Cross Platform Consistency

Android

iOS

Web (Future)

must use identical event names wherever applicable.

---

# Analytics Quality Rules

Every event must include

Timestamp

Version

Platform

Session

Context

Missing required fields invalidate the event.

---

# Accessibility Analytics

Track

Dynamic Font Enabled

Reduce Motion Enabled

Screen Reader Usage (privacy-safe)

Accessibility Errors

---

# Security

Analytics must never expose

Internal IDs

Authentication Secrets

Queue Algorithms

Private Backend Data

Analytics transport must be encrypted.

---

# Developer Rules

Developers must never

Create undocumented analytics events.

Rename existing events without versioning.

Log sensitive information.

Fire duplicate events.

Track backend business logic incorrectly.

---

# Acceptance Criteria

Analytics implementation is complete when

✓ Every major user action is tracked.

✓ Funnel metrics are available.

✓ Queue metrics are measurable.

✓ Booking conversion is measurable.

✓ Privacy requirements are satisfied.

✓ Events remain consistent across platforms.

✓ Sensitive information is never logged.

---

# Related Documents

11-Queue-System.md

12-Search-System.md

13-Authentication.md

14-Notification-System.md

16-State-Management.md

17-Error-Handling.md

21-Performance.md

22-Security.md

23-Developer-Guidelines.md

25-Design-Freeze-v1.0.md

---

End of Document