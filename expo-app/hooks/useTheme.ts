// ============================================================================
// useTheme: resolves light/dark colours from the system setting
// (Flutter used ThemeMode.system)
// ============================================================================

import { useColorScheme } from 'react-native';
import {
  darkColors,
  fonts,
  lightColors,
  radius,
  spacing,
  typography,
  type ThemeColors,
} from '@/constants/theme';

export interface AppTheme {
  isDark: boolean;
  colors: ThemeColors;
  fonts: typeof fonts;
  radius: typeof radius;
  spacing: typeof spacing;
  typography: typeof typography;
}

export function useTheme(): AppTheme {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
    fonts,
    radius,
    spacing,
    typography,
  };
}
