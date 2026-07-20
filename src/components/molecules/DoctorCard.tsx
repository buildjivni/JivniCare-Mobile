import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { BadgeCheck, Clock } from 'lucide-react-native';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { QueueStatusBadge, type QueueStatusBadgeStatus } from './QueueStatusBadge';
import type { AccessibleProps } from '../../types/accessibility';

// Doctor Availability & Booking Automation overhaul (Founder directive, 2026-07-19) — see
// docs/05-Business-Rules.md Section 16, docs/07-Mobile-UX-Spec.md's DoctorCard Component Spec,
// docs/09-Component-Library.md Section 2.1. `clinicName`/`city` were removed from this card's
// data shape (Clinic Name display requirement removed); `bookingTime`/`opdTime`/`isLive`/
// `isClosed` were added. `queueStatus` is intentionally left unchanged — it remains a separate,
// independently-driven status model per docs/15-Known-Gaps.md Section 2.3.
//
// Premium-redesign pass (Founder directive, 2026-07-19) — see the same three docs' 2026-07-19
// diff notes: added a full-width CTA Button row ("Book Appointment" / disabled "Currently
// Closed"), switched the time row to the short-form "Booking: {time}" / "OPD: {time}" pair with
// `Clock` icon accents, and polished spacing/typography to match the reference premium
// booking-platform layout. The CTA Button reuses `onPress` — it is additive to, not a
// replacement for, the outer card's existing tap-to-navigate behavior (still enabled when
// `isClosed`; only the button itself becomes disabled — see Mobile-UX-Spec.md's "CTA BUTTON
// ROW" subsection for why these two facts don't contradict each other).
export interface DoctorCardDoctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  consultationFee: number;
  profilePhoto?: string;
  isVerified: boolean;
  isEarlyPartner: boolean;
  queueStatus: QueueStatusBadgeStatus;
  patientsAhead?: number;
  patientsServed: number;
  /** Pre-formatted display string, e.g. "7:00 AM" — sourced from doctor.bookingStartTime. */
  bookingTime: string;
  /** Pre-formatted display string, e.g. "10:00 AM" — sourced from doctor.opdStartTime. */
  opdTime: string;
  /** Automated/manual live status per docs/05-Business-Rules.md Rules DA2-DA4. */
  isLive: boolean;
  /** Drives the grayscale/opacity Closed State treatment. Kept separate from `!isLive` per
   * docs/09-Component-Library.md Section 2.1's note. */
  isClosed: boolean;
}

