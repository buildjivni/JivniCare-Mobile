import { MOCK_NOTIFICATIONS, MOCK_UNREAD_COUNT } from '@/data/notificationFixtures';
import type { Notification } from '@/types/notification';

import type { NotificationRepository } from './NotificationRepository';
import { mockDelay } from '../shared';

/** Mock implementation — returns static fixtures from `src/data/notificationFixtures.ts` after
 * a simulated delay. */
export class MockNotificationRepository implements NotificationRepository {
  async getInbox(): Promise<Notification[]> {
    await mockDelay(300);
    return MOCK_NOTIFICATIONS;
  }

  async markRead(_ids?: string[]): Promise<void> {
    await mockDelay(200);
  }

  async getUnreadCount(): Promise<number> {
    await mockDelay(150);
    return MOCK_UNREAD_COUNT;
  }
}
