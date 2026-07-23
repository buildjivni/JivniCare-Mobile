# JivniCare Patient Mobile App
# Design Tokens

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines the global Design Token System for the JivniCare Patient Mobile App.

All UI must use these tokens.

Hardcoded values are prohibited.

Every screen, component and interaction must reference these tokens.

---

# Design Token Hierarchy

Foundation

↓

Color

↓

Typography

↓

Spacing

↓

Radius

↓

Elevation

↓

Iconography

↓

Motion

↓

Opacity

↓

Z-Index

---

# Color System

## Brand

Primary

Primary Light

Primary Dark

Primary Surface

Primary Container

---

## Secondary

Secondary

Secondary Light

Secondary Surface

---

## Neutral

Background

Surface

Card

Border

Divider

Overlay

Disabled Background

---

## Text

Primary Text

Secondary Text

Muted Text

Placeholder

Disabled Text

Inverse Text

---

## Semantic Colors

Success

Success Surface

Warning

Warning Surface

Error

Error Surface

Information

Information Surface

---

## Queue Colors

Queue Open

Queue Busy

Queue Paused

Queue Closed

Queue Emergency

These colors are reserved exclusively for queue status.

---

# Typography

One font family throughout the application.

Hierarchy

Display

↓

H1

↓

H2

↓

H3

↓

Title

↓

Subtitle

↓

Body Large

↓

Body

↓

Caption

↓

Label

↓

Button

Rules

Maximum 3 font weights.

No custom fonts.

No mixed typography systems.

---

# Letter Spacing

Only predefined values allowed.

No manual adjustments.

---

# Line Height

Every typography style has fixed line height.

Never override manually.

---

# Spacing System

Based on 8-point grid.

Allowed spacing values

4

8

12

16

20

24

32

40

48

56

64

80

96

No arbitrary spacing.

---

# Border Radius

Available Tokens

Radius XS

Radius Small

Radius Medium

Radius Large

Radius XL

Radius Pill

No custom radius values.

---

# Elevation

Level 0

Background

Level 1

Cards

Level 2

Sticky Elements

Level 3

Bottom Sheets

Level 4

Dialogs

Level 5

Critical Overlay

Never create custom shadows.

---

# Icon Tokens

Supported Sizes

16

20

24

28

32

40

Icons must use one icon library only.

Do not mix icon sets.

---

# Illustration Tokens

Categories

Healthcare

Empty State

Error

Onboarding

Queue

Support

All illustrations must follow the same visual style.

---

# Avatar Tokens

Sizes

Small

Medium

Large

XL

Types

Doctor

Patient

Hospital

Family Member

Fallback Initial

---

# Button Tokens

Sizes

Small

Medium

Large

Variants

Primary

Secondary

Outline

Text

Danger

Disabled

States

Default

Hover

Pressed

Loading

Disabled

---

# Input Tokens

Height

Small

Medium

Large

States

Focused

Default

Error

Disabled

Readonly

---

# Card Tokens

Types

Doctor

Clinic

Booking

Queue

Notification

Family

Review

Cards must share:

Border Radius

Elevation

Padding

Spacing

---

# Motion Tokens

Duration

Instant

Fast

Normal

Slow

Extra Slow

Easing

Standard

Accelerate

Decelerate

Emphasized

---

# Opacity Tokens

Disabled

Overlay

Pressed

Dragged

Hidden

Only predefined values allowed.

---

# Blur Tokens

Small

Medium

Large

Used only for overlays.

---

# Shadow Tokens

Shadow Level 1

Shadow Level 2

Shadow Level 3

Shadow Level 4

Shadow Level 5

Never define screen-specific shadows.

---

# Border Tokens

Hairline

Thin

Regular

Strong

---

# Z-Index Tokens

Background

↓

Content

↓

Header

↓

FAB (Future)

↓

Bottom Sheet

↓

Dialog

↓

Snackbar

↓

Critical Alert

Z-index values must never be hardcoded.

---

# Animation Tokens

Fade

Slide

Scale

Expand

Collapse

Used consistently throughout the app.

---

# Skeleton Tokens

Doctor Card

Queue Card

Booking Card

Home

Search

Profile

Loading placeholders must match actual layouts.

---

# Status Tokens

Online

Offline

Loading

Error

Success

Busy

Paused

Completed

Cancelled

---

# Accessibility Tokens

Minimum Touch Target

48dp

Minimum Contrast

WCAG AA

Focus Ring

Standardized

Dynamic Font Scaling

Supported

---

# Responsive Tokens

Supported Widths

320dp

360dp

390dp

412dp

Supported Orientations

Portrait

Landscape (limited support where applicable)

---

# Token Naming Convention

Examples

color.primary

color.success

spacing.md

spacing.lg

radius.large

text.body

button.primary

shadow.level2

motion.fast

icon.medium

Do not use raw values inside components.

---

# Developer Rules

Developers must:

Use design tokens everywhere.

Never hardcode:

Colors

Spacing

Radius

Typography

Animation Duration

Elevation

Opacity

Border Width

Any deviation requires updating this document first.

---

# Acceptance Criteria

Design Token implementation is complete when:

Every UI element references tokens.

No hardcoded visual values exist.

Dark mode support can be added without rewriting components.

Consistency is maintained across the application.

---

# Related Documents

07-Component-System.md

09-Motion-System.md

23-Developer-Guidelines.md

25-Design-Freeze-v1.0.md

---

End of Document