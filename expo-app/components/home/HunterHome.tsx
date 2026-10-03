// ============================================================================
// HunterHome (ports the non-landlord branch of home_screen.dart)
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { PropertyImage } from '@/components/ui/PropertyImage';
import { FeaturedCard, ListingCard } from '@/components/property/PropertyCards';
import { useTheme } from '@/hooks/useTheme';
import { loadHomeData, usePropertiesStore } from '@/stores/propertiesStore';
import type { Property } from '@/types/property';

const EMERALD = '#064E3B';

const CATEGORIES = ['All Homes', 'Apartments', 'Duplexes', 'Self-Contain', 'Studios', 'Shortlets'];

const CITIES: ReadonlyArray<{ name: string; count: string; color: string }> = [
  { name: 'Lagos', count: '2,450+ Homes', color: '#064E3B' },
  { name: 'Abuja', count: '1,830+ Homes', color: '#1E3A8A' },
  { name: 'Port Harcourt', count: '960+ Homes', color: '#581C87' },
  { name: 'Ibadan', count: '640+ Homes', color: '#991B1B' },
  { name: 'Enugu', count: '480+ Homes', color: '#92400E' },
];

function fallbackProperty(
  id: string,
  title: string,
  price: number,
  address: string,
  rooms: number,
): Property {
  return {
    id,
    title,
    description: '',
    address,
    city: '',
    state: '',
    price,
    serviceCharge: 0,
    totalMoveInCost: 0,
    bedrooms: rooms,
    bathrooms: rooms,
    toilets: 0,
    propertyType: '',
    images: [],
    amenities: [],
    isFeatured: false,
    isFavorited: false,
  };
}

// Shown while the API has no data (same placeholders as the Flutter app).
const FALLBACK_FEATURED: Property[] = [
  fallbackProperty('prop_0', 'Luxury 3-Bed Apartment, Lekki Phase 1', 3500000, 'Lekki Phase 1, Lagos', 3),
  fallbackProperty('prop_1', 'Modern Executive Duplex, Ajah', 5500000, 'Ajah, Lagos', 3),
  fallbackProperty('prop_2', 'Studio Penthouse, Victoria Island', 2200000, 'VI, Lagos', 3),
];
const FALLBACK_NEWEST: Property[] = [
  fallbackProperty('new_0', 'Affordable 2-Bed Flat, Yaba', 850000, 'Yaba, Lagos', 2),
  fallbackProperty('new_1', 'Mini Flat Apartment, Surulere', 450000, 'Surulere, Lagos', 2),
  fallbackProperty('new_2', 'Shared Luxury Apartment, Ikeja GRA', 350000, 'Ikeja, Lagos', 2),
];

function SectionHeader({ title, action, onAction }: { title: string; action: string; onAction: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <AppText size={20} weight="extrabold" style={styles.sectionTitle}>
        {title}
      </AppText>
      <Pressable accessibilityRole="link" onPress={onAction} hitSlop={8}>
        <AppText size={14} weight="bold" color={colors.primary}>
          {action}
        </AppText>
      </Pressable>
    </View>
  );
}

