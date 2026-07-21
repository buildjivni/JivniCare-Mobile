import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { AsyncStorageAdapter } from '@/core/storage';

/**
 * Section 4's Data Ownership table: "Language preference | **Zustand** (`languageStore`) | Yes —
 * AsyncStorage (non-sensitive, per S02's rule carve-out) | `'hi' | 'en'`".
 *
 * Section 7 assigns "language-toggle orchestration (writes to `languageStore` + `core/i18n`)" to
 * `SettingsService` — not built in Milestone 6 (outside that milestone's explicit 7-service
 * list) — and `core/i18n` itself was never built either (Milestone 3's report: no concrete
 * `LanguageProvider`/`t()` design exists anywhere in the Engineering Design to build against).
 * With neither dependency available, `setLanguage()` only does what this store alone owns —
 * setting and persisting the value — and does **not** attempt to sync a non-existent i18n
 * library.
 *
 * Persistence Ownership: **Persistent** (`language`, via `persist` + `AsyncStorageAdapter`,
 * keyed by the pre-existing `STORAGE_KEYS.SETTINGS_LANGUAGE`). No Session/UI/Derived state lives
 * here.
 */
export type Language = 'hi' | 'en';

export interface LanguageStoreState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageStoreState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS_LANGUAGE,
      storage: createJSONStorage(() => new AsyncStorageAdapter()),
    },
  ),
);
