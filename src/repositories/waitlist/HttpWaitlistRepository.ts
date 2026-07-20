import { apiClient } from '@/api';
import type { WaitlistClaimResult } from '@/types/waitlist';

import type { WaitlistRepository } from './WaitlistRepository';
import { assertSuccessResponse, NotImplementedError } from '../shared';

/**
 * Real implementation. `join()` throws `NotImplementedError`: the design doc itself flags the
 * waitlist join step as "an undocumented endpoint" (Section 6, see `15-Known-Gaps.md` §2.1) — no
 * URL is fabricated.
 *
 * `claim()` calls F12's documented `claim-waitlist` endpoint. Both of its 200-status response
 * variants (successful claim vs. slot-already-taken) share one outer `{success, data}` envelope;
 * this method returns the inner `data` object unchanged so a future caller can check
 * `data.success`/`data.isTaken` itself, per the contract's explicit warning not to rely on HTTP
 * status alone — this repository makes no decision about which variant occurred.
 */
export class HttpWaitlistRepository implements WaitlistRepository {
  async join(_doctorId: string): Promise<void> {
    throw new NotImplementedError(
      'WaitlistRepository.join',
      'the waitlist join endpoint is undocumented',
    );
  }

  async claim(doctorId: string): Promise<WaitlistClaimResult> {
    const response = await apiClient.request<{ success: boolean; data: WaitlistClaimResult }>(
      '/api/patient/queue/claim-waitlist',
      'POST',
      { body: { doctorId } },
    );
    const body = assertSuccessResponse(response, 'WaitlistRepository.claim');
    return body.data;
  }
}