export function HunterHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const featuredRaw = usePropertiesStore((s) => s.featured);
  const newestRaw = usePropertiesStore((s) => s.newest);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [refreshing, setRefreshing] = useState(false);

  const featured = featuredRaw.length > 0 ? featuredRaw : FALLBACK_FEATURED;
  const newest = newestRaw.length > 0 ? newestRaw : FALLBACK_NEWEST;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadHomeData();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const goSearch = () => router.push('/search');

  const header = (
    <View>
      {/* Header: location, notifications, search bar */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.topRow}>
          <View>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={18} color="#10B981" />
              <AppText size={14} weight="semibold" color="rgba(255,255,255,0.9)" style={styles.locationText}>
                Lagos, Nigeria
              </AppText>
              <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
            </View>
            <AppText size={24} weight="extrabold" color="#FFFFFF" style={styles.headline}>
              Find Your Dream Home
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => router.push('/notifications')}
            style={styles.bell}
          >
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        <Pressable accessibilityRole="search" onPress={goSearch} style={styles.searchBar}>
          <Ionicons name="search" size={24} color={EMERALD} />
          <AppText size={15} color="#94A3B8" numberOfLines={1} style={styles.searchPlaceholder}>
            Search area, state, or property type...
          </AppText>
          <View style={styles.tune}>
            <Ionicons name="options" size={18} color="#FFFFFF" />
          </View>
        </Pressable>
      </View>

      {/* Hero banner */}
      <View style={styles.heroPad}>
        <View style={styles.hero}>
          <PropertyImage style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.heroOverlay]} />
          <View style={styles.heroText}>
            <View style={styles.heroTag}>
              <AppText size={10} weight="extrabold" color="#FFFFFF" style={styles.tagText}>
                PREMIUM PICK OF THE DAY
              </AppText>
            </View>
            <AppText size={18} weight="bold" color="#FFFFFF" style={styles.heroTitle}>
              Luxury 4-Bed Fully Serviced Villa
            </AppText>
            <View style={styles.heroRow}>
              <AppText size={13} weight="medium" color="#E2E8F0" style={styles.heroPrice}>
                ₦7,500,000 / year • Victoria Island
              </AppText>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/property/[id]', params: { id: '1' } })}
                style={styles.heroBtn}
              >
                <AppText size={12} weight="bold" color={EMERALD}>
                  View
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Category pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pills}
        style={styles.pillsScroll}
      >
        {CATEGORIES.map((c) => {
          const selected = c === category;
          return (
            <Pressable
              key={c}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setCategory(c)}
              style={[
                styles.pill,
                {
                  backgroundColor: selected ? EMERALD : colors.surface,
                  borderColor: selected ? EMERALD : colors.border,
                },
                selected && styles.pillShadow,
              ]}
            >
              <AppText
                size={13}
                weight={selected ? 'bold' : 'semibold'}
                color={selected ? '#FFFFFF' : colors.textSecondary}
              >
                {c}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      <SectionHeader title="Featured Properties" action="See All" onAction={goSearch} />
      <FlatList
        horizontal
        data={featured}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <FeaturedCard property={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      />

      <SectionHeader title="Explore Locations" action="View Map" onAction={goSearch} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cities}
      >
        {CITIES.map((c) => (
          <View
            key={c.name}
            style={[styles.city, { backgroundColor: c.color, shadowColor: c.color }]}
          >
            <AppText size={16} weight="extrabold" color="#FFFFFF">
              {c.name}
            </AppText>
            <AppText size={12} weight="medium" color="rgba(255,255,255,0.8)" style={styles.cityCount}>
              {c.count}
            </AppText>
          </View>
        ))}
      </ScrollView>

      <SectionHeader title="Newest Verified Listings" action="Browse All" onAction={goSearch} />
    </View>
  );

  return (
    <FlatList
      data={newest}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <ListingCard property={item} />
        </View>
      )}
      ListHeaderComponent={header}
      ListFooterComponent={<View style={styles.footer} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
      }
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.background }}
    />
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: EMERALD, paddingHorizontal: 24, paddingBottom: 28 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { marginLeft: 6 },
  headline: { marginTop: 6, letterSpacing: -0.5 },
  bell: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  bellDot: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  searchBar: {
    marginTop: 24,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  searchPlaceholder: { flex: 1, marginLeft: 12 },
  tune: { padding: 8, borderRadius: 10, backgroundColor: EMERALD },

  heroPad: { paddingHorizontal: 24, paddingTop: 20 },
  hero: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  heroOverlay: { backgroundColor: 'rgba(0,0,0,0.35)' },
  heroText: { position: 'absolute', left: 20, right: 20, bottom: 20 },
  heroTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#D4A017',
  },
  tagText: { letterSpacing: 0.8 },
  heroTitle: { marginTop: 8 },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  heroPrice: { flexShrink: 1, marginRight: 8 },
  heroBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#FFFFFF' },

  pillsScroll: { marginTop: 24, marginBottom: 8, flexGrow: 0 },
  pills: { paddingHorizontal: 24 },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 10,
  },
  pillShadow: {
    shadowColor: EMERALD,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 16,
  },
  sectionTitle: { letterSpacing: -0.4 },
  carousel: { paddingHorizontal: 24, paddingBottom: 8 },
  cities: { paddingHorizontal: 24 },
  city: {
    width: 140,
    height: 100,
    marginRight: 14,
    padding: 16,
    borderRadius: 18,
    justifyContent: 'flex-end',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cityCount: { marginTop: 2 },
  listItem: { paddingHorizontal: 24 },
  footer: { height: 100 },
});
