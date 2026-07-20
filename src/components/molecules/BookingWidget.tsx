import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { ERROR } from '@/core/theme';
import { Button } from '@/components/atoms';
import type { AccessibleProps } from '@/types/accessibility';

/**
 * ⚠️ SPEC DEVIATION — flagged per `13-AI-Development-Rules.md` Rules 1/2/5 rather than silently
 * resolved (same pattern used for `WaitlistForm`, see `docs/15-Known-Gaps.md` Section 2.1).
 * `docs/09-Component-Library.md` Section 3.4 already documents a `BookingWidget` — but as an
 * ORGANISM with a token/queue-based interface (`doctor`, `estimatedToken`, `totalSlots`,
 * `patientsAhead`, `consultationFee`, `onConfirm`, `onWaitlist`, `blocked`/`blockReason`), since
 * JivniCare's real booking model (`05-Business-Rules.md` Rules B1–B10, `07-Mobile-UX-Spec.md`
 * S08) is a sequential QUEUE TOKEN system with no appointment-time-slot concept anywhere in the
 * docs. This task explicitly asked for a "molecule" with a `slots` UI and a mocked `onSubmit`,
 * which is a different component with a different name collision, not an implementation of the
 * documented organism. Built exactly as this task specified (this file), placed at the
 * explicitly requested path. Do not treat this as the Section 3.4 `BookingWidget` — if the
 * documented token-based organism is still needed, it should be built separately (e.g. as
 * `BookingSummaryWidget` or similar) rather than overwritten by this file. Logged in
 * `docs/15-Known-Gaps.md`.
 */

/** The 13 named booking-block error codes — `05-Business-Rules.md` Rule B6, verbatim. Do not
 * add, remove, or rename any of these; do not collapse them into a generic message (same rule). */
export type BookingErrorCode =
  | 'DOCTOR_NOT_VERIFIED'
  | 'DOCTOR_NOT_ACCEPTING'
  | 'ALREADY_BOOKED'
  | 'QUEUE_FULL'
  | 'DAILY_LIMIT_REACHED'
  | 'CLINIC_CLOSED_TODAY'
  | 'CLINIC_CLOSED_ON_THIS_DAY'
  | 'BOOKING_NOT_STARTED'
  | 'BOOKING_FINISHED'
  | 'QUEUE_PAUSED'
  | 'EMERGENCY_FULL'
  | 'EMERGENCY_ONLY_ACTIVE'
  | 'WAITLIST_RESERVED';

/** All 13 codes, for exhaustiveness checks / tests — mirrors the order in Rule B6. */
export const BOOKING_ERROR_CODES: readonly BookingErrorCode[] = [
  'DOCTOR_NOT_VERIFIED',
  'DOCTOR_NOT_ACCEPTING',
  'ALREADY_BOOKED',
  'QUEUE_FULL',
  'DAILY_LIMIT_REACHED',
  'CLINIC_CLOSED_TODAY',
  'CLINIC_CLOSED_ON_THIS_DAY',
  'BOOKING_NOT_STARTED',
  'BOOKING_FINISHED',
  'QUEUE_PAUSED',
  'EMERGENCY_FULL',
  'EMERGENCY_ONLY_ACTIVE',
  'WAITLIST_RESERVED',
];

function isBookingErrorCode(value: unknown): value is BookingErrorCode {
  return typeof value === 'string' && (BOOKING_ERROR_CODES as readonly string[]).includes(value);
}

/**
 * A rejected/thrown value this widget knows how to map to one of the 13 named codes.
 * `11-API-Contract.md` F08 confirms the real route returns `{success:false, error: <message>}` —
 * an already-localized MESSAGE STRING, not a machine-readable code (see the ⚠️ note on
 * `mapBookingErrorToMessage` below). Until that's resolved, the parent screen integrating the
 * real `POST /api/patient/book-appointment` call is responsible for translating the server's
 * response into this shape before rejecting — this component only performs the code → copy
 * mapping, per this task's explicit scope.
 */
export interface BookingSubmitError {
  code: BookingErrorCode;
  /** Interpolated into the `{name}` placeholder for `ALREADY_BOOKED` / `DOCTOR_NOT_ACCEPTING`. */
  doctorName?: string;
}

export interface BookingSlot {
  id: string;
  /** Localized display label, e.g. "10:00 AM" — sourced by the caller, not this component. */
  label: string;
  disabled?: boolean;
}

interface BookingErrorCopy {
  en: string;
  hi: string;
}

