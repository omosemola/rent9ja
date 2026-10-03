// ============================================================================
// RentNaija design tokens (ported from lib/core/theme/app_theme.dart)
// ============================================================================

export const palette = {
  // Primary: deep emerald green
  primary: '#0A6847',
  primaryLight: '#16A34A',
  primaryDark: '#064E3B',
  primarySurface: '#ECFDF5',

  // Accent: warm gold
  accent: '#D4A017',
  accentLight: '#FBBF24',
  accentDark: '#B8860B',

  white: '#FFFFFF',
  black: '#000000',

  success: '#16A34A',
  error: '#DC2626',
  warning: '#F59E0B',
  info: '#2563EB',

  /** Flutter's heroGradient: a flat 80% black overlay. */
  heroOverlay: 'rgba(0,0,0,0.8)',
} as const;

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primarySurface: string;
  accent: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  onPrimary: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  white: string;
  shadow: string;
}

export const lightColors: ThemeColors = {
  primary: palette.primary,
  primaryDark: palette.primaryDark,
  primarySurface: palette.primarySurface,
  accent: palette.accent,
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  onPrimary: palette.white,
  success: palette.success,
  error: palette.error,
  warning: palette.warning,
  info: palette.info,
  white: palette.white,
  shadow: '#000000',
};

export const darkColors: ThemeColors = {
  primary: palette.primaryLight,
  primaryDark: palette.primary,
  primarySurface: '#0F2F25',
  accent: palette.accentLight,
  background: '#0F172A',
  surface: '#1E293B',
  surfaceVariant: '#334155',
  border: '#334155',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  onPrimary: palette.white,
  success: palette.success,
  error: palette.error,
  warning: palette.warning,
  info: palette.info,
  white: palette.white,
  shadow: '#000000',
};

/** Font family names registered by @expo-google-fonts/outfit in app/_layout.tsx. */
export const fonts = {
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semibold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
  extrabold: 'Outfit_800ExtraBold',
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 24,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/** Mirrors Flutter's TextTheme (sizes and weights; colours are applied by <Text>). */
export const typography = {
  displayLarge: { fontSize: 32, fontFamily: fonts.bold },
  displayMedium: { fontSize: 28, fontFamily: fonts.bold },
  displaySmall: { fontSize: 24, fontFamily: fonts.semibold },
  headlineLarge: { fontSize: 22, fontFamily: fonts.semibold },
  headlineMedium: { fontSize: 20, fontFamily: fonts.semibold },
  headlineSmall: { fontSize: 18, fontFamily: fonts.semibold },
  titleLarge: { fontSize: 16, fontFamily: fonts.semibold },
  titleMedium: { fontSize: 15, fontFamily: fonts.medium },
  titleSmall: { fontSize: 14, fontFamily: fonts.medium },
  bodyLarge: { fontSize: 16, fontFamily: fonts.regular },
  bodyMedium: { fontSize: 14, fontFamily: fonts.regular },
  bodySmall: { fontSize: 12, fontFamily: fonts.regular },
  labelLarge: { fontSize: 14, fontFamily: fonts.semibold },
  labelMedium: { fontSize: 12, fontFamily: fonts.medium },
  labelSmall: { fontSize: 11, fontFamily: fonts.medium },
} as const;

export type TypographyVariant = keyof typeof typography;
