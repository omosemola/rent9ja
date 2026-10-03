// ============================================================================
// Register (ports register_screen.dart)
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';
import type { Role } from '@/types/user';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors, fonts } = useTheme();
  const params = useLocalSearchParams<{ role?: string }>();
  const role: Role = params.role === 'LANDLORD' ? 'LANDLORD' : 'HUNTER';
  const isLandlord = role === 'LANDLORD';

  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.status === 'loading');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const roleColor = isLandlord ? colors.accent : colors.primary;

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (name.length < 2) next.name = 'Name is required';
    if (!email) next.email = 'Email is required';
    else if (!email.includes('@')) next.email = 'Enter a valid email';
    if (password.length < 8) next.password = 'Password must be at least 8 characters';
    if (confirm !== password) next.confirm = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    if (!acceptTerms) {
      toast.show('Please accept the terms and conditions', 'info');
      return;
    }
    const ok = await register({
      email: email.trim(),
      password,
      fullName: name.trim(),
      role,
      phone: phone.trim() || undefined,
    });
    if (ok) router.replace('/home');
    else toast.show(useAuthStore.getState().error ?? 'Registration failed', 'error');
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

        <View
          style={[
            styles.roleBadge,
            { backgroundColor: isLandlord ? `${colors.accent}1A` : colors.primarySurface },
          ]}
        >
          <Ionicons name={isLandlord ? 'business' : 'search'} size={18} color={roleColor} />
          <AppText color={roleColor} weight="semibold" size={13} style={styles.roleLabel}>
            {isLandlord ? 'Landlord Account' : 'House Hunter Account'}
          </AppText>
        </View>

        <AppText variant="displayMedium" style={styles.title}>
          Create Account
        </AppText>
        <AppText variant="bodyLarge" color={colors.textSecondary}>
          {isLandlord
            ? 'Start listing your properties to thousands of tenants'
            : 'Join thousands of Nigerians finding their dream home'}
        </AppText>

        <View style={styles.form}>
          <TextField
            label="Full Name"
            placeholder="Enter your full name"
            icon="person-outline"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            error={errors.name}
          />
          <View style={styles.gap} />
          <TextField
            label="Email Address"
            placeholder="Enter your email"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
          />
          <View style={styles.gap} />
          <TextField
            label="Phone Number"
            placeholder="+234 ..."
            icon="call-outline"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <View style={styles.gap} />
          <TextField
            label="Password"
            placeholder="Min. 8 characters"
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            password
            autoCapitalize="none"
            error={errors.password}
          />
          <View style={styles.gap} />
          <TextField
            label="Confirm Password"
            placeholder="Re-enter your password"
            icon="lock-closed-outline"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            autoCapitalize="none"
            error={errors.confirm}
          />

          <View style={styles.terms}>
            <Checkbox value={acceptTerms} onChange={setAcceptTerms} />
            <Text style={[styles.termsText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
              I agree to the{' '}
              <Text style={{ color: colors.primary, fontFamily: fonts.semibold }}>Terms of Service</Text>
              {' and '}
              <Text style={{ color: colors.primary, fontFamily: fonts.semibold }}>Privacy Policy</Text>
            </Text>
          </View>

          <Button label="Create Account" height={56} loading={loading} onPress={() => void submit()} />

          <View style={styles.signInRow}>
            <AppText variant="bodyMedium">Already have an account? </AppText>
            <Pressable accessibilityRole="link" onPress={() => router.replace('/login')}>
              <AppText color={colors.primary} weight="bold">
                Sign In
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
    marginBottom: 24,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 16,
  },
  roleLabel: { marginLeft: 8 },
  title: { marginBottom: 8 },
  form: { marginTop: 32 },
  gap: { height: 16 },
  terms: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 20, marginBottom: 28 },
  termsText: { flex: 1, marginLeft: 10, fontSize: 12 },
  signInRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});
