export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * The pluggable seam a future crash/log-reporting SDK (Crashlytics/Sentry) hooks into, per
 * `docs/engineering/Sprint-0-Engineering-Design.md` Section 14: "`core/logger`... [is] designed
 * as... integration point[s] a future Sentry/Firebase Crashlytics SDK would hook into." Swapping
 * the active provider (via `setLoggerProvider`) is the only change needed to add real crash
 * reporting later — every `logger.debug/info/warn/error(...)` call site stays the same.
 */
export interface LoggerProvider {
  log(level: LogLevel, message: string, ...args: unknown[]): void;
}
