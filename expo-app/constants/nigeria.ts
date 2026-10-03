// ============================================================================
// Nigeria-specific constants (ported from lib/core/utils/helpers.dart)
// ============================================================================

export const NIGERIAN_STATES: readonly string[] = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe',
  'Zamfara', 'Abuja FCT',
];

export const POPULAR_STATES: readonly string[] = [
  'Lagos', 'Abuja FCT', 'Rivers', 'Oyo', 'Enugu', 'Anambra',
  'Delta', 'Edo', 'Kaduna', 'Kano',
];

export const PROPERTY_TYPE_LABELS: Readonly<Record<string, string>> = {
  APARTMENT: 'Apartment',
  DUPLEX: 'Duplex',
  SELF_CONTAINED: 'Self-Contained',
  MINI_FLAT: 'Mini Flat',
  BUNGALOW: 'Bungalow',
  STUDIO: 'Studio',
  SHARED_APARTMENT: 'Shared Apartment',
  OFFICE_SPACE: 'Office Space',
  SHOP: 'Shop',
};