/**
 * Verbatim from `10-UX-Writing-Guide.md` Section 6's 13-code table — do not paraphrase (per the
 * task's own constraint and per `13-AI-Development-Rules.md` Rule 4, treating this table's
 * strings as locked the same way Business-Rules' numbers are locked).
 *
 * ⚠️ `DAILY_LIMIT_REACHED` has TWO distinct canonical messages depending on WHICH limit fired —
 * the doctor-level daily cap ("No slots today") vs. the patient-level 3-active-bookings cap
 * ("You have 3 active bookings today") — but Rule B6 names only ONE code for both cases, and
 * `11-API-Contract.md` F08 does not document a way to distinguish them from the response alone
 * (no separate field, no distinct code). This is flagged in `docs/15-Known-Gaps.md` rather than
 * guessed at; this component exposes a `dailyLimitContext` option so the CALLER (who presumably
 * knows which check the backend message text matched) can pick the right one, defaulting to the
 * doctor-level message since that's the more common case ("no slots" is the general queue-full
 * scenario this widget's slot list already deals with).
 */
const BOOKING_ERROR_MESSAGES: Record<
  BookingErrorCode,
  BookingErrorCopy | { doctorLevel: BookingErrorCopy; patientLevel: BookingErrorCopy }
> = {
  QUEUE_FULL: {
    en: 'Queue just got full. Join Waitlist?',
    hi: 'Queue abhi full ho gaya. Waitlist join karein?',
  },
  DAILY_LIMIT_REACHED: {
    doctorLevel: { en: 'No slots today', hi: 'Aaj koi slot nahi hai' },
    patientLevel: {
      en: 'You have 3 active bookings today',
      hi: 'Aapke paas aaj 3 active bookings hain',
    },
  },
  ALREADY_BOOKED: {
    en: 'You already have a booking with Dr. {name}',
    hi: 'Aapka pehle se hi Dr. {name} ke saath booking hai',
  },
  DOCTOR_NOT_ACCEPTING: {
    en: 'Dr. {name} is not accepting bookings',
    hi: 'Dr. {name} booking nahi le rahe hain',
  },
  DOCTOR_NOT_VERIFIED: {
    en: "This doctor's profile is not currently available",
    hi: 'Ye doctor ki profile abhi uplabdh nahi hai',
  },
  CLINIC_CLOSED_TODAY: {
    en: 'Clinic is closed today',
    hi: 'Clinic aaj band hai',
  },
  CLINIC_CLOSED_ON_THIS_DAY: {
    en: 'Clinic is closed on this day',
    hi: 'Clinic is din band rehta hai',
  },
  BOOKING_NOT_STARTED: {
    en: 'Booking opens soon for today',
    hi: 'Aaj ki booking jald shuru hogi',
  },
  BOOKING_FINISHED: {
    en: 'Booking closed for today',
    hi: 'Aaj ke liye booking band ho gayi hai',
  },
  QUEUE_PAUSED: {
    en: 'Doctor has paused the queue temporarily',
    hi: 'Doctor ne queue temporarily rok di hai',
  },
  EMERGENCY_FULL: {
    en: 'Emergency slots are full',
    hi: 'Emergency slots full hain',
  },
  EMERGENCY_ONLY_ACTIVE: {
    en: 'Doctor is accepting emergency cases only right now',
    hi: 'Doctor abhi sirf emergency case le rahe hain',
  },
  WAITLIST_RESERVED: {
    en: 'This slot is reserved for a waitlisted patient',
    hi: 'Ye slot ek waitlist patient ke liye reserved hai',
  },
};

/** Fallback for anything NOT one of the 13 named codes (generic 500, network failure, an
 * un-parseable rejection, etc.) — `10-UX-Writing-Guide.md` Section 16's canonical fallback.
 * This is deliberately NOT a 14th fake B6 code — it's a separate bucket, per the task's own
 * constraint to strictly use only the 13 named codes for the error-state logic. */
const GENERIC_ERROR_COPY: BookingErrorCopy = {
  en: 'Something went wrong',
  hi: 'Kuchh galat ho gaya',
};

export interface GetBookingErrorMessageOptions {
  language?: 'en' | 'hi';
  doctorName?: string;
  dailyLimitContext?: 'doctorLevel' | 'patientLevel';
}

/** Maps one of the 13 B6 codes to its exact `10-UX-Writing-Guide.md` string, substituting the
 * `{name}` placeholder where present. Exported so screens/tests can use the same mapping this
 * widget uses internally, mirroring `OTPInputBox.tsx`'s exported `mapVerifyOtpApiError` pattern. */
export function getBookingErrorMessage(
  code: BookingErrorCode,
  {
    language = 'en',
    doctorName,
    dailyLimitContext = 'doctorLevel',
  }: GetBookingErrorMessageOptions = {},
): string {
  const entry = BOOKING_ERROR_MESSAGES[code];
  const copy: BookingErrorCopy = 'doctorLevel' in entry ? entry[dailyLimitContext] : entry;
  const template = copy[language];
  return doctorName ? template.replace('{name}', doctorName) : template;
}

