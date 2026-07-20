# Document 06: User-Personas.md
**Version:** V1.0.0 FINAL | **Date:** 2026-07-16 | **Status:** LOCKED
**Derived from:** `03-Product-Vision.md` | **Authority:** Tier 3 — no corrections needed
against this document in any of the three audits performed (doc-vs-doc, doc-vs-code,
readiness). Kept as originally drafted.

---

## 1. Overview

This document defines all user personas for JivniCare. Har persona ke liye: background, goals, pain points, tech behavior, aur JivniCare mein unka journey documented hai. 

**Persona Count:** 7 (3 Patient + 3 Doctor + 1 Admin)

---

## 2. Patient Personas

---

### 2.1 Persona P1: "Ramesh — The Rural Elderly"

| Attribute | Detail |
|-----------|--------|
| **Name** | Ramesh Yadav |
| **Age** | 62 years |
| **Location** | Jamui district, Bihar — Gaon mein rehta hai, 8km from district hospital |
| **Occupation** | Retired farmer |
| **Education** | 8th pass |
| **Language** | Hindi (native), no English |
| **Device** | Samsung Galaxy M13 (₹10,000 range), 4G but inconsistent network |
| **Tech Comfort** | **Low** — WhatsApp chala leta hai, YouTube dekhta hai, app install karna mushkil lagta hai |
| **Family** | Beta Patna mein IT job karta hai, bahu ghar mein hai |

#### Daily Context
- Subah 5 baje uthta hai, shaam ko 7 baje sota hai
- Health issues: Diabetes, blood pressure, joint pain
- Doctor dikhane jaata hai: Monthly checkup ke liye district hospital
- Travel: Auto-rickshaw ₹150, 45 min one way

#### Goals (What Ramesh Wants)
1. **Doctor se jaldi milein** — Ghanto khade hone se bachna
2. **Pata chale doctor clinic pe hai ya nahi** — Bekar travel na karna pade
3. **Beta Patna se booking kar sake** — Khud phone pe thik se nahi kar paata
4. **Hindi mein sab samajh aaye** — English nahi aata

#### Pain Points (Current Frustrations)
| Pain Point | Severity | Current Behavior |
|------------|----------|-----------------|
| Hospital mein 3-4 ghanta wait | 🔴 Critical | Subah 6 baje ghar se nikalta hai, token 45 leke 11 baje doctor milta hai |
| Pata nahi doctor aaya hai ya nahi | 🔴 Critical | 2 baar aisa hua — doctor emergency mein town chale gaye, khali haath lautna pada |
| Phone pe booking nahi kar paata | 🟡 High | Beta ko phone karta hai, beta busy hota hai, booking miss ho jaati hai |
| Medical terms samajh nahi aate | 🟡 High | Doctor ne "hypertension" kaha, samajh nahi aaya |
| Counter pe paisa count karna mushkil | 🟢 Medium | ₹600 nikaalne mein time lagta hai, peeche se log chillate hain |

#### JivniCare Journey
```
1. Beta Patna se app open karta hai → Ramesh ka profile select karta hai
2. "Jamui" location select → "General Physician" filter
3. Dr. Rajesh Kumar (Jamui Care Clinic) dikhta hai — "Live Queue: 2 patients"
4. Token book karta hai — ₹600 fee dikh rahi hai
5. Ramesh ko SMS aata hai: "Aapka token 5 hai. Clinic 9:30 baje pahunche."
6. Ramesh 9:30 baje pahunchta hai — 10:15 baje doctor se milke 10:30 baje ghar wapas
```

#### Success Metrics for Ramesh
- **Wait time:** 4 hours → 45 minutes
- **Travel confidence:** 100% sure doctor available hai
- **Family dependency:** Beta ko sirf booking ke liye phone nahi karna padta

---

### 2.2 Persona P2: "Priya — The Working Mother"

