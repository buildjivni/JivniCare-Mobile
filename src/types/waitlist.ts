import type { QueueToken } from './booking';

/**
 * F12 — `docs/11-API-Contract.md` documents two distinct 200-status response shapes for
 * `claim-waitlist`, both under one outer `{success:true, data: {...}}` envelope: a successful
 * claim (`{success:true, message, token}`) and an already-taken race loss
 * (`{success:false, message, isTaken:true}`). This type models the inner `data` object covering
 * both — the contract's own explicit warning is that a caller must check `success`/`isTaken`
 * here, not just the HTTP status.
 */
export interface WaitlistClaimResult {
  success: boolean;
  message: string;
  token?: QueueToken;
  isTaken?: boolean;
}
