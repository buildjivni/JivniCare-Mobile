# JivniCare Mobile

Patient-facing mobile app for **JivniCare** — a healthcare marketplace connecting patients in
semi-rural and semi-urban India to verified local doctors, with live queue status, online
booking, and a zero-commission model for doctors.

> This repository has been prepared for external engineering audit. See
> [Current Development Status](#current-development-status) and
> [Known Limitations](#known-limitations) below for the honest state of the build.

---

## Project Overview

JivniCare's mission is to let patients discover their nearest verified doctors and book a
queue token instantly — without physically waiting in line — and to give doctors a
zero-commission channel for direct patient reach with unified online + walk-in queue
management.

This repo contains the **patient mobile app** only (Expo / React Native). The doctor and admin
experiences are separate web applications not part of this codebase.

Full product, design, and API documentation lives in [`docs/`](./docs) — start with
[`docs/01-Documentation-Index.md`](./docs/01-Documentation-Index.md).

---

## Tech Stack

| Layer              | Technology                                                             |
| ------------------ | ---------------------------------------------------------------------- |
| Framework          | [Expo](https://expo.dev) (SDK 57) + React Native 0.86                  |
| Language           | TypeScript (strict mode)                                               |
| Routing            | Expo Router (file-based, `app/`)                                       |
| Styling            | NativeWind 4 (Tailwind CSS for React Native)                           |
| State              | Zustand                                                                |
| Icons              | lucide-react-native                                                    |
| Animations         | react-native-reanimated / react-native-worklets                        |
| State/config       | react-native-safe-area-context, react-native-screens, react-native-svg |
| Build/Distribution | EAS (`eas.json`)                                                       |
| Package manager    | npm (`package-lock.json` committed)                                    |

---

## Folder Structure

```
jivnicare-mobile/
├── app/                    # Expo Router screens (file-based routing)
│   ├── _layout.tsx         # Root stack layout, header theming
│   ├── index.tsx           # Home screen
│   ├── doctor/[id].tsx     # Doctor profile screen
│   └── booking/[id].tsx    # Booking screen
├── src/
│   ├── components/
│   │   ├── atoms/          # Button, Input, Avatar, Badge, OTPInput
│   │   ├── molecules/      # DoctorCard, BookingWidget, QueueStatusBadge, OTPInputBox
│   │   ├── organisms/      # WaitlistForm
│   │   ├── templates/      # (skeleton) full-page layout compositions
│   │   ├── layout/         # (skeleton) structural wrappers (headers, containers)
│   │   ├── animation/      # (skeleton) shared motion/animation components
│   │   └── utility/        # (skeleton) non-visual utility components
│   ├── core/                # (skeleton) theme, i18n, storage, network, logger, config
│   ├── api/                  # (skeleton) HTTP client interceptors/endpoints
│   ├── repositories/         # (skeleton) auth, doctor, booking, queue, waitlist, notification, profile, lead, consent
│   ├── services/              # (skeleton) business/domain services
│   ├── features/               # (skeleton) per-feature hooks (auth, search, doctor-profile, booking, queue, waitlist, my-bookings, notifications, profile, settings)
│   ├── store/                   # (skeleton) global state (Zustand)
│   ├── hooks/                    # (skeleton) shared cross-feature hooks
│   ├── utils/                     # (skeleton) shared pure helper functions
│   ├── constants/                  # (skeleton) shared constants (routes, config values)
│   ├── data/                        # Mock data used while backend integration is pending
│   └── types/                       # Shared TypeScript types
├── assets/
│   └── brand/                # Brand SVGs (logos, app icons, wordmark) — see docs/08.1-Brand-Assets.md
├── docs/                     # Product/design/API documentation (source of truth — read first)
├── app.json                  # Expo app configuration
├── eas.json                  # EAS Build/Submit profiles
├── eslint.config.js           # ESLint flat config (TS/RN/import/boundaries rules)
├── .prettierrc.json            # Prettier formatting rules
├── .prettierignore
├── babel.config.js
├── metro.config.js           # Metro bundler config (NativeWind integration)
├── tailwind.config.js
├── global.css                # Tailwind entry stylesheet
├── tsconfig.json
├── nativewind-env.d.ts
├── package.json
└── package-lock.json
```

> The `src/` folders marked **(skeleton)** are directory-only scaffolding created in Sprint 0
> Milestone 1 (Engineering Foundation) per
> [`docs/engineering/Sprint-0-Engineering-Design.md`](./docs/engineering/Sprint-0-Engineering-Design.md).
> They contain only a `.gitkeep` placeholder today — implementation lands in later Sprint 0
> milestones (state, services, repositories, API client, etc.).

---

## Setup Instructions

### Prerequisites

- Node.js 18+ (developed/verified against Node 24)
- npm 10+
- [Expo Go](https://expo.dev/go) app on a physical device, or an Android/iOS simulator
- (Optional, for native/EAS builds) an [Expo](https://expo.dev) account and the `eas-cli`

### Install

```bash
git clone https://github.com/buildjivni/JivniCare-Mobile.git
cd JivniCare-Mobile
npm install
```

> `.npmrc` sets `legacy-peer-deps=true` — required for the current React Native/React 19
> dependency graph. Keep using `npm install` rather than switching package managers unless the
> lockfile is regenerated for that tool.

---

## Run Commands

| Command                | Description                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `npm start`            | Start the Expo dev server (Metro), scan the QR code with Expo Go                                                       |
| `npm run android`      | Start the dev server and open on a connected Android device/emulator                                                   |
| `npm run ios`          | Start the dev server and open on an iOS simulator (macOS only)                                                         |
| `npm run web`          | Start the dev server for web (requires `react-dom` + `react-native-web` — see [Known Limitations](#known-limitations)) |
| `npm run lint`         | Lint the project with ESLint                                                                                           |
| `npm run lint:fix`     | Lint and auto-fix what's fixable                                                                                       |
| `npm run format`       | Format the codebase with Prettier                                                                                      |
| `npm run format:check` | Check formatting without writing changes                                                                               |
| `npm run typecheck`    | Type-check without emitting files (`tsc --noEmit`)                                                                     |

---

## Build Commands

Local bundle verification (no native tooling required — validates Metro/JS bundling only):

```bash
npx expo export --platform android
npx expo export --platform ios
```

Production/native binaries are built via **EAS Build** (profiles defined in `eas.json`):

```bash
npx eas build --platform android --profile production
npx eas build --platform ios --profile production
```

Development client build (for testing native modules without Expo Go):

```bash
npx eas build --platform android --profile development
```

---

## Environment Variables

**None are currently required.** The app runs entirely against local mock data
(`src/data/mockDoctor.ts`) — no network calls or API base URL are wired up yet.

Once backend integration begins (see [`docs/11-API-Contract.md`](./docs/11-API-Contract.md)),
expect an API base URL to be introduced as an Expo public environment variable, e.g.:

| Variable (planned)         | Purpose                               |
| -------------------------- | ------------------------------------- |
| `EXPO_PUBLIC_API_BASE_URL` | Base URL of the JivniCare backend API |

No `.env` file exists in this repo today. If/when one is added, only variable **names** should
ever be documented here — real values (API keys, tokens, secrets) must never be committed and
must stay out of version control (see `.gitignore`).

---

## Current Development Status

This is a **frontend-first, pre-backend-integration build**. Per
[`docs/15-Known-Gaps.md`](./docs/15-Known-Gaps.md) and
[`docs/14-Feature-Dependencies.md`](./docs/14-Feature-Dependencies.md):

- 3 screens exist and route correctly: Home (`app/index.tsx`), Doctor Profile
  (`app/doctor/[id].tsx`), Booking (`app/booking/[id].tsx`).
- A component library (atoms/molecules/organisms) exists and is documented in
  [`docs/09-Component-Library.md`](./docs/09-Component-Library.md).
- All screens currently run against **mock data** (`src/data/mockDoctor.ts`) — no real API
  calls are wired up.
- Full product/design/API documentation (15 documents) is complete and locked as of
  2026-07-16 — see [`docs/01-Documentation-Index.md`](./docs/01-Documentation-Index.md).
- Several backend endpoints required for real integration do not exist yet or are
  cookie-only (not Bearer-token compatible with mobile) — tracked as Phase 0 blockers in
  `docs/15-Known-Gaps.md` Section 2.

**Build verification performed for this audit:**

- ✅ `npm install` — installs cleanly, lockfile is valid
- ✅ `npx tsc --noEmit` — zero TypeScript errors
- ✅ `npx expo export --platform android` — bundles successfully (3449 modules)
- ✅ `npx expo export --platform ios` — bundles successfully (3358 modules)

---

## Known Limitations

- **No backend integration** — all data is mocked; see `docs/15-Known-Gaps.md` Section 2 for
  the specific backend gaps (cookie-only auth, missing waitlist-join endpoint, missing consent
  log write path, etc.) blocking real API wiring.
- **Web platform not runnable out of the box** — `app.json` declares a `web` bundler config,
  but `react-dom` and `react-native-web` are not installed as dependencies. `npm run web` /
  `npx expo export --platform web` will fail until these are added. Not fixed as part of this
  audit pass since it is not a build-breaking issue for the primary Android/iOS targets and
  installing new dependencies was out of scope for an audit-prep pass.
- **No automated test suite** — no test runner or test files currently exist in the repo (Jest/
  RTL setup is out of scope for Sprint 0 Milestone 1 — Engineering Foundation).
- **A handful of pre-existing lint warnings, not errors** — `npm run lint` exits `0` but surfaces
  8 warnings on pre-existing code: hardcoded color/inline-style usage (design-token extraction is
  Sprint 0 Phase 0.3, not yet implemented) and one `useRef(...).current` read during render in
  `OTPInput.tsx` (flagged by the newer React Compiler-oriented `react-hooks/refs` rule). See
  `docs/implementation/M1-Engineering-Foundation-Report.md` for details.
- **Minor dependency version drift** — `npx expo-doctor` reports `react-native-worklets` and
  `react-native-reanimated` are slightly ahead of the versions Expo SDK 57 expects (minor/patch
  only). Does not affect bundling; left unchanged since it is not build-breaking.
- **Known product/business-logic gaps** — see
  [`docs/15-Known-Gaps.md`](./docs/15-Known-Gaps.md) for the full, actively maintained list of
  V2 deferrals, unverified claims, and accepted V1 limitations.

---

## Documentation

All product, UX, design, and API documentation lives in [`docs/`](./docs). Start with
[`docs/01-Documentation-Index.md`](./docs/01-Documentation-Index.md) and read
[`docs/13-AI-Development-Rules.md`](./docs/13-AI-Development-Rules.md) before making any code
changes.
