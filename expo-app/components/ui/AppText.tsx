// ============================================================================
// AppText: themed <Text> using the Flutter TextTheme variants
// ============================================================================

import { Text, type TextProps, type TextStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { fonts, type TypographyVariant } from '@/constants/theme';

type Weight = keyof typeof fonts;

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  weight?: Weight;
  size?: number;
  align?: TextStyle['textAlign'];
}

// In Flutter's TextTheme these variants default to the secondary text colour.
const SECONDARY_VARIANTS: ReadonlySet<TypographyVariant> = new Set([
  'bodySmall',
  'labelMedium',
  'labelSmall',
]);

export function AppText({
  variant = 'bodyMedium',
  color,
  weight,
  size,
  align,
  style,
  ...rest
}: AppTextProps) {
  const { colors, typography } = useTheme();
  const base = typography[variant];
  const resolvedColor =
    color ?? (SECONDARY_VARIANTS.has(variant) ? colors.textSecondary : colors.textPrimary);

  return (
    <Text
      {...rest}
      style={[
        {
          fontSize: size ?? base.fontSize,
          fontFamily: weight ? fonts[weight] : base.fontFamily,
          color: resolvedColor,
          textAlign: align,
        },
        style,
      ]}
    />
  );
}
