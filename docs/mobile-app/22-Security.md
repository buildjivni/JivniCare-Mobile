# JivniCare Patient Mobile App
# Security

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines the Security Architecture for the JivniCare Patient Mobile App.

The objective is to protect:

- Patient Identity
- Personal Information
- Authentication Sessions
- Healthcare Data
- API Communication
- Device Storage

Security must be built into every layer of the application and must never be treated as an afterthought.

---

# Security Principles

The application follows these core principles:

- Security by Design
- Least Privilege
- Zero Trust
- Defense in Depth
- Secure by Default
- Privacy by Default

Backend remains the authoritative source for all sensitive operations.

---

# Threat Model

Primary threats include:

- Unauthorized Access
- Session Hijacking
- Token Theft
- Device Loss
- API Abuse
- Data Tampering
- Replay Attacks
- Reverse Engineering
- Man-in-the-Middle (MITM) Attacks

The application must implement appropriate mitigations for each.

---

# Authentication Security

Authentication uses:

- Mobile Number
- OTP Verification
- Secure Backend Session

Authentication must always be verified by the backend.

The mobile application never determines authentication validity independently.

---

# Authorization

Authorization is role-based.

Patient application permissions include:

- View Own Profile
- Manage Family Members
- Book Appointments
- View Own Bookings
- Track Own Queue

Patients must never access data belonging to other users.

---

# Session Management

After successful login:

↓

Backend creates authenticated session

↓

Client stores session credentials securely

↓

Backend validates session on every protected request

Expired sessions require re-authentication.

---

# Session Expiration

Session may expire because of:

- Logout
- Server Expiration
- Security Revocation
- Device Change (if implemented)
- Administrative Action

When expired:

↓

Clear secure session

↓

Redirect Login

↓

Resume previous flow where appropriate

---

# Token Handling

Authentication tokens:

- Must be short-lived where practical
- Must never be logged
- Must never appear in URLs
- Must only be transmitted over encrypted connections

Token refresh strategy is managed by backend APIs.

---

# Secure Storage

Sensitive information must use secure platform storage.

Examples:

Android

- Android Keystore

iOS

- Keychain

Never store sensitive credentials in plain local storage.

---

# Never Store

Never persist:

OTP

Access Tokens (outside secure storage)

Refresh Tokens (outside secure storage)

Passwords

Private Keys

Session Secrets

Medical Records unless explicitly required and protected

---

# Data Encryption

Data in Transit

↓

TLS 1.2 or higher (prefer TLS 1.3)

Data at Rest

↓

Platform secure storage where applicable

Sensitive backend data must also be encrypted according to backend policies.

---

# API Security

Every protected request requires:

- Authentication
- Authorization
- HTTPS
- Server-side validation

Client-side validation improves UX but never replaces backend validation.

---

# Certificate Validation

The application must validate server certificates.

Invalid or expired certificates must result in failed connections.

Future enhancement:

Certificate Pinning may be implemented for additional protection.

---

# Input Validation

All user input must be validated for:

- Length
- Format
- Allowed Characters
- Required Fields

Backend remains responsible for final validation.

---

# Output Handling

Never trust API responses blindly.

Validate:

- Required fields
- Data types
- Enum values
- Null handling

Gracefully reject malformed responses.

---

# Sensitive Screens

Examples:

OTP Verification

Profile

Family Members

Bookings

These screens must avoid exposing sensitive information through screenshots where platform capabilities permit.

---

# Clipboard Usage

Sensitive values such as OTPs or tokens must not be copied to the clipboard automatically.

If future copy functionality is introduced, it should exclude security-sensitive information.

---

# Logging

Allowed

Request ID

Timestamp

HTTP Status

Screen Name

Feature

Error Code

Never Log

OTP

Tokens

Authorization Headers

Personal Health Information

Sensitive Personal Data

---

# Analytics Security

Analytics events must exclude:

Authentication credentials

Medical details

Prescription information

Exact sensitive search queries

Personally identifiable health information

---

# Device Security

Detect and respond appropriately to:

- Unsupported operating systems
- Security policy violations (future)
- Device integrity signals (future, if implemented)

Core healthcare functionality should remain secure even on compromised environments, subject to backend risk policies.

---

# Rooted / Jailbroken Devices

Future enhancement:

Application may detect rooted or jailbroken devices and apply additional security controls or warnings.

Current implementation should be designed to support this capability without assuming enforcement.

---

# Reverse Engineering Protection

Release builds should:

- Remove debug information where appropriate
- Obfuscate production code
- Disable debugging features
- Protect sensitive configuration

---

# Secrets Management

API keys and secrets:

- Never hardcoded in source code
- Never committed to version control
- Loaded securely through approved configuration mechanisms

The mobile app must not contain backend secrets.

---

# Deep Link Security

Incoming deep links must be validated.

Reject:

- Invalid routes
- Malformed parameters
- Unauthorized destinations

Protected screens require authentication.

---

# Notification Security

Push notifications should avoid exposing sensitive medical information on the lock screen.

Examples

Good

```
You have an update regarding your appointment.
```

Avoid

```
Your medical condition report is ready.
```

Actual visibility depends on user device notification settings.

---

# Offline Security

Sensitive cached information must:

- Respect secure storage policies
- Be removed during logout
- Follow data retention rules

Live queue data must never be stored as authoritative offline data.

---

# Network Security

All communication must use:

HTTPS

TLS

Server authentication

Reject insecure HTTP communication.

---

# Error Security

Error messages must never expose:

Database structure

API internals

Stack traces

Internal identifiers

Infrastructure details

Users should receive only safe, actionable messages.

---

# Privacy

Collect only data necessary to provide the service.

Follow applicable privacy regulations and organizational data governance policies.

Users should be informed about data collection through the application's privacy policy.

---

# Audit Logging

Backend should maintain audit records for critical actions such as:

Login

Logout

Booking Created

Booking Cancelled

Profile Updated

Family Member Modified

Mobile application should provide required context while avoiding sensitive logging.

---

# Security Testing

Every release should include:

Authentication Testing

Authorization Testing

API Security Testing

Session Management Testing

Secure Storage Verification

Encryption Verification

Input Validation Testing

Penetration Testing (as appropriate)

Dependency Vulnerability Scanning

---

# OWASP Mobile Alignment

The implementation should align with current OWASP Mobile Application Security guidance, including protection against:

- Insecure Authentication
- Insecure Authorization
- Insecure Communication
- Insecure Data Storage
- Code Tampering
- Reverse Engineering
- Sensitive Data Exposure

---

# Incident Response

If suspicious activity is detected:

↓

Invalidate session

↓

Require re-authentication

↓

Log security event

↓

Follow backend incident response procedures

---

# Developer Rules

Developers must never:

Hardcode secrets.

Log authentication credentials.

Store tokens in insecure storage.

Trust client-side validation.

Bypass HTTPS.

Expose sensitive information through analytics.

Disable security protections in production builds.

---

# Acceptance Criteria

Security implementation is complete when:

✓ All protected APIs require authentication.

✓ Sensitive data uses secure storage.

✓ HTTPS is enforced.

✓ Tokens are handled securely.

✓ Sensitive information is never logged.

✓ Input and output are validated.

✓ Security testing passes before release.

✓ Implementation aligns with approved security requirements.

---

# Related Documents

13-Authentication.md

15-API-Contracts.md

16-State-Management.md

17-Error-Handling.md

18-Offline-Strategy.md

20-Analytics.md

21-Performance.md

23-Developer-Guidelines.md

25-Design-Freeze-v1.0.md

---

End of Document