import { FEATURE_FLAGS } from '@/constants/featureFlags';

import { HttpAuthRepository, MockAuthRepository, type AuthRepository } from './auth';
import { HttpBookingRepository, MockBookingRepository, type BookingRepository } from './booking';
import { HttpDoctorRepository, MockDoctorRepository, type DoctorRepository } from './doctor';
import {
  HttpNotificationRepository,
  MockNotificationRepository,
  type NotificationRepository,
} from './notification';
import { HttpProfileRepository, MockProfileRepository, type ProfileRepository } from './profile';
import { HttpQueueRepository, MockQueueRepository, type QueueRepository } from './queue';
import {
  HttpWaitlistRepository,
  MockWaitlistRepository,
  type WaitlistRepository,
} from './waitlist';

export type { AuthRepository } from './auth';
export type { BookingRepository } from './booking';
export type { DoctorRepository } from './doctor';
export type { NotificationRepository } from './notification';
export type { ProfileRepository } from './profile';
export type { QueueRepository } from './queue';
export type { WaitlistRepository } from './waitlist';

/**
 * Repository factory (Section 6, "Repository Implementations" — "a small factory
 * (`src/repositories/index.ts`) reads `core/config`'s `USE_MOCK_DATA` flag and exports the
 * chosen implementation"). Services (a future milestone) import only from `@/repositories`,
 * never a concrete `Http*`/`Mock*` file directly, so the mock/real swap point stays this one
 * module.
 */
const useMockData: boolean = FEATURE_FLAGS.USE_MOCK_DATA;

export const authRepository: AuthRepository = useMockData
  ? new MockAuthRepository()
  : new HttpAuthRepository();

export const doctorRepository: DoctorRepository = useMockData
  ? new MockDoctorRepository()
  : new HttpDoctorRepository();

export const bookingRepository: BookingRepository = useMockData
  ? new MockBookingRepository()
  : new HttpBookingRepository();

export const queueRepository: QueueRepository = useMockData
  ? new MockQueueRepository()
  : new HttpQueueRepository();

export const waitlistRepository: WaitlistRepository = useMockData
  ? new MockWaitlistRepository()
  : new HttpWaitlistRepository();

export const notificationRepository: NotificationRepository = useMockData
  ? new MockNotificationRepository()
  : new HttpNotificationRepository();

export const profileRepository: ProfileRepository = useMockData
  ? new MockProfileRepository()
  : new HttpProfileRepository();
