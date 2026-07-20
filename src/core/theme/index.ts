/**
 * Public entry point for the theme system. Other modules should import from `@/core/theme`
 * without knowing this folder's internal file layout (Section 8 of
 * `docs/engineering/Sprint-0-Engineering-Design.md`).
 */

export { ThemeProvider, useTheme } from './ThemeProvider';
export { THEME } from './theme';
export type { Theme, Tokens } from './theme';

export * from './tokens/colors';
export * from './tokens/typography';
export * from './tokens/spacing';
export * from './tokens/radius';
export * from './tokens/elevation';
export * from './tokens/opacity';
