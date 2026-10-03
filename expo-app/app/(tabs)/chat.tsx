// ============================================================================
// Conversations Screen - Chat List (ports conversations_screen.dart)
// Static demo data at parity with Flutter; every row opens /chat/1.
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useToast } from '@/components/ui/Toast';
import { palette } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface Conversation {
  name: string;
  message: string;
  time: string;
  unread: number;
  online: boolean;
}

const CONVERSATIONS: Conversation[] = [
  { name: 'Chief Adebayo', message: 'Yes, the apartment is still available for viewing...', time: '2m ago', unread: 2, online: true },
  { name: 'Amaka C.', message: 'I can schedule an inspection for next week.', time: '15m ago', unread: 0, online: false },
  { name: 'Ibrahim M.', message: 'The rent includes service charge for this year.', time: '1h ago', unread: 1, online: true },
  { name: 'Chidinma O.', message: 'Let me send you the floor plan.', time: '3h ago', unread: 0, online: false },
  { name: 'Emeka N.', message: 'Thanks for your interest! When would you like to visit?', time: 'Yesterday', unread: 3, online: true },
  { name: 'Admin Support', message: 'Your account has been verified successfully.', time: '2 days ago', unread: 0, online: false },
];

export default function ConversationsScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Messages"
        showBack={false}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search conversations"
            hitSlop={8}
            onPress={() => toast.show('Search Conversations coming soon!', 'info')}
            style={styles.action}
          >
            <Ionicons name="search-outline" size={24} color={colors.textPrimary} />
          </Pressable>
        }
      />

      <FlatList
        data={CONVERSATIONS}
        keyExtractor={(c) => c.name}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const hasUnread = item.unread > 0;
          return (
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                router.push({ pathname: '/chat/[id]', params: { id: '1', name: item.name } })
              }
              style={styles.row}
            >
              <View>
                <View style={[styles.avatar, { backgroundColor: colors.primarySurface }]}>
                  <AppText size={15} weight="bold" color={colors.primary}>
                    {item.name.substring(0, 2).toUpperCase()}
                  </AppText>
                </View>
                {item.online ? (
                  <View style={[styles.online, { backgroundColor: palette.success, borderColor: colors.surface }]} />
                ) : null}
              </View>

              <View style={styles.content}>
                <View style={styles.line}>
                  <AppText
                    size={15}
                    weight={hasUnread ? 'bold' : 'medium'}
                    numberOfLines={1}
                    style={styles.flex}
                  >
                    {item.name}
                  </AppText>
                  <AppText
                    size={12}
                    weight={hasUnread ? 'semibold' : 'regular'}
                    color={hasUnread ? colors.primary : colors.textTertiary}
                  >
                    {item.time}
                  </AppText>
                </View>
                <View style={[styles.line, styles.subLine]}>
                  <AppText
                    size={13}
                    weight={hasUnread ? 'medium' : 'regular'}
                    color={hasUnread ? colors.textPrimary : colors.textTertiary}
                    numberOfLines={1}
                    style={styles.flex}
                  >
                    {item.message}
                  </AppText>
                  {hasUnread ? (
                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                      <AppText size={11} weight="bold" color="#FFFFFF">
                        {item.unread}
                      </AppText>
                    </View>
                  ) : null}
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  action: { padding: 8, marginRight: 8 },
  list: { paddingHorizontal: 20 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  online: {
    position: 'absolute',
    right: 0,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  content: { flex: 1, marginLeft: 16 },
  line: { flexDirection: 'row', alignItems: 'center' },
  subLine: { marginTop: 4 },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