| Attribute | Detail |
|-----------|--------|
| **Name** | Priya Sharma |
| **Age** | 34 years |
| **Location** | Deoghar, Jharkhand — Semi-urban colony |
| **Occupation** | Government school teacher |
| **Education** | Graduate (B.Ed) |
| **Language** | Hindi + Basic English |
| **Device** | Redmi Note 12 (₹15,000 range), stable 4G WiFi at home |
| **Tech Comfort** | **Medium-High** — PhonePe, Amazon, Instagram sab chala leti hai |
| **Family** | Husband (bank clerk), 2 bachche (8 saal ka beta, 5 saal ki beti) |

#### Daily Context
- School: 9 AM - 4 PM
- Bachchon ko tuition + activities manage karna hai
- Sasural wale alag city mein hain — help nahi milti
- Health: Beti ko frequently cold/cough hota hai, skin allergy bhi hai

#### Goals
1. **Bachchon ka doctor jaldi dikhana** — School ke baad 4:30-6:30 window mein
2. **Verified pediatrician dhundhna** — Bachchon ka specialist chahiye, general physician nahi
3. **Fees pehle se pata chale** — Budget mein plan karna hai (₹500-800 range)
4. **Queue track karna** — Ghar se niklu ya 15 min baad?

#### Pain Points
| Pain Point | Severity | Current Behavior |
|------------|----------|-----------------|
| Bachchi ke liye 2 ghanta wait — uske homework miss ho jaata hai | 🔴 Critical | Shaam ko 4:30 baje clinic jaati hai, 6:30 baje ghar aati hai |
| Pediatrician kaun accha hai — pata nahi | 🔴 Critical | Pados wali ne "Dr. Sinha" kaha, lekin unka clinic 10km door hai |
| Fees pata nahi — counter pe negotiate karna awkward hai | 🟡 High | Pehli baar gayi toh ₹800 fees thi, budget ₹500 tha |
| Beti clinic mein bore hoti hai, rooti hai | 🟡 High | Toys leke jaati hai, phir bhi 2 ghanta mushkil hai |
| Doctor ne kaha "dawai 5 din" — bhool jaati hai | 🟢 Medium | Whatsapp pe husband ko message karti hai reminder ke liye |

#### JivniCare Journey
```
1. Office se ghar aate hi app open — "Pediatrician near me" search
2. Filter: Verified, Fees < ₹800, Distance < 5km, Hindi speaking
3. Dr. Anjali Gupta (Child Care Clinic) — 4.8★, 12 years exp, ₹600 fees
4. Live Queue: 3 patients, avg wait 20 min
5. 4:45 PM token book — "Token 8, reach by 5:15 PM"
6. 5:10 PM clinic pahunchi, 5:35 PM doctor se mili, 5:50 PM ghar
7. App mein prescription save — next visit reminder auto-set
```

#### Success Metrics for Priya
- **Wait time:** 2 hours → 25 minutes
- **Doctor discovery time:** Word-of-mouth (3 days) → App (3 minutes)
- **Family stress:** High → Low (predictable schedule)

---

### 2.3 Persona P3: "Amit — The Remote Caregiver"

| Attribute | Detail |
|-----------|--------|
| **Name** | Amit Kumar |
| **Age** | 29 years |
| **Location** | Bangalore, Karnataka — IT professional |
| **Occupation** | Software Engineer (₹8 LPA) |
| **Education** | B.Tech |
| **Language** | Hindi + English (Bangalore mein mostly English) |
| **Device** | iPhone 14, 5G, premium connectivity |
| **Tech Comfort** | **Very High** — Sab apps use karta hai, UPI, crypto, SaaS tools |
| **Family** | Parents in Muzaffarpur, Bihar — Papa 58 (heart patient), Mummy 55 (diabetes) |

#### Daily Context
- Job: 10 AM - 7 PM (WFH 2 days)
- Parents se roz 8:30 PM pe video call
- Papa ka monthly cardiologist checkup hai — Mummy endocrinologist
- Har 2 mahine mein Bihar jaata hai — baaki time remote manage karna hai

#### Goals
1. **Papa/Mummy ka doctor booking remotely karna** — Bangalore se Muzaffarpur
2. **Queue status real-time dekhna** — Papa ko kab bhejna hai?
3. **Doctor verify karna** — Papa ko kisi random doctor ke paas nahi bhejna
4. **Emergency mein immediate action** — Agar night mein Papa ko chest pain ho toh nearest hospital kaha hai?

