// ============================================================================
// Property cards used on Home (ports _FeaturedCard, _ListingCard, _SpecPill)
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { PropertyImage } from '@/components/ui/PropertyImage';
import { useTheme } from '@/hooks/useTheme';
import type { Property } from '@/types/property';
import { formatPricePerYear } from '@/utils/format';

const EMERALD = '#064E3B';

export function propertyAddress(p: Property): string {
  return p.address || `${p.city}, ${p.state || 'Nigeria'}`;
}

export function SpecPill({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.spec}>
      <Ionicons name={icon} size={14} color={colors.textSecondary} />
      <AppText variant="labelMedium" weight="semibold" style={styles.specText}>
        {text}
      </AppText>
    </View>
  );
}

/** 260px-wide carousel card with FEATURED ribbon. */
export function FeaturedCard({ property }: { property: Property }) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/property/[id]', params: { id: property.id } })}
      style={[styles.featured, { backgroundColor: colors.surface }]}
    >
      <View style={styles.featuredImageWrap}>
        <PropertyImage uri={property.images[0]} style={styles.fill} />
        <View style={styles.ribbon}>
          <AppText size={10} weight="extrabold" color="#FFFFFF" style={styles.ribbonText}>
            FEATURED
          </AppText>
        </View>
      </View>

      <View style={styles.featuredBody}>
        <AppText size={19} weight="extrabold" color={colors.primary}>
          {formatPricePerYear(property.price)}
        </AppText>
        <AppText size={14} weight="bold" numberOfLines={1} style={styles.titleGap}>
          {property.title || 'Property Listing'}
        </AppText>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
          <AppText size={12} color={colors.textSecondary} numberOfLines={1} style={styles.addressText}>
            {propertyAddress(property)}
          </AppText>
        </View>
        <View style={styles.specs}>
          <SpecPill icon="bed-outline" text={`${property.bedrooms} Beds`} />
          <View style={styles.specGap} />
          <SpecPill icon="water-outline" text={`${property.bathrooms} Baths`} />
        </View>
      </View>
    </Pressable>
  );
}

/** Horizontal row card used in the newest-listings list. */
export function ListingCard({ property }: { property: Property }) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/property/[id]', params: { id: property.id } })}
      style={[styles.listing, { backgroundColor: colors.surface }]}
    >
      <View style={styles.thumb}>
        <PropertyImage uri={property.images[0]} style={styles.fill} />
      </View>
      <View style={styles.listingBody}>
        <AppText size={15} weight="bold" numberOfLines={1}>
          {property.title || 'Property Listing'}
        </AppText>
        <AppText size={13} color={colors.textSecondary} numberOfLines={1} style={styles.titleGap}>
          {propertyAddress(property)}
        </AppText>
        <View style={styles.listingFooter}>
          <AppText size={16} weight="extrabold" color={colors.primary}>
            {formatPricePerYear(property.price)}
          </AppText>
          <View style={styles.counts}>
            <Ionicons name="bed-outline" size={14} color={colors.textSecondary} />
            <AppText size={12} weight="semibold" color={colors.textSecondary} style={styles.countText}>
              {property.bedrooms}
            </AppText>
            <Ionicons
              name="water-outline"
              size={14}
              color={colors.textSecondary}
              style={styles.bathIcon}
            />
            <AppText size={12} weight="semibold" color={colors.textSecondary} style={styles.countText}>
              {property.bathrooms}
            </AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { width: '100%', height: '100%' },
  spec: { flexDirection: 'row', alignItems: 'center' },
  specText: { marginLeft: 4 },
  specGap: { width: 12 },

  featured: {
    width: 260,
    marginRight: 18,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  featuredImageWrap: { height: 170, backgroundColor: EMERALD },
  ribbon: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#D4A017',
  },
  ribbonText: { letterSpacing: 0.6 },
  featuredBody: { padding: 16 },
  titleGap: { marginTop: 4 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  addressText: { marginLeft: 4, flex: 1 },
  specs: { flexDirection: 'row', marginTop: 10 },

  listing: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  thumb: { width: 120, height: 120, backgroundColor: EMERALD },
  listingBody: { flex: 1, padding: 14 },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  counts: { flexDirection: 'row', alignItems: 'center' },
  countText: { marginLeft: 4 },
  bathIcon: { marginLeft: 10 },
});
