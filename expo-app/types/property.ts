// ============================================================================
// Property types
//
// `ApiProperty` is what the NestJS backend actually returns (raw Prisma rows:
// `rentAmount`, `lga`, `media[]`, `landlord`). The Flutter UI read `price`,
// `city` and `images` instead, which never existed on the API, so those
// screens silently fell back to defaults. `Property` is the normalised shape
// the UI consumes; `normalizeProperty` (services/propertiesService.ts) maps
// one to the other.
// ============================================================================

export type PropertyType =
  | 'APARTMENT'
  | 'DUPLEX'
  | 'SELF_CONTAINED'
  | 'MINI_FLAT'
  | 'BUNGALOW'
  | 'STUDIO'
  | 'SHARED_APARTMENT'
  | 'OFFICE_SPACE'
  | 'SHOP'
  | 'WAREHOUSE'
  | 'LAND'
  | 'HOSTEL';

export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'ACTIVE'
  | 'PAUSED'
  | 'RENTED'
  | 'REJECTED';

export type MediaKind = 'IMAGE' | 'VIDEO' | 'FLOOR_PLAN' | 'VIRTUAL_TOUR';

export interface ApiPropertyMedia {
  id: string;
  url: string;
  type?: MediaKind;
  order?: number;
}

export interface ApiPropertyLandlord {
  id: string;
  fullName: string;
  profilePicture?: string | null;
  phone?: string | null;
  email?: string | null;
  landlordProfile?: {
    isVerified?: boolean;
    verificationBadge?: boolean;
    averageRating?: number;
    totalReviews?: number;
  } | null;
}

/** Boolean amenity flags present on the Prisma Property model. */
export interface ApiPropertyAmenityFlags {
  hasParking?: boolean;
  hasWaterSupply?: boolean;
  hasElectricity?: boolean;
  hasGenerator?: boolean;
  hasSolar?: boolean;
  hasSecurity?: boolean;
  hasInternet?: boolean;
  hasSwimmingPool?: boolean;
  hasGym?: boolean;
  hasBalcony?: boolean;
  hasPopCeiling?: boolean;
  hasWardrobes?: boolean;
  hasKitchenCabinets?: boolean;
  hasAirConditioning?: boolean;
  hasWaterHeater?: boolean;
  hasBorehole?: boolean;
  hasCctv?: boolean;
  isGatedEstate?: boolean;
  isFurnished?: boolean;
  petsAllowed?: boolean;
}

export interface ApiProperty extends ApiPropertyAmenityFlags {
  id: string;
  landlordId?: string;
  title: string;
  description?: string;
  propertyType?: PropertyType;
  status?: PropertyStatus;
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  squareMeters?: number | null;
  rentAmount?: number;
  serviceCharge?: number | null;
  agencyFee?: number | null;
  legalFee?: number | null;
  cautionFee?: number | null;
  agreementFee?: number | null;
  totalMoveInCost?: number | null;
  address?: string;
  state?: string;
  lga?: string;
  area?: string | null;
  isFeatured?: boolean;
  viewCount?: number;
  createdAt?: string;
  media?: ApiPropertyMedia[];
  landlord?: ApiPropertyLandlord;
  isFavorited?: boolean;
  /** Legacy keys the Flutter UI looked for. Tolerated if a backend adds them. */
  price?: number;
  city?: string;
  images?: string[];
}

export interface PropertyLandlord {
  id: string;
  fullName: string;
  profilePicture?: string;
  phone?: string;
  email?: string;
  isVerified: boolean;
  averageRating: number;
  totalReviews: number;
}

/** Normalised property used throughout the UI. */
export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  price: number;
  serviceCharge: number;
  totalMoveInCost: number;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  squareMeters?: number;
  propertyType: PropertyType | '';
  images: string[];
  amenities: string[];
  isFeatured: boolean;
  isFavorited: boolean;
  landlord?: PropertyLandlord;
}

export type SortBy = 'newest' | 'oldest' | 'price_low' | 'price_high' | 'popular';

export interface PropertySearchParams {
  query?: string;
  state?: string;
  city?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  sortBy?: SortBy;
  page?: number;
  limit?: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
}
