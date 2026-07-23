# JivniCare Patient Mobile App
# API Contracts

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines the API Contract between the Patient Mobile App and the Backend Services.

It establishes a stable communication standard so that:

- Frontend
- Backend
- Mobile App
- Web Portal
- Future Integrations

can evolve independently without breaking compatibility.

The backend is always the source of truth.

---

# API Design Principles

Every API must be:

- Stateless
- Versioned
- Predictable
- Secure
- Idempotent where required
- Consistent
- Backward Compatible

---

# Base URL

Example

```
https://api.jivnicare.com/api/v1
```

Rules

- Every endpoint starts with `/api/v1`
- Never expose internal service URLs
- Version must be part of the URL

---

# Resource Naming

Resources use plural nouns.

Examples

```
/doctors

/bookings

/queues

/users

/family-members

/notifications
```

Avoid verbs.

Good

```
GET /doctors
```

Bad

```
GET /getDoctors
```

---

# HTTP Methods

GET

Retrieve data

POST

Create

PUT

Replace

PATCH

Partial Update

DELETE

Delete resource

---

# Authentication

Protected APIs require authentication.

Header

```
Authorization

Bearer <access_token>
```

Missing token

↓

401 Unauthorized

---

# Request Headers

Standard headers

```
Authorization

Content-Type

Accept

Accept-Language

X-App-Version

X-Platform

X-Request-ID
```

---

# Content Type

Requests

```
application/json
```

Responses

```
application/json
```

Multipart only when uploading files.

---

# Response Structure

Every successful response follows the same format.

```
{
  "success": true,
  "message": "Booking created successfully.",
  "data": { },
  "meta": { }
}
```

---

# Error Response

Every error follows one structure.

```
{
  "success": false,
  "message": "Validation failed.",
  "error": {
      "code": "VALIDATION_ERROR",
      "details": []
  }
}
```

Never return inconsistent error formats.

---

# HTTP Status Codes

200

Success

201

Created

204

No Content

400

Bad Request

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

422

Validation Failed

429

Too Many Requests

500

Internal Server Error

503

Service Unavailable

---

# Pagination

Large collections must be paginated.

Request

```
?page=1

&pageSize=20
```

Response

```
meta

currentPage

pageSize

totalItems

totalPages

hasNext

hasPrevious
```

---

# Sorting

Standard format

```
?sort=experience

?order=asc
```

Supported

Ascending

Descending

---

# Filtering

Examples

```
?gender=female

?availability=open

?city=jamui

?specialty=dentist
```

Multiple filters allowed.

---

# Searching

Standard

```
?q=tooth pain
```

Backend performs:

- Intent Detection
- Synonym Resolution
- Typo Tolerance

Frontend only sends query.

---

# Date Format

All dates use

ISO-8601

Example

```
2026-07-21T12:30:00Z
```

Frontend handles formatting for display.

---

# Time Zone

Backend returns UTC.

Frontend converts to user's local timezone.

Never return localized timestamps from backend.

---

# Boolean Fields

Always

```
true

false
```

Never

```
1

0

Yes

No
```

---

# Null Handling

Nullable values return

```
null
```

Never

```
""

"null"

undefined
```

---

# Field Naming

Use camelCase.

Good

```
doctorName

queueStatus

estimatedArrival
```

Bad

```
Doctor_Name

doctor_name

DoctorName
```

---

# Resource IDs

Every resource has one immutable ID.

Examples

```
doctorId

bookingId

queueId

tokenId

userId
```

IDs never change.

---

# Validation Errors

Example

```
{
 "success": false,
 "message": "Validation failed.",
 "error": {
   "code": "VALIDATION_ERROR",
   "fields": [
      {
        "field":"mobileNumber",
        "message":"Invalid mobile number."
      }
   ]
 }
}
```

Allows frontend to show field-specific errors.

---

# Idempotency

Required for

Booking

Payment (Future)

Token Creation

Header

```
Idempotency-Key
```

Repeated request

↓

Return existing result

Never create duplicate bookings.

---

# Rate Limiting

Backend may limit requests.

Response

```
429 Too Many Requests
```

Optional headers

```
Retry-After
```

Frontend should respect server instructions.

---

# File Upload

Multipart only.

Supported future uploads

Profile Photo

Medical Documents

Prescriptions

Images

---

# API Versioning

Current

```
/api/v1
```

Future

```
/api/v2
```

Breaking changes require new version.

---

# Caching

May Cache

Doctor List

Specialties

Profile

Settings

Must Never Cache

Authentication

Queue

ETA

Booking Confirmation

Live Availability

---

# Retry Policy

Safe Retry

GET

Retry with exponential backoff.

Unsafe Retry

POST

Retry only when idempotency is supported.

---

# Timeout

Frontend timeout controlled centrally.

Never hardcode timeouts inside individual screens.

---

# Queue APIs

Backend owns

Queue Position

ETA

Now Serving

Queue Status

Frontend only displays.

---

# Booking APIs

Booking request

↓

Validation

↓

Booking Created

↓

Token Assigned

↓

Response Returned

Frontend waits for confirmation before updating UI.

---

# Search APIs

Frontend sends

```
q

filters

sort

pagination
```

Backend returns ranked results.

Frontend must not reorder.

---

# Notification APIs

Notification read status

↓

Backend Update

↓

Unread Count Refresh

---

# Error Handling

If API fails

↓

Show previous valid state

↓

Retry

↓

Recover

No silent failures.

---

# Security Rules

Frontend must never expose

Internal database IDs

Server stack traces

SQL errors

Authentication secrets

Private metadata

---

# Logging Rules

Log

Request ID

Response Time

Endpoint

Status Code

Never log

OTP

Access Token

Refresh Token

Personal health information

---

# Analytics

Track

API Success

API Failure

Retry Count

Timeout

Validation Error

Authentication Failure

---

# Backward Compatibility

Minor releases

↓

No breaking changes

Major releases

↓

New API version

---

# Developer Rules

Developers must never

Change response formats

Return inconsistent errors

Use different naming conventions

Calculate backend-owned values

Expose internal implementation details

Ignore API versioning

---

# Acceptance Criteria

API Contract implementation is complete when

✓ Every endpoint follows the same structure.

✓ Errors are standardized.

✓ Authentication is consistent.

✓ Pagination is identical everywhere.

✓ Validation responses are predictable.

✓ Backend remains the source of truth.

✓ Frontend contains no business logic.

---

# Related Documents

10-Business-Rules.md

11-Queue-System.md

12-Search-System.md

13-Authentication.md

16-State-Management.md

17-Error-Handling.md

22-Security.md

23-Developer-Guidelines.md

25-Design-Freeze-v1.0.md

---

End of Document