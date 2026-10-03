// ============================================================================
// Search Screen with Advanced Filters (ports search_screen.dart)
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { PropertyImage } from '@/components/ui/PropertyImage';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TextField } from '@/components/ui/TextField';
import { propertyAddress } from '@/components/property/PropertyCards';
import { useTheme } from '@/hooks/useTheme';
import { usePropertiesStore } from '@/stores/propertiesStore';
import type { Property } from '@/types/property';
import { formatPricePerYear } from '@/utils/format';

const STATES = ['All States', 'Lagos', 'Abuja', 'Rivers', 'Oyo', 'Anambra', 'Enugu'];

/**
 * Filter label -> backend PropertyType enum.
 * (Flutter sent "SELF_CONTAIN" for "Self-Contain", which the API never matched;
 * here it maps to the real SELF_CONTAINED value.)
 */
const TYPES: { label: string; value: string | undefined }[] = [
  { label: 'All Types', value: undefined },
  { label: 'Apartment', value: 'APARTMENT' },
  { label: 'Duplex', value: 'DUPLEX' },
  { label: 'Self-Contain', value: 'SELF_CONTAINED' },
  { label: 'Studio', value: 'STUDIO' },
];

function SearchResultCard({ property }: { property: Property }) {
  const router = useRouter();
  const { colors } = useTheme();
  const hasImage = property.images.length > 0;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/property/[id]', params: { id: property.id } })}
      style={[styles.card, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.cardImage, { backgroundColor: colors.primarySurface }]}>
        {hasImage ? (
          <PropertyImage uri={property.images[0]} style={styles.fill} />
        ) : (
          <View style={styles.imageFallback}>
            <Ionicons name="home" size={48} color="rgba(255,255,255,0.4)" />
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <View style={styles.priceRow}>
          <AppText size={18} weight="extrabold" color={colors.primary}>
            {formatPricePerYear(property.price)}
          </AppText>
          <AppText size={12} weight="semibold" color={colors.textSecondary}>
            {property.propertyType || 'APARTMENT'}
          </AppText>
        </View>
        <AppText size={16} weight="bold" style={styles.title}>
          {property.title || 'Property Listing'}
        </AppText>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
          <AppText size={13} color={colors.textTertiary} numberOfLines={1} style={styles.addressText}>
            {propertyAddress(property)}
          </AppText>
        </View>
        <View style={styles.specRow}>
          <Ionicons name="bed-outline" size={16} color={colors.textSecondary} />
          <AppText size={13} color={colors.textSecondary} style={styles.specText}>
            {property.bedrooms} Beds
          </AppText>
          <Ionicons name="water-outline" size={16} color={colors.textSecondary} style={styles.bathIcon} />
          <AppText size={13} color={colors.textSecondary} style={styles.specText}>
            {property.bathrooms} Baths
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

export default function SearchScreen() {
  const { colors, radius } = useTheme();
  const results = usePropertiesStore((s) => s.searchResults);
  const loading = usePropertiesStore((s) => s.loading.search);
  const search = usePropertiesStore((s) => s.search);

  const [query, setQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedType, setSelectedType] = useState('All Types');
  const [sheetOpen, setSheetOpen] = useState(false);

  const performSearch = useCallback(
    (overrides?: { query?: string; state?: string; type?: string }) => {
      const q = (overrides?.query ?? query).trim();
      const st = overrides?.state ?? selectedState;
      const tp = overrides?.type ?? selectedType;
      void search({
        query: q || undefined,
        state: st !== 'All States' ? st : undefined,
        propertyType: TYPES.find((t) => t.label === tp)?.value,
      });
    },
    [query, selectedState, selectedType, search],
  );

  // Initial search on mount (matches initState -> _performSearch).
  useEffect(() => {
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterButton = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Filter properties"
      onPress={() => setSheetOpen(true)}
      hitSlop={8}
      style={styles.filterBtn}
    >
      <Ionicons name="options-outline" size={24} color={colors.textPrimary} />
      <View style={[styles.dot, { backgroundColor: colors.accent, borderColor: colors.surface }]} />
    </Pressable>
  );

  const header = (
    <View>
      <View style={styles.searchWrap}>
        <TextField
          icon="search-outline"
          placeholder="Search by location, property type..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => performSearch()}
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
            onPress={() => {
              setQuery('');
              performSearch({ query: '' });
            }}
            style={styles.clear}
          >
            <Ionicons name="close" size={22} color={colors.textTertiary} />
          </Pressable>
        ) : null}
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={STATES}
        keyExtractor={(s) => s}
        style={styles.chips}
        contentContainerStyle={styles.chipsContent}
        renderItem={({ item }) => {
          const selected = selectedState === item;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => {
                setSelectedState(item);
                performSearch({ state: item });
              }}
              style={[
                styles.chip,
                {
                  borderRadius: 10,
                  backgroundColor: selected ? colors.primary : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
            >
              {selected ? <Ionicons name="checkmark" size={14} color="#FFFFFF" style={styles.check} /> : null}
              <AppText size={12} weight="medium" color={selected ? '#FFFFFF' : colors.textSecondary}>
                {item}
              </AppText>
            </Pressable>
          );
        }}
      />
      <View style={styles.gap} />
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Search Properties" showBack={false} right={filterButton} />

      {header}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : results.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="search-outline" size={64} color={colors.textTertiary} />
          <AppText variant="titleLarge" style={styles.emptyTitle}>
            No properties found
          </AppText>
          <AppText color={colors.textTertiary}>Try adjusting your search query or filters</AppText>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => <SearchResultCard property={item} />}
        />
      )}

      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSheetOpen(false)} />
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <AppText variant="headlineSmall">Filter Properties</AppText>
          <AppText size={14} weight="semibold" style={styles.sheetLabel}>
            Property Type
          </AppText>
          <View style={styles.typeWrap}>
            {TYPES.map((t) => {
              const selected = selectedType === t.label;
              return (
                <Pressable
                  key={t.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setSelectedType(t.label);
                    setSheetOpen(false);
                    performSearch({ type: t.label });
                  }}
                  style={[
                    styles.typeChip,
                    {
                      borderRadius: radius.sm,
                      backgroundColor: selected ? colors.primarySurface : colors.surface,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <AppText
                    size={14}
                    weight={selected ? 'semibold' : 'medium'}
                    color={selected ? colors.primary : colors.textPrimary}
                  >
                    {t.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  fill: { width: '100%', height: '100%' },
  filterBtn: { padding: 8, marginRight: 8 },
  dot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },

  searchWrap: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16, justifyContent: 'center' },
  clear: { position: 'absolute', right: 36, top: 8 + 18 },

  chips: { height: 38, flexGrow: 0 },
  chipsContent: { paddingHorizontal: 20, alignItems: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginRight: 8,
  },
  check: { marginRight: 4 },
  gap: { height: 12 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { marginTop: 16, marginBottom: 8 },

  list: { paddingHorizontal: 20, paddingVertical: 12 },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardImage: { height: 180 },
  imageFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: 16 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { marginTop: 6 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  addressText: { marginLeft: 4, flex: 1 },
  specRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  specText: { marginLeft: 4 },
  bathIcon: { marginLeft: 16 },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  sheetLabel: { marginTop: 20, marginBottom: 10 },
  typeWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
});