type BookingWidgetStatus = 'idle' | 'loading' | 'error';

export interface BookingWidgetProps extends AccessibleProps {
  /**
   * Time slots to choose from before booking. NOTE: this concept has no equivalent in the
   * documented JivniCare booking model (`05-Business-Rules.md` Section 1, `11-API-Contract.md`
   * F08) — real bookings are for "today" (or an optional `date`) against a doctor's queue, with
   * no slot selection, and F08's request body has no `slotId` field. Built as requested; flagged
   * in `docs/15-Known-Gaps.md` so a real F08 integration doesn't silently assume `slotId` is a
   * server-accepted field.
   */
  slots: BookingSlot[];
  /** Pre-selects a slot (e.g. the first available one). Uncontrolled otherwise. */
  defaultSelectedSlotId?: string;
  /** Doctor's display name, interpolated into `ALREADY_BOOKED` / `DOCTOR_NOT_ACCEPTING` copy. */
  doctorName?: string;
  /** Active display language for the mapped error copy — sourced from the app's language state
   * per `docs/09-Component-Library.md` Section 0, not decided by this component. */
  language?: 'en' | 'hi';
  /** See `BOOKING_ERROR_MESSAGES`'s note on `DAILY_LIMIT_REACHED`'s two possible messages. */
  dailyLimitContext?: 'doctorLevel' | 'patientLevel';
  /**
   * Mocked booking submission — this component never calls a real endpoint itself (per this
   * task's "mocked with `onSubmit` prop" requirement, same pattern as `WaitlistForm`). Resolve
   * on success; reject with a `BookingSubmitError` to drive the mapped error state, or reject
   * with anything else (a plain `Error`, a network failure) to fall back to the generic message.
   */
  onSubmit: (slotId: string) => Promise<void>;
  /** Fires once after `onSubmit` resolves — e.g. to navigate to S09 Token Tracking per
   * `07-Mobile-UX-Spec.md` S08's documented success navigation. */
  onSuccess?: () => void;
  /** Fires once after `onSubmit` rejects, alongside the internal error-state update, for
   * screens that also want to log/report the failure. */
  onError?: (code: BookingErrorCode | 'UNKNOWN', rawError: unknown) => void;
  /** Parent-level block (e.g. doctor offline, offline network per Rule O2 — no auto-retry). */
  disabled?: boolean;

  // Copy props — each defaults to the closest canonical string in `10-UX-Writing-Guide.md`
  // where one exists (cited per-prop below), fully overridable by the caller.
  /** Default: "Book Appointment" — canonical S08 headline, Section 6. */
  title?: string;
  /** Default: "Book Appointment" — NOTE: this task's literal requirement, not the canonical S08
   * action-button string ("Confirm Booking", Section 6) or S07's CTA ("Book Appointment Now",
   * `09-Component-Library.md` Section 1.1's usage example). Flagged rather than silently picking
   * one; pass the string matching whichever screen actually embeds this widget. */
  bookButtonLabel?: string;
  /** Default: "Booking..." — canonical loading-state string, Section 6. */
  loadingButtonLabel?: string;
  /** Shown when `slots` is empty. Default reuses the canonical "No slots today" string
   * (Section 6's `DAILY_LIMIT_REACHED` doctor-level row) since it's the same underlying concept. */
  noSlotsText?: string;
  /** Accessible group label read before the slot list. No canonical string exists for this —
   * flagged, fully overridable. */
  slotsSectionLabel?: string;
}

