// ============================================================================
// TextField: filled input (InputDecorationTheme) with optional prefix icon,
// password visibility toggle, label and error text
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { AppText } from './AppText';
import type { IconName } from './Button';
import { useTheme } from '@/hooks/useTheme';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  icon?: IconName;
  error?: string | null;
  /** Renders a show/hide eye button and toggles secureTextEntry. */
  password?: boolean;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, icon, error, password = false, multiline, style, onFocus, onBlur, ...rest },
  ref,
) {
  const { colors, radius, fonts } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const borderColor = error ? colors.error : focused ? colors.primary : 'transparent';

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText variant="labelLarge" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.field,
          {
            backgroundColor: colors.surfaceVariant,
            borderRadius: radius.lg,
            borderColor,
            alignItems: multiline ? 'flex-start' : 'center',
          },
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={focused ? colors.primary : colors.textTertiary}
            style={[styles.prefix, multiline ? styles.prefixMultiline : null]}
          />
        ) : null}

        <TextInput
          ref={ref}
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.primary}
          multiline={multiline}
          secureTextEntry={password ? hidden : rest.secureTextEntry}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              fontFamily: fonts.regular,
              minHeight: multiline ? 96 : undefined,
              textAlignVertical: multiline ? 'top' : 'center',
            },
            style,
          ]}
          {...rest}
        />

        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden((h) => !h)}
            hitSlop={8}
          >
            <Ionicons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textTertiary}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <AppText variant="bodySmall" color={colors.error} style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  label: { marginBottom: 8 },
  field: {
    flexDirection: 'row',
    borderWidth: 1.5,
    paddingHorizontal: 20,
  },
  prefix: { marginRight: 12 },
  prefixMultiline: { marginTop: 18 },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 18,
  },
  error: { marginTop: 6, marginLeft: 4 },
});
