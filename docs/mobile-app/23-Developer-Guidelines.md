# JivniCare Patient Mobile App
# Developer Guidelines

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines the mandatory engineering standards for developing the JivniCare Patient Mobile App.

It ensures that every contributor—whether human or AI-assisted—produces code that is:

- Consistent
- Maintainable
- Secure
- Testable
- Scalable
- Production Ready

These guidelines apply to every feature, screen, component, and API integration.

---

# Engineering Principles

Every implementation must follow:

- Single Responsibility Principle (SRP)
- Separation of Concerns (SoC)
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- YAGNI (You Aren't Gonna Need It)
- Composition over Inheritance
- Backend as Source of Truth

---

# Project Structure

Recommended structure

```
src/

├── app/
├── navigation/
├── screens/
├── components/
│
├── features/
│     ├── auth/
│     ├── booking/
│     ├── queue/
│     ├── search/
│     ├── profile/
│     └── notifications/
│
├── services/
├── api/
├── store/
├── hooks/
├── utils/
├── constants/
├── theme/
├── assets/
├── types/
└── tests/
```

Each folder has one clear responsibility.

---

# Feature Structure

Each feature should contain

```
feature/

├── components/
├── hooks/
├── services/
├── screens/
├── types/
├── constants/
└── tests/
```

Avoid cross-feature dependencies unless explicitly shared.

---

# Naming Conventions

Components

```
DoctorCard
```

Hooks

```
useQueue()

useSearch()
```

Services

```
BookingService
```

Stores

```
queueStore
```

Files

```
doctor-card.tsx

queue-service.ts
```

Constants

```
MAX_BOOKINGS

API_TIMEOUT
```

Use consistent PascalCase, camelCase, and kebab-case according to project conventions.

---

# Code Style

Code should be:

Readable

Small

Focused

Self-explanatory

Avoid unnecessary comments.

Prefer expressive names over comments.

---

# Functions

Functions should:

Do one thing

Be easy to test

Avoid side effects

Return predictable results

Prefer small functions over large ones.

---

# Components

Components should:

Be reusable

Remain focused

Receive data through props or state

Avoid business logic where possible

Separate UI from business logic.

---

# State Management

Business state belongs in centralized stores.

UI state belongs inside components when appropriate.

Never duplicate business state.

Refer to:

16-State-Management.md

---

# API Layer

All API communication must go through the centralized API layer.

Components must never call HTTP clients directly.

---

# Services

Business logic belongs inside services.

Examples

BookingService

QueueService

AuthService

SearchService

Services should remain framework-independent whenever practical.

---

# Error Handling

Errors must:

Be handled gracefully

Provide recovery options

Avoid exposing technical details

Refer to:

17-Error-Handling.md

---

# Offline Behavior

Offline logic must follow:

18-Offline-Strategy.md

Developers must never invent offline behavior outside documented rules.

---

# Security

All security implementation must follow:

22-Security.md

Security rules override implementation convenience.

---

# Accessibility

Every new component must satisfy:

19-Accessibility.md

Accessibility reviews are mandatory.

---

# Performance

Every feature should consider:

Rendering efficiency

Memory usage

Network usage

Battery impact

Refer to:

21-Performance.md

---

# Reusability

Before creating a new component

↓

Search existing components

↓

Reuse if suitable

↓

Create only if necessary

Avoid duplicate UI components.

---

# Styling

Use only approved design tokens.

Never hardcode:

Colors

Spacing

Typography

Radius

Shadows

Refer to:

08-Design-Tokens.md

---

# Navigation

Navigation must follow:

04-Navigation-System.md

Never create undocumented routes.

---

# Business Rules

Business decisions must come only from:

10-Business-Rules.md

Developers must not invent healthcare logic.

---

# Logging

Allowed

Warnings

Recoverable Errors

Development Diagnostics

Never log:

Tokens

OTP

Sensitive User Information

Health Data

---

# Environment Configuration

Separate environments:

Development

Testing

Staging

Production

Never hardcode environment-specific values.

---

# Dependency Management

Before adding a dependency:

Evaluate necessity

Review maintenance status

Review security

Review bundle size

Prefer existing platform capabilities where appropriate.

---

# Code Reviews

Every pull request should verify:

Architecture

Naming

Security

Accessibility

Performance

Testing

Documentation

No PR should be merged without review.

---

# Git Workflow

Recommended branches

```
main

develop

feature/*

bugfix/*

hotfix/*
```

Use short-lived feature branches.

---

# Commit Messages

Recommended format

```
feat:

fix:

refactor:

docs:

test:

perf:

chore:

style:
```

Examples

```
feat: add doctor booking flow

fix: prevent duplicate queue refresh

docs: update booking architecture
```

---

# Testing Requirements

Every feature should include:

Unit Tests

Integration Tests

UI Tests (where appropriate)

Critical healthcare workflows require additional validation.

---

# Manual Testing Checklist

Verify

Authentication

Search

Booking

Queue

Notifications

Offline

Accessibility

Performance

Security

Regression

---

# Documentation

Every major feature must include:

Architecture updates

API changes

Business rule changes

Developer notes (if needed)

Documentation must remain synchronized with implementation.

---

# Code Quality

Run before merge:

Formatter

Linter

Type Checking

Unit Tests

Security Checks

Build Verification

No known critical issues should remain unresolved.

---

# Definition of Done (DoD)

A task is complete only when:

✓ Feature implemented.

✓ Design matches approved specification.

✓ Tests pass.

✓ Documentation updated.

✓ Accessibility verified.

✓ Performance reviewed.

✓ Security reviewed.

✓ Code reviewed.

✓ Build succeeds.

✓ No critical defects remain.

---

# AI-Assisted Development

AI tools may assist development, but developers remain responsible for:

Correctness

Security

Architecture

Compliance

All AI-generated code must be reviewed before merging.

---

# Release Readiness Checklist

Before release:

✓ No blocking defects.

✓ Performance goals met.

✓ Security validation completed.

✓ Accessibility review completed.

✓ Analytics events verified.

✓ Offline behavior verified.

✓ Documentation synchronized.

✓ Version updated.

---

# Developer Rules

Developers must never:

Bypass architecture.

Duplicate business logic.

Hardcode configuration.

Ignore design tokens.

Merge failing tests.

Commit secrets.

Introduce undocumented behavior.

Modify healthcare rules without specification updates.

---

# Acceptance Criteria

Developer Guidelines are successfully adopted when:

✓ Project structure remains consistent.

✓ Coding standards are followed.

✓ Documentation stays current.

✓ Architecture is preserved.

✓ Code reviews enforce standards.

✓ Releases remain stable and maintainable.

---

# Related Documents

02-Design-Principles.md

04-Navigation-System.md

07-Component-System.md

08-Design-Tokens.md

10-Business-Rules.md

15-API-Contracts.md

16-State-Management.md

17-Error-Handling.md

18-Offline-Strategy.md

19-Accessibility.md

20-Analytics.md

21-Performance.md

22-Security.md

24-Implementation-Roadmap.md

25-Design-Freeze-v1.0.md

---

End of Document