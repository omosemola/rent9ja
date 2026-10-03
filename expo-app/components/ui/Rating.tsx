// ============================================================================
// StarRating & PriceTag
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/hooks/useTheme';

export interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

export function StarRating({ rating, reviewCount = 0, size = 16 }: StarRatingProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {Array.from({ length: 5 }, (_, i) => (
        <Ionicons
          key={i}
          name={i < Math.round(rating) ? 'star' : 'star-outline'}
          size={size}
          color={colors.accent}
        />
      ))}
      {reviewCount > 0 ? (
        <AppText
          variant="labelMedium"
          size={size * 0.75}
          weight="medium"
          style={styles.count}
        >{`${rating.toFixed(1)} (${reviewCount})`}</AppText>
      ) : null}
    </View>
  );
}

export interface PriceTagProps {
  price: string;
  period?: string;
  fontSize?: number;
}

export function PriceTag({ price, period, fontSize = 16 }: PriceTagProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.priceRow}>
      <AppText color={colors.primary} weight="extrabold" size={fontSize}>
        {price}
      </AppText>
      {period ? (
        <AppText color={colors.textTertiary} weight="medium" size={fontSize * 0.7}>
          {`/${period}`}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  count: { marginLeft: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end' },
});
