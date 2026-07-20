import type { QueueToken } from '@/types/booking';

import type { QueueRepository } from './QueueRepository';
import { NotImplementedError } from '../shared';

/**
 * Real implementation. `getTokenStatus()` throws `NotImplementedError`: `docs/11-API-Contract.md`'s
 * only documented F09 transport is a Server-Sent Events stream (`GET
 * /api/patient/bookings/stream`) — a persistent connection, not a single JSON response — which
 * `ApiClient.request()` (Milestone 4) cannot represent as a one-shot `Promise<QueueToken>`. No
 * simple polling GET is documented as an alternative. This is a genuine transport mismatch
 * between this milestone's `QueueRepository` interface (Section 6, Promise-based) and the API
 * Contract, flagged in `docs/implementation/M5-Repository-Foundation-Report.md` rather than
 * worked around by fabricating a URL or half-implementing SSE here.
 */
export class HttpQueueRepository implements QueueRepository {
  async getTokenStatus(_tokenId: string): Promise<QueueToken> {
    throw new NotImplementedError(
      'QueueRepository.getTokenStatus',
      'F09 only documents an SSE stream transport, incompatible with a one-shot Promise-based fetch',
    );
  }
}
