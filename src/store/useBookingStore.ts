/**
 * JivniCare Mobile — Booking Store (Zustand)
 * Manages appointment booking flow steps and selection state.
 * 
 * Note: In-memory store only, no persistence needed for booking workflow.
 */

import { create } from "zustand";
import type { BookingState, Doctor, QueueToken } from "../types";

export const useBookingStore = create<BookingState>()((set) => ({
  isBookingOpen: false,
  selectedDoctor: null,
  selectedService: null,
  step: "service",
  patientDetails: {
    name: "",
    email: "",
    phone: "",
    location: "",
  },
  generatedToken: null,

  openBooking: (doctor: Doctor) =>
    set({
      isBookingOpen: true,
      selectedDoctor: doctor,
      step: "service",
      selectedService: null,
      generatedToken: null,
    }),

  closeBooking: () => set({ isBookingOpen: false }),

  setStep: (step) => set({ step }),

  setService: (service) => set({ selectedService: service }),

  setDoctor: (doctor: Doctor) => set({ selectedDoctor: doctor }),

  setPatientDetails: (details: Partial<{ name: string; email: string; phone: string; location: string }>) =>
    set((state) => ({
      patientDetails: { ...state.patientDetails, ...details },
    })),

  setGeneratedToken: (token: QueueToken | null) => set({ generatedToken: token }),

  resetBooking: () =>
    set({
      selectedDoctor: null,
      selectedService: null,
      step: "service",
      patientDetails: { name: "", email: "", phone: "", location: "" },
      generatedToken: null,
    }),
}));
