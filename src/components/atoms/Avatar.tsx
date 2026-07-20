import React from 'react';
import { Image, Text, View } from 'react-native';
import { User } from 'lucide-react-native';
import { TEXT_SECONDARY } from '@/core/theme';
import type { AccessibleProps } from '@/types/accessibility';

export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';
export type AvatarStatus = 'online' | 'offline' | 'busy';

export interface AvatarProps extends AccessibleProps {
  source?: string;
  size: AvatarSize;
  /** Initials or icon fallback when no photo is available. */
  fallback?: string;
  status?: AvatarStatus;
}

// Sizes per docs/09-Component-Library.md Section 1.7.
const SIZE_CLASS: Record<AvatarSize, string> = {
  small: 'h-8 w-8',
  medium: 'h-12 w-12',
  large: 'h-16 w-16',
  xlarge: 'h-20 w-20',
};

const ICON_SIZE: Record<AvatarSize, number> = {
  small: 16,
  medium: 20,
  large: 28,
  xlarge: 32,
};

const TEXT_SIZE_CLASS: Record<AvatarSize, string> = {
  small: 'text-[12px]',
  medium: 'text-[14px]',
  large: 'text-[16px]',
  xlarge: 'text-[18px]',
};

const STATUS_DOT_CLASS: Record<AvatarStatus, string> = {
  online: 'bg-secondary',
  offline: 'bg-statusOffline',
  busy: 'bg-statusBusy',
};

export function Avatar({
  source,
  size,
  fallback,
  status,
  accessibilityLabel,
  accessibilityRole = 'image',
  accessibilityHint,
  accessibilityState,
  testID,
}: AvatarProps) {
  const containerClass = `${SIZE_CLASS[size]} items-center justify-center overflow-hidden rounded-full bg-muted`;

  return (
    <View className="relative" accessible={false}>
      <View
        className={containerClass}
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        accessibilityHint={accessibilityHint}
        accessibilityState={accessibilityState}
        testID={testID}
      >
        {source ? (
          <Image source={{ uri: source }} className="h-full w-full" resizeMode="cover" />
        ) : fallback ? (
          <Text
            className={`font-semibold text-textSecondary ${TEXT_SIZE_CLASS[size]}`}
            numberOfLines={1}
          >
            {fallback}
          </Text>
        ) : (
          <User size={ICON_SIZE[size]} color={TEXT_SECONDARY} />
        )}
      </View>
      {status ? (
        <View
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface ${STATUS_DOT_CLASS[status]}`}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      ) : null}
    </View>
  );
}

export default Avatar;
