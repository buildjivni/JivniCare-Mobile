import { apiClient } from '@/api';
import type { Notification } from '@/types/notification';

import type { NotificationRepository } from './NotificationRepository';
import { assertSuccessResponse } from '../shared';

/**
 * Real implementation — calls F17's three documented endpoints. All three respond with flat
 * JSON (not the `{success,data}` envelope). `getInbox()` takes no query params here since the
 * `NotificationRepository` interface (Section 6) declares no parameters for it — the backend's
 * own `limit` default (15, per `docs/11-API-Contract.md`) applies untouched. `markRead` is a
 * `PATCH`, per the contract, not a `POST`.
 */
export class HttpNotificationRepository implements NotificationRepository {
  async getInbox(): Promise<Notification[]> {
    const response = await apiClient.request<{ success: boolean; notifications: Notification[] }>(
      '/api/notifications',
      'GET',
    );
    const body = assertSuccessResponse(response, 'NotificationRepository.getInbox');
    return body.notifications;
  }

  async markRead(ids?: string[]): Promise<void> {
    const response = await apiClient.request<{ success: boolean }>(
      '/api/notifications/mark-read',
      'PATCH',
      {
        body: ids ? { ids } : {},
      },
    );
    assertSuccessResponse(response, 'NotificationRepository.markRead');
  }

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.request<{ success: boolean; unreadCount: number }>(
      '/api/notifications/unread-count',
      'GET',
    );
    const body = assertSuccessResponse(response, 'NotificationRepository.getUnreadCount');
    return body.unreadCount;
  }
}
