import type { LoggerProvider } from '../types';

/**
 * Production default — silent. `docs/engineering/Sprint-0-Engineering-Design.md` Section 14
 * requires production logs to stay out of the console (there, achieved via a Babel plugin that
 * strips `console.*` calls entirely). This module gets the same outcome — zero console output in
 * production builds — at the `LoggerProvider` level instead, so it needs no extra build-tooling
 * dependency for this milestone. When a real crash-reporting SDK is added, replace this provider
 * (via `setLoggerProvider`) with one that forwards to it — no call site changes needed.
 */
export const noopLoggerProvider: LoggerProvider = {
  log() {
    // Intentionally does nothing.
  },
};
