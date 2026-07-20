import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { WaitlistForm } from '@/components/organisms';
import { DoctorCard, type QueueStatusBadgeStatus } from '@/components/molecules';
import { MOCK_DOCTOR } from '@/data/mockDoctor';

// Localized queue-status labels — sourced from docs/10-UX-Writing-Guide.md by the screen,
// per docs/09-Component-Library.md Section 2.1 (DoctorCard never hardcodes this copy itself).
const QUEUE_STATUS_TEXT: Record<QueueStatusBadgeStatus, string> = {
  available: 'Available',
  onBreak: 'On Break',
  busy: 'Busy',
  offline: 'Offline',
};

export default function HomeScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(false);
  const [position, setPosition] = useState<number | undefined>(undefined);

  const handleWaitlistSubmit = () => {
    setSubmitError(undefined);
    setLoading(true);
    // Mocked submit — replace with the real waitlist endpoint per docs/11-API-Contract.md.
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setPosition(4);
    }, 800);
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-6 px-4 py-6"
      accessibilityLabel="Home screen"
    >
      <WaitlistForm
        name={name}
        onChangeName={setName}
        phone={phone}
        onChangePhone={setPhone}
        onSubmit={handleWaitlistSubmit}
        loading={loading}
        submitError={submitError}
        success={success}
        position={position}
        accessibilityLabel="Join Waitlist"
        testID="home-waitlist-form"
      />

      <View className="gap-3">
        <Text
          className="text-[18px] font-semibold leading-[23px] text-textPrimary"
          accessibilityRole="header"
        >
          Featured Doctors
        </Text>

        <DoctorCard
          doctor={MOCK_DOCTOR}
          onPress={() => router.push(`/doctor/${MOCK_DOCTOR.id}`)}
          onBookPress={() => router.push(`/booking/${MOCK_DOCTOR.id}`)}
          queueStatusText={QUEUE_STATUS_TEXT[MOCK_DOCTOR.queueStatus]}
          accessibilityLabel={`View ${MOCK_DOCTOR.name}'s profile`}
          accessibilityHint="Opens the doctor's full profile"
          testID="home-featured-doctor-card"
        />
      </View>
    </ScrollView>
  );
}
