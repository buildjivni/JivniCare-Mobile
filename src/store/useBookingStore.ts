/**
 * JivniCare Mobile — Booking Store (Zustand)
 * Manages appointment booking flow steps and selection state.
 * 
 * Persisted in AsyncStorage to prevent form data loss when app is put in background.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { BookingState, Doctor, QueueToken } from "../types";

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "jivnicare-booking-storage-mobile",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
