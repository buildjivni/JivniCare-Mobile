import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { DoctorCard, type QueueStatusBadgeStatus } from '@/components/molecules';
import { MOCK_DOCTOR } from '@/data/mockDoctor';

const QUEUE_STATUS_TEXT: Record<QueueStatusBadgeStatus, string> = {
  available: 'Available',
  onBreak: 'On Break',
  busy: 'Busy',
  offline: 'Offline',
};

// Placeholder biography copy for the MVP flow — replace with the real profile fields
// (docs/11-API-Contract.md) once the doctor-profile endpoint is wired up.
const MOCK_ABOUT_TEXT =
  'Dr. Rajesh Sharma is a General Physician with over a decade of experience treating ' +
  'patients across common illnesses, chronic condition management, and preventive care. ' +
  'He is known for his patient-first approach and clear, easy-to-follow guidance.';

export default function DoctorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // MVP placeholder — the profile always renders MOCK_DOCTOR regardless of `id` until the
  // real doctor-lookup endpoint is connected.
  const doctor = MOCK_DOCTOR;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-6 px-4 py-6"
      accessibilityLabel="Doctor profile screen"
    >
      <DoctorCard
        doctor={doctor}
        onPress={() => router.push(`/booking/${doctor.id}`)}
        onBookPress={() => router.push(`/booking/${doctor.id}`)}
        queueStatusText={QUEUE_STATUS_TEXT[doctor.queueStatus]}
        accessibilityLabel={`${doctor.name}'s profile card`}
        accessibilityHint="Opens the booking screen for this doctor"
        testID="doctor-profile-card"
      />

      <View className="gap-3">
        <Text
          className="text-[18px] font-semibold leading-[23px] text-textPrimary"
          accessibilityRole="header"
        >
          About
        </Text>
        <Text className="text-[14px] leading-[21px] text-textSecondary">{MOCK_ABOUT_TEXT}</Text>
        <Text className="text-[12px] leading-[17px] text-textTertiary">Doctor ID: {id}</Text>
      </View>
    </ScrollView>
  );
}
