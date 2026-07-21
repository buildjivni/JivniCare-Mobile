import { create } from 'zustand';

import { subscribeToConnectivity } from '@/core/network';

/**
 * Section 4's Data Ownership table: "Network connectivity | **Zustand** (`uiStore`) | No |
 * `isOnline: boolean`, fed by a `core/network` NetInfo listener" and "Toast/banner queue |
 * **Zustand** (`uiStore`) | No | Ephemeral UI notifications." Per the folder tree comment,
 * `uiStore.ts` owns exactly these two concerns: "isOnline, toast queue, global banners."
 *
 * `core/network`'s own comment (`connectivity.ts`, Milestone 3) explicitly deferred wiring its
 * listener into `uiStore` to "whichever milestone builds `src/store/`" — this module does that
 * wiring once, at module load, directly (a Core dependency, not a Service — both are permitted
 * for the State layer).
 *
 * Toast/banner exact field shapes are not itemized anywhere in the Engineering Design beyond
 * "toast queue, global banners" — kept deliberately minimal (`id` + `message` only) rather than
 * guessed at further.
 *
 * Ownership: **Session** (`isOnline`, resets every app launch, no persistence). **UI**
 * (`toasts`/`banners`, ephemeral notification queues). No Persistent/Derived state lives here.
 */
export interface UiToast {
  id: string;
  message: string;
}

export interface UiBanner {
  id: string;
  message: string;
}

export interface UiStoreState {
  isOnline: boolean;
  toasts: UiToast[];
  banners: UiBanner[];
  setOnline: (isOnline: boolean) => void;
  showToast: (toast: UiToast) => void;
  dismissToast: (id: string) => void;
  showBanner: (banner: UiBanner) => void;
  dismissBanner: (id: string) => void;
}

export const useUiStore = create<UiStoreState>()((set) => ({
  isOnline: true,
  toasts: [],
  banners: [],

  setOnline: (isOnline) => set({ isOnline }),

  showToast: (toast) => set((state) => ({ toasts: [...state.toasts, toast] })),
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),

  showBanner: (banner) => set((state) => ({ banners: [...state.banners, banner] })),
  dismissBanner: (id) =>
    set((state) => ({ banners: state.banners.filter((banner) => banner.id !== id) })),
}));

subscribeToConnectivity((isConnected) => {
  useUiStore.getState().setOnline(isConnected);
});
