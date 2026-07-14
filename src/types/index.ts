// =============================================================
//  JivniCare Mobile — Type Definitions
//  Ported from web's types/index.ts.
// =============================================================

export interface Doctor {
  id: string;
  uniqueDoctorId?: string;
  name: string;
  slug?: string;
  publicSlug?: string;
  shortCode?: string;
  qrCodeReady?: boolean;
  specialty: string;
  qualifications?: string;
  experience: string;
  education: string;
  verificationStatus?: string;
  registrationNumber?: string;
  medicalCouncil?: string;
  clinic: string;
  hospitalSlug?: string;
  hospitalType?: string;
  location: string;
  landmark?: string;
  fullAddress?: string;
  registrationId?: string;
  pincode?: string;
  latitude?: number | null;
  longitude?: number | null;
  distance?: string;
  distanceStr?: string;
  distanceKm?: number;
  image: string;
  bgImage: string;
  clinicImage?: string;
  rating: number;
  reviews: number;
  reviewCount?: number;
  totalConsultations?: number;
  lifetimePatientsDeclaration?: string;
  verifiedBadgeLabel?: string;
  patientTrustLabel?: string;
  available: string;
  availabilityStatus?: string;
  nextAvailable?: string;
  isQueueActive?: boolean;
  queueWaitMinutes?: number;
  patientsWaiting?: number;
  onboardingStage?: string;
  isAvailableToday?: boolean;
  availableSlots?: number;
  fee: string;
  videoFee?: string;
  consultationModes?: ('OPD' | 'Video' | 'HomeVisit')[];
  languages?: string[];
  tags: string[];
  searchableKeywords?: string[];
  diseases?: string[];
  procedures?: string[];
  partnerTier?: string;
  gender?: string;
  about: string;
  averageConsultationTime?: number;
  updatedAt?: string | Date;
  emergencyAvailable?: boolean;
  isEmergencySupported?: boolean;
  weeklySchedule?: any;
  holidayOverride?: any;
}

export interface Specialty {
  name: string;
  id: string;
}

export interface BookingDetails {
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  service: string;
  fee: string;
  clinic: string;
  patientName?: string;
  patientPhone: string;
}

export interface QueueToken {
  id: string;
  tokenNumber: number;
  status: string;
  createdAt: string;
  tokenIssuedAt?: string;
  source?: string;
  estimatedWaitMinutes?: number;
  doctorId?: string;
  doctorName?: string;
  clinic?: string;
  location?: string;
  patientName?: string;
  patientPhone?: string;
  queuePosition?: number;
}

export interface BookingState {
  isBookingOpen: boolean;
  selectedDoctor: Doctor | null;
  selectedService: string | null;
  step: "service" | "confirm" | "success";
  patientDetails: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  generatedToken: QueueToken | null;

  // Actions
  openBooking: (doctor: Doctor) => void;
  closeBooking: () => void;
  setStep: (step: BookingState["step"]) => void;
  setService: (service: string | null) => void;
  setDoctor: (doctor: Doctor) => void;
  setPatientDetails: (details: Partial<{ name: string; email: string; phone: string; location: string }>) => void;
  setGeneratedToken: (token: QueueToken | null) => void;
  resetBooking: () => void;
}
