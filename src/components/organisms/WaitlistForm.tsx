import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import type { AccessibleProps } from '../../types/accessibility';

const MIN_NAME_LENGTH = 2;
const PHONE_DIGIT_COUNT = 10;

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function isNameValid(name: string): boolean {
  return name.trim().length >= MIN_NAME_LENGTH;
}

function isPhoneValid(phone: string): boolean {
  return digitsOnly(phone).length === PHONE_DIGIT_COUNT;
}

export interface WaitlistFormProps extends AccessibleProps {
  name: string;
  onChangeName: (text: string) => void;
  phone: string;
  onChangePhone: (text: string) => void;

  /**
   * `07-Mobile-UX-Spec.md` S12's documented Waitlist form has ONE field — Phone, pre-filled
   * from the logged-in patient — with no Name field at all (name-collection instead belongs to
   * F13 Lead Capture, a different screen with its own Turnstile blocker). This task explicitly
   * requires a Name field, which is a deviation from the locked S12 layout — flagged in
   * `docs/15-Known-Gaps.md` rather than silently resolved. Defaults to `true` per this task's
   * explicit requirement; set to `false` to render only the field S12 actually specifies.
   */
  collectName?: boolean;

  /**
   * Fires only after local validation passes. This component does not call any API itself:
   * `11-API-Contract.md` F12's only documented waitlist endpoint
   * (`POST /api/patient/queue/claim-waitlist`) is the CLAIM step for when a slot opens, not the
   * initial join action this form performs — `07-Mobile-UX-Spec.md` S12 explicitly calls that
   * out as "distinct from the CLAIM flow." No initial-join endpoint is documented anywhere, so
   * per `13-AI-Development-Rules.md` Rule 7 the network call is left to the parent screen to
   * wire once that endpoint exists, rather than guessing at a request shape here.
   */
  onSubmit: () => void;

  /** Parent-controlled — true while the submission triggered by `onSubmit` is in flight. */
  loading?: boolean;
  /** Server-side error surfaced after a failed submission, e.g. the canonical "Something went
   * wrong" (`10-UX-Writing-Guide.md` Section 16). */
  submitError?: string;
  /** Parent sets this once submission succeeds — swaps the form for the success state. */
  success?: boolean;
  /**
   * Waitlist queue position. No documented endpoint currently returns this value for the join
   * action (see `docs/15-Known-Gaps.md`) — stays optional so the success state degrades
   * gracefully until the backend supplies it.
   */
  position?: number;
  /** Called once when `success` becomes true, for screens that navigate to a dedicated success
   * screen instead of showing the inline success state below. */
  onSuccessNavigate?: () => void;

  // Copy props — each defaults to the closest canonical string in `10-UX-Writing-Guide.md`
  // where one exists (cited per-prop below); fully overridable by the caller.
  /** Default: "Join Waitlist" — canonical, Section 10. */
  headerTitle?: string;
  /** Default: "We will notify you when a slot opens" — canonical, Section 10. */
  infoText?: string;
  /** Default: "Name" — borrowed from Section 11 (Profile Strings); Section 10 has no
   * dedicated Name-field string since the canonical S12 layout has no Name field. */
  nameLabel?: string;
  namePlaceholder?: string;
  /** No canonical string exists for this validation message — flagged, fully overridable. */
  nameRequiredError?: string;
  /** No canonical string exists for this validation message — flagged, fully overridable. */
  nameTooShortError?: string;
  /** Default: "Phone Number" — canonical, Section 3 (Phone Login). */
  phoneLabel?: string;
  /** Default: "98765 43210" — matches the Input usage example in
   * `09-Component-Library.md` Section 1.2. */
  phonePlaceholder?: string;
  /** Default: "Please enter a valid 10-digit number" — canonical, Section 3. */
  phoneInvalidError?: string;
  /** Default: "Join Waitlist" — canonical, Section 10. NOTE: this task's requirement #2 asks
   * for "Get Priority Access," which is not the locked canonical string for this action —
   * defaulted to the canonical copy and left fully overridable rather than baking in
   * non-canonical copy as the library default (see `docs/15-Known-Gaps.md`). */
  submitLabel?: string;
  /** Default: "Something went wrong" — canonical, Section 16. */
  genericErrorText?: string;
  /** Heading shown in the success state. No canonical "You're in!" string exists in
   * `10-UX-Writing-Guide.md` — default falls back to the canonical position-aware sentence
   * from Section 10 ("You are #{position} on the waitlist") when `position` is known, else a
   * neutral confirmation. Fully overridable. */
  successHeading?: string;
}

