# JivniCare Patient Mobile App
# Business Rules

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines all product-level business rules for the JivniCare Patient Mobile App.

Business Rules define how the application behaves regardless of UI implementation.

UI may change.

Business Rules must never change without updating this document.

---

# Business Rule Hierarchy

Business Rules

↓

Feature Rules

↓

Screen Rules

↓

Component Rules

↓

Validation Rules

---

# Core Product Rule

JivniCare is a **Queue-Based Appointment Platform**.

It is **NOT** a Time Slot Booking Platform.

Users receive Queue Tokens.

Doctors manage live consultation queues.

---

# Doctor Availability

A doctor may have one of the following states.

## Available

Queue is accepting new tokens.

Booking allowed.

---

## Busy

Queue is active.

Waiting time is high.

Booking allowed.

---

## Paused

Queue temporarily paused.

New bookings disabled.

Existing patients continue tracking.

---

## Closed

Consultation closed.

Booking disabled.

---

## Emergency

Doctor unavailable due to emergency.

Booking disabled.

Queue may stop updating.

---

# Queue Rules

Each doctor has only one active consultation queue.

A patient can only hold one active token for the same doctor.

Queue order is determined by clinic operations.

Patients cannot manually change queue position.

---

# Token Rules

Every successful booking generates:

- Unique Token Number
- Booking ID
- Queue Position
- Booking Timestamp

Token numbers must remain immutable.

---

# Booking Rules

Booking is allowed only when:

- Doctor is available
- Queue accepts new patients
- Patient is authenticated

Otherwise booking must be rejected.

---

# Booking Restrictions

Users cannot:

Book past consultations.

Select consultation time.

Modify token number.

Manually change queue.

---

# Duplicate Booking Rule

Users cannot create duplicate active bookings for:

Same Doctor

Same Family Member

Same Active Queue

If attempted:

Display existing booking.

---

# Family Member Rules

Booking requires exactly one patient.

Patient may be:

Self

or

One Family Member

Only one patient per booking.

---

# Queue Position Rules

Queue position updates automatically.

Patient cannot refresh position manually faster than system policy.

Queue updates come from backend.

Frontend never calculates queue order.

---

# ETA Rules

Estimated Arrival Time is an estimate only.

It is calculated using backend algorithms.

Frontend displays only.

Users must never be told that ETA is guaranteed.

---

# Queue Update Rules

Queue updates include:

Now Serving

Patients Ahead

Estimated Arrival

Queue Status

Last Updated

Only changed values should update.

---

# Notification Rules

Critical notifications:

Queue Nearly Ready

Your Turn

Queue Paused

Queue Closed

Booking Confirmed

Informational notifications:

Doctor Joined

Feature Updates

Announcements

Marketing notifications require user consent.

---

# Search Rules

Search supports:

Doctor

Clinic

Hospital

Specialty

Symptom

Disease

Location

Search is case-insensitive.

Search supports partial matches.

---

# Doctor Listing Rules

Doctor cards are sorted according to backend ranking.

Frontend must not invent ranking logic.

Sorting options exposed to users:

Distance

Experience

Fee

Availability

Rating (if supported)

---

# Saved Doctor Rules

Users may save unlimited doctors unless future product limits are introduced.

Saving a doctor does not create a booking.

Removing a doctor does not affect booking history.

---

# Booking History Rules

Completed bookings remain read-only.

Users cannot edit historical records.

Users cannot delete completed bookings.

---

# Profile Rules

Users may update:

Name

Profile Photo

Preferred Language

Notification Preferences

Users may not update:

Verified Mobile Number (without verification flow)

Booking History

Queue History

---

# Authentication Rules

All protected features require login.

Protected features include:

Bookings

Queue

Saved Doctors

Profile

Family Members

Notifications

If authentication expires:

Redirect to Login

Resume intended action after successful authentication.

---

# Offline Rules

Available Offline:

Profile (cached)

Saved Doctors (cached)

Recent Bookings (cached)

Family Members (cached)

Unavailable Offline:

Booking

Queue Tracking

Search

Live Availability

Show clear offline message.

---

# Error Handling Rules

Every failed operation must provide:

Reason

Recovery Action

Retry option (where applicable)

No silent failures.

---

# Permission Rules

Location

Optional but recommended.

Notification

Recommended.

Camera

Future feature.

Microphone

Only for voice search.

Never request unnecessary permissions.

---

# Analytics Rules

Track:

App Launch

Login

Search

Doctor Viewed

Doctor Saved

Booking Started

Booking Completed

Queue Viewed

Notification Opened

Profile Updated

No personally sensitive information should be logged.

---

# Privacy Rules

Mask sensitive personal information where appropriate.

Do not expose:

OTP

Authentication Tokens

Internal IDs

Backend implementation details

---

# Security Rules

Frontend must never trust client-side validation alone.

All critical actions require backend verification.

Business decisions must originate from backend.

---

# Future Compatibility Rules

Business Rules should support future features without breaking existing behavior.

Examples:

Video Consultation

Hospital Chains

Multiple Clinics

Digital Prescriptions

Payments

Lab Booking

These features must extend existing rules rather than replacing them.

---

# Non-Goals

The Patient App does NOT:

Manage doctor schedules.

Control clinic workflow.

Reorder queue.

Predict guaranteed consultation time.

Allow manual queue editing.

Replace clinic staff decisions.

---

# Developer Rules

Developers must never:

Implement undocumented business logic.

Hardcode queue behavior.

Calculate ETA on frontend.

Create alternate booking workflows.

Assume backend responses.

Business Rules override implementation convenience.

---

# Acceptance Criteria

Business Rule implementation is complete when:

- All booking decisions follow documented rules.
- Queue behavior is consistent.
- Duplicate bookings are prevented.
- Authentication is enforced.
- Frontend never makes business decisions.
- User experience remains predictable.

---

# Related Documents

06-Screen-Specifications.md

11-Queue-System.md

13-Authentication.md

17-Error-Handling.md

23-Developer-Guidelines.md

25-Design-Freeze-v1.0.md

---

End of Document