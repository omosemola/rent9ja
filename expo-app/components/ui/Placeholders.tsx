// ============================================================================
// Skeleton (ShimmerCard) & EmptyState (EmptyStateWidget)
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { Button, type IconName } from './Button';
import { useTheme } from '@/hooks/useTheme';

export interface SkeletonProps {
  height?: number;
  width?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Pulsing placeholder (pure Animated; no native shimmer library). */
export function Skeleton({ height = 120, width = '100%', borderRadius = 16, style }: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.55, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[{ height, width, borderRadius, backgroundColor: colors.surfaceVariant, opacity }, style]}
    />
  );
}

export interface EmptyStateProps {
  icon: IconName;
  title: string;
  subtitle: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
}

export function EmptyState({ icon, title, subtitle, buttonLabel, onButtonPress }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <View style={[styles.iconBox, { backgroundColor: colors.primarySurface }]}>
        <Ionicons name={icon} size={36} color={colors.primary} />
      </View>
      <AppText variant="headlineSmall" align="center" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="bodyMedium" color={colors.textSecondary} align="center">
        {subtitle}
      </AppText>
      {buttonLabel ? (
        <View style={styles.button}>
          <Button label={buttonLabel} onPress={onButtonPress} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { marginBottom: 8 },
  button: { marginTop: 24 },
});
