// ============================================================================
// OTP Verification (ports otp_verification_screen.dart)
// Still simulated like Flutter (2s delay then /home): not routed from anywhere.
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useTheme } from '@/hooks/useTheme';

const LENGTH = 6;
const RESEND_SECONDS = 60;

export default function OtpVerificationScreen() {
  const router = useRouter();
  const { colors, fonts } = useTheme();
  const params = useLocalSearchParams<{ email?: string; type?: string }>();
  const email = params.email ?? '';
  const isEmail = (params.type ?? 'email') === 'email';

  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [timerRun, setTimerRun] = useState(0);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    setSecondsLeft(RESEND_SECONDS);
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRun]);

  const verify = (code: string) => {
    setLoading(true);
    // TODO (parity with Flutter): call the auth API to verify the OTP.
    setTimeout(() => router.replace('/home'), 2000);
    void code;
  };

  const onChange = (index: number, raw: string) => {
    const value = raw.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < LENGTH - 1) inputs.current[index + 1]?.focus();
    if (!value && index > 0) inputs.current[index - 1]?.focus();

    const code = next.join('');
    if (code.length === LENGTH) verify(code);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="" showBack />
      <SafeAreaView edges={['bottom']} style={styles.body}>
        <View style={[styles.iconBox, { backgroundColor: colors.primarySurface }]}>
          <Ionicons name={isEmail ? 'mail-outline' : 'call-outline'} size={36} color={colors.primary} />
        </View>

        <AppText variant="displaySmall" style={styles.title}>
          {`Verify Your ${isEmail ? 'Email' : 'Phone'}`}
        </AppText>
        <AppText variant="bodyLarge" color={colors.textSecondary} align="center" style={styles.copy}>
          {'We sent a 6-digit code to\n'}
          <AppText variant="bodyLarge" weight="bold" color={colors.textSecondary}>
            {email}
          </AppText>
        </AppText>

        <View style={styles.boxes}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => {
                inputs.current[index] = el;
              }}
              value={digit}
              onChangeText={(t) => onChange(index, t)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectionColor={colors.primary}
              style={[
                styles.box,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: focusedIndex === index ? colors.primary : colors.border,
                  borderWidth: focusedIndex === index ? 2 : 1,
                  color: colors.textPrimary,
                  fontFamily: fonts.bold,
                  marginRight: index < LENGTH - 1 ? 8 : 0,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.fullWidth}>
          <Button
            label="Verify Code"
            height={56}
            loading={loading}
            onPress={() => {
              const code = digits.join('');
              if (code.length === LENGTH) verify(code);
            }}
          />
        </View>

        {secondsLeft > 0 ? (
          <AppText variant="bodyMedium" color={colors.textTertiary} style={styles.resend}>
            {`Resend code in ${secondsLeft}s`}
          </AppText>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={() => setTimerRun((n) => n + 1)} // TODO: call resend OTP API
            style={styles.resend}
          >
            <AppText color={colors.primary} weight="bold" size={15}>
              Resend Code
            </AppText>
          </Pressable>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 32, alignItems: 'center' },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: { marginBottom: 12 },
  copy: { lineHeight: 24 },
  boxes: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  box: { width: 50, height: 58, borderRadius: 14, fontSize: 20 },
  fullWidth: { width: '100%', marginTop: 32 },
  resend: { marginTop: 24 },
});
