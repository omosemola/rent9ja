// ============================================================================
// Onboarding (ports onboarding_screen.dart): solid emerald, hero photo, role CTAs
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Button, type IconName } from '@/components/ui/Button';

const EMERALD = '#064E3B';

function FeatureBadge({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.badge}>
      <Ionicons name={icon} size={16} color="#FFFFFF" />
      <AppText variant="labelLarge" color="#FFFFFF" size={13} style={styles.badgeLabel}>
        {label}
      </AppText>
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  return (
    <SafeAreaView style={styles.screen}>
      {/* Hero image */}
      <View style={styles.hero}>
        <Image
          source={require('../assets/images/onboarding_house.jpg')}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <View style={[StyleSheet.absoluteFill, styles.overlay]} />
        <View style={styles.brand}>
          <Ionicons name="home" size={20} color="#FFFFFF" />
          <AppText variant="titleMedium" color="#FFFFFF" weight="bold" style={styles.brandText}>
            RentNaija
          </AppText>
        </View>
      </View>

      {/* Content & actions */}
      <View style={styles.content}>
        <Animated.View style={[styles.header, { opacity: progress, transform: [{ translateY }] }]}>
          <AppText
            variant="headlineMedium"
            color="#FFFFFF"
            weight="extrabold"
            size={26}
            align="center"
            style={styles.title}
          >
            Discover Luxury Rentals
          </AppText>
          <AppText
            variant="bodyLarge"
            color="rgba(255,255,255,0.8)"
            size={15}
            align="center"
            style={styles.subtitle}
          >
            Verified apartments, duplexes, and homes across Nigeria.
          </AppText>
        </Animated.View>

        <Animated.View style={[styles.badges, { opacity: progress }]}>
          <FeatureBadge icon="shield-checkmark" label="Verified" />
          <FeatureBadge icon="chatbubble" label="Direct Chat" />
          <FeatureBadge icon="shield" label="Secure Pay" />
        </Animated.View>

        <Animated.View style={[styles.actions, { opacity: progress }]}>
          <Button
            label="I'm Looking for a Home"
            variant="white"
            icon="search"
            height={56}
            onPress={() => router.replace({ pathname: '/register', params: { role: 'HUNTER' } })}
          />
          <Button
            label="I'm a Landlord"
            variant="outlineLight"
            icon="business"
            height={56}
            style={styles.landlordBtn}
            onPress={() => router.replace({ pathname: '/register', params: { role: 'LANDLORD' } })}
          />
          <View style={styles.loginRow}>
            <AppText color="rgba(255,255,255,0.7)" size={14}>
              Already have an account?{' '}
            </AppText>
            <Pressable accessibilityRole="link" onPress={() => router.replace('/login')}>
              <AppText color="#FFFFFF" weight="bold" size={14} style={styles.underline}>
                Sign In
              </AppText>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: EMERALD },
  hero: {
    flex: 5,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 10,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  overlay: { backgroundColor: 'rgba(0,0,0,0.25)' },
  brand: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: EMERALD,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  brandText: { marginLeft: 8, letterSpacing: 0.5 },
  content: {
    flex: 5,
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  header: { alignItems: 'center' },
  title: { letterSpacing: -0.5 },
  subtitle: { marginTop: 8, lineHeight: 21 },
  badges: { flexDirection: 'row', justifyContent: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  badgeLabel: { marginLeft: 6 },
  actions: { width: '100%' },
  landlordBtn: { marginTop: 12 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  underline: { textDecorationLine: 'underline' },
});