export function BookingWidget({
  slots,
  defaultSelectedSlotId,
  doctorName,
  language = 'en',
  dailyLimitContext = 'doctorLevel',
  onSubmit,
  onSuccess,
  onError,
  disabled = false,
  title = 'Book Appointment',
  bookButtonLabel = 'Book Appointment',
  loadingButtonLabel = 'Booking...',
  noSlotsText = 'No slots today',
  slotsSectionLabel = 'Select a time slot',
  accessibilityLabel,
  testID,
}: BookingWidgetProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>(defaultSelectedSlotId);
  const [status, setStatus] = useState<BookingWidgetStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const isLoading = status === 'loading';
  const canSubmit = Boolean(selectedSlotId) && !isLoading && !disabled;

  const handleSelectSlot = (slotId: string) => {
    if (isLoading) return;
    setSelectedSlotId(slotId);
    // A fresh selection dismisses the previous failure — matches OTPInputBox's precedent of
    // clearing error state on new user input rather than leaving a stale error visible.
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage(undefined);
    }
  };

  const handleBookPress = async () => {
    if (!selectedSlotId || isLoading || disabled) return;
    setStatus('loading');
    setErrorMessage(undefined);
    try {
      await onSubmit(selectedSlotId);
      setStatus('idle');
      onSuccess?.();
    } catch (rawError) {
      const code = isBookingErrorCode((rawError as BookingSubmitError | undefined)?.code)
        ? (rawError as BookingSubmitError).code
        : undefined;
      const resolvedDoctorName =
        (rawError as BookingSubmitError | undefined)?.doctorName ?? doctorName;
      const message = code
        ? getBookingErrorMessage(code, {
            language,
            doctorName: resolvedDoctorName,
            dailyLimitContext,
          })
        : GENERIC_ERROR_COPY[language];
      setStatus('error');
      setErrorMessage(message);
      onError?.(code ?? 'UNKNOWN', rawError);
    }
  };

  return (
    <View
      className="gap-4 rounded-[16px] bg-surface p-4 shadow-md"
      accessible={false}
      testID={testID}
    >
      <Text
        className="text-[18px] font-semibold leading-[23px] text-textPrimary"
        accessibilityRole="header"
        accessibilityLabel={accessibilityLabel ?? title}
      >
        {title}
      </Text>

      {/* Widget Layout requirement #1: time slots */}
      {slots.length === 0 ? (
        <Text className="text-[14px] leading-[21px] text-textSecondary">{noSlotsText}</Text>
      ) : (
        <View accessibilityRole="none" accessibilityLabel={slotsSectionLabel}>
          <View className="flex-row flex-wrap gap-2">
            {slots.map((slot) => {
              const isSelected = slot.id === selectedSlotId;
              const isSlotDisabled = Boolean(slot.disabled) || isLoading || disabled;
              return (
                <Pressable
                  key={slot.id}
                  onPress={() => handleSelectSlot(slot.id)}
                  disabled={isSlotDisabled}
                  // ACC1 / this task's requirement: every slot is a 44px+ touch target.
                  className={[
                    'min-h-[44px] items-center justify-center rounded-[8px] border px-4',
                    isSelected ? 'border-primary bg-primary' : 'border-border bg-surface',
                    isSlotDisabled && !isSelected ? 'opacity-50' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  accessibilityRole="radio"
                  accessibilityLabel={slot.label}
                  accessibilityState={{
                    disabled: isSlotDisabled,
                    selected: isSelected,
                    checked: isSelected,
                  }}
                  testID={testID ? `${testID}-slot-${slot.id}` : undefined}
                >
                  <Text
                    className={[
                      'text-[14px] leading-[21px] font-medium',
                      isSelected ? 'text-white' : 'text-textPrimary',
                    ].join(' ')}
                  >
                    {slot.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* Widget Layout requirement #2: "Book Appointment" button */}
      <Button
        variant="primary"
        size="large"
        fullWidth
        loading={isLoading}
        disabled={!canSubmit}
        onPress={handleBookPress}
        accessibilityLabel={isLoading ? loadingButtonLabel : bookButtonLabel}
        accessibilityHint="Submits your booking request for the selected slot"
        accessibilityState={{ busy: isLoading, disabled: !canSubmit }}
        testID={testID ? `${testID}-submit` : undefined}
      >
        {bookButtonLabel}
      </Button>

      {/*
        Widget Layout requirement #3: error display area.
        Accessibility requirement: accessibilityLiveRegion="assertive" (explicit task
        requirement). This is a deliberate deviation from Input's/OTPInputBox's "polite" error
        convention (`09-Component-Library.md` Section 1.2) — justified the same way
        `QueueTracker`'s TOKEN_CALLED announcement and `Toast`'s error variant both use
        "assertive" (Section 3.5 / 6.3): a failed booking attempt is a one-shot, financially
        relevant event that should interrupt, not a live-typing validation hint. The container
        stays mounted (message swapped in/out inside it) rather than conditionally
        mounting/unmounting the whole region, matching guidance that a live region should exist
        before its content changes for reliable announcement across platforms.
        ACC5 ("Error messages: Visual + audio + haptic") is satisfied here for visual + audio
        (screen reader via the live region); haptic feedback is intentionally NOT wired in since
        `expo-haptics` is not yet a project dependency — flagged in `docs/15-Known-Gaps.md`
        rather than added unprompted.
      */}
      <View
        accessibilityLiveRegion="assertive"
        accessibilityRole={status === 'error' ? 'alert' : 'none'}
      >
        {status === 'error' && errorMessage ? (
          <View className="flex-row items-start gap-2 rounded-[12px] border border-error bg-error/10 p-3">
            <AlertTriangle
              size={18}
              color={ERROR}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
            <Text
              className="flex-1 text-[14px] leading-[21px] text-error"
              accessibilityLabel={errorMessage}
            >
              {errorMessage}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default BookingWidget;
