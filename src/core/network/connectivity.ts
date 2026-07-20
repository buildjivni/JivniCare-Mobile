import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

/**
 * NetInfo wrapper + connectivity singleton — the folder's documented purpose per
 * `docs/engineering/Sprint-0-Engineering-Design.md`'s folder structure ("`network/` # NetInfo
 * wrapper, connectivity singleton") and Section 4 ("`core/network`'s connectivity listener feeds
 * `uiStore.isOnline`"). This milestone builds the listener only — wiring it into `uiStore`
 * (Zustand, out of scope for Core Foundation) is left to whichever milestone builds `src/store/`.
 */

export type ConnectivityListener = (isConnected: boolean) => void;

/** One-shot connectivity check. */
export async function isConnected(): Promise<boolean> {
  const state: NetInfoState = await NetInfo.fetch();
  return Boolean(state.isConnected);
}

/** Subscribes to connectivity changes; returns an unsubscribe function. */
export function subscribeToConnectivity(listener: ConnectivityListener): () => void {
  return NetInfo.addEventListener((state) => {
    listener(Boolean(state.isConnected));
  });
}
