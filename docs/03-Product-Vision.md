# Document 03: Product-Vision.md
**Version:** V1.0.0 FINAL | **Date:** 2026-07-16 | **Status:** LOCKED
**Authority:** Tier 1 — Never contradicts mission. If any other document conflicts with this one, this document wins.

---

## 1. Mission Statement

> **"Rural aur Semi-Urban Bharat mein patients ko unke nearest, verified doctors se instantly connect karna — bina physical queue mein wait kiye, bina extra charges waste kiye. Emergency conditions mein bhi patients apne nearest best hospital ko discover kar sakein, jisse healthcare accessibility badhe aur preventable death rate reduce ho."**

### Core Promise
- **Patient:** "Ghanto wait nahi, sirf minutes mein doctor se connect."
- **Doctor:** "Zero commission, direct patient reach, reduced overhead."
- **Society:** "Better healthcare access = Better health outcomes."

---

## 2. Target Users (Priority Order)

### 2.1 Primary User: Patient
| Attribute | Detail |
|-----------|--------|
| **Age Group** | 18+ to 50 years |
| **Location** | Semi-Rural + Semi-Urban India |
| **Tech Comfort** | Basic smartphone user, low-to-moderate internet literacy |
| **Language** | Hindi (primary), English (secondary) |
| **Pain Points** | Long waiting hours, word-of-mouth dependency, no visibility of doctor availability, family member time waste, extra travel cost |
| **Use Cases** | Self booking, Family member booking (remote), Emergency discovery |

### 2.2 Secondary User: Doctor + Clinic/Hospital
| Attribute | Detail |
|-----------|--------|
| **Profile** | Individual doctors, clinics, hospitals |
| **Pain Points** | Low visibility, high ad spend, commission to agents, large waiting area cost, receptionist overload, inconsistent patient flow |
| **Benefits** | Direct patient reach, zero commission, reduced staff need, data-driven ad campaigns, FIFO queue management, walk-in + online unified |

### 2.3 Tertiary User: Admin (Super Admin)
| Attribute | Detail |
|-----------|--------|
| **Role** | Single admin handling entire platform |
| **Responsibilities** | Doctor activity monitoring, patient activity, booking analytics, queue management, active/inactive doctor tracking, online vs walk-in ratio, registration approvals |
| **Platform** | Web-based admin dashboard |

---

## 3. Core Problems Being Solved

### 3.1 Patient Problems

| # | Problem | Impact | JivniCare Solution |
|---|---------|--------|-------------------|
| P1 | **Ghanto wait for 10-min OPD** | Health deterioration, family member time waste, extra travel cost | Real-time queue + online booking + token system |
| P2 | **Word-of-mouth dependency** | Wrong doctor selection, wasted money on inexperienced doctors | Verified doctor profiles with ratings, experience, specialization |
| P3 | **No visibility of doctor availability** | Unnecessary travel, closed clinic pe pahunchna | Live status: Open/Closed, Live Queue count, Emergency Only |
| P4 | **Remote family member booking** | Elderly/ill family member ko bar-bar preshan karna | Remote booking by family member from any city |
| P5 | **Emergency confusion** | Pata nahi kaunsa hospital best hai emergency mein | Emergency discovery: nearest best hospital with live status |
| P6 | **Inconsistent queue management** | FIFO nahi, jiska reference uska number | Unified FIFO queue (online + walk-in) |

### 3.2 Doctor Problems

| # | Problem | Impact | JivniCare Solution |
|---|---------|--------|-------------------|
| D1 | **Low visibility** | Kam patients, high ad spend | Marketplace visibility, search & discover |
| D2 | **Agent commission** | 20-30% earning cut | Zero commission, direct patient connection |
| D3 | **Large waiting area cost** | High infrastructure expense | Online queue reduces physical waiting need |
| D4 | **Receptionist overload** | Staff busy in calls/bookings, not patient care | Automated booking + queue management |
| D5 | **No patient flow data** | Blind ad spend, no ROI tracking | Analytics: patient source, area-wise data, conversion tracking |
| D6 | **Walk-in inconsistency** | Online patients alag, walk-in alag — FIFO break | Unified queue: walk-in ko bhi platform pe register karo |

---

## 4. Success Metrics (KPIs)

### 4.1 North Star Metric
**Daily Successful Bookings** — Patient ne book kiya, doctor ne confirm kiya, patient ne visit kiya.

### 4.2 Primary Metrics

| Metric | Target (Month 3) | Target (Month 6) | Measurement |
|--------|-----------------|------------------|-------------|
| Daily Bookings | 50/day | 200/day | Booking completion rate |
| Patient Retention | 40% return in 30 days | 60% return in 30 days | Repeat booking rate |
| Doctor Registrations | 25 doctors | 100 doctors | Verified doctor count |
| Avg Queue Wait Time | 45 min → 15 min | 15 min → 10 min | Patient feedback + queue data |
| Platform Trust Score | 3.5/5 | 4.2/5 | App store rating + NPS |
| Online vs Walk-in Ratio | 30:70 | 50:50 | Admin dashboard analytics |

### 4.3 Secondary Metrics
- **Emergency Discovery Usage:** Kitne patients ne emergency feature use kiya
- **Remote Booking %:** Kitni bookings family members ne ki (non-local)
- **Doctor Activation Rate:** Registered doctors mein se kitne active hain
- **Average Consultation Fee:** Market rate tracking
- **Patient Source Analytics:** Kaunse area se zyada patients aa rahe hain

