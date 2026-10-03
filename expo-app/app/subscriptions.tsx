// ============================================================================
// Subscription Plans Screen
// ============================================================================

import { View, ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/useTheme';
import { palette } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function SubscriptionPlansScreen() {
  const { colors, radius } = useTheme();
  const toast = useToast();

  const comingSoon = () => toast.show('Coming soon!', 'info');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerTitle: 'Subscription Plans' }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant="displaySmall">Choose Your Plan</AppText>
        <AppText color={colors.textSecondary} style={{ marginTop: 8 }}>
          Unlock premium features for your listings
        </AppText>

        <View style={styles.spacer} />

        {/* Free Plan */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg }]}>
          <View style={styles.rowBetween}>
            <AppText variant="headlineSmall">Basic</AppText>
            <View style={[styles.badge, { backgroundColor: colors.surfaceVariant }]}>
              <AppText size={12} weight="bold" color={colors.textSecondary}>Current</AppText>
            </View>
          </View>
          <AppText size={28} weight="extrabold" color={colors.primary} style={{ marginTop: 8 }}>Free</AppText>
          <View style={{ marginTop: 20 }}>
            {['Up to 3 property listings', 'Basic analytics', 'Standard support', 'Limited chat messages'].map((f) => (
              <View key={f} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={20} color={palette.success} />
                <AppText size={14} style={{ marginLeft: 10 }}>{f}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Premium Plan */}
        <LinearGradient
          colors={['#0F2027', '#203A43', '#2C5364']} // primaryGradient equivalent
          style={[styles.card, styles.premiumCard, { borderRadius: radius.lg }]}
        >
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <AppText variant="headlineSmall" color="#FFFFFF">Premium</AppText>
              <Ionicons name="ribbon" size={24} color={palette.accentLight} style={{ marginLeft: 8 }} />
            </View>
            <LinearGradient colors={['#D4AF37', '#FFD700', '#D4AF37']} style={styles.badge}>
              <AppText size={12} weight="bold" color="#FFFFFF">Recommended</AppText>
            </LinearGradient>
          </View>
          
          <View style={[styles.row, { alignItems: 'flex-end', marginTop: 8 }]}>
            <AppText size={28} weight="extrabold" color="#FFFFFF">₦15,000</AppText>
            <AppText size={14} color="rgba(255,255,255,0.7)" style={{ marginBottom: 4 }}> /month</AppText>
          </View>

          <View style={{ marginTop: 20 }}>
            {[
              'Unlimited property listings', 'Featured listings badge', 'Priority in search results',
              'Verified landlord badge', 'Advanced analytics dashboard', 'Higher visibility in searches',
              'Unlimited chat messages', 'Premium support (24/7)'
            ].map((f) => (
              <View key={f} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={20} color={palette.accentLight} />
                <AppText size={14} color="#FFFFFF" style={{ marginLeft: 10 }}>{f}</AppText>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 24 }}>
            <Button label="Upgrade to Premium" onPress={comingSoon} variant="primary" style={{ backgroundColor: '#FFFFFF' }} labelStyle={{ color: palette.primaryDark }} />
          </View>
        </LinearGradient>

        <AppText size={13} color={colors.textTertiary} style={{ textAlign: 'center', marginTop: 24 }}>
          Cancel anytime. No hidden fees.
        </AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: 20 },
  spacer: { height: 32 },
  card: { padding: 24, borderWidth: 1, marginBottom: 20 },
  premiumCard: { borderWidth: 0, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
});