#### Pain Points
| Pain Point | Severity | Current Behavior |
|------------|----------|-----------------|
| Papa ko phone pe samajh nahi aata kaunsa doctor, kab jaana hai | 🔴 Critical | Roz phone pe 20 min explain karta hai — "Papa, Dr. Sinha ke paas 9:30 baje jana hai" |
| Papa 1 ghanta pehle pahunch jaate hain — wait karte karte thak jaate hain | 🔴 Critical | Papa anxious hain, "late ho jayega" soch ke jaldi nikalte hain |
| Emergency mein pata nahi kaunsa hospital open hai, kaha jana hai | 🔴 Critical | 2 mahine pehle Papa ko 11 PM pe chest pain hua — Mummy ne padosi ko pucha, unhone kaha "City Hospital jao" — 30 min waste |
| Papa ne kaha "doctor ne kuchh kaha" — details nahi pata | 🟡 High | Papa phone pe bhool jaate hain kya kaha tha |
| Different city mein hoon — physically help nahi kar sakta | 🟡 High | Har emergency pe guilt hota hai |

#### JivniCare Journey
```
1. Monday subah app open — "Muzaffarpur" location set (saved as "Parent's Location")
2. "Cardiologist" search — Dr. R.K. Mishra (Heart Care Center) — Verified, 15+ years
3. Live Queue: 4 patients, wait 35 min
4. Papa ke liye token book — Papa ko SMS: "Token 12, 10:30 AM clinic pahunche"
5. Real-time track: "3 patients remaining" → Papa ko message: "Abhi niklo, 15 min mein turn"
6. Thursday ko Mummy ka endocrinologist booking — same flow
7. Saturday raat 11 PM — Papa ko chest pain → Emergency tab open
   → "Nearest 24/7 Hospital: City Heart Institute, 2.3km, Open, Emergency Active"
   → One-tap ambulance number + hospital direction share to Papa's phone
```

#### Success Metrics for Amit
- **Phone call time:** 20 min/day → 5 min/day
- **Parent wait time:** 90 min average → 15 min average
- **Emergency response time:** 30 min (confusion) → 5 min (action)
- **Guilt/stress level:** High → Managed

---

## 3. Doctor Personas

---

### 3.1 Persona D1: "Dr. Rajesh — The Individual Clinic Owner"

| Attribute | Detail |
|-----------|--------|
| **Name** | Dr. Rajesh Kumar |
| **Age** | 48 years |
| **Location** | Jamui, Bihar — Personal clinic "Jamui Care Clinic" |
| **Specialization** | General Physician |
| **Experience** | 18+ years |
| **Qualification** | MBBS, MD |
| **Language** | Hindi + English |
| **Device** | Samsung A54 (₹35,000), 4G, basic smartphone user |
| **Tech Comfort** | **Low-Medium** — WhatsApp, PhonePe, YouTube medical videos. App management nahi aata. |
| **Staff** | 1 receptionist (Sunita, 24 years old), no nurse |

#### Clinic Context
- **Timings:** 9 AM - 1 PM, 5 PM - 8 PM (Mon-Sat), Sunday emergency only
- **Daily patients:** 25-30 (OPD)
- **Consultation fee:** ₹600
- **Clinic setup:** 2 rooms, 8 waiting chairs, no AC
- **Monthly expenses:** Rent ₹8,000, Sunita salary ₹6,000, utilities ₹3,000 = ₹17,000
- **Monthly earning:** ₹45,000 - ₹55,000

#### Goals
1. **Zyada patients laana** — Roz 25 se 40 karne hain
2. **Agent commission band karna** — 20% agent ko deta hai (₹120 per patient)
3. **Queue manage karna** — Sunita subah se phone pe busy rehti hai, patients gussa hote hain
4. **Reputation build karna** — New patients kaunse area se aa rahe hain, ye track karna hai

