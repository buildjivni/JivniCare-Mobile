import * as SecureStore from 'expo-secure-store';

import { StorageError } from '@/core/errors';

import type { StorageAdapter } from './types';

/**
 * `expo-secure-store` wrapper (Keychain on iOS, Keystore on Android) — per Section 16, this is
 * meant to become the **only** file that calls `expo-secure-store` directly once a future
 * milestone builds token persistence on top of it. This milestone only builds the generic
 * adapter; it stores no auth data itself.
 */
export class SecureStoreAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (cause) {
      throw new StorageError(`SecureStoreAdapter: failed to read "${key}"`, { cause });
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (cause) {
      throw new StorageError(`SecureStoreAdapter: failed to write "${key}"`, { cause });
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (cause) {
      throw new StorageError(`SecureStoreAdapter: failed to remove "${key}"`, { cause });
    }
  }

  /** `expo-secure-store` has no native "delete everything" API — callers must remove known keys
   * individually. Throwing (rather than silently no-op-ing) makes this limitation visible at the
   * call site instead of masking a bug. */
  clear(): Promise<void> {
    throw new StorageError(
      'SecureStoreAdapter.clear() is not supported by expo-secure-store — remove keys individually.',
    );
  }
}
