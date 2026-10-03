// ============================================================================
// Favorites Screen (ports favorites_screen.dart)
// Static demo list at parity with Flutter: swipe left to remove, each card
// links to the hardcoded /property/1.
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/useTheme';

interface SavedItem {
  id: number;
  title: string;
  price: string;
}

const INITIAL: SavedItem[] = [
  { id: 0, title: 'Luxury 3-Bed Apartment', price: '₦3.5M/yr' },
  { id: 1, title: 'Modern Duplex, Ajah', price: '₦5M/yr' },
  { id: 2, title: 'Studio VI', price: '₦2M/yr' },
  { id: 3, title: 'Flat in Maitama', price: '₦6M/yr' },
];

/** Replacement for Flutter's Dismissible(direction: endToStart). */
function SwipeToDismiss({ onDismiss, children }: { onDismiss: () => void; children: React.ReactNode }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const x = useRef(new Animated.Value(0)).current;

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderMove: (_, g) => {
        if (g.dx < 0) x.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx < -width * 0.4) {
          Animated.timing(x, { toValue: -width, duration: 180, useNativeDriver: true }).start(onDismiss);
        } else {
          Animated.spring(x, { toValue: 0, useNativeDriver: true }).start();
        }
      },
      onPanResponderTerminate: () => Animated.spring(x, { toValue: 0, useNativeDriver: true }).start(),
    }),
  ).current;

  return (
    <View style={styles.swipeWrap}>
      <View style={[styles.swipeBg, { backgroundColor: 'rgba(220,38,38,0.1)' }]}>
        <Ionicons name="trash-outline" size={28} color={colors.error} />
      </View>
      <Animated.View style={{ transform: [{ translateX: x }] }} {...pan.panHandlers}>
        {children}
      </Animated.View>
    </View>
  );
}

export default function FavoritesScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const [items, setItems] = useState(INITIAL);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Saved Properties"
        showBack={false}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Folders"
            hitSlop={8}
            onPress={() => toast.show('Folders coming soon!', 'info')}
            style={styles.action}
          >
            <Ionicons name="folder-outline" size={24} color={colors.textPrimary} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.list}>
        {items.map((item) => (
          <SwipeToDismiss key={item.id} onDismiss={() => setItems((l) => l.filter((i) => i.id !== item.id))}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/property/[id]', params: { id: '1' } })}
              style={[styles.card, { backgroundColor: colors.surface }]}
            >
              <View style={[styles.thumb, { backgroundColor: colors.primarySurface }]}>
                <Ionicons name="home" size={32} color="rgba(255,255,255,0.4)" />
              </View>
              <View style={styles.body}>
                <AppText variant="titleMedium" weight="semibold">
                  {item.title}
                </AppText>
                <AppText variant="bodySmall" color={colors.textSecondary} style={styles.sub}>
                  Lagos, Nigeria
                </AppText>
                <AppText weight="extrabold" color={colors.primary}>
                  {item.price}
                </AppText>
              </View>
              <Ionicons name="heart" size={22} color={colors.error} style={styles.heart} />
            </Pressable>
          </SwipeToDismiss>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  action: { padding: 8, marginRight: 8 },
  list: { padding: 20 },
  swipeWrap: { marginBottom: 16 },
  swipeBg: {
    ...(StyleSheet.absoluteFill as any),
    borderRadius: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumb: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, padding: 14 },
  sub: { marginTop: 4, marginBottom: 8 },
  heart: { marginRight: 14 },
});
