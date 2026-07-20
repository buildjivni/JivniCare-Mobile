import React, { useState } from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  ReturnKeyTypeOptions,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import type { AccessibleProps } from '@/types/accessibility';

export type InputType = 'text' | 'phone' | 'search';

export interface InputProps extends AccessibleProps {
  type?: InputType;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  // Conceptually REQUIRED per docs/09-Component-Library.md Section 1.2 — if omitted,
  // accessibilityLabel must carry the same information for screen-reader users.
  label?: string;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
}

const KEYBOARD_TYPE_BY_INPUT_TYPE: Record<InputType, KeyboardTypeOptions> = {
  text: 'default',
  phone: 'phone-pad',
  search: 'default',
};

const COLOR_BORDER_FOCUS = '#5696C7';
const COLOR_ERROR = '#DC2626';
const COLOR_TEXT_TERTIARY = '#9CA3AF';

export function Input({
  type = 'text',
  value,
  onChangeText,
  placeholder,
  label,
  error,
  disabled = false,
  maxLength,
  autoFocus,
  returnKeyType,
  onSubmitEditing,
  accessibilityLabel,
  accessibilityRole = 'text',
  accessibilityHint,
  accessibilityState,
  testID,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);
  const isFilled = value.length > 0;

  const borderClass = hasError
    ? 'border-error'
    : isFocused
      ? 'border-borderFocus'
      : // Mirrors OTPInput's documented "Filled" border treatment (Design-System.md OTP Input
        // section) for visual consistency across the input family — Text Input has no dedicated
        // "Filled" spec of its own.
        isFilled
        ? 'border-primary'
        : 'border-border';

  const containerClasses = [
    'min-h-[48px] flex-row items-center rounded-[12px] border bg-surface px-4',
    borderClass,
    isFocused && !hasError ? 'shadow-sm' : '',
    disabled ? 'bg-muted' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const iconColor = hasError ? COLOR_ERROR : isFocused ? COLOR_BORDER_FOCUS : COLOR_TEXT_TERTIARY;
  const textColorClass = disabled ? 'text-textTertiary' : 'text-textPrimary';

  return (
    <View>
      {label ? (
        <Text className="mb-1 text-[12px] leading-[17px] text-textSecondary">{label}</Text>
      ) : null}
      <View className={containerClasses}>
        {type === 'search' ? <Search size={20} color={iconColor} /> : null}
        <TextInput
          className={`ml-2 flex-1 text-[14px] leading-[21px] ${textColorClass}`}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLOR_TEXT_TERTIARY}
          editable={!disabled}
          maxLength={maxLength}
          autoFocus={autoFocus}
          keyboardType={KEYBOARD_TYPE_BY_INPUT_TYPE[type]}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole={accessibilityRole}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ ...accessibilityState, disabled }}
          testID={testID}
        />
        {type === 'search' && isFilled && !disabled ? (
          <Pressable
            onPress={() => onChangeText('')}
            style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <X size={18} color={COLOR_TEXT_TERTIARY} />
          </Pressable>
        ) : null}
      </View>
      {hasError ? (
        // Error text is associated with the field and announced without requiring the user
        // to re-focus it, per docs/09-Component-Library.md Section 1.2.
        <Text
          className="mt-1 text-[12px] leading-[17px] text-error"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export default Input;