---

## 5. Non-Goals (V1 Scope — Ye Nahi Karna)

> **Explicitly OUT of V1 scope. Ye features V2 ya uske baad consider honge.**

| # | Feature | Reason | Planned For |
|---|---------|--------|-------------|
| NG1 | **Video Consultation** | Infrastructure heavy, regulatory complexity, patient trust pehle build karna hai | V2 |
| NG2 | **In-App Payment Gateway** | V1 mein cash at clinic — UPI integration V2 mein | V2 |
| NG3 | **Medicine Delivery** | Supply chain complexity, pharmacy partnerships needed | V3 |
| NG4 | **Lab Test Booking** | Lab partnerships required, separate logistics | V3 |
| NG5 | **Multi-language (beyond Hindi+English)** | Pehle Hindi market validate karo | V2 (Regional languages) |
| NG6 | **Insurance Integration** | Regulatory complexity, TPA partnerships | V3 |
| NG7 | **AI Symptom Checker** | Medical liability, requires extensive validation | V2 |
| NG8 | **Doctor-side Mobile App** | V1 mein web dashboard for doctors, mobile app V2 | V2 |
| NG9 | **Patient Health Records** | Data privacy complexity, PHR standards | V2 |
| NG10 | **Subscription Plans for Doctors** | Pehle free listing se market build karo | V2 (Freemium) |

---

## 6. Geography & Rollout Plan

### 6.1 Phase 1: Product-Market Fit Test (Months 1-3)
| City | State | Reason |
|------|-------|--------|
| **Deoghar** | Jharkhand | Test market, moderate population, healthcare gap |
| **Jamui** | Bihar | Reference city (user image shows Jamui Care Clinic), known terrain |

### 6.2 Phase 2: Market Expansion (Months 4-6)
| City | State | Reason |
|------|-------|--------|
| **Patna** | Bihar | Capital city, larger user base, validation at scale |
| **Muzaffarpur** | Bihar | Tier-2 city, semi-urban mix |
| **Siwan** | Bihar | Rural-heavy, perfect for core use case |
| **Rohtas** | Bihar | Diverse demographics |
| **Bhagalpur** | Bihar | Established healthcare market |

> **Note (added during technical documentation, 2026-07-16):** the live product's district/
> location constant (`BIHAR_DISTRICTS`, verified directly in code) already contains all 37 Bihar
> districts + Deoghar, not just the 9 named above. This document's rollout table describes where
> *marketing and doctor-acquisition focus* will be in each phase — it is not a technical
> restriction, and `04-PRD.md` Section 2.2 / `12-Backend-Spec.md` correctly describe the platform
> as pan-Bihar-capable from Day 1. A patient in a district outside this rollout table can still
> use the app if a doctor there has registered; the phased list is a go-to-market focus, not a
> feature gate. This resolves a contradiction found across the original 14-document set, where
> some docs described a hard 2-district technical limit that does not exist in code.

### 6.3 Language Strategy
- **Primary:** Hindi (all UI, notifications, support)
- **Secondary:** English (optional toggle, doctor profiles, medical terms)
- **V2:** Regional languages (Bhojpuri, Maithili, etc.)

---

## 7. Competitive Differentiation

| Factor | Traditional Way | Other Apps | JivniCare |
|--------|--------------|------------|-----------|
| **Queue Management** | Physical token | No queue feature | Live digital queue + FIFO |
| **Walk-in Integration** | Separate system | Online only | Online + Walk-in unified |
| **Commission** | 20-30% to agents | 15-20% platform fee | **0% commission** |
| **Emergency Discovery** | Word of mouth | Not available | Live emergency hospital finder |
| **Rural Focus** | Ignored | Urban-centric | **Semi-rural + semi-urban first** |
| **Family Remote Booking** | Phone calls | Self-only | Family member can book remotely |

---

## 8. Risk Assumptions & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Low doctor adoption** | High | Free listing, zero commission, data insights |
| **Low patient trust** | High | Verified badges, ratings, transparent fees |
| **Internet connectivity issues** | Medium | Lightweight app, offline queue status caching |
| **Doctor no-shows** | Medium | Confirmation system, patient alerts, admin oversight |
| **Platform abuse (fake bookings)** | Medium | OTP verification, booking limits, admin monitoring |

---

## 9. Document Hierarchy

```
Product-Vision.md (THIS DOCUMENT) ← Source of Truth for "Why"
    ├── User-Personas.md ← "For Whom"
    ├── PRD.md ← "What"
    ├── Business-Rules.md ← "How Rules Work"
    ├── Mobile-UX-Spec.md ← "How It Looks"
    └── Backend-Spec.md ← "How It Works Technically"
```

**If conflict arises:** Product-Vision.md > PRD.md > Business-Rules.md > All other docs.

---

## 10. Approval & Sign-off

| Role | Name | Status | Date |
|------|------|--------|------|
| Founder | [Founder Name] | ☐ Approved | |
| Product Lead | [To be assigned] | ☐ Approved | |
| Tech Lead | [To be assigned] | ☐ Approved | |

---

*"JivniCare — Ghanto nahi, sirf minutes mein doctor se connect."*
