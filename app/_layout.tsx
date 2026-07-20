import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BACKGROUND, NAVY, PRIMARY, SURFACE, ThemeProvider, TITLE } from '@/core/theme';

// Header colors per docs/08-Design-System.md — surface background (Neutral Colors table),
// navy headline text (Primary Colors: "--color-navy: Headers, brand text, authority"), and
// primary for the back-button tint (Primary Colors: "Buttons, links, active states"). Matches
// docs/09-Component-Library.md Section 4.2's Header spec (56px height, centered headline
// title, ChevronLeft back icon). Sourced from the theme token module (Section 8 of
// docs/engineering/Sprint-0-Engineering-Design.md) instead of re-typed hex literals.
const HEADER_COLORS = {
  background: SURFACE,
  title: NAVY,
  tint: PRIMARY,
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            // Flat header per docs/08-Design-System.md's design philosophy ("Flat, high-contrast,
            // soft rounded corners... NOT neumorphism/skeuomorphism") — no shadow, just the
            // surface background color.
            headerStyle: {
              backgroundColor: HEADER_COLORS.background,
            },
            headerShadowVisible: false,
            headerTintColor: HEADER_COLORS.tint,
            headerTitleStyle: {
              color: HEADER_COLORS.title,
              fontSize: TITLE.fontSize,
              fontWeight: TITLE.fontWeight,
            },
            headerTitleAlign: 'center',
            headerBackTitle: '',
            contentStyle: {
              backgroundColor: BACKGROUND,
            },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'JivniCare' }} />
          <Stack.Screen name="doctor/[id]" options={{ title: 'Doctor Profile' }} />
          <Stack.Screen name="booking/[id]" options={{ title: 'Book Appointment' }} />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
