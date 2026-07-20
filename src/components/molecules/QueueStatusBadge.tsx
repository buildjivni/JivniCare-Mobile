import React from 'react';
import { Circle, Clock, Users, BellOff } from 'lucide-react-native';
import { Badge } from '../atoms/Badge';
import type { AccessibleProps } from '../../types/accessibility';

export type QueueStatusBadgeStatus = 'available' | 'onBreak' | 'busy' | 'offline';

export interface QueueStatusBadgeProps extends AccessibleProps {
  status: QueueStatusBadgeStatus;
  patientsAhead?: number;
  breakMessage?: string;
  /** Visual label — sourced from docs/10-UX-Writing-Guide.md by the parent screen. */
  text: string;
  onPress?: () => void;
}

function StatusIcon({ status }: { status: QueueStatusBadgeStatus }) {
  // Structural UI icons per Design-System.md — Lucide, not emoji.
  switch (status) {
    case 'available':
      return <Circle size={10} color="#FFFFFF" fill="#FFFFFF" />;
    case 'onBreak':
      return <Clock size={12} color="#FFFFFF" />;
    case 'busy':
      return <Users size={12} color="#FFFFFF" />;
    case 'offline':
      return <BellOff size={12} color="#FFFFFF" />;
  }
}

export function QueueStatusBadge({
  status,
  text,
  onPress,
  accessibilityLabel,
  accessibilityRole,
  accessibilityHint,
  accessibilityState,
  testID,
}: QueueStatusBadgeProps) {
  return (
    <Badge
      variant="status"
      status={status}
      text={text}
      icon={<StatusIcon status={status} />}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={onPress ? 'button' : (accessibilityRole ?? 'text')}
      accessibilityHint={accessibilityHint}
      accessibilityState={accessibilityState}
      testID={testID}
    />
  );
}

export default QueueStatusBadge;
