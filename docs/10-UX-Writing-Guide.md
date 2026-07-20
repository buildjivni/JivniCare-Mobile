# Document 10: UX-Writing-Guide.md
**Version:** V1.2.1 | **Date:** 2026-07-19 | **Status:** LOCKED
**Supersedes:** V1.2.0 — Section 22 gains a note (premium-redesign pass, Founder directive,
2026-07-19) confirming DoctorCard's new CTA Button reuses Section 6's existing "Book Appointment"
string rather than introducing a new one; no strings changed or added, doc-linkage only. V1.1.0
added Section 22 (Doctor Availability & Booking Automation Strings,
Founder directive 2026-07-19) for the new DoctorCard Blue Tick / Live Dot / Closed-State work.
V1.1.0 superseded V1.0.0 — Section 10 (Waitlist Strings) corrected to match
`07-Mobile-UX-Spec.md` S12 exactly (was "Book Now," now "Book with Dr. {name}" — see
`02-Source-of-Truth.md` Corrections Log #6). Section 6 (Blocked States) expanded from 5 to the
full 13 named error codes now confirmed in `05-Business-Rules.md` Rule B6.
**Languages:** Hindi (Primary) + English | **Tone:** Friendly, Clear, Respectful

---

## 1. WRITING PRINCIPLES

```
1. SIMPLE: 8th-grade reading level. No medical jargon.
2. ACTIVE: "We will send you an OTP" not "OTP will be sent"
3. CONSISTENT: Same term everywhere. "Token" not "Ticket" or "Number"
4. EMPATHETIC: "We understand" not "Error occurred"
5. ACTIONABLE: Every message tells user what to do next
6. BILINGUAL: Hindi first for patient-facing, English acceptable for technical terms
```

---

## 2. ONBOARDING STRINGS

### Splash Screen
| English | Hindi |
|---------|-------|
| "Book Doctor Appointments" | "Doctor ki appointment book karein" |
| "Making healthcare accessible" | "Sehat ko sabke liye aasan banayein" |

### Language Selection
| English | Hindi |
|---------|-------|
| "Choose Your Language" | "Apni bhasha chunein" |
| "You can change this anytime in settings" | "Aap isse kabhi bhi settings mein badal sakte hain" |
| "Hindi" | "हिंदी" |
| "English" | "English" |
| "Sab kuch Hindi mein" | "सब कुछ हिंदी में" |
| "Everything in English" | "Everything in English" |
| "Continue" | "Aage badhein" |

### Onboarding Carousel
| English | Hindi |
|---------|-------|
| "Book from Home" | "Ghar se book karein" |
| "Book Doctor Appointments from Home" | "Ghar baithe doctor ki appointment book karein" |
| "Get a token number before you even leave your house" | "Ghar se nikalne se pehle hi aapka number aa jaye" |
| "Live Queue Tracking" | "Live queue tracking" |
| "Track Your Queue Position Live" | "Apni queue position live dekhein" |
| "Know exactly how many patients are ahead of you" | "Jaanein kitne patient aapke aage hain" |
| "Pay at Clinic" | "Clinic pe payment karein" |
| "No Online Payment Needed" | "Online payment ki zaroorat nahi" |
| "Pay the doctor directly at the clinic. Zero platform fees." | "Doctor ko clinic mein sidha payment karein. Koi platform fee nahi." |
| "Skip" | "Skip karein" |
| "Next" | "Aage" |
| "Get Started" | "Shuru karein" |

---

## 3. AUTHENTICATION STRINGS

### Phone Login
| English | Hindi |
|---------|-------|
| "Enter Your Phone Number" | "Apna phone number daalein" |
| "We will send you an OTP" | "Hum aapko OTP bhejenge" |
| "Phone Number" | "Phone number" |
| "Enter 10-digit mobile number" | "10 digit ka mobile number daalein" |
| "Send OTP" | "OTP bhejein" |
| "Sending..." | "Bhej rahe hain..." |
| "Please enter a valid 10-digit number" | "Sahi 10 digit ka number daalein" |
| "This number is blocked. Try another." | "Ye number block hai. Koi aur number daalein." |
| "SMS service unavailable. Please try again shortly." | "SMS service abhi uplabdh nahi hai. Thodi der baad koshish karein." |

### OTP Verification
| English | Hindi |
|---------|-------|
| "Enter OTP" | "OTP daalein" |
| "Sent to" | "Bheja gaya:" |
| "Change" | "Badle" |
| "Resend OTP in 30s" | "30 second mein OTP dubara bhejein" |
| "Resend OTP" | "OTP dubara bhejein" |
| "Verify" | "Verify karein" |
| "Verifying..." | "Verify ho raha hai..." |
| "Invalid OTP. Try again." | "Galat OTP. Dubara koshish karein." |
| "OTP expired. Request a new one." | "OTP expire ho gaya. Naya OTP maangein." |
| "Too many attempts. Try after 15 minutes." | "Bahut zyada koshish. 15 minute baad koshish karein." |
| "Verification service unavailable. Please try again." | "Verification service abhi uplabdh nahi hai. Dubara koshish karein." |

---

## 4. HOME & SEARCH STRINGS

### Home Screen
| English | Hindi |
|---------|-------|
| "Search doctor or symptom..." | "Doctor ya lakshan search karein..." |
| "Change Location" | "Location badle" |
| "Popular Doctors" | "Lokpriya doctor" |
| "Nearby Clinics" | "Aas paas ki clinics" |
| "View All" | "Sab dekhein" |
| "First Visit Free" | "Pehli visit free" |

### Search Focus
| English | Hindi |
|---------|-------|
| "Recent Searches" | "Haal ki searches" |
| "Clear All" | "Sab hataein" |
| "Trending Searches" | "Trending searches" |
| "Fever" | "Bukhar" |
| "Child doctor" | "Bachchon ka doctor" |
| "Bone specialist" | "Haddi ka doctor" |

### Search Results
| English | Hindi |
|---------|-------|
| "No doctors found for '{query}'" | "'{query}' ke liye koi doctor nahi mila" |
| "Request a Doctor in your area" | "Apne area mein doctor ki request karein" |
| "No doctors match these filters" | "Koi doctor in filters se match nahi karta" |
| "Try removing some filters" | "Kuch filters hata kar dekhein" |
| "Doctors joining soon in {district}" | "{district} mein doctor jald aa rahe hain" |
| "Get Notified" | "Notification paayein" |
| "Clear All Filters" | "Sab filters hataein" |
| "Apply Filters" | "Filters lagayein" |
| "Reset All" | "Sab reset karein" |
| "Search failed. Please try again." | "Search fail ho gaya. Dubara koshish karein." |

### Filter Labels
| English | Hindi |
|---------|-------|
| "Specialty" | "Vishayagya" |
| "Availability" | "Upalabdhata" |
| "Any" | "Koi bhi" |
| "Available Today" | "Aaj uplabdh" |
| "Available Tomorrow" | "Kal uplabdh" |
| "Max Fee" | "Maximum fee" |
| "Under ₹500" | "₹500 se kam" |
| "Under ₹1000" | "₹1000 se kam" |
| "Min Experience" | "Minimum anubhav" |
| "5+ Years" | "5+ saal" |
| "10+ Years" | "10+ saal" |
| "15+ Years" | "15+ saal" |

---

## 5. DOCTOR PROFILE STRINGS

| English | Hindi |
|---------|-------|
| "Verified" | "Verified" |
| "Early Partner" | "Early Partner" |
| "years experience" | "saal ka anubhav" |
| "patients served via JivniCare" | "JivniCare ke through patient serve kiye" |
| "About the Doctor" | "Doctor ke baare mein" |
| "Read More" | "Aur padhein" |
| "Read Less" | "Kam padhein" |
| "Education & Qualifications" | "Padhai aur yogyata" |
| "Expertise" | "Vishesh gyan" |
| "Languages Spoken" | "Boli jane wali bhashayein" |
| "Clinic Details" | "Clinic ki jankari" |
| "Address" | "Pata" |
| "Timing" | "Samay" |
| "Owner" | "Malik" |
| "Emergency services available" | "Emergency seva uplabdh hai" |
| "Emergency fee" | "Emergency fee" |
| "Call clinic" | "Clinic ko call karein" |
| "Share Profile" | "Profile share karein" |
| "Copy Link" | "Link copy karein" |
| "Share on WhatsApp" | "WhatsApp par share karein" |
| "Profile not found" | "Profile nahi mila" |
| "Search other doctors" | "Aur doctor dhoondhein" |

### Queue Status Badges
| English | Hindi |
|---------|-------|
| "LIVE · {count} ahead" | "LIVE · {count} aage" |
| "On Break · {message}" | "Break pe hain · {message}" |
| "Queue Full · Join Waitlist" | "Queue full · Waitlist join karein" |
| "Currently Unavailable · Get Notified" | "Abhi uplabdh nahi · Notification paayein" |
| "Your Turn! Please be ready" | "Aapki baari! Taiyaar rahein" |
| "Waiting" | "Intezaar ho raha hai" |
| "Visit Complete" | "Visit pura hua" |

---

## 6. BOOKING STRINGS

### Booking Confirmation
| English | Hindi |
|---------|-------|
| "Book Appointment" | "Appointment book karein" |
| "Your Token Will Be" | "Aapka token hoga" |
| "(estimated)" | "(anumaanit)" — shown next to the pre-confirm token number per `07-Mobile-UX-Spec.md` S08's note that this number may shift by 1-2 before the real API response comes back |
| "patients ahead of you" | "patient aapke aage hain" |
| "Consultation Fee" | "Consultation fee" |
| "Platform Fee" | "Platform fee" |
| "FREE" | "FREE" |
| "Total Payable" | "Kul dena hai" |
| "Pay at Clinic" | "Clinic pe payment karein" |
| "No online payment required" | "Online payment ki zaroorat nahi" |
| "You're saving ₹29 — Early Access Benefit" | "Aap ₹29 bacha rahe hain — Early Access Benefit" |
| "Confirm Booking" | "Booking confirm karein" |
| "Booking..." | "Book ho raha hai..." |

### Consent Checkbox
| English | Hindi |
|---------|-------|
| "I understand JivniCare is a booking platform, not a medical provider. I will pay the consultation fee directly at the clinic." | "Main samajhta/samajhti hoon ki JivniCare ek booking platform hai, medical provider nahi. Main consultation fee sidha clinic mein dunga/dungi." |

### Blocked States — full 13-code table (expanded 2026-07-16 to match `05-Business-Rules.md` Rule B6 exactly)
| Error Code | English | Hindi | Recovery Action |
|---|---|---|---|
| `QUEUE_FULL` | "Queue just got full. Join Waitlist?" | "Queue abhi full ho gaya. Waitlist join karein?" | → S12 Waitlist Join |
| `DAILY_LIMIT_REACHED` (doctor-level) | "No slots today" | "Aaj koi slot nahi hai" | → S12 Waitlist Join |
| `DAILY_LIMIT_REACHED` (patient-level, 3-token cap) | "You have 3 active bookings today" | "Aapke paas aaj 3 active bookings hain" | → Redirect to S10 My Bookings |
| `ALREADY_BOOKED` | "You already have a booking with Dr. {name}" | "Aapka pehle se hi Dr. {name} ke saath booking hai" | → [View Booking] to S09 |
| `DOCTOR_NOT_ACCEPTING` | "Dr. {name} is not accepting bookings" | "Dr. {name} booking nahi le rahe hain" | → Back to S07, no retry |
| `DOCTOR_NOT_VERIFIED` | "This doctor's profile is not currently available" | "Ye doctor ki profile abhi uplabdh nahi hai" | → Back to S06 search results |
| `CLINIC_CLOSED_TODAY` | "Clinic is closed today" | "Clinic aaj band hai" | → Show next open day if known, else back to S07 |
| `CLINIC_CLOSED_ON_THIS_DAY` | "Clinic is closed on this day" | "Clinic is din band rehta hai" | → Same as above |
| `BOOKING_NOT_STARTED` | "Booking opens soon for today" | "Aaj ki booking jald shuru hogi" | → Show opening time if available, [Notify Me] |
| `BOOKING_FINISHED` | "Booking closed for today" | "Aaj ke liye booking band ho gayi hai" | → Suggest next available day |
| `QUEUE_PAUSED` | "Doctor has paused the queue temporarily" | "Doctor ne queue temporarily rok di hai" | → [Retry] after a short wait, no auto-retry |
| `EMERGENCY_FULL` | "Emergency slots are full" | "Emergency slots full hain" | → Suggest nearest alternative if available |
| `EMERGENCY_ONLY_ACTIVE` | "Doctor is accepting emergency cases only right now" | "Doctor abhi sirf emergency case le rahe hain" | → Offer emergency booking path if applicable |
| `WAITLIST_RESERVED` | "This slot is reserved for a waitlisted patient" | "Ye slot ek waitlist patient ke liye reserved hai" | → Offer to join waitlist instead |
| (generic 409, duplicate request) | *(no user-facing error — treat as success, same requestId means the same tap was processed twice)* | *(same)* | → Show the normal success screen, not an error |
| (generic 500) | "Something went wrong" | "Kuchh galat ho gaya" | → [Retry] |

> Do not collapse these into a single generic "Booking failed" message — each has a distinct
> recovery path, and several (`ALREADY_BOOKED`, `DAILY_LIMIT_REACHED` patient-level) should route
> the user somewhere useful rather than just showing an error and stopping.

---

## 7. TOKEN TRACKING STRINGS

| English | Hindi |
|---------|-------|
| "Your Token" | "Aapka token" |
| "patients ahead" | "patient aage hain" |
| "Currently serving" | "Abhi serve ho raha hai" |
| "Your Turn!" | "Aapki baari!" |
| "Please be ready" | "Taiyaar rahein" |
| "Visit Complete" | "Visit pura hua" |
| "Marked as No Show" | "No show mark kiya gaya" |
| "Booking Cancelled" | "Booking cancel ho gayi" |
| "Token Expired" | "Token expire ho gaya" |
| "Get Directions" | "Raasta dekhein" |
| "Cancel Booking" | "Booking cancel karein" |
| "Call Clinic" | "Clinic ko call karein" |
| "Token not found" | "Token nahi mila" |
| "Back to My Bookings" | "Meri bookings par wapas jayein" |

---

## 8. MY BOOKINGS STRINGS

| English | Hindi |
|---------|-------|
| "My Bookings" | "Meri bookings" |
| "Active" | "Active" |
| "Past" | "Pichhla" |
| "No bookings yet" | "Abhi koi booking nahi" |
| "Find a Doctor" | "Doctor dhoondhein" |
| "Track" | "Track karein" |
| "Cancel" | "Cancel karein" |
| "Completed" | "Pura hua" |
| "Cancelled" | "Cancel ho gaya" |
| "No Show" | "No show" |
| "Expired" | "Expire ho gaya" |
| "Failed to load" | "Load nahi ho paya" |

---

## 9. CANCELLATION STRINGS

| English | Hindi |
|---------|-------|
| "Cancel Booking?" | "Booking cancel karein?" |
| "Token #{number} with Dr. {name} will be cancelled." | "Token #{number} Dr. {name} ke saath cancel ho jayega." |
| "Keep Booking" | "Booking rakhein" |
| "Yes, Cancel" | "Haan, cancel karein" |
| "Booking cancelled successfully" | "Booking safaltapurvak cancel ho gayi" |
| "This booking can no longer be cancelled" | "Ye booking ab cancel nahi ho sakti" |

---

## 10. WAITLIST STRINGS

### ⚠️ Corrected 2026-07-16 — see `02-Source-of-Truth.md` Corrections Log #6
| English | Hindi |
|---------|-------|
| "Join Waitlist" | "Waitlist join karein" |
| "Other doctors available now" | "Abhi aur doctor uplabdh hain" |
| "Book with Dr. {name}" | "Dr. {name} ke saath book karein" — **THIS is the single canonical string for the S12 same-specialty-suggestion primary button.** The earlier draft had "Book Now" here and "Book with Dr. {name}" in the screen spec; both now say the latter. Do not reintroduce "Book Now" for this specific button. |
| "Or join waitlist for Dr. {name}" | "Ya Dr. {name} ki waitlist join karein" |
| "We will notify you when a slot opens" | "Jab slot khulega tab hum aapko batayenge" |
| "You are #{position} on the waitlist" | "Aap waitlist mein #{position} number par hain" |
| "We will notify you within 15 minutes when a slot opens" | "Jab slot khulega tab 15 minute ke andar hum aapko batayenge" — **this 15-minute figure is the LOCKED TARGET per Business-Rules.md Rule W1, not what the backend enforces today (see Feature-Dependencies.md P0-5) — do not ship this exact string until the backend timer matches, or change it to a vaguer "shortly" until then.** |
| "Slot Available!" | "Slot khul gaya!" |
| "Dr. {name} has an opening. Tap to claim within 15 min." | "Dr. {name} ke paas jagah hai. 15 minute ke andar claim karein." — same caveat as above |
| "This slot has been taken by someone else." | "Ye slot kisi aur ne le liya hai." — shown when `claim-waitlist`'s response has `data.isTaken: true` (HTTP 200, not an error — see API-Contract.md F12) |

---

## 11. PROFILE STRINGS

| English | Hindi |
|---------|-------|
| "Edit Profile" | "Profile edit karein" |
| "Name" | "Naam" |
| "Email" | "Email" |
| "Phone" | "Phone" |
| "Phone number cannot be changed" | "Phone number badla nahi ja sakta" |
| "Location" | "Location" |
| "Preferred Language" | "Pasandida bhasha" |
| "Change Photo" | "Photo badle" |
| "Save" | "Save karein" |
| "Saving..." | "Save ho raha hai..." |
| "Failed to save changes" | "Badlav save nahi ho paye" |

---

## 12. SETTINGS STRINGS

| English | Hindi |
|---------|-------|
| "Settings" | "Settings" |
| "Account" | "Account" |
| "My Bookings" | "Meri bookings" |
| "Notifications" | "Notifications" |
| "Preferences" | "Pasand" |
| "Language" | "Bhasha" |
| "Support" | "Madad" |
| "Help & Support" | "Madad aur support" |
| "Terms of Use" | "Upyog ke niyam" |
| "Privacy Policy" | "Gopniyata niti" |
| "Medical Disclaimer" | "Medical disclaimer" |
| "Account Management" | "Account management" |
| "Deactivate Account" | "Account deactivate karein" |
| "App Version" | "App version" |
| "Logout" | "Logout karein" |
| "Are you sure you want to logout?" | "Kya aap logout karna chahte hain?" |

> Note: "Dark Mode" removed from this table in V1.1.0 — dark mode is out of scope for the
> patient mobile app per `08-Design-System.md`'s note; it was scoped to the web admin/doctor
> dashboards only in the original draft and shouldn't appear as a mobile Settings toggle.

---

## 13. NOTIFICATION STRINGS

| English | Hindi |
|---------|-------|
| "Notifications" | "Notifications" |
| "Mark All Read" | "Sab padha hua mark karein" |
| "No notifications yet" | "Abhi koi notification nahi" |
| "Booking Confirmed!" | "Booking confirm ho gayi!" |
| "Token #{number} with Dr. {name}. Visit {clinic} today." | "Token #{number} Dr. {name} ke saath. Aaj {clinic} jayein." |
| "Your turn is coming!" | "Aapki baari aa rahi hai!" |
| "Token #{number} — {count} patients ahead. Please be ready." | "Token #{number} — {count} patient aage hain. Taiyaar rahein." |
| "Queue Update" | "Queue update" |
| "{count} patients ahead of you now." | "Ab aapke {count} patient aage hain." |
| "Dr. {name} is {status}" | "Dr. {name} {status} hain" |
| "Your token #{number} is still valid." | "Aapka token #{number} abhi bhi valid hai." |

---

## 14. DATA DELETION STRINGS

| English | Hindi |
|---------|-------|
| "Deactivate Account" | "Account deactivate karein" |
| "Are you sure?" | "Kya aap sure hain?" |
| "Deactivating your account will:" | "Account deactivate karne se:" |
| "Cancel all active bookings" | "Sab active bookings cancel ho jayengi" |
| "Remove you from all waitlists" | "Aap sab waitlists se hat jayenge" |
| "You won't be able to book appointments" | "Aap appointment book nahi kar payenge" |
| "Your data will be retained for 30 days" | "Aapka data 30 din tak rakha jayega" |
| "After 30 days, your account will be permanently deactivated." | "30 din ke baad aapka account hamesha ke liye deactivate ho jayega." |
| "You can reactivate by logging in within 30 days." | "Aap 30 din ke andar login karke reactivate kar sakte hain." — **backend reactivation logic not yet confirmed built, see Feature-Dependencies.md P0-6; do not remove this string, get the backend built to match it** |
| "Enter OTP sent to {phone}" | "{phone} par bheja gaya OTP daalein" — **OTP step confirmed as a locked decision 2026-07-16; backend build required, see P0-3** |
| "Deactivate" | "Deactivate karein" |
| "Deactivating..." | "Deactivate ho raha hai..." |
| "Account deactivated successfully" | "Account safaltapurvak deactivate ho gaya" |
| "Invalid OTP. Try again." | "Galat OTP. Dubara koshish karein." |

---

## 15. LEAD CAPTURE STRINGS

| English | Hindi |
|---------|-------|
| "Request a Doctor" | "Doctor ki request karein" |
| "No doctors found for '{query}' in {district}." | "{district} mein '{query}' ke liye koi doctor nahi mila." |
| "Tell us what you need and we'll notify you when a doctor joins." | "Humein batayein ki aapko kya chahiye, jab doctor aayenge tab hum aapko batayenge." |
| "Describe your symptoms or needs (optional)" | "Apne lakshan ya zaroorat batayein (optional)" |
| "Submit Request" | "Request bhejein" |
| "Submitting..." | "Bheja ja raha hai..." |
| "Thank you! We'll notify you when a doctor joins your area." | "Dhanyawad! Jab aapke area mein doctor aayenge tab hum aapko batayenge." |
| "Back to Search" | "Search par wapas jayein" |

> Note: this form is blocked on the Turnstile mobile-compatibility gap (`API-Contract.md`
> Blocker 2 / `Feature-Dependencies.md` P0-2) — build the UI now, it will not successfully
> submit until that backend work lands.

---

## 16. ERROR STRINGS (general/fallback — see Section 6 for booking-specific codes)

| English | Hindi |
|---------|-------|
| "Something went wrong" | "Kuchh galat ho gaya" |
| "Please try again" | "Dubara koshish karein" |
| "No internet connection" | "Internet connection nahi hai" |
| "Server error" | "Server mein error hai" |
| "Connection failed. Check your internet." | "Connection fail ho gaya. Apna internet check karein." |
| "Too many requests. Please wait." | "Bahut zyada requests. Kripaya intezaar karein." |
| "Page not found" | "Page nahi mila" |
| "Go to Homepage" | "Homepage par jayein" |
| "Access denied" | "Access nahi hai" |
| "This doctor profile is not available" | "Ye doctor profile uplabdh nahi hai" |
| "Search other doctors" | "Aur doctor dhoondhein" |
| "All slots just got filled. Join the waitlist?" | "Sab slots full ho gaye hain. Waitlist join karein?" |

---

## 17. LOADING STRINGS

| English | Hindi |
|---------|-------|
| "Loading..." | "Load ho raha hai..." |
| "Please wait..." | "Kripaya intezaar karein..." |
| "Finding doctors..." | "Doctor dhoondh rahe hain..." |
| "Booking your appointment..." | "Aapki appointment book ho rahi hai..." |
| "Cancelling..." | "Cancel ho raha hai..." |

---

## 18. SUCCESS STRINGS

| English | Hindi |
|---------|-------|
| "Success!" | "Safalta!" |
| "Booking confirmed!" | "Booking confirm ho gayi!" |
| "Changes saved" | "Badlav save ho gaye" |
| "Profile updated" | "Profile update ho gayi" |
| "OTP sent successfully" | "OTP safaltapurvak bheja gaya" |
| "Logged in successfully" | "Safaltapurvak login ho gaye" |

---

## 19. CONFIRMATION DIALOG STRINGS

| English | Hindi |
|---------|-------|
| "Are you sure?" | "Kya aap sure hain?" |
| "This action cannot be undone." | "Ye action wapas nahi ho sakta." |
| "Confirm" | "Confirm karein" |
| "Cancel" | "Cancel karein" |
| "Go Back" | "Wapas jayein" |

---

## 20. OFFLINE STRINGS (new section, 2026-07-16 — closes a gap: offline states were referenced
throughout `07-Mobile-UX-Spec.md`'s per-screen specs but this doc had no dedicated strings for them)

| English | Hindi |
|---------|-------|
| "Reconnecting..." | "Dubara connect ho raha hai..." |
| "You're offline. Showing saved data." | "Aap offline hain. Saved data dikha rahe hain." |
| "This action needs internet. Please reconnect." | "Is action ke liye internet chahiye. Dubara connect karein." |
| "Back online" | "Wapas online" |

---

## 21. STRING FORMATTING RULES

```
1. VARIABLES: Use {variable} format
   Example: "Hello {name}" → "Namaste {name}"

2. PLURALS: Handle in code, not strings
   - 1 patient: "1 patient ahead"
   - 2+ patients: "{count} patients ahead"
   - Hindi: "{count} patient aage hain" (works for all counts)

3. DATES: Use relative time
   - "2 min ago" → "2 minute pehle"
   - "Today" → "Aaj"
   - "Tomorrow" → "Kal"

4. CURRENCY: Always use ₹ prefix
   - "₹500" (not "Rs. 500" or "500 INR")

5. PHONE: Always show +91 prefix
   - "+91 98765 43210"

6. TOKEN NUMBERS: Use # prefix
   - "Token #12" → "Token #12" (same in Hindi)

7. ELLIPSIS: Use ... for truncation
   - "Dr. Rajesh Shar..." not "Dr. Rajesh S..."

8. ACCESSIBILITY LABELS (new 2026-07-16): every string used as an accessibilityLabel per
   09-Component-Library.md Section 0 must come from this document — never hardcode a separate
   English-only label "for screen readers" that diverges from what's visually/audibly shown in
   the active language. If a visual string uses an emoji + text combo (e.g. "🟢 LIVE · 5
   ahead"), its accessibilityLabel equivalent should be the full spoken meaning ("Available
   now, 5 patients ahead"), not the emoji read literally — see the specific examples already
   given per-component in Component-Library.md Section 1.6.
```

---

## 22. DOCTOR AVAILABILITY & BOOKING AUTOMATION STRINGS (new section, 2026-07-19 — see
`05-Business-Rules.md` Section 16 and `07-Mobile-UX-Spec.md`'s DoctorCard Component Spec)

| English | Hindi | Notes |
|---------|-------|-------|
| "Booking: {time}" | "Booking: {time}" | Short-form, for tighter layouts. |
| "OPD: {time}" | "OPD: {time}" | Short-form pairing with the above. |
| "Booking starts at: {time}" | "Booking {time} baje shuru hogi" | Long-form — used in the DoctorCard time row per the Component Spec. Sources the same `bookingTime` value as the short-form string above; use one or the other per component fit, not both on the same card. |
| "OPD opens at: {time}" | "OPD {time} baje khulega" | Long-form pairing with the above. |
| "Currently Closed" | "Abhi band hai" | Closed-state (`isClosed`/`isLive:false`) button/label text. **Distinct from** the existing "Currently Unavailable · Get Notified" Queue Status Badge string (Section 5) — that one belongs to the OLD `queueStatus` OFFLINE state; this one belongs to the NEW `isLive`/`isClosed` model. Do not use interchangeably until `15-Known-Gaps.md` Section 2.3 is resolved. As of the 2026-07-19 premium-redesign pass, this is also the DoctorCard CTA Button's disabled-state label (`07-Mobile-UX-Spec.md`'s "CTA BUTTON ROW"). |

> **Note (added 2026-07-19, premium-redesign pass):** DoctorCard's new CTA Button's enabled-state
> label is the EXISTING "Book Appointment" string already defined in Section 6 above — this is a
> reuse, not a new string. It is deliberately NOT the S07 entry CTA's "Book Appointment Now"
> string (`09-Component-Library.md` Section 1.1's usage example); those remain two distinct
> strings for two distinct screens/components, per `15-Known-Gaps.md` Section 2.2's existing note
> on this exact ambiguity.

---

*String Count: 235+ key strings | Locked: 2026-07-15 | Corrected: 2026-07-16 | Section 22 added:
2026-07-19*
