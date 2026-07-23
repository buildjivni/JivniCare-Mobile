# JivniCare Patient Mobile App
# Product Overview

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines what JivniCare is, why it exists, the problem it solves, who it serves, and the guiding principles behind the product.

It acts as the foundation for every design and engineering decision.

---

# Product Summary

JivniCare is a patient-first healthcare platform that enables users to discover doctors, book digital queue tokens, and monitor real-time clinic queues before visiting.

Unlike traditional appointment systems, JivniCare focuses on **Queue Intelligence**, not fixed appointment slots.

The platform helps patients minimize waiting time while helping clinics manage patient flow more efficiently.

---

# Problem Statement

Patients visiting outpatient clinics commonly face several issues:

- Long and unpredictable waiting times.
- No visibility into the current queue.
- Arriving too early and waiting unnecessarily.
- Difficulty discovering verified doctors.
- Limited information about clinic operations.
- Inefficient manual token systems.

Traditional appointment systems often fail because doctors cannot reliably adhere to strict time slots due to emergencies, variable consultation durations, walk-in patients, and operational delays.

---

# Solution

JivniCare replaces rigid appointment scheduling with a **Live Token Queue System**.

Patients receive a digital token instead of a fixed appointment time and can monitor:

- Current token being served.
- Their token position.
- Number of patients ahead.
- Estimated arrival window.
- Queue delays and pauses.

This allows patients to leave for the clinic at the appropriate time rather than waiting for hours.

---

# Product Vision

To become the most trusted patient-centric queue management platform by making healthcare visits more predictable, transparent, and stress-free.

---

# Product Mission

Reduce unnecessary waiting time while improving the patient experience through intelligent queue management and seamless digital healthcare interactions.

---

# Target Users

## Primary Users

- Individual patients.
- Family members booking for others.
- Returning patients.
- Elderly patients requiring a simple interface.

## Secondary Users

- Caregivers.
- Guardians.
- Family coordinators.

---

# Target Geography (V1)

Initial rollout:

- Jamui
- Deoghar

Expansion planned across Bihar before scaling nationally.

---

# Product Scope (Version 1)

Included:

- OTP Authentication
- Doctor Discovery
- Smart Search
- Doctor Profile
- Token Booking
- Live Queue Tracking
- Queue Notifications
- Saved Doctors
- Booking History
- Family Profiles
- Settings
- Help & Support

Excluded:

- Doctor App
- Reception App
- Admin Panel
- Online Consultation
- Pharmacy Ordering
- Lab Booking
- Payments
- Insurance

---

# Core Value Proposition

Patients should never have to wonder:

- "How many people are ahead of me?"
- "Should I leave now?"
- "Is the doctor running late?"

JivniCare answers these questions in real time.

---

# Product Pillars

## 1. Transparency

Users should always know:

- Queue status.
- Token progress.
- Clinic status.
- Estimated arrival window.

No hidden information.

---

## 2. Simplicity

Healthcare applications should be understandable for users of all ages.

Interfaces should require minimal learning.

---

## 3. Reliability

Displayed information must accurately reflect the clinic's current queue whenever possible.

---

## 4. Trust

Users should feel confident booking through verified clinics and doctors.

Trust indicators should be consistently visible throughout the application.

---

## 5. Speed

Every interaction should be optimized to reduce effort:

- Minimal taps.
- Fast search.
- Fast booking.
- Fast queue access.

---

# Product Philosophy

JivniCare is **not** an appointment booking application.

It is a **Queue Intelligence Platform**.

Everything in the product should reinforce this philosophy.

---

# Key Features

## Authentication

- Mobile OTP login.
- Secure session management.

---

## Doctor Discovery

Users can discover doctors using:

- Specialty
- Symptoms
- Disease
- Doctor Name
- Clinic Name
- Hospital Name
- Location

---

## Doctor Profile

Displays:

- Doctor information
- Qualifications
- Experience
- Specialization
- Clinic details
- Consultation fee (if applicable)
- Live queue summary

---

## Token Booking

Instead of selecting a time slot, patients receive a queue token.

Booking should require minimal input and be completed quickly.

---

## Live Queue

Displays:

- Now Serving
- Your Token
- Patients Ahead
- Estimated Arrival Window
- Queue Progress
- Queue Status

This is the primary differentiator of the product.

---

## Notifications

Real-time alerts for:

- Queue movement
- Token approaching
- Queue paused
- Booking confirmation
- Important updates

Notifications should always provide actionable information.

---

## Family Profiles

Users can manage multiple family members and choose who the booking is for during the booking process.

---

## Booking History

Patients should be able to review previous visits and bookings.

---

# User Goals

A patient should be able to:

1. Find a doctor.
2. Understand the doctor's availability.
3. Book a token.
4. Leave home at the right time.
5. Reach the clinic without unnecessary waiting.

---

# Business Goals

Version 1 aims to:

- Reduce patient waiting time.
- Improve patient satisfaction.
- Increase clinic operational efficiency.
- Build trust in digital queue management.
- Establish a scalable healthcare platform.

---

# Success Metrics

The product is successful if users can:

- Complete login easily.
- Find doctors quickly.
- Book tokens without confusion.
- Understand queue progress.
- Arrive closer to their consultation time.
- Navigate the app without assistance.

---

# Non-Goals (Version 1)

The following are intentionally excluded:

- AI diagnosis
- Medical consultation
- Emergency dispatch
- Pharmacy marketplace
- Laboratory booking
- Online payments
- Video consultation

These may be considered in future releases.

---

# Dependencies

The Patient App depends on:

- Backend APIs
- Queue Engine
- Notification Service
- Authentication Service
- Search Service
- Clinic Management System

---

# Design Constraints

- Mobile-first.
- Consistent design language.
- Accessibility compliant.
- Responsive across supported device sizes.
- Optimized for low and mid-range Android devices.
- Minimal cognitive load.

---

# Acceptance Criteria

This document is considered complete when:

- Product purpose is clearly defined.
- Scope is unambiguous.
- Core philosophy is established.
- Success metrics are documented.
- Product boundaries are clearly understood.

---

# Related Documents

- 00-README.md
- 02-Design-Principles.md
- 03-Information-Architecture.md
- 10-Business-Rules.md
- 11-Queue-System.md

---

End of Document