import { AppError, type AppErrorOptions } from './AppError';

/** Thrown by `core/config` when a required, strongly-typed configuration value is missing or
 * malformed (e.g. an `EXPO_PUBLIC_*` override set to an unrecognized value) — a configuration
 * mistake, not a runtime network/storage failure. */
export class ConfigurationError extends AppError {
  constructor(message: string, options: AppErrorOptions = {}) {
    super(message, options);
    this.name = 'ConfigurationError';
  }
}
