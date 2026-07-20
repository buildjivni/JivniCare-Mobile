import type { QueueToken } from '@/types/booking';

/**
 * F09 — matches
 * `docs/engineering/Sprint-0-Engineering-Design.md` Section 6's `QueueRepository` interface
 * exactly. No speculative methods added.
 */
export interface QueueRepository {
  getTokenStatus(tokenId: string): Promise<QueueToken>;
}
