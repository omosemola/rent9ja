// ============================================================================
// Notifications Screen
// ============================================================================

import { View, FlatList, StyleSheet, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/useTheme';
import { palette } from '@/constants/theme';

const NOTIFICATIONS = [
  { icon: 'home', color: palette.primary, title: 'New listing in your area', body: 'A new 3-bedroom apartment was listed in Lekki Phase 1 matching your preferences.', time: '5 min ago', read: false },
  { icon: 'chatbubble', color: palette.info, title: 'New message', body: 'Chief Adebayo sent you a message about the Lekki apartment.', time: '15 min ago', read: false },
  { icon: 'calendar', color: palette.accent, title: 'Inspection reminder', body: 'You have an inspection scheduled for tomorrow at 11:00 AM at Lekki Phase 1.', time: '1 hour ago', read: false },
  { icon: 'checkmark-circle', color: palette.success, title: 'Property verified', body: 'The property at Admiralty Way has been verified by our team.', time: '2 hours ago', read: true },
  { icon: 'heart', color: palette.error, title: 'Price drop alert', body: 'A property you saved in Victoria Island dropped in price by ₦200,000.', time: '5 hours ago', read: true },
  { icon: 'star', color: palette.warning, title: 'New review', body: 'You received a 5-star review from Ngozi Eze.', time: 'Yesterday', read: true },
  { icon: 'card', color: palette.success, title: 'Payment successful', body: 'Your premium subscription payment of ₦15,000 was successful.', time: '2 days ago', read: true },
  { icon: 'megaphone', color: palette.primary, title: 'Special offer', body: 'Upgrade to Premium and get 30% off your first month! Limited time offer.', time: '3 days ago', read: true },
] as const;

export default function NotificationsScreen() {
  const { colors, radius } = useTheme();
  const toast = useToast();

  const comingSoon = () => toast.show('Coming soon!', 'info');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: 'Notifications',
          headerRight: () => (
            <Pressable onPress={() => toast.show('Marked all as read', 'success')} style={{ padding: 8 }}>
              <AppText color={colors.primary} weight="bold">
                Mark all read
              </AppText>
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={comingSoon}
            style={[
              styles.card,
              {
                backgroundColor: item.read ? colors.surface : `${colors.primarySurface}80`,
                borderColor: item.read ? colors.border : `${colors.primary}20`,
                borderRadius: radius.md,
              },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: `${item.color}1A`, borderRadius: radius.sm }]}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <View style={styles.content}>
              <View style={styles.titleRow}>
                <AppText size={14} weight={item.read ? 'medium' : 'bold'} style={styles.titleText} numberOfLines={1}>
                  {item.title}
                </AppText>
                {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
              </View>
              <AppText size={13} color={colors.textSecondary} style={styles.bodyText} numberOfLines={2}>
                {item.body}
              </AppText>
              <AppText size={11} color={colors.textTertiary}>
                {item.time}
              </AppText>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { padding: 20 },
  card: {
    flexDirection: 'row',
    padding: 14,
    marginBottom: 8,
    borderWidth: 0.5,
  },
  iconWrap: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, marginLeft: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  titleText: { flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
  bodyText: { marginTop: 4, marginBottom: 6, lineHeight: 18 },
});