export interface DoctorCardProps extends AccessibleProps {
  doctor: DoctorCardDoctor;
  onPress: () => void;
  /** Optional dedicated handler for the "Book Appointment" CTA (e.g. to route straight to
   * booking instead of the profile). Falls back to `onPress` when omitted, preserving the
   * single-action behavior documented in docs/09-Component-Library.md Section 2.1. */
  onBookPress?: () => void;
  /** Localized early-partner badge label from docs/10-UX-Writing-Guide.md. */
  earlyPartnerBadgeText?: string;
  /** Localized queue-status badge label from docs/10-UX-Writing-Guide.md. */
  queueStatusText: string;
  /** Localized experience suffix, e.g. "yrs exp" / "saal anubhav". */
  experienceLabel?: string;
  /** Localized short-form label from docs/10-UX-Writing-Guide.md Section 22 — "Booking". */
  bookingLabel?: string;
  /** Localized short-form label from docs/10-UX-Writing-Guide.md Section 22 — "OPD". */
  opdLabel?: string;
  /** Localized CTA label from docs/10-UX-Writing-Guide.md Section 6 — "Book Appointment". */
  bookAppointmentLabel?: string;
  /** Localized closed-state CTA label from docs/10-UX-Writing-Guide.md Section 22 — "Currently Closed". */
  closedButtonLabel?: string;
}

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function formatFee(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function DoctorCard({
  doctor,
  onPress,
  onBookPress = onPress,
  earlyPartnerBadgeText = 'Early Partner',
  queueStatusText,
  experienceLabel = 'yrs exp',
  bookingLabel = 'Booking',
  opdLabel = 'OPD',
  bookAppointmentLabel = 'Book Appointment',
  closedButtonLabel = 'Currently Closed',
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityHint,
  accessibilityState,
  testID,
}: DoctorCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const avatarFallback = initialsFromName(doctor.name);

  const containerClasses = [
    'w-full rounded-[20px] bg-surface p-4 shadow-md',
    doctor.isClosed ? 'grayscale opacity-60' : '',
    isPressed ? 'opacity-[0.85]' : '',
    isFocused ? 'border-2 border-borderFocus' : 'border-2 border-transparent',
  ]
    .filter(Boolean)
    .join(' ');

  const cardShadowStyle =
    Platform.OS === 'android' ? { elevation: 4 } : { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 4 } };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={containerClasses}
      style={cardShadowStyle}
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityHint={accessibilityHint}
      accessibilityState={accessibilityState}
      testID={testID}
    >
      <View className="gap-4">
        {/* Row 1: Avatar + identity (name + Blue Tick + Live Dot) + queue status — per
            docs/07-Mobile-UX-Spec.md's DoctorCard Component Spec */}
        <View className="flex-row items-start gap-3">
          <View className="shrink-0">
            <Avatar
              size="xlarge"
              source={doctor.profilePhoto}
              fallback={avatarFallback}
              accessibilityLabel={`${doctor.name}'s photo`}
            />
          </View>

          <View className="min-w-0 flex-1 gap-1">
            <View className="flex-row items-start gap-2">
              <View className="min-w-0 flex-1 gap-0.5">
                <View className="flex-row items-center gap-1">
                  <Text className="shrink text-[18px] font-semibold leading-[23px] text-textPrimary" numberOfLines={1}>
                    {doctor.name}
                  </Text>
                  {doctor.isVerified ? (
                    // "Blue Tick" — DoctorCard-specific substitute for the shared Badge atom's
                    // green `verified` pill, per docs/09-Component-Library.md Section 2.1.
                    <BadgeCheck
                      size={16}
                      color="#5696C7"
                      accessibilityElementsHidden
                      importantForAccessibility="no"
                    />
                  ) : null}
                  {doctor.isLive ? (
                    // "Green Dot" Live Indicator — rendered next to the name, independent of
                    // the Avatar atom's own status dot. Hidden from a11y tree; the card's
                    // overall accessibilityLabel speaks "live now" per the Component Spec.
                    <View
                      className="h-2 w-2 rounded-full bg-success"
                      accessibilityElementsHidden
                      importantForAccessibility="no"
                    />
                  ) : null}
                </View>
                <Text className="text-[14px] leading-[21px] text-textSecondary" numberOfLines={1}>
                  {doctor.specialty} · {doctor.experience} {experienceLabel}
                </Text>
              </View>

              <View className="max-w-[45%] shrink-0">
                <QueueStatusBadge
                  status={doctor.queueStatus}
                  patientsAhead={doctor.patientsAhead}
                  text={queueStatusText}
                  accessibilityLabel={queueStatusText}
                />
              </View>
            </View>

            {doctor.isEarlyPartner ? (
              <View className="mt-1 flex-row flex-wrap gap-1">
                <Badge
                  variant="earlyPartner"
                  text={earlyPartnerBadgeText}
                  accessibilityLabel={`${doctor.name} is an Early Partner doctor`}
                />
              </View>
            ) : null}
          </View>
        </View>

        {/* Row 2: Booking / OPD time strings (short-form pair, with Clock icon accents) —
            replaces the old computed "Next Available" value and the removed Clinic Name row
            (docs/05-Business-Rules.md Rule DA1). */}
        <View className="flex-row items-center gap-2 rounded-[12px] bg-background px-3 py-2.5">
          <View className="min-w-0 flex-1 flex-row items-center gap-1.5">
            <Clock size={14} color="#6B7280" accessibilityElementsHidden importantForAccessibility="no" />
            <Text className="shrink text-[14px] leading-[21px] text-textSecondary" numberOfLines={1}>
              {bookingLabel}: <Text className="font-semibold text-textPrimary">{doctor.bookingTime}</Text>
            </Text>
          </View>
          <View className="h-4 w-px bg-border" />
          <View className="min-w-0 flex-1 flex-row items-center gap-1.5">
            <Clock size={14} color="#6B7280" accessibilityElementsHidden importantForAccessibility="no" />
            <Text className="shrink text-[14px] leading-[21px] text-textSecondary" numberOfLines={1}>
              {opdLabel}: <Text className="font-semibold text-textPrimary">{doctor.opdTime}</Text>
            </Text>
          </View>
        </View>

        {/* Row 3: Fee + experience — fee uses --color-secondary (#4B9F5F) per Design System */}
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-[13px] leading-[18px] text-textSecondary">Consultation Fee</Text>
          <Text className="text-[18px] font-bold leading-[23px] text-secondary">
            {formatFee(doctor.consultationFee)}
          </Text>
        </View>

        {/* Row 4: CTA Button — "Book Appointment" / disabled "Currently Closed" (added
            2026-07-19, premium-redesign pass). Additive to the outer card's own onPress; see
            docs/07-Mobile-UX-Spec.md's "CTA BUTTON ROW" subsection. */}
        <Button
          variant="primary"
          size="large"
          fullWidth
          disabled={doctor.isClosed}
          onPress={onBookPress}
          accessibilityLabel={
            doctor.isClosed
              ? `${closedButtonLabel} — booking unavailable for ${doctor.name}`
              : `${bookAppointmentLabel} with ${doctor.name}`
          }
          testID={testID ? `${testID}-cta` : undefined}
        >
          {doctor.isClosed ? closedButtonLabel : bookAppointmentLabel}
        </Button>
      </View>
    </Pressable>
  );
}

export default DoctorCard;
