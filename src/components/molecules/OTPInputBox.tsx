import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { OTPInput } from '../atoms/OTPInput';
import type { AccessibleProps } from '../../types/accessibility';

/**
 * OTP verification failure codes mapped from F01 `POST /api/v1/auth/verify-otp`
 * (docs/11-API-Contract.md). Note: the 13 named codes in `05-Business-Rules.md` Rule B6
 * belong to F08 Book Appointment — they do not apply to OTP verification.
 */
export type OtpVerifyErrorCode =
  | 'INVALID_OTP'
  | 'OTP_EXPIRED'
  | 'RATE_LIMITED'
  | 'SERVICE_UNAVAILABLE'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'MAX_ATTEMPTS_EXCEEDED';

/** Maps F01 verify-otp HTTP failures to a typed error code for OTPInputBox state handling. */
export function mapVerifyOtpApiError(status: number, message?: string): OtpVerifyErrorCode {
  if (status === 429) return 'RATE_LIMITED';
  if (status === 503) return 'SERVICE_UNAVAILABLE';
  if (status === 500) return 'SERVER_ERROR';
  if (status === 400) return 'VALIDATION_ERROR';
  if (status === 401) {
    const normalized = message?.toLowerCase() ?? '';
    if (normalized.includes('expired')) return 'OTP_EXPIRED';
    return 'INVALID_OTP';
  }
  return 'SERVER_ERROR';
}

export interface OTPInputBoxProps extends AccessibleProps {
  phone: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onChangePhone: () => void;
  /** Localized error string from docs/10-UX-Writing-Guide.md OTP Verification section. */
  error?: string;
  /** Typed failure from F01 verify-otp — drives error border when set. */
  errorCode?: OtpVerifyErrorCode;
  countdown: number;
  maxAttempts: number;
  attemptsUsed: number;
  /** Shows green success borders on OTP cells after successful verification. */
  success?: boolean;
  /** Disables OTP entry while verify/resend requests are in flight. */
  disabled?: boolean;
  /** Localized "Sent to +91 XXXXXX7890" prefix. */
  sentToPrefix?: string;
  /** Localized change-phone action label. */
  changePhoneLabel?: string;
  /** Localized resend countdown, e.g. "Resend OTP in 30s". */
  resendCountdownLabel?: string;
  /** Localized resend action label when countdown reaches zero. */
  resendLabel?: string;
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length < 4) return phone;
  return `+91 XXXXXX${digits.slice(-4)}`;
}

export function OTPInputBox({
  phone,
  onVerify,
  onResend,
  onChangePhone,
  error,
  errorCode,
  countdown,
  maxAttempts,
  attemptsUsed,
  success = false,
  disabled = false,
  sentToPrefix = 'Sent to',
  changePhoneLabel = 'Change',
  resendCountdownLabel,
  resendLabel = 'Resend OTP',
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  testID,
}: OTPInputBoxProps) {
  const [otp, setOtp] = useState('');
  const [resendReadyAnnounced, setResendReadyAnnounced] = useState(countdown === 0);
  const prevCountdownRef = useRef(countdown);
  const prevErrorRef = useRef<string | undefined>(error);

  useEffect(() => {
    if (error && error !== prevErrorRef.current) {
      setOtp('');
    }
    prevErrorRef.current = error;
  }, [error]);

  const maxAttemptsReached = attemptsUsed >= maxAttempts;
  const hasError = Boolean(error) || maxAttemptsReached || Boolean(errorCode);
  const isInputDisabled = disabled || maxAttemptsReached || success;
  const canResend = countdown === 0 && !disabled && !maxAttemptsReached;
  const maskedPhone = maskPhone(phone);
  const countdownText = resendCountdownLabel ?? `Resend OTP in ${countdown}s`;

  useEffect(() => {
    if (prevCountdownRef.current > 0 && countdown === 0) {
      setResendReadyAnnounced(false);
    }
    prevCountdownRef.current = countdown;
  }, [countdown]);

  const handleResendAnnounce = () => {
    if (!resendReadyAnnounced) {
      setResendReadyAnnounced(true);
    }
  };

  return (
    <View className="gap-4" accessible={false}>
      <View className="flex-row flex-wrap items-center gap-1">
        <Text className="text-[14px] leading-[21px] text-textSecondary">
          {sentToPrefix} {maskedPhone}
        </Text>
        <Pressable
          onPress={onChangePhone}
          disabled={disabled}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={changePhoneLabel}
          accessibilityHint="Returns to phone number entry"
          accessibilityState={{ disabled }}
        >
          <Text className="text-[14px] font-semibold leading-[21px] text-primary">{changePhoneLabel}</Text>
        </Pressable>
      </View>

      <OTPInput
        value={otp}
        onChange={setOtp}
        onComplete={onVerify}
        error={hasError}
        success={success}
        autoFocus
        disabled={isInputDisabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ ...accessibilityState, disabled: isInputDisabled, busy: disabled }}
        testID={testID ? `${testID}-otp` : undefined}
      />

      {hasError && error ? (
        <Text
          className="text-[12px] leading-[17px] text-error"
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      ) : null}

      <View accessibilityLiveRegion="polite">
        {canResend ? (
          <Pressable
            onPress={() => {
              handleResendAnnounce();
              onResend();
            }}
            disabled={disabled}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={resendLabel}
            accessibilityState={{ disabled }}
          >
            <Text className="text-[14px] font-semibold leading-[21px] text-primary">{resendLabel}</Text>
          </Pressable>
        ) : (
          <Text
            className="text-[14px] leading-[21px] text-textSecondary"
            importantForAccessibility={countdown === 0 ? 'yes' : 'no'}
            accessibilityElementsHidden={countdown > 0}
          >
            {countdownText}
          </Text>
        )}
      </View>
    </View>
  );
}

export default OTPInputBox;
