import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import type { AccessibleProps } from '../../types/accessibility';

export interface OTPInputProps extends AccessibleProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  /** Fires when all digits are entered — used for auto-submit. */
  onComplete?: (value: string) => void;
  error?: boolean;
  success?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

const DEFAULT_LENGTH = 6;

function buildDigitLabel(index: number, length: number): string {
  return `Digit ${index + 1} of ${length}`;
}

function buildGroupLabel(value: string, length: number): string {
  return `Enter ${length} digit OTP, currently ${value.length} digits entered`;
}

function valueToCells(value: string, length: number): string[] {
  const cells = value.split('').slice(0, length);
  while (cells.length < length) cells.push('');
  return cells;
}

function cellsToValue(cells: string[]): string {
  return cells.join('');
}

/** Border classes mirror the Input atom and Design-System.md OTP Input section. */
function cellBorderClass({
  hasError,
  isSuccess,
  isFocused,
  isFilled,
  disabled,
}: {
  hasError: boolean;
  isSuccess: boolean;
  isFocused: boolean;
  isFilled: boolean;
  disabled: boolean;
}): string {
  if (disabled) return 'border-border bg-muted';
  if (hasError) return 'border-error bg-surface';
  if (isSuccess) return 'border-success bg-surface';
  if (isFocused) return 'border-primary bg-[#EFF6FF] shadow-sm';
  if (isFilled) return 'border-primary bg-surface';
  return 'border-border bg-surface';
}

export function OTPInput({
  length = DEFAULT_LENGTH,
  value,
  onChange,
  onComplete,
  error = false,
  success = false,
  autoFocus = false,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  testID,
}: OTPInputProps) {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(autoFocus ? 0 : null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const cells = valueToCells(value, length);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    if (autoFocus && !disabled) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus, disabled]);

  useEffect(() => {
    if (!error || reduceMotion) return;

    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [error, reduceMotion, shakeAnim]);

  const updateValue = useCallback(
    (next: string) => {
      const sanitized = next.replace(/\D/g, '').slice(0, length);
      onChange(sanitized);
      if (sanitized.length === length) {
        onComplete?.(sanitized);
        inputRefs.current[length - 1]?.blur();
      }
    },
    [length, onChange, onComplete],
  );

  const focusIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, length - 1));
      inputRefs.current[clamped]?.focus();
    },
    [length],
  );

  const handleChange = useCallback(
    (index: number, text: string) => {
      if (disabled) return;

      if (text.length > 1) {
        const pasted = text.replace(/\D/g, '').slice(0, length);
        updateValue(pasted);
        focusIndex(Math.min(Math.max(pasted.length - 1, 0), length - 1));
        return;
      }

      const nextCells = valueToCells(value, length);

      if (text === '') {
        nextCells[index] = '';
        updateValue(cellsToValue(nextCells));
        return;
      }

      const digit = text.replace(/\D/g, '').slice(-1);
      if (!digit) return;

      nextCells[index] = digit;
      updateValue(cellsToValue(nextCells));

      if (index < length - 1) {
        focusIndex(index + 1);
      }
    },
    [disabled, focusIndex, length, updateValue, value],
  );

  const handleKeyPress = useCallback(
    (index: number, event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (disabled) return;
      if (event.nativeEvent.key !== 'Backspace') return;

      const nextCells = valueToCells(value, length);

      if (nextCells[index]) {
        nextCells[index] = '';
        updateValue(cellsToValue(nextCells));
        return;
      }

      if (index > 0) {
        nextCells[index - 1] = '';
        updateValue(cellsToValue(nextCells));
        focusIndex(index - 1);
      }
    },
    [disabled, focusIndex, length, updateValue, value],
  );

  return (
    <Animated.View
      style={{ transform: [{ translateX: shakeAnim }] }}
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? buildGroupLabel(value, length)}
      accessibilityHint={accessibilityHint}
      accessibilityState={accessibilityState}
      testID={testID}
    >
      <View className="flex-row justify-between gap-2">
        {cells.map((digit, index) => {
          const isFilled = digit.length > 0;
          const isFocused = focusedIndex === index;
          const borderClass = cellBorderClass({
            hasError: error,
            isSuccess: success,
            isFocused,
            isFilled,
            disabled,
          });

          return (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              className={`h-[56px] w-[48px] rounded-[12px] border text-center text-[18px] font-semibold leading-[27px] text-textPrimary ${borderClass}`}
              value={digit}
              onChangeText={(text) => handleChange(index, text)}
              onKeyPress={(event) => handleKeyPress(index, event)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex((current) => (current === index ? null : current))}
              keyboardType="number-pad"
              maxLength={length}
              selectTextOnFocus
              editable={!disabled}
              accessibilityLabel={buildDigitLabel(index, length)}
              accessibilityRole="text"
              testID={testID ? `${testID}-digit-${index + 1}` : undefined}
            />
          );
        })}
      </View>
    </Animated.View>
  );
}

export default OTPInput;
