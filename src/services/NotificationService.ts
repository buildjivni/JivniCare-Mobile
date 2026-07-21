import { notificationRepository } from '@/repositories';
import type { Notification } from '@/types/notification';

/**
 * F16, F17, Rules N1–N11 (Section 7). Documented responsibilities: "Inbox fetch, mark-read
 * (single + bulk), unread-count badge sourcing, FCM device-token registration/unregistration
 * (once F16 lands)."
 *
 * The first three are thin pass-throughs — `NotificationRepository` (Milestone 5) already
 * returns/accepts exactly these shapes, and `markRead(ids?)`'s existing optional-array signature
 * already covers both the single and bulk cases Section 7 names. FCM device-token registration
 * is **not** built: Section 7's own phrasing, "once F16 lands," confirms F16 has not landed —
 * there is no FCM SDK, no device-token endpoint, and no repository method for it.
 */
export interface NotificationServiceContract {
  getInbox(): Promise<Notification[]>;
  markRead(ids?: string[]): Promise<void>;
  getUnreadCount(): Promise<number>;
}

export const NotificationService: NotificationServiceContract = {
  async getInbox() {
    return notificationRepository.getInbox();
  },

  async markRead(ids) {
    return notificationRepository.markRead(ids);
  },

  async getUnreadCount() {
    return notificationRepository.getUnreadCount();
  },
};
