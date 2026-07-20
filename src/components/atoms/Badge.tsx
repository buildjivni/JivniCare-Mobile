import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';
import { Check, Star } from 'lucide-react-native';
import type { AccessibleProps } from '../../types/accessibility';

export type BadgeVariant = 'verified' | 'status' | 'earlyPartner';
export type QueueStatus = 'available' | 'onBreak' | 'busy' | 'offline' | 'called' | 'waiting';

export interface BadgeProps extends AccessibleProps {
  variant: BadgeVariant;
  /** Required when variant is 'status'. */
  status?: QueueStatus;
  text: string;
  /** Lucide icon per Design-System.md, NOT the emoji from the copy string. */
  icon?: React.ReactNode;
}

// Status colors per Design-System.md's Status Colors table, sourced from the semantic
// tokens defined in tailwind.config.js.
const STATUS_BG_CLASS: Record<QueueStatus, string> = {
  available: 'bg-statusAvailable',
  onBreak: 'bg-statusOnBreak',
  busy: 'bg-statusBusy',
  offline: 'bg-statusOffline',
  called: 'bg-statusCalled',
  waiting: 'bg-statusWaiting',
};

function DefaultIcon({ variant }: { variant: BadgeVariant }) {
  // Per Design-System.md's Icon Library: `Check` maps to the Verified badge, `Star` maps to
  // Early Partner. Neither is an emoji — this satisfies the emoji/icon split the table calls
  // out for structural UI elements.
  if (variant === 'verified') return <Check size={12} color="#FFFFFF" />;
  if (variant === 'earlyPartner') return <Star size={12} color="#FFFFFF" />;
  return null;
}

export function Badge({
  variant,
  status = 'available',
  text,
  icon,
  accessibilityLabel,
  accessibilityRole = 'text',
  accessibilityHint,
  accessibilityState,
  testID,
}: BadgeProps) {
  const sharedA11yProps = {
    accessible: true,
    accessibilityLabel,
    accessibilityRole,
    accessibilityHint,
    accessibilityState,
    testID,
  };

  const content = (
    <View className="flex-row items-center gap-1 px-2.5 py-1">
      {icon ?? <DefaultIcon variant={variant} />}
      <Text className="text-[12px] leading-[16px] font-semibold text-white" numberOfLines={1}>
        {text}
      </Text>
    </View>
  );

  if (variant === 'earlyPartner') {
    // Design-System.md's Badge System specifies a diagonal gradient
    // (linear-gradient(135deg, #F59E0B, #D97706)) — react-native-svg (already a peer
    // dependency of lucide-react-native) renders this exactly, without pulling in an
    // additional gradient library.
    return (
      <View className="min-h-[24px] overflow-hidden rounded-full" {...sharedA11yProps}>
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Defs>
            <SvgLinearGradient id="earlyPartnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#D97706" />
            </SvgLinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#earlyPartnerGradient)" />
        </Svg>
        {content}
      </View>
    );
  }

  if (variant === 'status') {
    return (
      <View className={`min-h-[24px] flex-row items-center rounded-[8px] ${STATUS_BG_CLASS[status]}`} {...sharedA11yProps}>
        {content}
      </View>
    );
  }

  // verified
  return (
    <View className="min-h-[24px] flex-row items-center rounded-full bg-success" {...sharedA11yProps}>
      {content}
    </View>
  );
}

export default Badge;
