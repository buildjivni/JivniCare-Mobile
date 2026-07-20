import { apiClient } from '@/api';
import type { CreateBookingPayload, QueueToken } from '@/types/booking';

import type { BookingRepository } from './BookingRepository';
import { assertSuccessResponse } from '../shared';

/**
 * Real implementation — calls F08/F10/F11's documented endpoints. `create`/`cancel` respond
 * with the `{success, data: {...}}` envelope; `getMyBookings` responds flat (`{success,
 * bookings}`) — per `docs/11-API-Contract.md`'s Response Envelope section, each method unwraps
 * exactly its own documented shape, not a blanket parser.
 */
export class HttpBookingRepository implements BookingRepository {
  async create(payload: CreateBookingPayload): Promise<QueueToken> {
    const response = await apiClient.request<{
      success: boolean;
      data: { success: boolean; token: QueueToken };
    }>('/api/patient/book-appointment', 'POST', { body: payload });
    const body = assertSuccessResponse(response, 'BookingRepository.create');
    return body.data.token;
  }

  async cancel(tokenId: string): Promise<void> {
    const response = await apiClient.request<{
      success: boolean;
      data: { success: boolean; message: string };
    }>('/api/patient/queue/cancel-token', 'POST', { body: { tokenId } });
    assertSuccessResponse(response, 'BookingRepository.cancel');
  }

  async getMyBookings(): Promise<QueueToken[]> {
    const response = await apiClient.request<{ success: boolean; bookings: QueueToken[] }>(
      '/api/patient/my-bookings',
      'GET',
    );
    const body = assertSuccessResponse(response, 'BookingRepository.getMyBookings');
    return body.bookings;
  }
}
