import React, { createContext, useContext, useMemo } from 'react';

import { THEME, type Tokens } from './theme';

type ThemeContextValue = Tokens;

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Global theme provider — wraps the app once at the root (see `app/_layout.tsx`) and exposes the
 * full design-token set via `useTheme()`.
 *
 * V1 ships light mode only, per `docs/08-Design-System.md`'s Dark Mode note (scoped to the
 * Admin/Doctor dashboards, not this patient app). This always reads `THEME.light`; wiring a real
 * `colorScheme` preference later only requires changing this one selection, per Section 8's Dark
 * Mode Strategy — no consumer component needs to change, since every consumer already reads
 * colors through `useTheme()` rather than a hardcoded value.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const value = useMemo<ThemeContextValue>(() => THEME.light, []);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Returns the full design-token set (`colors`, `typography`, `spacing`, `radius`, `elevation`,
 * `opacity`). Must be called from within a `ThemeProvider` (mounted once at the app root). */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme() must be used within a <ThemeProvider>.');
  }
  return context;
}
