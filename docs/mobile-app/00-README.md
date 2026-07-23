# JivniCare Patient Mobile App
## Master Design Documentation

**Version:** 1.0.0

**Status:** Design Freeze (In Progress)

**Document Type:** Master Documentation

**Target Platform**
- Android
- iOS

---

# Purpose

This documentation serves as the **single source of truth** for the JivniCare Patient Mobile App.

Every design decision, UX rule, business rule, screen specification, interaction, component, and implementation guideline is documented here so that developers, designers, QA engineers, and AI coding assistants (Cursor, Claude Code, GitHub Copilot, etc.) can build the application without making assumptions.

No implementation should introduce features, UI, or workflows that are not defined in these documents.

---

# Project Goal

JivniCare is a healthcare platform focused on reducing unnecessary waiting time in clinics through a **Token-Based Live Queue Management System**.

Unlike traditional appointment systems, JivniCare does **not** rely on fixed appointment time slots.

Instead, patients receive a queue token and can monitor the clinic's live queue before leaving home.

Core objective:

> Right Patient
>
> Right Doctor
>
> Right Time

---

# Product Vision

The application should feel:

- Premium
- Modern
- Fast
- Clean
- Trustworthy
- Healthcare focused
- Easy for every age group
- Minimal learning curve

Every screen should provide clarity instead of complexity.

---

# Design Philosophy

The application follows one unified design language.

All screens must maintain consistency in:

- Colors
- Typography
- Components
- Motion
- Icons
- Buttons
- Cards
- Navigation
- Shadows
- Border Radius
- Spacing

No screen should look like it belongs to a different application.

---

# Product Scope (Version 1)

Included

- Authentication
- Home
- Doctor Discovery
- Search
- Doctor Profile
- Token Booking
- Live Queue
- Notifications
- Family Members
- Saved Doctors
- Booking History
- Profile
- Help
- Settings

Excluded

- Doctor App
- Reception App
- Admin Dashboard
- Online Video Consultation
- Payments
- Lab Booking
- Pharmacy Ordering

Future versions will cover these modules separately.

---

# Target Users

Primary

- Patients

Secondary

- Family members booking on behalf of patients

---

# Core Principle

This application is **NOT** an appointment booking system.

This application is a:

**Live Queue + Token Booking Platform**

Everything in the product should support this philosophy.

---

# UX Principles

The application should always:

- Reduce confusion
- Reduce waiting time
- Reduce unnecessary taps
- Reduce cognitive load

Increase:

- Trust
- Visibility
- Predictability
- Accessibility
- Simplicity

---

# Primary Navigation

The application follows a bottom navigation architecture.

Main sections:

- Home
- Bookings
- My Queue
- More

Search remains available in the header where applicable.

---

# Documentation Structure

This documentation is divided into multiple modules.

01 Product Overview

02 Design Principles

03 Information Architecture

04 Navigation System

05 User Flows

06 Screen Specifications

07 Component System

08 Design Tokens

09 Motion System

10 Business Rules

11 Queue System

12 Search System

13 Authentication

14 Notifications

15 API Contracts

16 State Management

17 Error Handling

18 Offline Strategy

19 Accessibility

20 Analytics

21 Performance

22 Security

23 Developer Guidelines

24 Implementation Roadmap

25 Design Freeze

---

# Rules For Developers

Developers must never:

- Invent new UI
- Add undocumented screens
- Introduce new colors
- Modify navigation
- Change business logic
- Create custom components when reusable components exist

Whenever documentation conflicts with implementation, documentation takes priority.

---

# Rules For Designers

Designers must:

- Use design tokens only
- Use approved component library
- Follow spacing system
- Follow typography system
- Maintain consistency across all screens

No visual experimentation is allowed during implementation.

---

# Rules For AI Coding Assistants

If an AI assistant (Cursor, Claude Code, GitHub Copilot, etc.) is used:

It must:

- Read this documentation before implementation.
- Follow every business rule.
- Never guess missing functionality.
- Never invent UX.
- Never modify workflows without explicit documentation.
- Reuse existing components whenever possible.
- Keep implementation aligned with this documentation.

If any requirement is unclear, implementation should stop and request clarification instead of making assumptions.

---

# Design Freeze Policy

Implementation begins only after:

- Documentation completed
- Design reviewed
- Design approved
- Design Freeze declared

No major UX changes are allowed after Design Freeze without updating the documentation first.

---

# Success Criteria

The application is considered successful when:

- Patients can quickly find doctors.
- Token booking is simple.
- Live queue tracking is accurate and understandable.
- Users know the right time to leave for the clinic.
- The UI remains consistent across the entire application.
- Developers can implement the product without making assumptions.

---

End of Document