// ============================================================================
// VerifiedBadge & PremiumBadge
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/hooks/useTheme';

export function VerifiedBadge({ size = 18 }: { size?: number }) {
  const { colors } = useTheme();
  return <Ionicons name="checkmark-circle" size={size} color={colors.primary} />;
}

/** Gold pill. Flutter's goldGradient was already flattened to solid accent. */
export function PremiumBadge({ label = 'Premium' }: { label?: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.premium, { backgroundColor: colors.accent }]}>
      <Ionicons name="ribbon" size={14} color="#FFFFFF" />
      <AppText variant="labelSmall" color="#FFFFFF" weight="bold" style={styles.premiumLabel}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  premium: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  premiumLabel: { marginLeft: 4 },
});
