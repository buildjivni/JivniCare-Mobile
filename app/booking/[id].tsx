import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import {
  BookingWidget,
  BOOKING_ERROR_CODES,
  type BookingErrorCode,
  type BookingSlot,
  type BookingSubmitError,
} from '@/components/molecules';
import { MOCK_DOCTOR } from '@/data/mockDoctor';

const MOCK_SLOTS: BookingSlot[] = [
  { id: 'slot-1', label: '9:00 AM' },
  { id: 'slot-2', label: '9:30 AM' },
  { id: 'slot-3', label: '10:00 AM', disabled: true },
  { id: 'slot-4', label: '10:30 AM' },
  { id: 'slot-5', label: '11:00 AM' },
];

const MOCK_SUBMIT_DELAY_MS = 600;

function formatErrorCodeLabel(code: BookingErrorCode): string {
  return code
    .split('_')
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(' ');
}

// BookingWidget's error copy templates read "Dr. {name}" — MOCK_DOCTOR.name already carries
// the "Dr." prefix for card display, so strip it before handing the name to the widget.
const DOCTOR_NAME_WITHOUT_TITLE = MOCK_DOCTOR.name.replace(/^Dr\.\s*/i, '');

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [confirmedSlotLabel, setConfirmedSlotLabel] = useState<string | undefined>(undefined);

  // --- Error simulator (dev-only) — lets us keep exercising the 13 B6 error codes from
  // docs/05-Business-Rules.md against the real routing flow instead of a standalone sandbox. ---
  const [simulateError, setSimulateError] = useState(false);
  const [selectedErrorCode, setSelectedErrorCode] = useState<BookingErrorCode>(BOOKING_ERROR_CODES[0]);

  const handleBookingSubmit = async (slotId: string) => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_SUBMIT_DELAY_MS));

    if (simulateError) {
      const error: BookingSubmitError = { code: selectedErrorCode, doctorName: DOCTOR_NAME_WITHOUT_TITLE };
      throw error;
    }

    const slot = MOCK_SLOTS.find((s) => s.id === slotId);
    setConfirmedSlotLabel(slot?.label);
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-6 px-4 py-6"
      accessibilityLabel="Booking screen"
    >
      <View className="gap-1">
        <Text
          className="text-[24px] font-bold leading-[29px] text-textPrimary"
          accessibilityRole="header"
        >
          Book Appointment
        </Text>
        <Text className="text-[14px] leading-[21px] text-textSecondary">{MOCK_DOCTOR.name}</Text>
      </View>

      {confirmedSlotLabel ? (
        <View
          className="rounded-[12px] bg-success/10 p-3"
          accessible
          accessibilityLiveRegion="polite"
        >
          <Text className="text-[14px] leading-[21px] text-success">
            Booking confirmed for {confirmedSlotLabel}
          </Text>
        </View>
      ) : null}

      <BookingWidget
        slots={MOCK_SLOTS}
        doctorName={DOCTOR_NAME_WITHOUT_TITLE}
        onSubmit={handleBookingSubmit}
        onSuccess={() => {}}
        accessibilityLabel="Book Appointment widget"
        testID="booking-widget"
      />

      {/* Error simulator toggle (dev-only) — remove once real booking API errors can be
          exercised end-to-end. */}
      <View className="gap-3 rounded-[16px] bg-surface p-4 shadow-md">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-[14px] font-semibold leading-[21px] text-textPrimary">
            Error Simulator (Dev)
          </Text>
          <Switch
            value={simulateError}
            onValueChange={setSimulateError}
            accessibilityLabel="Toggle booking error simulator"
            accessibilityRole="switch"
            accessibilityState={{ checked: simulateError }}
            testID="booking-error-simulator-toggle"
          />
        </View>

        {simulateError ? (
          <View className="flex-row flex-wrap gap-2">
            {BOOKING_ERROR_CODES.map((code) => {
              const isSelected = code === selectedErrorCode;
              return (
                <Pressable
                  key={code}
                  onPress={() => setSelectedErrorCode(code)}
                  className={[
                    'min-h-[36px] items-center justify-center rounded-[8px] border px-3',
                    isSelected ? 'border-primary bg-primary' : 'border-border bg-background',
                  ].join(' ')}
                  accessibilityRole="radio"
                  accessibilityLabel={formatErrorCodeLabel(code)}
                  accessibilityState={{ selected: isSelected, checked: isSelected }}
                  testID={`booking-error-simulator-option-${code}`}
                >
                  <Text
                    className={[
                      'text-[12px] leading-[17px] font-medium',
                      isSelected ? 'text-white' : 'text-textSecondary',
                    ].join(' ')}
                  >
                    {formatErrorCodeLabel(code)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>

      <Text className="text-[12px] leading-[17px] text-textTertiary">Doctor ID: {id}</Text>
    </ScrollView>
  );
}
