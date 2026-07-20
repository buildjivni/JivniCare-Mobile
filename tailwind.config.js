/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Exact hex values from docs/08-Design-System.md — kept as a flat, 1:1 mapping of that
      // doc's token names so `bg-primary`, `text-textSecondary`, etc. never drift from the
      // locked spec, and so components don't need to hardcode arbitrary hex values.
      colors: {
        // Primary Colors
        primary: '#5696C7',
        primaryDark: '#2B6CB0',
        secondary: '#4B9F5F',
        secondaryDark: '#2F855A',
        navy: '#1B3F6B',

        // Neutral Colors
        background: '#F8F9FA',
        surface: '#FFFFFF',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        textTertiary: '#9CA3AF',
        border: '#E5E7EB',
        borderFocus: '#5696C7',

        // Semantic Colors
        success: '#16A34A',
        warning: '#F59E0B',
        error: '#DC2626',
        info: '#3B82F6',
        emergency: '#DC2626',

        // Disabled input background (Input System's Text Input "Disabled" spec)
        muted: '#F3F4F6',

        // Status Colors (Queue/Token status table)
        statusAvailable: '#16A34A',
        statusOnBreak: '#F59E0B',
        statusBusy: '#EA580C',
        statusOffline: '#6B7280',
        statusCalled: '#16A34A',
        statusWaiting: '#F59E0B',
        statusCompleted: '#6B7280',
        statusCancelled: '#DC2626',
        statusNoShow: '#6B7280',
        statusExpired: '#6B7280',
      },
    },
  },
  plugins: [],
};