#### Pain Points
| Pain Point | Severity | Current Behavior |
|------------|----------|-----------------|
| Agent ₹120 per patient le jaata hai — mahine ka ₹6,000+ | 🔴 Critical | 2 agents hain — ek local, ek hospital reference wala |
| Sunita subah 8:30 se phone pe busy — actual patients wait karte hain | 🔴 Critical | 8:30-10:30 AM — 40+ calls, Sunita frustrated, patients gussa |
| Waiting area 8 chairs — 15 log khade hain, garmi mein | 🟡 High | Patients complain karte hain, lekin zyada space nahi hai |
| Pata nahi kaunse area se zyada patients aa rahe hain | 🟡 High | Marketing blind hai — ₹5,000/month newspaper ad, ROI pata nahi |
| Walk-in patients alag list, phone booking alag — FIFO break hota hai | 🟡 High | Sunita manually list banati hai, confusion hoti hai |
| Sunday emergency mein patients pata nahi kaun aayega | 🟢 Medium | Phone aata hai — "Doctor sahab hain?" — availability batana padta hai |

#### JivniCare Journey (Doctor Side)
```
1. JivniCare team se call aaya — free listing, zero commission, queue management
2. Profile setup: Dr. Rajesh Kumar, MBBS MD, 18 years, ₹600 fees, Hindi+English
3. Verification: Degree upload + clinic photo + JivniCare team visit
4. Web dashboard access: Sunita ko training di gayi (15 min)
5. Daily workflow:
   - Subah 9 AM: Dashboard open → "Online Bookings: 8 patients, Walk-in: 5 patients"
   - Queue auto-FIFO: Token 1-8 online, Token 9-13 walk-in
   - Live status toggle: "Open" → "Closed for lunch" → "Open" → "Emergency Only"
   - Patient analytics: "70% patients Jamui city se, 20% nearby gaon se, 10% out of town"
6. Month 1 result: 25 → 38 patients/day, agent commission ₹0, Sunita phone calls 40 → 8/day
```

#### Success Metrics for Dr. Rajesh
- **Daily patients:** 25 → 38 (+52%)
- **Agent commission:** ₹6,000/month → ₹0
- **Sunita call volume:** 40/day → 8/day (-80%)
- **Patient wait satisfaction:** Complaints reduced by 70%

---

### 3.2 Persona D2: "Dr. Anjali — The Multi-Doctor Clinic Owner"

| Attribute | Detail |
|-----------|--------|
| **Name** | Dr. Anjali Gupta |
| **Age** | 42 years |
| **Location** | Deoghar, Jharkhand — "Child Care Clinic" (3 doctors) |
| **Specialization** | Pediatrician |
| **Experience** | 12 years |
| **Qualification** | MBBS, DCH |
| **Language** | Hindi + English |
| **Device** | iPhone 13, 5G, tech-savvy |
| **Tech Comfort** | **Medium-High** — EMR software use karti hai, Instagram pe health tips daalti hai |
| **Staff** | 2 receptionists, 1 nurse, 1 pharmacist |

#### Clinic Context
- **Timings:** 9 AM - 8 PM (Mon-Sat), 10 AM - 2 PM (Sun)
- **Daily patients:** 60-80 across 3 doctors
- **Consultation fee:** ₹600 (Dr. Anjali), ₹400 (Junior doctors)
- **Clinic setup:** 5 rooms, 20 waiting chairs, AC waiting area, pharmacy attached
- **Monthly expenses:** ₹65,000 (rent, staff, utilities)
- **Monthly earning:** ₹1.8 Lakh - ₹2.2 Lakh

#### Goals
1. **3 doctors ka schedule optimize karna** — Kaunsa doctor kab available, kaunsa overbooked
2. **Walk-in + online balance** — Online 50%, walk-in 50% — dono ko manage karna
3. **Patient data analyze karna** — Kaunse area se aa rahe hain, kaunsa doctor zyada demand pe hai
4. **Staff productivity badhana** — Receptionist ka 40% time booking mein waste ho raha hai

