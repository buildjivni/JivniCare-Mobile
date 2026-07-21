import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { AsyncStorageAdapter } from '@/core/storage';
import { AuthService } from '@/services';
import type { UserProfile } from '@/types/profile';

/**
 * Section 4's Data Ownership table: "Auth session flag | **Zustand** (`authStore`) | Yes —
 * `isAuthenticated`/user-profile-cache only, via AsyncStorage | `{ isAuthenticated: boolean,
 * user: PublicUserProfile | null }`". No type named `PublicUserProfile` is defined anywhere in
 * the Engineering Design; `src/types/profile.ts`'s `UserProfile` (Milestone 5) already excludes
 * raw tokens (only `id`/`phone`/`name`/`role`/`doctorId`/`latitude`/`longitude`), so it is reused
 * directly here rather than inventing a second, undocumented type.
 *
 * Raw tokens are **never** stored here (Rules SEC1–SEC3) — they live exclusively in
 * `AuthService`'s in-memory cache + `expo-secure-store` (Milestone 6). `logout()` calls
 * `AuthService.logout()` — the one Service dependency this store needs — to clear that token
 * state before clearing its own.
 *
 * Persistence Ownership: **Persistent** (`isAuthenticated` + `user`, via `persist` +
 * `AsyncStorageAdapter`, keyed by `STORAGE_KEYS.AUTH_SESSION_CACHE`). No Session/UI/Derived
 * state lives here.
 */
export interface AuthStoreState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  /** Populated by a future auth Feature hook after `AuthService.verifyOtp()` succeeds. */
  setSession: (user: UserProfile) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      setSession: (user) => set({ isAuthenticated: true, user }),

      logout: async () => {
        await AuthService.logout();
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_SESSION_CACHE,
      storage: createJSONStorage(() => new AsyncStorageAdapter()),
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
    },
  ),
);
