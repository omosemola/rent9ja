// ============================================================================
// Edit Profile Screen
// ============================================================================

import { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/useTheme';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, radius } = useTheme();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: 'Tunde Bakare',
    email: 'tunde.seeker@gmail.com',
    phone: '+234 806 789 0123',
    occupation: 'Software Engineer',
    bio: 'Looking for a cozy apartment in Lagos or Abuja.',
    minBudget: '500000',
    maxBudget: '2000000',
  });

  const [selectedLocations, setSelectedLocations] = useState<string[]>(['Lagos', 'Abuja FCT']);

  const locations = ['Lagos', 'Abuja FCT', 'Rivers', 'Oyo', 'Enugu'];

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setIsLoading(false);
    toast.show('Profile updated successfully!', 'success');
    router.back();
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: 'Edit Profile',
          headerRight: () =>
            isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 16 }} />
            ) : (
              <Pressable onPress={handleSave} style={{ padding: 8 }}>
                <AppText color={colors.primary} weight="bold">
                  Save
                </AppText>
              </Pressable>
            ),
        }}
      />

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 40) }]}>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={[styles.avatar, { backgroundColor: colors.primarySurface }]}>
            <AppText size={28} weight="bold" color={colors.primary}>
              TB
            </AppText>
          </View>
          <View style={[styles.cameraBtn, { backgroundColor: colors.primary, borderColor: colors.background }]}>
            <Ionicons name="camera" size={18} color="#FFFFFF" />
          </View>
        </View>

        <AppText variant="headlineSmall" style={styles.sectionTitle}>
          Personal Information
        </AppText>

        <TextField
          label="Full Name"
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
          icon="person-outline"
        />
        <View style={styles.spacer} />

        <TextField
          label="Email Address"
          value={form.email}
          onChangeText={(v) => setForm({ ...form, email: v })}
          icon="mail-outline"
          keyboardType="email-address"
        />
        <View style={styles.spacer} />

        <TextField
          label="Phone Number"
          value={form.phone}
          onChangeText={(v) => setForm({ ...form, phone: v })}
          icon="call-outline"
          keyboardType="phone-pad"
        />
        <View style={styles.spacer} />

        <TextField
          label="Occupation"
          value={form.occupation}
          onChangeText={(v) => setForm({ ...form, occupation: v })}
          icon="briefcase-outline"
        />
        <View style={styles.spacer} />

        <TextField
          label="Bio"
          value={form.bio}
          onChangeText={(v) => setForm({ ...form, bio: v })}
          multiline
          numberOfLines={3}
          style={styles.bioArea}
        />

        <View style={styles.largeSpacer} />
        <AppText variant="headlineSmall" style={styles.sectionTitle}>
          Search Preferences
        </AppText>

        <AppText size={14} weight="medium" style={styles.subTitle}>
          Monthly Budget
        </AppText>
        <View style={styles.budgetRow}>
          <View style={styles.flex1}>
            <TextField
              label="Min (₦)"
              value={form.minBudget}
              onChangeText={(v) => setForm({ ...form, minBudget: v })}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.budgetGap} />
          <View style={styles.flex1}>
            <TextField
              label="Max (₦)"
              value={form.maxBudget}
              onChangeText={(v) => setForm({ ...form, maxBudget: v })}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View style={styles.spacer} />
        <AppText size={14} weight="medium" style={styles.subTitle}>
          Preferred Locations
        </AppText>

        <View style={styles.chipRow}>
          {locations.map((loc) => {
            const selected = selectedLocations.includes(loc);
            return (
              <Pressable
                key={loc}
                onPress={() => toggleLocation(loc)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected ? colors.primary : 'transparent',
                    borderColor: selected ? colors.primary : colors.border,
                    borderRadius: radius.pill,
                  },
                ]}
              >
                <AppText size={14} color={selected ? '#FFFFFF' : colors.textSecondary}>
                  {loc}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: 20 },
  avatarWrap: { alignSelf: 'center', position: 'relative', marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  cameraBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { marginBottom: 16 },
  subTitle: { marginBottom: 8 },
  spacer: { height: 16 },
  largeSpacer: { height: 28 },
  bioArea: { minHeight: 80, textAlignVertical: 'top' },
  budgetRow: { flexDirection: 'row' },
  flex1: { flex: 1 },
  budgetGap: { width: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1 },
});