#### Pain Points
| Pain Point | Severity | Current Behavior |
|------------|----------|-----------------|
| 3 doctors ka schedule manually manage karna — confusion hoti hai | 🔴 Critical | Whiteboard pe likhte hain, erase ho jaata hai, overbooking hoti hai |
| Online patients alag, walk-in alag — junior doctors pe zyada load pad jaata hai | 🔴 Critical | Walk-in patients zyada hain — unka wait 2+ ghanta, online patients 30 min mein milta hai |
| Staff salary ₹35,000/month — 40% time booking management mein | 🟡 High | EMR software hai lekin booking alag system hai — sync nahi hai |
| Marketing budget ₹15,000/month — pata nahi kaunsa channel best hai | 🟡 High | Newspaper, Facebook, local hoardings — sab try kiya, ROI nahi pata |
| Sunday pe bhi patients aate hain — staff overtime chahiye ya nahi? | 🟢 Medium | Ad-hoc decision — kabhi staff bulaya, kabhi nahi |

#### JivniCare Journey
```
1. JivniCare se partnership — multi-doctor clinic module
2. 3 doctors ke profiles: Dr. Anjali (₹600), Dr. Verma (₹400), Dr. Priya (₹400)
3. Schedule setup: Mon-Wed-Fri Dr. Anjali, Tue-Thu Dr. Verma, Sat all 3, Sun Dr. Priya only
4. Dashboard features:
   - Doctor-wise queue: "Dr. Anjali: 12 patients, Avg wait 25 min"
   - "Dr. Verma: 8 patients, Avg wait 15 min" → Auto-suggest: "Dr. Verma se book karein?"
   - Walk-in registration: Receptionist walk-in ko bhi token generate karti hai — unified queue
   - Analytics: "Monday sabse zyada patients, 60% Deoghar city, 30% nearby towns"
5. Month 2 result: 70 → 95 patients/day, staff booking time 40% → 15%, zero overbooking
```

#### Success Metrics for Dr. Anjali
- **Daily patients:** 70 → 95 (+36%)
- **Staff productivity:** 40% booking time → 15% (+250% improvement)
- **Overbooking incidents:** 5/week → 0
- **Marketing ROI:** Blind ₹15K → Data-driven ₹8K (same results)

---

### 3.3 Persona D3: "Dr. Sameer — The Freshly Registered Doctor"

| Attribute | Detail |
|-----------|--------|
| **Name** | Dr. Sameer Khan |
| **Age** | 29 years |
| **Location** | Patna, Bihar — New clinic setup 3 months ago |
| **Specialization** | General Physician |
| **Experience** | 2 years (1 year government hospital, 1 year private) |
| **Qualification** | MBBS |
| **Language** | Hindi + English + Urdu |
| **Device** | OnePlus Nord 3, 5G, very tech-savvy |
| **Tech Comfort** | **Very High** — Instagram influencer (5K followers), YouTube health channel, Canva pe posters banata hai |
| **Staff** | No staff — khud hi receptionist, doctor, accountant |

#### Clinic Context
- **Timings:** 10 AM - 2 PM, 4 PM - 8 PM (Mon-Sat)
- **Daily patients:** 8-12 (struggling)
- **Consultation fee:** ₹300 (low to attract patients)
- **Clinic setup:** 1 room, 4 waiting chairs, basic setup
- **Monthly expenses:** ₹12,000 (rent ₹7K, utilities ₹5K)
- **Monthly earning:** ₹15,000 - ₹20,000 (barely surviving)

#### Goals
1. **Patient base build karna** — Roz 8 se 25 patients chahiye
2. **Visibility chahiye** — Patna mein koi nahi jaanta
3. **Digital presence** — Instagram se patients la raha hai lekin conversion kam hai
4. **Cost control** — Staff nahi afford kar sakta, sab khud karna hai

#### Pain Points
| Pain Point | Severity | Current Behavior |
|------------|----------|-----------------|
| Roz 8-12 patients — clinic chalana mushkil | 🔴 Critical | Instagram pe 5K followers lekin clinic mein 10 patients — conversion 0.2% |
| Patna mein 200+ general physicians — competition bahut hai | 🔴 Critical | Newspaper ad ₹3,000 — 2 patients aaye, ROI negative |
| Khud phone attend karna, khud patient dekhna, khud accounts — 14 ghanta kaam | 🟡 High | Subah 8 AM uthke patient calls, raat 10 PM tak accounts |
| Patients bolte hain "fees kam karo" — negotiate karna padta hai | 🟡 High | ₹300 se ₹250 kar diya — phir bhi nahi aaye |
| Trust nahi hai — "Naya doctor hai, experience nahi hai" | 🟡 High | 2 years experience hai lekin patients "purane doctor" ko prefer karte hain |

