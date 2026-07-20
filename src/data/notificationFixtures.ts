import type { Notification } from '@/types/notification';

/** Fixtures for `MockNotificationRepository` (F17) — used only when `core/config`'s
 * `USE_MOCK_DATA` flag is on. `Notification`'s field list is itself minimal (see
 * `src/types/notification.ts` for why). */
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'notif-mock-001' },
  { id: 'notif-mock-002' },
];

export const MOCK_UNREAD_COUNT = MOCK_NOTIFICATIONS.length;
