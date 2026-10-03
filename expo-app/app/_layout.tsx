// ============================================================================
// Root layout: fonts, splash, providers, startup data loading, root Stack
// (ports RentNaijaApp + MultiBlocProvider + setupDependencies)
// ============================================================================

import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/outfit';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';
import { loadHomeData } from '@/stores/propertiesStore';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });
  const { colors, isDark } = useTheme();
  const checkStatus = useAuthStore((s) => s.checkStatus);

  // AuthCheckStatus + LoadFeatured/LoadNewest, dispatched once at startup.
  useEffect(() => {
    void checkStatus();
    void loadHomeData();
  }, [checkStatus]);

  useEffect(() => {
    if (fontsLoaded) void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" options={{ animation: 'none' }} />
          <Stack.Screen name="create-property" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        </Stack>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
