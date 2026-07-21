import { create } from 'zustand';

/**
 * Section 4's Data Ownership table: "In-progress booking draft (pre-confirm) | **Zustand**
 * (`bookingDraftStore`) | No (cleared on submit/unmount) | Selected doctor + consent-checkbox
 * state before `BookingService.book()` fires." This is the *only* documented Booking-domain
 * store — booking history and queue-token tracking are explicitly React Query's job (Section
 * 4's "Rule: React Query and Zustand never duplicate the same data"), not this store's.
 *
 * Fields mirror `src/types/booking.ts`'s `CreateBookingPayload` (Milestone 5) — `doctorId`,
 * `date`, `isEmergency` — plus `consentAccepted`, which Section 7 names as a `BookingService`
 * responsibility ("consent-checkbox gating, pending F19/P0-4") this store merely holds the flag
 * for; the actual gating logic is out of scope here and deferred exactly as Milestone 6 already
 * flagged. This store never calls `BookingService` itself — it only holds pre-submit selection
 * state; the actual `BookingService.book()` call is a future Feature-hook's job, per the
 * doc's own "...before `BookingService.book()` fires" phrasing.
 *
 * Ownership: **Session** (all fields — ephemeral, cleared via `reset()` on submit/unmount, never
 * persisted). No Persistent/UI/Derived state lives here.
 */
export interface BookingDraftStoreState {
  doctorId: string | null;
  date: string | null;
  isEmergency: boolean;
  consentAccepted: boolean;
  setDoctor: (doctorId: string) => void;
  setDate: (date: string | null) => void;
  setIsEmergency: (isEmergency: boolean) => void;
  setConsentAccepted: (consentAccepted: boolean) => void;
  reset: () => void;
}

const initialDraftState = {
  doctorId: null,
  date: null,
  isEmergency: false,
  consentAccepted: false,
} satisfies Pick<BookingDraftStoreState, 'doctorId' | 'date' | 'isEmergency' | 'consentAccepted'>;

export const useBookingDraftStore = create<BookingDraftStoreState>()((set) => ({
  ...initialDraftState,

  setDoctor: (doctorId) => set({ doctorId }),
  setDate: (date) => set({ date }),
  setIsEmergency: (isEmergency) => set({ isEmergency }),
  setConsentAccepted: (consentAccepted) => set({ consentAccepted }),
  reset: () => set(initialDraftState),
}));
