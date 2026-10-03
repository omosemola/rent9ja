// ============================================================================
// Login (ports login_screen.dart)
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';

// Seed accounts from the Flutter "quick one-tap login" strip (development only).
const QUICK_LOGINS = {
  landlord: { email: 'adebayo.properties@gmail.com', password: 'Password123!' },
  tenant: { email: 'tunde.seeker@gmail.com', password: 'Password123!' },
} as const;

export default function LoginScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const login = useAuthStore((s) => s.login);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const loading = useAuthStore((s) => s.status === 'loading');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (e: string, p: string) => {
    const next: { email?: string; password?: string } = {};
    if (!e) next.email = 'Email is required';
    else if (!e.includes('@')) next.email = 'Enter a valid email';
    if (!p) next.password = 'Password is required';
    else if (p.length < 8) next.password = 'Password must be at least 8 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: string, p: string) => {
    if (!validate(e, p)) return;
    const ok = await login({ email: e, password: p });
    if (ok) router.replace('/home');
    else toast.show(useAuthStore.getState().error ?? 'Login failed', 'error');
  };

  const quickLogin = (account: { email: string; password: string }) => {
    setEmail(account.email);
    setPassword(account.password);
    void submit(account.email, account.password);
  };

  const onGoogle = async () => {
    await loginWithGoogle();
    toast.show(useAuthStore.getState().error ?? 'Google Sign-In is coming soon!', 'info');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to onboarding"
          onPress={() => router.replace('/onboarding')}
          style={[styles.back, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>

        <AppText variant="displayMedium" style={styles.title}>
          Welcome Back 👋
        </AppText>
        <AppText variant="bodyLarge" color={colors.textSecondary}>
          Sign in to your RentNaija Landlord or Tenant account
        </AppText>

        {__DEV__ ? (
          <View
            style={[
              styles.quick,
              { backgroundColor: colors.surfaceVariant, borderColor: colors.border },
            ]}
          >
            <AppText
              variant="labelSmall"
              weight="extrabold"
              color={colors.primary}
              style={styles.quickTitle}
            >
              ⚡ QUICK ONE-TAP LOGIN
            </AppText>
            <View style={styles.quickRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => quickLogin(QUICK_LOGINS.landlord)}
                style={[styles.quickBtn, { backgroundColor: '#064E3B' }]}
              >
                <Ionicons name="business" size={18} color="#FFFFFF" />
                <AppText color="#FFFFFF" weight="bold" size={13} style={styles.quickLabel}>
                  Landlord
                </AppText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => quickLogin(QUICK_LOGINS.tenant)}
                style={[
                  styles.quickBtn,
                  { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
                ]}
              >
                <Ionicons name="search" size={18} color={colors.textPrimary} />
                <AppText weight="bold" size={13} style={styles.quickLabel}>
                  Tenant
                </AppText>
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={styles.form}>
          <TextField
            label="Email Address"
            placeholder="Enter your email"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            error={errors.email}
          />
          <View style={styles.gap20} />
          <TextField
            label="Password"
            placeholder="Enter your password"
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            password
            autoCapitalize="none"
            autoComplete="password"
            error={errors.password}
            onSubmitEditing={() => void submit(email.trim(), password)}
          />

          <View style={styles.optionsRow}>
            <Checkbox value={rememberMe} onChange={setRememberMe} label="Remember me" />
            <Button
              label="Forgot Password?"
              variant="text"
              onPress={() => toast.show('Forgot Password coming soon!', 'info')}
              style={styles.forgot}
            />
          </View>

          <Button
            label="Sign In"
            height={56}
            loading={loading}
            onPress={() => void submit(email.trim(), password)}
          />

          <View style={styles.dividerRow}>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <AppText variant="bodySmall" style={styles.dividerText}>
              or continue with
            </AppText>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => void onGoogle()}
            style={({ pressed }) => [
              styles.social,
              { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="logo-google" size={20} color={colors.textPrimary} />
            <AppText variant="titleSmall" style={styles.socialLabel}>
              Continue with Google
            </AppText>
          </Pressable>

          <View style={styles.signUpRow}>
            <AppText variant="bodyMedium">Don&apos;t have an account? </AppText>
            <Pressable accessibilityRole="link" onPress={() => router.replace('/onboarding')}>
              <AppText color={colors.primary} weight="bold" size={14}>
                Sign Up
              </AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 },
  back: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: { marginBottom: 8 },
  quick: { marginTop: 20, padding: 12, borderRadius: 16, borderWidth: 1 },
  quickTitle: { letterSpacing: 0.8, marginBottom: 10 },
  quickRow: { flexDirection: 'row' },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 10,
  },
  quickLabel: { marginLeft: 6 },
  form: { marginTop: 24 },
  gap20: { height: 20 },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  forgot: { paddingVertical: 4 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  line: { flex: 1, height: StyleSheet.hairlineWidth },
  dividerText: { paddingHorizontal: 16 },
  social: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialLabel: { marginLeft: 8 },
  signUpRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
});
