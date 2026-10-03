// ============================================================================
// Properties service (ports PropertiesRepository) + API → UI normalisation
// ============================================================================

import type {
  ApiProperty,
  ApiPropertyAmenityFlags,
  Paginated,
  Property,
  PropertySearchParams,
} from '@/types/property';
import { api } from './api';

const AMENITY_LABELS: ReadonlyArray<[keyof ApiPropertyAmenityFlags, string]> = [
  ['hasParking', 'Parking'],
  ['hasWaterSupply', 'Water Supply'],
  ['hasElectricity', 'Electricity'],
  ['hasGenerator', 'Generator'],
  ['hasSolar', 'Solar'],
  ['hasSecurity', 'Security'],
  ['hasInternet', 'Internet'],
  ['hasSwimmingPool', 'Swimming Pool'],
  ['hasGym', 'Gym'],
  ['hasBalcony', 'Balcony'],
  ['hasPopCeiling', 'POP Ceiling'],
  ['hasWardrobes', 'Wardrobes'],
  ['hasKitchenCabinets', 'Kitchen Cabinets'],
  ['hasAirConditioning', 'Air Conditioning'],
  ['hasWaterHeater', 'Water Heater'],
  ['hasBorehole', 'Borehole'],
  ['hasCctv', 'CCTV'],
  ['isGatedEstate', 'Gated Estate'],
  ['isFurnished', 'Furnished'],
  ['petsAllowed', 'Pets Allowed'],
];

export function normalizeProperty(raw: ApiProperty): Property {
  const landlord = raw.landlord;
  const profile = landlord?.landlordProfile;

  const mediaUrls = (raw.media ?? [])
    .filter((m) => !m.type || m.type === 'IMAGE')
    .map((m) => m.url);

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? '',
    address: raw.address ?? '',
    city: raw.lga ?? raw.city ?? '',
    state: raw.state ?? '',
    price: raw.rentAmount ?? raw.price ?? 0,
    serviceCharge: raw.serviceCharge ?? 0,
    totalMoveInCost: raw.totalMoveInCost ?? 0,
    bedrooms: raw.bedrooms ?? 0,
    bathrooms: raw.bathrooms ?? 0,
    toilets: raw.toilets ?? 0,
    squareMeters: raw.squareMeters ?? undefined,
    propertyType: raw.propertyType ?? '',
    images: mediaUrls.length > 0 ? mediaUrls : (raw.images ?? []),
    amenities: AMENITY_LABELS.filter(([key]) => raw[key] === true).map(([, label]) => label),
    isFeatured: raw.isFeatured ?? false,
    isFavorited: raw.isFavorited ?? false,
    landlord: landlord
      ? {
          id: landlord.id,
          fullName: landlord.fullName,
          profilePicture: landlord.profilePicture ?? undefined,
          phone: landlord.phone ?? undefined,
          email: landlord.email ?? undefined,
          isVerified: profile?.isVerified ?? false,
          averageRating: profile?.averageRating ?? 0,
          totalReviews: profile?.totalReviews ?? 0,
        }
      : undefined,
  };
}

export async function searchProperties(
  params: PropertySearchParams = {},
): Promise<Paginated<Property>> {
  const { page = 1, limit = 20, ...filters } = params;
  // Drop undefined/empty filters, matching Flutter's `if (x != null)` map entries.
  const query = Object.fromEntries(
    Object.entries({ page, limit, ...filters }).filter(
      ([, v]) => v !== undefined && v !== null && v !== '',
    ),
  );
  const { data } = await api.get<Paginated<ApiProperty>>('/properties/search', { params: query });
  return { data: data.data.map(normalizeProperty), pagination: data.pagination };
}

export async function getFeatured(): Promise<Property[]> {
  const { data } = await api.get<ApiProperty[]>('/properties/featured');
  return data.map(normalizeProperty);
}

export async function getNewest(): Promise<Property[]> {
  const { data } = await api.get<ApiProperty[]>('/properties/newest');
  return data.map(normalizeProperty);
}

export async function getPropertyById(id: string): Promise<Property> {
  const { data } = await api.get<ApiProperty>(`/properties/${id}`);
  return normalizeProperty(data);
}

export async function toggleFavorite(propertyId: string): Promise<void> {
  await api.post(`/favorites/${propertyId}`);
}

/** The favorites payload isn't consumed by any Flutter screen yet; returned raw. */
export async function getFavorites(): Promise<unknown[]> {
  const { data } = await api.get<unknown[]>('/favorites');
  return data;
}
