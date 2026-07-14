/**
 * JivniCare Mobile — Auth Store (Zustand)
 * Manages authentication state, user role, and session.
 * 
 * SECURITY COMPLIANCE (iOS Keychain / Android Keystore):
 * - Refresh token is stored in SecureStore (outside Zustand entirely).
 * - Access token is in-memory only (excluded from persist partialize).
 * - Non-sensitive fields (user data, isAuthenticated) are persisted in AsyncStorage.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN" | null;

export interface AuthUser {
  id: string;
  phone?: string;
  email?: string;
  name: string;
  role: UserRole;
  verified?: boolean;
  avatar?: string;
  doctorId?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null; // In-memory only
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  _hasHydrated: boolean;

  // Actions
  login: (user: AuthUser, accessToken: string, refreshToken: string) => Promise<void>;
  updateUser: (partial: Partial<AuthUser>) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  getRefreshToken: () => Promise<string | null>;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isLoggingOut: false,
      _hasHydrated: false,

      login: async (user, accessToken, refreshToken) => {
        try {
          await SecureStore.setItemAsync("jivnicare_refresh_token", refreshToken);
        } catch (e) {
          console.error("Failed to store refresh token securely:", e);
        }
        set({ user, accessToken, isAuthenticated: true, isLoading: false });
      },

      updateUser: (partial) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...partial } });
      },

      logout: async () => {
        set({ isLoggingOut: true, user: null, accessToken: null, isAuthenticated: false });
        try {
          await SecureStore.deleteItemAsync("jivnicare_refresh_token");
        } catch (e) {
          console.error("Failed to delete refresh token from SecureStore:", e);
        }
        set({ isLoggingOut: false });
      },

      setLoading: (isLoading) => set({ isLoading }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      getRefreshToken: async () => {
        try {
          return await SecureStore.getItemAsync("jivnicare_refresh_token");
        } catch (e) {
          return null;
        }
      },

      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "jivnicare-auth-mobile",
      storage: createJSONStorage(() => AsyncStorage),
      // Persist only non-sensitive fields
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function getRoleRedirect(role: UserRole): string {
  switch (role) {
    case "DOCTOR": return "/doctor/dashboard";
    case "ADMIN": return "/admin/dashboard";
    case "PATIENT":
    default: return "/";
  }
}
