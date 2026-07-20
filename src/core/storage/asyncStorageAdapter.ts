import AsyncStorage from '@react-native-async-storage/async-storage';

import { StorageError } from '@/core/errors';

import type { StorageAdapter } from './types';

/** `@react-native-async-storage/async-storage` wrapper — for non-sensitive, persisted values
 * only (e.g. a future `languageStore` persistence, per Section 4's data-classification table).
 * Never for tokens; see `SecureStoreAdapter`. */
export class AsyncStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (cause) {
      throw new StorageError(`AsyncStorageAdapter: failed to read "${key}"`, { cause });
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (cause) {
      throw new StorageError(`AsyncStorageAdapter: failed to write "${key}"`, { cause });
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (cause) {
      throw new StorageError(`AsyncStorageAdapter: failed to remove "${key}"`, { cause });
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (cause) {
      throw new StorageError('AsyncStorageAdapter: failed to clear storage', { cause });
    }
  }
}
