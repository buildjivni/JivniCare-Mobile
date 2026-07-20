import { IS_DEV } from '@/core/config';
import { consoleLoggerProvider } from './providers/consoleProvider';
import { noopLoggerProvider } from './providers/noopProvider';
import type { LoggerProvider, LogLevel } from './types';

let activeProvider: LoggerProvider = IS_DEV ? consoleLoggerProvider : noopLoggerProvider;

/** Swaps the active `LoggerProvider` — the one seam a future Crashlytics/Sentry integration needs
 * (Section 14). Not called anywhere in this milestone; exported for that future use. */
export function setLoggerProvider(provider: LoggerProvider): void {
  activeProvider = provider;
}

function log(level: LogLevel, message: string, ...args: unknown[]): void {
  activeProvider.log(level, message, ...args);
}

/** The only sanctioned logging surface in the app (Section 14) — never call `console.*` directly
 * elsewhere. */
export const logger = {
  debug: (message: string, ...args: unknown[]) => log('debug', message, ...args),
  info: (message: string, ...args: unknown[]) => log('info', message, ...args),
  warn: (message: string, ...args: unknown[]) => log('warn', message, ...args),
  error: (message: string, ...args: unknown[]) => log('error', message, ...args),
};