export function WaitlistForm({
  name,
  onChangeName,
  phone,
  onChangePhone,
  collectName = true,
  onSubmit,
  loading = false,
  submitError,
  success = false,
  position,
  onSuccessNavigate,
  headerTitle = 'Join Waitlist',
  infoText = 'We will notify you when a slot opens',
  nameLabel = 'Name',
  namePlaceholder = 'Your full name',
  nameRequiredError = 'Please enter your name',
  nameTooShortError = 'Name must be at least 2 characters',
  phoneLabel = 'Phone Number',
  phonePlaceholder = '98765 43210',
  phoneInvalidError = 'Please enter a valid 10-digit number',
  submitLabel = 'Join Waitlist',
  genericErrorText = 'Something went wrong',
  successHeading,
  accessibilityLabel,
  testID,
}: WaitlistFormProps) {
  const [attempted, setAttempted] = useState(false);

  const nameError = (() => {
    if (!collectName || !attempted) return undefined;
    if (name.trim().length === 0) return nameRequiredError;
    if (!isNameValid(name)) return nameTooShortError;
    return undefined;
  })();

  const phoneError = (() => {
    if (!attempted) return undefined;
    if (!isPhoneValid(phone)) return phoneInvalidError;
    return undefined;
  })();

  React.useEffect(() => {
    if (success) onSuccessNavigate?.();
    // Only re-fire when the success transition itself happens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  const handleSubmit = () => {
    setAttempted(true);
    const nameOk = !collectName || isNameValid(name);
    const phoneOk = isPhoneValid(phone);
    if (nameOk && phoneOk) {
      onSubmit();
    }
  };

  if (success) {
    const resolvedHeading =
      successHeading ??
      (position !== undefined
        ? `You are #${position} on the waitlist`
        : 'You have joined the waitlist');

    return (
      <View
        className="items-center gap-3 rounded-[16px] bg-background p-6"
        accessible
        accessibilityRole="text"
        accessibilityLabel={
          position !== undefined
            ? `${resolvedHeading}, you are number ${position} on the waitlist`
            : resolvedHeading
        }
        testID={testID ? `${testID}-success` : undefined}
      >
        <CheckCircle size={48} color="#16A34A" />
        <Text className="text-center text-[18px] font-semibold leading-[23px] text-textPrimary">
          {resolvedHeading}
        </Text>
        {position !== undefined ? (
          <Badge
            variant="verified"
            text={`#${position}`}
            icon={<CheckCircle size={12} color="#FFFFFF" />}
            accessibilityLabel={`You are number ${position} on the waitlist`}
          />
        ) : null}
      </View>
    );
  }

  return (
    <View
      className="gap-4 rounded-[16px] bg-background p-4"
      accessible={false}
      testID={testID}
    >
      <Text
        className="text-[24px] font-bold leading-[29px] text-textPrimary"
        accessibilityRole="header"
        accessibilityLabel={accessibilityLabel ?? headerTitle}
      >
        {headerTitle}
      </Text>

      {infoText ? (
        <Text className="text-[14px] leading-[21px] text-textSecondary">{infoText}</Text>
      ) : null}

      <View className="gap-3">
        {collectName ? (
          <Input
            type="text"
            value={name}
            onChangeText={onChangeName}
            label={nameLabel}
            placeholder={namePlaceholder}
            error={nameError}
            disabled={loading}
            returnKeyType="next"
            accessibilityLabel={nameLabel}
            accessibilityHint="Enter your full name"
            testID={testID ? `${testID}-name` : undefined}
          />
        ) : null}

        <Input
          type="phone"
          value={phone}
          onChangeText={onChangePhone}
          label={phoneLabel}
          placeholder={phonePlaceholder}
          error={phoneError}
          disabled={loading}
          maxLength={10}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          accessibilityLabel={phoneLabel}
          accessibilityHint="Enter your 10 digit mobile number"
          testID={testID ? `${testID}-phone` : undefined}
        />
      </View>

      {submitError ? (
        <Text
          className="text-[12px] leading-[17px] text-error"
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {submitError || genericErrorText}
        </Text>
      ) : null}

      <Button
        variant="primary"
        size="large"
        fullWidth
        loading={loading}
        onPress={handleSubmit}
        accessibilityLabel={submitLabel}
        accessibilityHint="Adds you to the waitlist and notifies you when a slot opens"
        accessibilityState={{ busy: loading }}
        testID={testID ? `${testID}-submit` : undefined}
      >
        {submitLabel}
      </Button>
    </View>
  );
}

export default WaitlistForm;
