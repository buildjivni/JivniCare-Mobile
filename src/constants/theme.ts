/**
 * JivniCare Mobile — Design Tokens & Theme Configuration
 * Ported from web's globals.css.
 * 
 * DESIGN PARADIGM: Flat, minimalist, high-contrast, soft rounded corners.
 * No heavy shadows, 3D patterns, neumorphism, or claymorphism.
 */

export const THEME_TOKENS = {
  light: {
    background: '#FFFFFF',
    foreground: 'rgba(27, 63, 107, 0.9)', // Brand Navy at 90% opacity
    primary: '#5696C7', // Brand Sky Blue
    primaryForeground: '#FFFFFF',
    primaryHover: '#1A4D7C',
    secondary: '#4B9F5F', // Brand Green
    secondaryForeground: '#FFFFFF',
    navy: '#1B3F6B', // Brand Navy
    card: '#FFFFFF',
    cardForeground: 'rgba(27, 63, 107, 0.9)',
    popover: '#FFFFFF',
    popoverForeground: 'rgba(27, 63, 107, 0.9)',
    muted: 'rgba(86, 150, 199, 0.04)', // Sky Blue at 4%
    mutedForeground: 'rgba(27, 63, 107, 0.6)', // Navy at 60%
    accent: '#F0F9FF',
    accentForeground: '#1B3F6B',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    border: 'rgba(27, 63, 107, 0.1)', // Navy at 10%
    input: 'rgba(27, 63, 107, 0.1)',
    ring: '#5696C7',
    statusOffline: '#64748B',
  },
  dark: {
    background: '#0F172A',
    foreground: '#F8FAFC',
    primary: '#60A5FA',
    primaryForeground: '#0F172A',
    primaryHover: '#3B82F6',
    secondary: '#34D399',
    secondaryForeground: '#0F172A',
    navy: '#1E293B',
    card: '#1E293B',
    cardForeground: '#F8FAFC',
    popover: '#1E293B',
    popoverForeground: '#F8FAFC',
    muted: '#1E293B',
    mutedForeground: '#94A3B8',
    accent: '#1E293B',
    accentForeground: '#F8FAFC',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    border: '#334155',
    input: '#334155',
    ring: '#60A5FA',
    statusOffline: '#64748B',
  },
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const TYPOGRAPHY = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
} as const;
