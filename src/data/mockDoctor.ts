import type { DoctorCardDoctor } from '@/components/molecules';

/**
 * MVP placeholder doctor used to wire up the Home / Doctor Profile / Booking screens before
 * the real API (docs/11-API-Contract.md) is connected. Shape matches `DoctorCardDoctor`.
 */
export const MOCK_DOCTOR: DoctorCardDoctor = {
  id: 'doc-001',
  name: 'Dr. Rajesh Sharma',
  specialty: 'General Physician',
  experience: 12,
  consultationFee: 500,
  isVerified: true,
  isEarlyPartner: true,
  queueStatus: 'available',
  patientsAhead: 3,
  patientsServed: 1240,
  bookingTime: '7:00 AM',
  opdTime: '10:00 AM',
  isLive: true,
  isClosed: false,
};

export default MOCK_DOCTOR;
