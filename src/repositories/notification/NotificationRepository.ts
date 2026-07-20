import type { Notification } from '@/types/notification';

/**
 * F17 — matches
 * `docs/engineering/Sprint-0-Engineering-Design.md` Section 6's `NotificationRepository`
 * interface exactly. No speculative methods added.
 */
export interface NotificationRepository {
  getInbox(): Promise<Notification[]>;
  markRead(ids?: string[]): Promise<void>;
  getUnreadCount(): Promise<number>;
}
