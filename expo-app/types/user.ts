// ============================================================================
// User & auth types (mirrors the NestJS `User` model and auth responses)
// ============================================================================

export type Role = 'HUNTER' | 'LANDLORD' | 'ADMIN';

export interface LandlordProfile {
  id: string;
  userId: string;
  isVerified: boolean;
  verificationBadge: boolean;
  totalActiveListings: number;
  averageRating: number;
  totalReviews: number;
  responseRate?: number | null;
  avgResponseTime?: number | null;
  languages?: string[];
}

export interface HunterProfile {
  id: string;
  userId: string;
  occupation?: string | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  preferredStates?: string[];
  preferredCities?: string[];
  desiredBedrooms?: number | null;
  isVerified: boolean;
}

export interface User {
  id: string;
  email: string;
  phone?: string | null;
  role: Role;
  fullName: string;
  profilePicture?: string | null;
  isActive?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdAt?: string;
  landlordProfile?: LandlordProfile | null;
  hunterProfile?: HunterProfile | null;
}

export interface AuthResponse {
  message?: string;
  user: User;
  /** Absent when the backend requires verification before issuing tokens. */
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  role: Role;
  phone?: string;
}
