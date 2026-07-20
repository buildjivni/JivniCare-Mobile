import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { PRIMARY, TEXT_PRIMARY, WHITE } from '@/core/theme';
import type { AccessibleProps } from '@/types/accessibility';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends AccessibleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  /** Use docs/08-Design-System.md's Icon Library — Lucide, not emoji. */
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Heights per Design-System.md Button System ("Height: 48px (minimum)" for primary/
// secondary/danger, 44px for ghost).
const HEIGHT_CLASS: Record<ButtonSize, string> = {
  small: 'min-h-[40px]',
  medium: 'min-h-[48px]',
  large: 'min-h-[56px]',
};

// Sizes whose visual height dips below the 44px accessibility floor get extra hitSlop so
// the tappable area still meets the Apple HIG / WCAG 2.1 minimum without inflating the
// visual footprint.
const HIT_SLOP: Record<ButtonSize, { top: number; bottom: number; left: number; right: number }> = {
  small: { top: 2, bottom: 2, left: 4, right: 4 },
  medium: { top: 0, bottom: 0, left: 0, right: 0 },
  large: { top: 0, bottom: 0, left: 0, right: 0 },
};

const TEXT_SIZE_CLASS: Record<ButtonSize, string> = {
  small: 'text-[14px] leading-[21px]',
  medium: 'text-[16px] leading-[24px]',
  large: 'text-[16px] leading-[24px]',
};

// Base (resting) appearance per variant, using the semantic color tokens defined in
// tailwind.config.js (mirroring Design-System.md's Color Palette / Button System sections).
const VARIANT_CONTAINER: Record<ButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-transparent border border-primary',
  danger: 'bg-error',
  ghost: 'bg-transparent',
  // "Outline" isn't its own entry in Design-System.md's Button System — it's inferred here
  // as a neutral-bordered sibling to "Secondary" (which is brand-colored), using the same
  // --color-border token already defined for inputs/dividers.
  outline: 'bg-transparent border border-border',
};

// Pressed-state shift per variant, per Design-System.md's per-variant "Pressed:" line.
// Filled buttons (primary/danger) dim via opacity; outlined/transparent buttons tint their
// background instead — both are opacity/background shifts only, never a scale transform.
const VARIANT_CONTAINER_PRESSED: Record<ButtonVariant, string> = {
  primary: 'opacity-[0.85]',
  secondary: 'bg-primary/[0.08]',
  danger: 'opacity-[0.85]',
  ghost: 'bg-primary/[0.08]',
  // Borrows the Icon Button's documented pressed treatment ("background --color-text-tertiary
  // at 10% opacity") since Outline has no dedicated spec of its own.
  outline: 'bg-textTertiary/[0.10]',
};

const VARIANT_TEXT_CLASS: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-primary',
  danger: 'text-white',
  ghost: 'text-primary',
  outline: 'text-textPrimary',
};

const VARIANT_ICON_COLOR: Record<ButtonVariant, string> = {
  primary: WHITE,
  secondary: PRIMARY,
  danger: WHITE,
  ghost: PRIMARY,
  outline: TEXT_PRIMARY,
};

export function Button({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
  children,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityHint,
  accessibilityState,
  testID,
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isDisabled = disabled || loading;

  const containerClasses = [
    'flex-row items-center justify-center rounded-[12px] px-4',
    HEIGHT_CLASS[size],
    VARIANT_CONTAINER[variant],
    isPressed && !isDisabled ? VARIANT_CONTAINER_PRESSED[variant] : '',
    // Focus ring per Design-System.md's per-variant "Focus:" line (2px outline in
    // --color-border-focus) — external keyboard/switch-control navigation, not just mouse.
    isFocused ? 'border-2 border-borderFocus' : '',
    isDisabled ? 'opacity-50' : '',
    fullWidth ? 'w-full' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const textClasses = ['font-semibold', TEXT_SIZE_CLASS[size], VARIANT_TEXT_CLASS[variant]].join(
    ' ',
  );

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      disabled={isDisabled}
      hitSlop={HIT_SLOP[size]}
      className={containerClasses}
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ ...accessibilityState, disabled: isDisabled, busy: loading }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={VARIANT_ICON_COLOR[variant]} size="small" />
      ) : (
        <>
          {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
          <Text className={textClasses} numberOfLines={1}>
            {children}
          </Text>
          {rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
        </>
      )}
    </Pressable>
  );
}

export default Button;
