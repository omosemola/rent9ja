// ============================================================================
// Reviews Screen
// ============================================================================

import { View, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { useTheme } from '@/hooks/useTheme';
import { palette } from '@/constants/theme';

export default function ReviewsScreen() {
  const { colors, radius } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerTitle: 'Reviews' }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Rating Summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg }]}>
          <View style={styles.row}>
            <View style={styles.mainRating}>
              <AppText size={48} weight="extrabold" color={colors.primary}>
                4.8
              </AppText>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons key={s} name={s < 5 ? 'star' : 'star-outline'} size={20} color={palette.accent} />
                ))}
              </View>
              <AppText size={12} color={colors.textSecondary} style={{ marginTop: 4 }}>
                124 reviews
              </AppText>
            </View>
            <View style={styles.barsWrap}>
              <RatingBar label="5" percent={0.72} />
              <RatingBar label="4" percent={0.18} />
              <RatingBar label="3" percent={0.06} />
              <RatingBar label="2" percent={0.03} />
              <RatingBar label="1" percent={0.01} />
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.subRatingsRow}>
            <SubRating label="Communication" value="4.9" />
            <SubRating label="Professionalism" value="4.7" />
            <SubRating label="Accuracy" value="4.8" />
          </View>
        </View>

        {/* Reviews List */}
        {REVIEWS.map((r, i) => (
          <View key={i} style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}>
            <View style={styles.reviewerRow}>
              <View style={[styles.avatar, { backgroundColor: colors.primarySurface }]}>
                <AppText size={13} weight="bold" color={colors.primary}>
                  {r.name.split(' ').map(n => n[0]).join('')}
                </AppText>
              </View>
              <View style={styles.reviewerInfo}>
                <AppText size={14} weight="semibold">{r.name}</AppText>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Ionicons key={s} name={s <= r.rating ? 'star' : 'star-outline'} size={14} color={palette.accent} />
                  ))}
                  <AppText size={11} color={colors.textTertiary} style={{ marginLeft: 8 }}>{r.date}</AppText>
                </View>
              </View>
            </View>
            <AppText size={14} color={colors.textSecondary} style={styles.comment}>
              {r.comment}
            </AppText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function RatingBar({ label, percent }: { label: string; percent: number }) {
  const { colors, radius } = useTheme();
  return (
    <View style={styles.barRow}>
      <AppText size={12} color={colors.textTertiary} weight="medium">{label}</AppText>
      <View style={[styles.barTrack, { backgroundColor: colors.surfaceVariant, borderRadius: radius.sm }]}>
        <View style={[styles.barFill, { width: `${percent * 100}%`, backgroundColor: palette.accent }]} />
      </View>
      <View style={styles.percentWrap}>
        <AppText size={11} color={colors.textTertiary}>{Math.round(percent * 100)}%</AppText>
      </View>
    </View>
  );
}

function SubRating({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.subRatingCol}>
      <AppText size={18} weight="bold" color={colors.primary}>{value}</AppText>
      <AppText size={12} color={colors.textTertiary} style={{ marginTop: 4 }}>{label}</AppText>
    </View>
  );
}

const REVIEWS = [
  { name: 'Tunde Bakare', rating: 5, date: '2 weeks ago', comment: 'Excellent landlord! Very professional and responsive. The apartment was exactly as described.' },
  { name: 'Ngozi Eze', rating: 5, date: '1 month ago', comment: 'Chief Adebayo was very transparent about all costs. No hidden fees.' },
  { name: 'Bola Adeyemo', rating: 4, date: '2 months ago', comment: 'Good experience overall. Minor repairs were promptly handled.' },
  { name: 'Fatima Bello', rating: 5, date: '3 months ago', comment: 'Best landlord I\'ve dealt with in Lagos. Quick responses.' },
];

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: 20 },
  summaryCard: { padding: 24, borderWidth: 0.5, marginBottom: 24 },
  row: { flexDirection: 'row' },
  mainRating: { alignItems: 'center', justifyContent: 'center' },
  starsRow: { flexDirection: 'row', alignItems: 'center' },
  barsWrap: { flex: 1, marginLeft: 30 },
  barRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3 },
  barTrack: { flex: 1, height: 6, marginHorizontal: 8, overflow: 'hidden' },
  barFill: { height: '100%' },
  percentWrap: { width: 32 },
  divider: { height: 1, marginVertical: 20 },
  subRatingsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  subRatingCol: { alignItems: 'center' },

  reviewCard: { padding: 16, borderWidth: 0.5, marginBottom: 16 },
  reviewerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  reviewerInfo: { flex: 1, marginLeft: 12 },
  comment: { lineHeight: 21 },
});
