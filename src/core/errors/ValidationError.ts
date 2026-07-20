import { AppError, type AppErrorOptions } from './AppError';

export interface ValidationErrorOptions extends AppErrorOptions {
  /** Name of the field that failed validation, when applicable (e.g. for a generic
   * `src/utils/validation.ts` helper to attach which input it was checking). */
  field?: string;
}

/** Thrown by generic, non-business validation helpers (`src/utils/validation.ts`) — never by
 * business-rule validation (13 B6 booking codes, etc.), which stays Service-layer per
 * `docs/engineering/Sprint-0-Engineering-Design.md` Section 3's layering rules. */
export class ValidationError extends AppError {
  readonly field?: string;

  constructor(message: string, options: ValidationErrorOptions = {}) {
    super(message, options);
    this.name = 'ValidationError';
    this.field = options.field;
  }
}
