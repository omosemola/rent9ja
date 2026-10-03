// ============================================================================
// Property Detail Screen (ports property_detail_screen.dart)
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
// Note: using expo-router
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { palette } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { usePropertiesStore } from '@/stores/propertiesStore';
import { formatPricePerYear } from '@/utils/format';
import { propertyAddress } from '@/components/property/PropertyCards';

export default function PropertyDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id;

  const insets = useSafeAreaInsets();
  const { colors, radius } = useTheme();
  const { width } = useWindowDimensions();
  const toast = useToast();

  const loadDetail = usePropertiesStore((s) => s.loadDetail);
  const toggleFavorite = usePropertiesStore((s) => s.toggleFavorite);
  const detail = usePropertiesStore((s) => s.detail);
  const loading = usePropertiesStore((s) => s.loading.detail);

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) void loadDetail(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const comingSoon = (feature: string) => () => toast.show(`${feature} coming soon!`, 'info');

  const handleFavorite = async () => {
    if (!id) return;
    const success = await toggleFavorite(id);
    if (success) {
      toast.show('Favorite updated!', 'success');
    } else {
      toast.show('Failed to update favorite', 'error');
    }
  };

  if (loading || !detail || detail.id !== id) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const landlord = detail.landlord || {
    id: '1',
    fullName: 'Chief Adebayo Ogundimu',
    isVerified: true,
    averageRating: 4.8,
    totalReviews: 12,
  };

  const images = detail.images.length > 0 ? detail.images : [];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Gallery */}
        <View style={[styles.gallery, { height: 300, backgroundColor: colors.primaryDark }]}>
          {images.length > 0 ? (
            <FlatList
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              data={images}
              keyExtractor={(item, index) => `${index}-${item}`}
              onMomentumScrollEnd={(e) =>
                setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))
              }
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={{ width, height: 300 }} resizeMode="cover" />
              )}
            />
          ) : (
            <View style={styles.center}>
              <Ionicons name="business" size={80} color="rgba(255,255,255,0.3)" />
            </View>
          )}

          {images.length > 0 && (
            <View style={[styles.counter, { bottom: 16, right: 16 }]}>
              <Ionicons name="images-outline" size={16} color="#FFFFFF" />
              <AppText size={13} weight="semibold" color="#FFFFFF" style={styles.counterText}>
                {activeImage + 1}/{images.length}
              </AppText>
            </View>
          )}

          {/* App Bar Overlays */}
          <View style={[styles.appBar, { top: insets.top || 16 }]}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={[styles.roundBtn, { backgroundColor: 'rgba(255,255,255,0.9)' }]}
            >
              <Ionicons name="chevron-back" size={24} color={palette.black} style={styles.backIcon} />
            </Pressable>
            <View style={styles.appBarRight}>
              <Pressable
                accessibilityRole="button"
                onPress={comingSoon('Share')}
                style={[styles.roundBtn, { backgroundColor: 'rgba(255,255,255,0.9)', marginRight: 8 }]}
              >
                <Ionicons name="share-outline" size={20} color={palette.black} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={handleFavorite}
                style={[styles.roundBtn, { backgroundColor: 'rgba(255,255,255,0.9)' }]}
              >
                <Ionicons
                  name={detail.isFavorited ? 'heart' : 'heart-outline'}
                  size={20}
                  color={palette.error}
                />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.priceRow}>
            <View style={styles.priceWrap}>
              <AppText variant="displaySmall" color={colors.primary} weight="extrabold">
                {formatPricePerYear(detail.price)}
              </AppText>
              <AppText color={colors.textSecondary} style={styles.perYear}>
                {' '}
                / year
              </AppText>
            </View>
            <View style={[styles.verifiedBadge, { backgroundColor: `${palette.success}1A` }]}>
              <Ionicons name="checkmark-circle" size={16} color={palette.success} />
              <AppText size={12} weight="semibold" color={palette.success} style={styles.verifiedText}>
                Verified
              </AppText>
            </View>
          </View>

          <AppText variant="headlineMedium" style={styles.title}>
            {detail.title || '3-Bedroom Luxury Duplex'}
          </AppText>

          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={18} color={colors.textTertiary} />
            <AppText size={14} color={colors.textSecondary} style={styles.addressText}>
              {propertyAddress(detail)}
            </AppText>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.featuresRow}>
            <FeatureTile icon="bed-outline" value={String(detail.bedrooms)} label="Bedrooms" />
            <FeatureTile icon="water-outline" value={String(detail.bathrooms)} label="Bathrooms" />
            <FeatureTile icon="man-outline" value={String(detail.toilets)} label="Toilets" />
            <FeatureTile icon="square-outline" value={String(detail.squareMeters || 350)} label="sqm" />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <AppText variant="headlineSmall" style={styles.sectionTitle}>
            Property Manager
          </AppText>
          <View style={[styles.landlordCard, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <AppText size={20} weight="bold" color="#FFFFFF">
                {landlord.fullName.charAt(0)}
              </AppText>
            </View>
            <View style={styles.landlordInfo}>
              <AppText size={15} weight="bold">
                {landlord.fullName}
              </AppText>
              <AppText size={12} color={colors.textSecondary} style={styles.landlordSub}>
                Verified Landlord • {landlord.totalReviews} Active Listings
              </AppText>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: '/chat/[id]',
                  params: { id: '1', name: landlord.fullName, propertyTitle: detail.title },
                })
              }
              hitSlop={8}
            >
              <Ionicons name="chatbubble-outline" size={24} color={colors.primary} />
            </Pressable>
          </View>

          <AppText variant="headlineSmall" style={styles.sectionTitle}>
            Description
          </AppText>
          <AppText size={16} color={colors.textSecondary} style={styles.description}>
            {detail.description || 'Spacious, modern property located in a highly serene and secure environment...'}
          </AppText>

          <AppText variant="headlineSmall" style={styles.sectionTitle}>
            Amenities & Facilities
          </AppText>
          <View style={styles.amenities}>
            {detail.amenities.length > 0 ? (
              detail.amenities.map((am) => (
                <View
                  key={am}
                  style={[
                    styles.amenityChip,
                    { backgroundColor: colors.surfaceVariant, borderColor: colors.border, borderRadius: radius.sm },
                  ]}
                >
                  <Ionicons name="checkmark" size={16} color={colors.primary} />
                  <AppText size={13} weight="medium" style={styles.amenityText}>
                    {am}
                  </AppText>
                </View>
              ))
            ) : (
              <>
                <AmenityChip icon="flash" label="24/7 Electricity" />
                <AmenityChip icon="shield-checkmark" label="Gated Security" />
                <AmenityChip icon="water" label="Treated Water" />
                <AmenityChip icon="car" label="Parking Space" />
                <AmenityChip icon="snow" label="Air Conditioning" />
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button
          label="Contact"
          icon="chatbubble-outline"
          variant="outline"
          onPress={() =>
            router.push({
              pathname: '/chat/[id]',
              params: { id: '1', name: landlord.fullName, propertyTitle: detail.title },
            })
          }
          style={styles.contactBtn}
        />
        <View style={styles.gap} />
        <Button
          label="Book Inspection"
          icon="calendar"
          onPress={() => router.push({ pathname: '/book-appointment/[id]', params: { id: detail.id } })}
          style={styles.bookBtn}
        />
      </View>
    </View>
  );
}

