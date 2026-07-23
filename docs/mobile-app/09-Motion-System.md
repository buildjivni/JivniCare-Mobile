# JivniCare Patient Mobile App
# Motion System

**Version:** 1.0.0

**Status:** Design Freeze

---

# Purpose

This document defines the complete motion language for the JivniCare Patient Mobile App.

Motion should improve usability by communicating:

- Navigation
- Hierarchy
- Feedback
- State Changes
- Continuity

Motion must never exist only for decoration.

---

# Motion Philosophy

Every animation must answer one question:

> What changed?

Users should understand:

- What appeared
- What disappeared
- Where it came from
- Where it went

---

# Motion Principles

The motion system follows five principles.

## 1. Natural

Movement should feel smooth.

Never robotic.

---

## 2. Fast

Healthcare apps should feel responsive.

Avoid slow animations.

---

## 3. Purposeful

Every animation must explain a UI change.

Never animate for visual entertainment.

---

## 4. Consistent

The same interaction must always use the same animation.

---

## 5. Interruptible

Users should never wait for animations.

Animations should immediately stop if the user interacts.

---

# Motion Categories

Application Motion

↓

Navigation Motion

↓

Component Motion

↓

Feedback Motion

↓

Gesture Motion

↓

Loading Motion

---

# Screen Transition

Forward Navigation

Slide Forward

Back Navigation

Reverse Slide

Modal

Slide Up

Dialog

Fade + Scale

Search

Expand from Search Bar

---

# Bottom Navigation

When user scrolls down

↓

Bottom Navigation hides.

When user scrolls up

↓

Bottom Navigation reappears.

Behavior

Smooth.

Never jump.

---

# Header Motion

Home Header

Expanded

↓

Compact

↓

Expanded

As scrolling changes.

Elements

Search remains accessible.

Icons stay visible.

Greeting fades first.

---

# Specialty Section

Default

Icon + Label

After scrolling

↓

Icon Only

Scrolling upward

↓

Label returns

---

# Doctor Card

Loading

↓

Skeleton

↓

Fade

↓

Interactive

Hover (Future)

↓

Slight Elevation

Pressed

↓

Small Scale Feedback

---

# Queue Card

Queue updates

↓

Animate only changed values.

Do NOT redraw the entire card.

Examples

Patients Ahead

Now Serving

ETA

Update independently.

---

# Queue Progress

Progress animation

Linear

Smooth

Never jump.

---

# Booking Success

Animation

Success Icon

↓

Scale

↓

Checkmark

↓

Content

↓

Primary CTA

Sequence must feel rewarding.

---

# Search

Tap Search

↓

Expand

↓

Keyboard

↓

Suggestions

↓

Results

Closing

↓

Reverse animation.

---

# Bottom Sheet

Opening

Slide Up

Closing

Slide Down

Dismiss

Swipe Down

Background

Dimmed

---

# Dialog

Opening

Fade

+

Scale

Closing

Reverse

Never slide dialogs.

---

# Snackbar

Appears

Bottom

↓

Slide Up

Dismiss

↓

Slide Down

Duration

Auto dismiss.

---

# Notification Badge

Unread

↓

Small Scale Animation

Never bounce repeatedly.

---

# Button Motion

Tap

↓

Ripple

↓

Pressed State

↓

Release

Loading Button

↓

Spinner

↓

Success

↓

Normal

---

# Loading Motion

Preferred

Skeleton

Not Preferred

Infinite Spinner

Only use spinner for:

Very short actions.

---

# Pull To Refresh

User Pull

↓

Indicator

↓

Refresh

↓

Complete

↓

Return

Must support haptic feedback.

---

# List Animation

Doctor List

Cards appear

↓

Small Fade

↓

Small Upward Motion

No stagger delays.

---

# Empty State

Illustration

↓

Fade

↓

Title

↓

Description

↓

CTA

---

# Error State

Illustration

↓

Fade

↓

Retry Button

---

# Queue Updates

If queue changes

Only animate:

- Token Number
- Patients Ahead
- ETA
- Queue Status

Never rebuild the screen.

---

# Haptic Feedback

Supported

Booking Success

Notification Action

Button Confirmation

Queue Refresh

Permission Accepted

Avoid excessive vibration.

---

# Gesture Support

Back Swipe

Supported

Bottom Sheet Swipe

Supported

Pull Refresh

Supported

Long Press

Only where meaningful.

Double Tap

Not used.

---

# Animation Performance

Animations must maintain:

60 FPS minimum.

Avoid layout recalculations.

Avoid unnecessary repainting.

Prefer GPU-friendly transforms.

---

# Accessibility

Respect system setting:

Reduce Motion

If enabled

↓

Reduce animations

↓

Keep essential transitions only.

---

# Developer Rules

Developers must never:

Create custom animations.

Use inconsistent durations.

Animate layout unnecessarily.

Animate every element independently.

Ignore Reduce Motion settings.

---

# Motion Checklist

Every animation must satisfy:

✔ Purpose

✔ Consistency

✔ Performance

✔ Accessibility

✔ Interruptible

✔ Predictable

---

# Acceptance Criteria

Motion system is complete when:

- Navigation feels continuous.
- State changes are obvious.
- Queue updates are understandable.
- No animation causes delays.
- Motion enhances usability instead of distracting users.

---

# Related Documents

08-Design-Tokens.md

07-Component-System.md

04-Navigation-System.md

06-Screen-Specifications.md

---

End of Document