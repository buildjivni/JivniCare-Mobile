# JivniCare Patient Mobile App
# Queue System

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines the complete Queue Management System of JivniCare.

The Queue System is the core product engine.

Every booking, queue update, notification and ETA displayed inside the application follows the rules defined here.

Frontend must never invent queue behavior.

Backend remains the single source of truth.

---

# Queue Philosophy

JivniCare does NOT promise appointment time.

Instead, it provides:

• Real-Time Queue Visibility

• Queue Position

• Patients Ahead

• Estimated Arrival Window

• Live Queue Status

The objective is to reduce unnecessary waiting at clinics.

---

# Queue Architecture

```
Doctor

↓

Clinic

↓

Daily Queue

↓

Queue Token

↓

Patient

↓

Live Queue Updates
```

Every doctor owns one Daily Queue for each working day.

---

# Queue Lifecycle

```
Queue Created

↓

Open

↓

Active

↓

Busy

↓

Paused

↓

Resumed

↓

Closing

↓

Closed

↓

Archived
```

---

# Queue States

## Open

Queue accepts new tokens.

Patient booking allowed.

Status Color

Queue Open

---

## Active

Doctor is consulting patients.

Queue moves normally.

Booking allowed.

---

## Busy

Queue is active.

Waiting time increased.

Booking still allowed.

---

## Paused

Doctor temporarily unavailable.

Examples

Lunch Break

Emergency

Procedure

Meeting

Rules

New booking disabled.

Existing tokens remain valid.

ETA recalculated.

---

## Resumed

Doctor resumes consultation.

Queue continues.

ETA updated.

---

## Closing

Doctor stops accepting new patients.

Existing booked patients continue.

---

## Closed

Consultation finished.

No new booking.

Queue frozen.

---

## Emergency

Emergency consultation interrupts queue.

Rules

Queue movement suspended.

Patients notified.

ETA removed until queue stabilizes.

---

# Token Lifecycle

```
Generated

↓

Confirmed

↓

Waiting

↓

Ready Soon

↓

Now Serving

↓

Completed

↓

Archived
```

---

# Token States

## Generated

Backend created token.

Patient not yet confirmed.

---

## Confirmed

Booking successful.

Token assigned.

Queue position calculated.

---

## Waiting

Patient waiting.

Queue progressing normally.

---

## Ready Soon

Patient approaching consultation.

Notification triggered.

---

## Now Serving

Doctor currently calling patient.

---

## Completed

Consultation completed.

Booking moved to history.

---

## Missed (Future)

Patient absent.

Clinic policy applies.

---

## Cancelled (Future)

Token cancelled.

Queue recalculated.

---

# Queue Information Display

Patient App always shows

Doctor Name

Clinic

Token Number

Now Serving

Patients Ahead

Estimated Arrival

Queue Status

Last Updated

---

# Queue Progress

Queue progresses only when backend confirms.

Frontend never predicts movement.

---

# Queue Position

Calculated by backend.

Displayed by frontend.

Patients cannot manually refresh faster than server policy.

---

# ETA

ETA is always approximate.

Display format

```
Estimated Arrival

Around 12:35 PM

```

or

```
Approximately 35 minutes
```

Never display:

Guaranteed Time

Exact Consultation Time

---

# ETA Confidence

Future Support

High

Medium

Low

Based on queue stability.

---

# Queue Refresh Policy

Automatic refresh.

Manual refresh allowed.

Refresh interval controlled by backend.

Frontend must not hardcode polling frequency.

---

# Queue Notifications

Critical Notifications

Booking Confirmed

Queue Started

Only 10 Patients Ahead

Only 5 Patients Ahead

Only 2 Patients Ahead

Now Serving Soon

Your Turn

Queue Paused

Queue Resumed

Queue Closed

Emergency Delay

---

# Queue Card

Contains

Queue Status

Token Number

Patients Ahead

ETA

Now Serving

Track Queue Button

---

# Live Queue Screen

Shows

Large Queue Summary

Queue Progress

Timeline

Queue Status

Refresh Status

Call Clinic

Directions

Share

---

# Queue Timeline

Current

```
Token Generated

↓

Waiting

↓

Ready Soon

↓

Now Serving

↓

Completed
```

Timeline updates automatically.

---

# Queue Synchronization

Backend

↓

Realtime Service

↓

Patient App

↓

UI Update

Frontend never generates queue events.

---

# Doctor Pause

Doctor pauses queue.

↓

Queue Status

Paused

↓

ETA hidden

↓

Patients notified

↓

Waiting resumes after restart

---

# Emergency Flow

```
Emergency Started

↓

Queue Frozen

↓

Notification Sent

↓

ETA Removed

↓

Doctor Resumes

↓

ETA Recalculated

↓

Queue Continues
```

---

# Queue Completion

Consultation finished.

↓

Token Completed.

↓

History Updated.

↓

Queue Removed from Active Screen.

↓

Booking moved to Completed.

---

# Multiple Devices

Patient logged into multiple devices.

Queue state must remain synchronized.

Latest backend state wins.

---

# Offline Behavior

Offline

↓

Last Queue Snapshot

↓

Offline Banner

↓

Reconnect

↓

Refresh Queue

Live queue never continues offline.

---

# Error Handling

Queue unavailable

↓

Retry

Server unavailable

↓

Retry

Doctor unavailable

↓

Return to Doctor Profile

---

# Edge Cases

## Doctor Ends Clinic Early

Queue closes.

Remaining patients notified.

---

## Doctor Becomes Unavailable

Emergency state activated.

Patients informed.

---

## Internet Lost

Cached queue displayed.

Realtime updates paused.

Reconnect refreshes queue.

---

## Queue Reset

Only backend allowed.

Frontend clears stale state.

---

## Queue Reordering

Not supported.

Patients cannot change order.

---

## Duplicate Tokens

Backend prevents duplicates.

Frontend displays existing booking.

---

# Security Rules

Patient cannot:

Modify token.

Modify ETA.

Modify queue position.

Modify status.

Queue information is read-only.

---

# Performance Rules

Only changed values update.

Avoid rebuilding entire queue screen.

Realtime updates should remain lightweight.

---

# Analytics

Track

Queue Opened

Queue Refreshed

Notification Opened

Queue Completed

Queue Paused

Queue Resumed

---

# Developer Rules

Developers must never:

Calculate ETA.

Create fake queue movement.

Hardcode refresh intervals.

Modify token order.

Generate queue events.

Ignore backend queue state.

Backend is always authoritative.

---

# Acceptance Criteria

Queue implementation is complete when:

✓ Queue state matches backend.

✓ Token lifecycle is respected.

✓ ETA remains informational.

✓ Queue updates smoothly.

✓ Offline behavior is predictable.

✓ Emergency handling works.

✓ No frontend queue calculations exist.

---

# Related Documents

10-Business-Rules.md

12-Search-System.md

17-Error-Handling.md

18-Offline-System.md

23-Developer-Guidelines.md

25-Design-Freeze-v1.0.md

---

End of Document