# JivniCare Patient Mobile App
# Search System

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines the complete Search & Discovery System of the JivniCare Patient Mobile App.

Search is one of the primary entry points into the application.

The objective is to help patients find the right healthcare provider with the fewest possible interactions.

---

# Search Philosophy

Patients often do not know:

- Which doctor they need
- Which specialty to choose
- Which hospital to visit

Therefore, JivniCare Search must understand user intent rather than requiring exact medical terminology.

Search should reduce confusion, not increase it.

---

# Search Objectives

The Search System must enable users to search by:

- Doctor Name
- Clinic Name
- Hospital Name
- Specialty
- Symptoms
- Diseases
- Medical Services
- Location

The user should never need to know the exact wording.

---

# Search Entry Points

Search is accessible from:

Home Header

Doctor Listing

Empty States

Recent Searches

Deep Links (Future)

Voice Search (Future)

Search always opens as a dedicated full-screen experience.

---

# Search Architecture

```
User Input

↓

Normalization

↓

Intent Detection

↓

Backend Search

↓

Ranking

↓

Results

↓

Doctor Profile
```

The frontend submits the query and renders the ranked results returned by the backend.

---

# Supported Search Types

## Doctor Name

Examples

```
Dr Amit Kumar

Dr Sharma
```

---

## Specialty

Examples

```
Cardiologist

Dentist

Dermatologist

Orthopedic
```

---

## Hospital

Examples

```
ABC Hospital

City Hospital
```

---

## Clinic

Examples

```
Health Care Clinic

Smile Dental
```

---

## Symptoms

Examples

```
Tooth Pain

Headache

Fever

Back Pain

Skin Rash

Chest Pain
```

---

## Diseases

Examples

```
Diabetes

Hypertension

Migraine

Asthma
```

---

## Location

Examples

```
Jamui

Deoghar

Near Me

Patna
```

---

# Search Flow

```
Home

↓

Tap Search

↓

Search Screen

↓

Suggestions

↓

Results

↓

Doctor Profile
```

---

# Search Input Behavior

Supports:

Partial Match

Case Insensitive

Multiple Words

Whitespace Normalization

Typo Tolerance (Backend)

Synonyms (Backend)

Frontend should never implement search logic.

---

# Search Suggestions

Suggestions appear before search execution.

Categories

Recent Searches

Popular Searches

Trending Specialties

Popular Symptoms

Nearby Clinics

Suggested Doctors

---

# Recent Searches

Store the latest searches locally.

Maximum entries configurable by backend or application settings.

Users may:

Clear Individual Search

Clear All

---

# Search History Rules

History stores only:

Search Text

Timestamp

Sensitive health data must not be stored.

---

# Empty Search State

If the search field is empty, display:

Recent Searches

Popular Specialties

Trending Doctors

Nearby Clinics

Common Symptoms

Never show a blank screen.

---

# Search Result Categories

Results may contain:

Doctors

Clinics

Hospitals

Specialties

Locations

The backend determines the result grouping.

---

# Doctor Result Card

Displays:

Doctor Photo

Doctor Name

Specialty

Clinic

Experience

Consultation Fee

Queue Status

Verified Badge

Book Token CTA

Doctor Cards must reuse the standard Doctor Card component.

---

# Search Ranking

Ranking is determined entirely by backend.

Possible ranking signals include:

Relevance

Availability

Distance

Verification

Experience

Rating (if supported)

Popularity (future)

Frontend must never reorder results.

---

# Filters

Supported Filters

Availability

Distance

Consultation Fee

Gender

Experience

Language (Future)

Hospital

Specialty

---

# Sorting

Supported Sort Options

Relevance

Nearest

Experience

Consultation Fee

Availability

Backend performs sorting.

---

# Search States

Searching

↓

Loading

↓

Results

↓

No Results

↓

Error

All states must be implemented.

---

# No Results State

Display:

Illustration

Helpful Message

Suggested Searches

Popular Specialties

Return Home CTA

Never show an empty list without guidance.

---

# Voice Search

Future Feature.

Flow

```
Voice

↓

Speech Recognition

↓

Search Query

↓

Results
```

Voice Search follows the same backend search pipeline.

---

# Symptom Search

Examples

```
Tooth Pain

↓

Dentist

Fever

↓

General Physician

Skin Allergy

↓

Dermatologist
```

Symptom mapping is maintained by the backend.

Frontend displays recommendations only.

---

# Location Search

Supported Examples

Near Me

Jamui

Patna

Deoghar

Clinic Area

Backend resolves location relevance.

---

# Search Performance

Results should begin loading immediately after query submission.

Search must remain responsive even for large datasets.

Avoid blocking the UI.

---

# Offline Behavior

Offline Search

Not Supported

Display:

Offline Banner

Retry

Search requires internet connectivity.

---

# Error Handling

Network Error

↓

Retry

Server Error

↓

Retry

Unknown Error

↓

Return Home

Every error state must provide recovery.

---

# Analytics

Track

Search Opened

Query Submitted

Suggestion Selected

Filter Applied

Sort Changed

Doctor Opened

Booking Started

No Result Search

Search Cleared

Do not log sensitive health information.

---

# Accessibility

Search Field

48dp minimum touch target

Supports screen readers

Supports dynamic text

Clear button accessible

Voice Search accessible (future)

---

# Security Rules

Frontend must not expose:

Internal search ranking

Backend scoring

Private doctor metadata

Search APIs

Search responses must be treated as read-only.

---

# Developer Rules

Developers must never:

Implement client-side ranking

Implement client-side doctor filtering beyond UI selection

Reorder backend results

Cache sensitive search results

Hardcode search suggestions

Business logic belongs to backend.

---

# Acceptance Criteria

Search implementation is complete when:

✓ Users can search by all supported categories.

✓ Suggestions appear before search.

✓ Results follow backend ranking.

✓ Filters work consistently.

✓ Empty states guide users.

✓ Search remains performant.

✓ No frontend search logic exists.

---

# Related Documents

06-Screen-Specifications.md

07-Component-System.md

10-Business-Rules.md

13-Authentication.md

23-Developer-Guidelines.md

25-Design-Freeze-v1.0.md

---

End of Document