function FeatureTile({ icon, value, label }: { icon: any; value: string; label: string }) {
  const { colors, radius } = useTheme();
  return (
    <View style={styles.featureTile}>
      <View style={[styles.featureIcon, { backgroundColor: colors.primarySurface, borderRadius: radius.md }]}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <AppText size={16} weight="bold" style={styles.featureValue}>
        {value}
      </AppText>
      <AppText size={12} color={colors.textTertiary}>
        {label}
      </AppText>
    </View>
  );
}

function AmenityChip({ icon, label }: { icon: any; label: string }) {
  const { colors, radius } = useTheme();
  return (
    <View
      style={[
        styles.amenityChip,
        { backgroundColor: colors.surfaceVariant, borderColor: colors.border, borderRadius: radius.sm },
      ]}
    >
      <Ionicons name={icon} size={16} color={colors.primary} />
      <AppText size={13} weight="medium" style={styles.amenityText}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingBottom: 100 },

  gallery: { position: 'relative' },
  counter: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: { marginLeft: 6 },
  appBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appBarRight: { flexDirection: 'row' },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { marginRight: 2 }, // visual center tweak

  content: { padding: 20 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceWrap: { flexDirection: 'row', alignItems: 'baseline' },
  perYear: { fontSize: 14 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  verifiedText: { marginLeft: 4 },
  title: { marginTop: 12 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  addressText: { marginLeft: 6, flex: 1 },

  divider: { height: 1, marginVertical: 24 },

  featuresRow: { flexDirection: 'row', justifyContent: 'space-around' },
  featureTile: { alignItems: 'center' },
  featureIcon: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  featureValue: { marginTop: 8 },

  sectionTitle: { marginBottom: 12 },
  landlordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    marginBottom: 24,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  landlordInfo: { flex: 1, marginLeft: 14 },
  landlordSub: { marginTop: 2 },

  description: { lineHeight: 24, marginBottom: 24 },

  amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  amenityText: { marginLeft: 8 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  contactBtn: { flex: 1 },
  gap: { width: 14 },
  bookBtn: { flex: 2 },
});
