/**
 * JivniCare Mobile — Location Store (Zustand)
 * Manages user selected district and coordinates.
 * Persisted in AsyncStorage.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { normalizeDistrict } from "../constants/districts";

interface LocationState {
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setDistrict: (district: string | null) => void;
  setCoordinates: (lat: number, lng: number) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      district: null,
      latitude: null,
      longitude: null,
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
      setDistrict: (district) => set({ district: normalizeDistrict(district) || null }),
      setCoordinates: (lat, lng) => set({ latitude: lat, longitude: lng }),
      clearLocation: () => set({ district: null, latitude: null, longitude: null }),
    }),
    {
      name: "jivnicare_location_mobile",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
