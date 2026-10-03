// ============================================================================
// ScreenHeader: AppBar replacement (white / dark background, 20px semibold
// title, optional back button and trailing actions)
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from './AppText';
import { useTheme } from '@/hooks/useTheme';

export interface ScreenHeaderProps {
  title: string;
  /** Show a back arrow (default true when the router can go back). */
  showBack?: boolean;
  right?: ReactNode;
}

export function ScreenHeader({ title, showBack, right }: ScreenHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const back = showBack ?? router.canGoBack();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingTop: insets.top,
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.inner}>
        {back ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            hitSlop={8}
            style={styles.back}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
        ) : null}
        <AppText
          variant="headlineMedium"
          numberOfLines={1}
          style={[styles.title, !back && styles.titleNoBack]}
        >
          {title}
        </AppText>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { borderBottomWidth: StyleSheet.hairlineWidth },
  inner: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  back: { padding: 8, marginRight: 4 },
  title: { flex: 1 },
  titleNoBack: { marginLeft: 12 },
  right: { flexDirection: 'row', alignItems: 'center' },
});
