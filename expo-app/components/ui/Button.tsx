// ============================================================================
// Button: ElevatedButton / OutlinedButton / TextButton equivalents
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/hooks/useTheme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type ButtonVariant =
  | 'primary' // ElevatedButton
  | 'outline' // OutlinedButton
  | 'white' // white fill on dark/emerald backgrounds (onboarding)
  | 'outlineLight' // translucent white outline (onboarding)
  | 'text'; // TextButton

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  /** Fixed height (Flutter SizedBox height); otherwise 16px vertical padding. */
  height?: number;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  height,
  style,
  labelStyle,
  testID,
}: ButtonProps) {
  const { colors, radius } = useTheme();

  const scheme = {
    primary: { bg: colors.primary, fg: colors.onPrimary, border: undefined },
    outline: { bg: 'transparent', fg: colors.primary, border: colors.primary },
    white: { bg: '#FFFFFF', fg: '#064E3B', border: undefined },
    outlineLight: { bg: 'transparent', fg: '#FFFFFF', border: 'rgba(255,255,255,0.5)' },
    text: { bg: 'transparent', fg: colors.primary, border: undefined },
  }[variant];

  const inactive = disabled || loading;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: scheme.bg,
          borderRadius: radius.lg + 2,
          borderColor: scheme.border,
          borderWidth: scheme.border ? 1.5 : 0,
          height,
          paddingVertical: height ? 0 : 16,
          paddingHorizontal: variant === 'text' ? 12 : 24,
          opacity: inactive ? 0.6 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={scheme.fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={22} color={scheme.fg} style={styles.icon} /> : null}
          <AppText variant="titleLarge" color={scheme.fg} weight="semibold" style={labelStyle}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
});