#### JivniCare Journey
```
1. JivniCare pe free listing — "Verified Doctor" badge mila
2. Profile: Dr. Sameer Khan, MBBS, 2 years, ₹300 fees, Hindi+English+Urdu
3. "New Doctor" badge + "Affordable Care" tag
4. Patient reviews start: "Bahut ache se sunte hain, time dete hain" → 4.5★ rating
5. JivniCare analytics: "Aapke 60% patients 18-30 age group hain — Instagram pe target karein"
6. Month 3 result: 10 → 22 patients/day, fees ₹300 → ₹400 (demand badhne pe), first profit month
```

#### Success Metrics for Dr. Sameer
- **Daily patients:** 10 → 22 (+120%)
- **Fees:** ₹300 → ₹400 (+33%)
- **Work hours:** 14 hours → 10 hours (auto-booking saves 4 hours/day)
- **Profit:** Loss ₹3,000/month → Profit ₹18,000/month

---

## 4. Admin Persona

---

### 4.1 Persona A1: "The Super Admin"

| Attribute | Detail |
|-----------|--------|
| **Role** | Super Admin (Founder/Operations Manager) |
| **Location** | Remote — Patna/Bangalore |
| **Device** | Laptop (MacBook/Windows), secondary phone |
| **Tech Comfort** | **Very High** — Full-stack understanding, analytics tools, dashboard power user |
| **Access** | Web-based Admin Dashboard (not mobile app) |

#### Daily Workflow (Typical Day)

| Time | Activity | Dashboard Section |
|------|----------|-------------------|
| **8:00 AM** | Overnight activity check | Notifications panel: "3 new doctor registrations, 12 bookings, 2 cancellations" |
| **8:15 AM** | Doctor registration approvals | Verification queue: Degrees check, clinic photos review, call verification status |
| **8:45 AM** | Booking analytics review | Analytics: Yesterday's bookings, online vs walk-in ratio, peak hours |
| **9:00 AM** | Queue monitoring | Live queue: "Dr. Rajesh: 5 patients, Dr. Anjali: 12 patients" — any alerts? |
| **9:30 AM** | Patient activity check | Patient reports: New registrations, retention rate, complaint tickets |
| **10:00 AM** | Doctor activity check | Doctor reports: Active doctors, inactive > 3 days, response time, ratings drop |
| **10:30 AM** | Issue resolution | Support tickets: "Patient ne bola doctor nahi mila", "Doctor ne queue close kar diya" |
| **11:00 AM** | Marketing/Expansion data | City-wise analytics: Deoghar vs Jamui performance, growth rate |
| **2:00 PM** | Afternoon check-in | Quick pulse: Live bookings, any system alerts, server health |
| **5:00 PM** | End-of-day summary | Daily report: Total bookings, revenue (if payment enabled), new users, issues |
| **6:00 PM** | Doctor communication | Broadcast: "Weekend pe clinic closed ka notification patients ko bhej dein" |
| **9:00 PM** | Night monitoring | Emergency alerts: Any "Emergency Only" mode activations, critical issues |

#### Goals
1. **Platform health monitor karna** — Sab smooth chal raha hai ya nahi
2. **Doctor quality maintain karna** — Fake doctors, unverified clinics — ye sab rokna
3. **Patient trust protect karna** — Complaints ka same-day resolution
4. **Data-driven decisions** — Kaunsa city expand karna hai, kaunsa feature priority

#### Pain Points
| Pain Point | Severity | Current Behavior |
|------------|----------|-----------------|
| Fake doctor registrations — verification time consuming | 🔴 Critical | Manual degree check, clinic visit — 2-3 days per doctor |
| Patient complaints — "doctor ne dekha nahi" — investigation mushkil | 🔴 Critical | Phone pe doctor se baat, patient se baat — 30 min per case |
| Multiple cities ka data alag-alag — consolidated view nahi | 🟡 High | Excel sheets banani padti hain, manual merge |
| Doctor inactive ho jaate hain — pata nahi chalta | 🟡 High | Weekly check karna padta hai, automated alert nahi hai |
| Night mein emergency alerts — sleep disturb hoti hai | 🟢 Medium | Phone pe alert aata hai, critical nahi toh bhi dekhna padta hai |

