# JivniCare Patient Mobile App
# Authentication System

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines the complete Authentication System for the JivniCare Patient Mobile App.

Authentication must be:

- Secure
- Simple
- Fast
- Reliable

The authentication experience should require the minimum possible effort while maintaining strong security.

---

# Authentication Philosophy

JivniCare follows a **Mobile Number + OTP Authentication** model.

There are:

- No passwords
- No usernames
- No security questions

The user's verified mobile number becomes the primary identity.

---

# Authentication Goals

The authentication system must:

- Verify the user securely
- Create an authenticated session
- Restore sessions automatically
- Protect all private resources
- Minimize repeated logins

---

# Authentication Flow

```
Splash

↓

Check Session

↓

Session Valid?

↓

YES

↓

Home

↓

NO

↓

Login

↓

OTP

↓

Home
```

---

# Login Screen

## Purpose

Authenticate the patient using a verified mobile number.

## Components

- Mobile Number Input
- Country Code
- Continue Button

---

# Mobile Number Rules

Only valid mobile numbers are accepted.

Validation occurs:

- Client-side (basic format)
- Server-side (final verification)

Client validation never replaces backend validation.

---

# OTP Flow

```
Enter Mobile Number

↓

Request OTP

↓

Receive OTP

↓

Enter OTP

↓

Verify

↓

Session Created
```

---

# OTP Screen

## Components

- OTP Input
- Verify Button
- Resend OTP
- Countdown Timer

---

# OTP Rules

OTP:

- One-time use
- Time-limited
- Server verified

Frontend never validates OTP independently.

---

# OTP Auto Read

If supported by the operating system:

- Detect OTP automatically
- Autofill input
- Allow manual editing if needed

---

# OTP Expiry

Expired OTP

↓

Show message

↓

Allow Resend

Previous OTP becomes invalid immediately.

---

# Resend OTP

Rules

User must wait until the countdown completes.

Each resend generates a new OTP.

Old OTP becomes invalid.

---

# OTP Retry

Maximum retry attempts are controlled by the backend.

Frontend displays appropriate error messages.

---

# Successful Authentication

After successful verification:

Backend returns:

- Session
- Authentication Token
- User Profile
- Session Expiry

Frontend stores only the required authentication state.

---

# Session Lifecycle

```
Login

↓

Authenticated

↓

Session Active

↓

Token Refresh

↓

Logout

↓

Session Destroyed
```

---

# Session Validation

At application launch:

Splash Screen

↓

Validate Session

If valid:

↓

Go Home

If invalid:

↓

Login

---

# Session Expiry

If session expires during app usage:

User action

↓

Backend responds Unauthorized

↓

Redirect Login

↓

Authenticate

↓

Return to previous screen

User should not lose unfinished work whenever possible.

---

# Auto Login

Returning users should not log in repeatedly.

If a valid session exists:

Splash

↓

Home

No user interaction required.

---

# Logout Flow

```
More

↓

Logout

↓

Confirmation Dialog

↓

Logout

↓

Login Screen
```

---

# Logout Behavior

Logout must:

- Destroy session
- Clear authentication tokens
- Remove sensitive cached data
- Disconnect realtime services
- Return to Login

---

# Route Protection

Protected Screens

- Home
- Search
- Doctor Profile
- Bookings
- Queue
- Notifications
- Saved Doctors
- Family Members
- Profile
- Settings

Unauthenticated users cannot access these routes.

---

# Authentication Guard

Before entering protected routes:

```
Session Valid?

↓

YES

↓

Continue

↓

NO

↓

Login

↓

Resume Navigation
```

---

# Resume Flow

Example

```
User opens Doctor Link

↓

Session Expired

↓

Login

↓

OTP

↓

Doctor Profile
```

The intended destination must be preserved.

---

# Device Support

Users may sign in on multiple devices.

Backend controls:

- Session validity
- Device authorization
- Concurrent sessions

Frontend displays only the current authenticated state.

---

# Authentication Errors

Examples

Invalid OTP

Expired OTP

Network Error

Server Error

Too Many Attempts

Every error must provide a recovery action.

---

# Offline Authentication

Offline login is not supported.

Authentication always requires network connectivity.

If offline:

Display:

Offline Banner

Retry

---

# Deep Link Authentication

Incoming protected link

↓

Session Check

↓

Authenticated

↓

Destination

OR

↓

Login

↓

OTP

↓

Destination

---

# Security Rules

Frontend must never:

Store OTP

Store authentication secrets in plain text

Trust client validation

Expose backend tokens

Display internal error details

---

# Privacy Rules

Sensitive information must be protected.

Mask mobile number where appropriate.

Example

```
+91 XXXXXXX123
```

Do not expose:

Session Tokens

Refresh Tokens

Internal User IDs

---

# Token Refresh

Session renewal is handled automatically.

Users should not notice background refresh.

If refresh fails:

↓

Login Required

---

# Authentication States

Unauthenticated

↓

Authenticating

↓

Authenticated

↓

Refreshing

↓

Expired

↓

Logged Out

All states must be handled.

---

# Analytics

Track

Login Started

OTP Requested

OTP Verified

OTP Failed

Session Restored

Logout

Session Expired

Do not log:

OTP

Session Tokens

Phone Number

Authentication Secrets

---

# Accessibility

Support:

Screen Readers

Dynamic Text

Keyboard Navigation

Accessible Error Messages

Visible Focus Indicators

---

# Developer Rules

Developers must never:

Implement password login

Skip OTP verification

Store sensitive authentication data insecurely

Bypass authentication guards

Trust client-side validation

Authentication decisions always belong to the backend.

---

# Acceptance Criteria

Authentication implementation is complete when:

✓ Mobile login works.

✓ OTP verification succeeds.

✓ Sessions restore automatically.

✓ Expired sessions redirect correctly.

✓ Protected routes remain secure.

✓ Logout removes all sensitive data.

✓ No sensitive authentication information is exposed.

---

# Related Documents

04-Navigation-System.md

05-User-Flows.md

10-Business-Rules.md

17-Error-Handling.md

18-Offline-System.md

23-Developer-Guidelines.md

25-Design-Freeze-v1.0.md

---

End of Documents