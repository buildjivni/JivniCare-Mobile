import type { LoggerProvider, LogLevel } from '../types';

const CONSOLE_METHOD: Record<LogLevel, (...args: unknown[]) => void> = {
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

/** Development default — thin wrapper over `console.*`, per this milestone's "console-backed
 * implementation only" requirement. This is the only file in the module allowed to touch
 * `console.*` directly; every call site elsewhere goes through `logger.*`. */
export const consoleLoggerProvider: LoggerProvider = {
  log(level, message, ...args) {
    CONSOLE_METHOD[level](`[${level.toUpperCase()}] ${message}`, ...args);
  },
};
