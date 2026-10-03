// ============================================================================
// Forgot Password (ports forgot_password_screen.dart)
// Flutter simulated the request with a 2s delay and never linked this screen.
// Here it calls the real /auth/forgot-password endpoint through the auth store
// (the same call AuthBloc already supported).
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const forgotPassword = useAuthStore((s) => s.forgotPassword);
  const loading = useAuthStore((s) => s.status === 'loading');

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!email.trim()) return;
    const ok = await forgotPassword(email.trim());
    if (ok) setSent(true);
    else toast.show(useAuthStore.getState().error ?? 'Could not send reset link', 'error');
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="" showBack />
      <SafeAreaView edges={['bottom']} style={styles.body}>
        {sent ? (
          <View style={styles.successWrap}>
            <View style={[styles.successIcon, { backgroundColor: `${colors.success}1A` }]}>
              <Ionicons name="mail-open" size={48} color={colors.success} />
            </View>
            <AppText variant="displaySmall" align="center" style={styles.successTitle}>
              Check Your Email
            </AppText>
            <AppText variant="bodyLarge" color={colors.textSecondary} align="center" style={styles.copy}>
              {`We sent a password reset link to\n${email.trim()}`}
            </AppText>
            <View style={styles.fullWidth}>
              <Button label="Back to Sign In" height={56} onPress={() => router.replace('/login')} />
            </View>
            <Pressable accessibilityRole="button" onPress={() => setSent(false)} style={styles.retry}>
              <AppText color={colors.primary} weight="semibold">
                Didn&apos;t receive email? Try again
              </AppText>
            </Pressable>
          </View>
        ) : (
          <View>
            <View style={[styles.iconBox, { backgroundColor: colors.primarySurface }]}>
              <Ionicons name="key-outline" size={36} color={colors.primary} />
            </View>
            <AppText variant="displaySmall" style={styles.formTitle}>
              Forgot Password?
            </AppText>
            <AppText variant="bodyLarge" color={colors.textSecondary} style={styles.copy}>
              Enter the email address associated with your account and we&apos;ll send you a link to
              reset your password.
            </AppText>

            <View style={styles.field}>
              <TextField
                label="Email Address"
                placeholder="Enter your email"
                icon="mail-outline"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Button label="Send Reset Link" height={56} loading={loading} onPress={() => void submit()} />

            <Pressable
              accessibilityRole="link"
              onPress={() => router.replace('/login')}
              style={styles.back}
            >
              <AppText color={colors.primary} weight="semibold">
                Back to Sign In
              </AppText>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  formTitle: { marginBottom: 12 },
  copy: { lineHeight: 24 },
  field: { marginTop: 40, marginBottom: 28 },
  back: { alignSelf: 'center', marginTop: 24 },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  successTitle: { marginBottom: 12 },
  fullWidth: { width: '100%', marginTop: 40 },
  retry: { marginTop: 16 },
});
