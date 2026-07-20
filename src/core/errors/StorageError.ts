import { AppError, type AppErrorOptions } from './AppError';

/** Thrown by `core/storage`'s adapters (`SecureStoreAdapter`/`AsyncStorageAdapter`) when the
 * underlying native storage call fails or is unsupported (e.g. `expo-secure-store` has no native
 * "clear all" API). */
export class StorageError extends AppError {
  constructor(message: string, options: AppErrorOptions = {}) {
    super(message, options);
    this.name = 'StorageError';
  }
}