#### Success Metrics for Admin
- **Doctor verification time:** 3 days → 1 day
- **Patient complaint resolution:** 48 hours → 4 hours
- **Platform uptime:** 99.5%+
- **Fake doctor detection:** 100% before going live
- **City expansion decision:** Gut feeling → Data-driven

---

## 5. Persona Interaction Matrix

| Interaction | Primary Actor | Secondary Actor | Trigger | JivniCare Feature |
|-------------|---------------|-----------------|---------|-----------------|
| **Patient books doctor** | P1/P2/P3 | D1/D2/D3 | Health need | Booking flow + Live queue |
| **Family member books remotely** | P3 (Amit) | P1 (Ramesh) | Parent needs doctor | Remote booking + SMS notification |
| **Doctor manages queue** | D1/D2/D3 | A1 (Admin) | Daily clinic operations | Doctor dashboard + Live status toggle |
| **Admin verifies doctor** | A1 | D3 (New doctor) | New registration | Verification workflow + Document check |
| **Patient emergency discovery** | P1/P2/P3 | D2 (Hospital) | Emergency health issue | Emergency map + Live hospital status |
| **Walk-in patient registers** | D1/D2 | P1/P2 | Patient arrives without booking | Walk-in token generation + Unified queue |
| **Admin monitors platform** | A1 | All users | Daily operations | Admin dashboard + Analytics + Alerts |

---

## 6. Persona Priority for V1 Development

| Priority | Persona | Reason | V1 Focus |
|----------|---------|--------|----------|
| **P0** | P1 — Ramesh (Rural Elderly) | Core mission — rural India primary user | Hindi-only UI, large fonts, simple flow, SMS notifications |
| **P0** | P2 — Priya (Working Mother) | High-frequency user, family decision maker | Quick booking, pediatric filter, fee transparency, queue tracking |
| **P1** | P3 — Amit (Remote Caregiver) | High-value use case, word-of-mouth potential | Remote booking, real-time tracking, emergency discovery |
| **P0** | D1 — Dr. Rajesh (Individual Clinic) | Most common doctor type, high pain point | Simple web dashboard, queue toggle, walk-in registration |
| **P1** | D2 — Dr. Anjali (Multi-Doctor) | Revenue driver, complex needs | Multi-doctor schedule, doctor-wise analytics, staff management |
| **P2** | D3 — Dr. Sameer (New Doctor) | Growth potential, onboarding test case | Easy registration, "New Doctor" badge, review system |
| **P0** | A1 — Super Admin | Platform governance | Verification workflow, analytics dashboard, alert system |

---

## 7. Accessibility & Inclusion Notes

| Persona | Accessibility Need | JivniCare Solution |
|---------|-------------------|-------------------|
| P1 — Ramesh | Low vision, low tech literacy | Large fonts (18px+), high contrast, voice prompts, SMS backup |
| P1 — Ramesh | Slow internet | Lightweight screens, offline queue cache, minimal images |
| P2 — Priya | Time-constrained | One-tap rebooking, saved preferences, quick filters |
| P3 — Amit | Remote management | Real-time sync, instant notifications, emergency shortcuts |
| D1 — Dr. Rajesh | Low tech comfort | Simple web UI, Sunita can operate, minimal training needed |
| D1 — Dr. Rajesh | Hindi-only operation | Full Hindi dashboard, voice notes, simple icons |

---

## 8. Document Sign-off

| Role | Name | Status | Date |
|------|------|--------|------|
| Founder | [Founder Name] | ☐ Approved | |
| Product Lead | [To be assigned] | ☐ Approved | |
| UX Lead | [To be assigned] | ☐ Approved | |

---

*"Har user ka alag dard, alag zaroorat — JivniCare sabke liye."*
