/**
 * Generic key-value storage abstraction. This is deliberately domain-agnostic — it has no
 * knowledge of auth, tokens, or any specific storage key. Per this milestone's explicit scope,
 * it must never be used to implement authentication storage or persist tokens; that remains a
 * future `AuthService`/`core/storage`-consuming milestone's job (Section 16: "`expo-secure-store`
 * ... accessed exclusively through `core/storage`'s `secureStore` wrapper").
 */
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  /** Clears every key this adapter manages. Not every backing implementation supports this — see
   * `SecureStoreAdapter`. */
  clear(): Promise<void>;
}
