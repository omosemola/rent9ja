// ============================================================================
// Create Property Screen
// ============================================================================

import { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/useTheme';
import { palette } from '@/constants/theme';

const STEPS = ['Basic Information', 'Location', 'Pricing', 'Photos'];
const PROP_TYPES = {
  APARTMENT: 'Apartment',
  DUPLEX: 'Duplex',
  SELF_CONTAINED: 'Self-Contained',
  MINI_FLAT: 'Mini Flat',
  BUNGALOW: 'Bungalow',
  STUDIO: 'Studio',
  SHARED_APARTMENT: 'Shared',
};
const AMENITIES = {
  Parking: 'car-outline',
  Security: 'shield-checkmark-outline',
  Generator: 'flash-outline',
  Borehole: 'water-outline',
  Internet: 'wifi-outline',
  AC: 'snow-outline',
  Pool: 'water',
  Gym: 'barbell-outline',
  Furnished: 'bed-outline',
  CCTV: 'videocam-outline',
};
const STATES = ['Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Enugu'];

export default function CreatePropertyScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const toast = useToast();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '',
    type: 'APARTMENT',
    bedrooms: 1,
    bathrooms: 1,
    description: '',
    amenities: [] as string[],
    state: STATES[0],
    city: '',
    address: '',
    rent: '',
    serviceCharge: '',
  });

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else submit();
  };
  const prevStep = () => setStep(step - 1);

  const submit = () => {
    toast.show('Property listed successfully! 🎉', 'success');
    router.back();
  };

  const toggleAmenity = (am: string) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(am) ? f.amenities.filter((a) => a !== am) : [...f.amenities, am],
    }));
  };

  return (
    <KeyboardAvoidingView style={[styles.screen, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ headerTitle: 'List Property' }} />
      
      {/* Progress */}
      <View style={[styles.progressWrap, { backgroundColor: colors.surface }]}>
        <AppText size={14} weight="bold">{STEPS[step]}</AppText>
        <AppText size={12} color={colors.textTertiary}>Step {step + 1} of 4</AppText>
        <View style={[styles.progressBar, { backgroundColor: colors.surfaceVariant, borderRadius: radius.pill }]}>
          <View style={[styles.progressFill, { width: `${((step + 1) / 4) * 100}%`, backgroundColor: colors.primary }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {step === 0 && (
          <View>
            <TextField label="Property Title" placeholder="e.g. Modern 3-Bedroom Apartment in Lekki" value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} />
            
            <AppText size={14} weight="medium" style={{ marginTop: 16, marginBottom: 8 }}>Property Type</AppText>
            <View style={styles.chipWrap}>
              {Object.entries(PROP_TYPES).map(([k, v]) => {
                const sel = form.type === k;
                return (
                  <Pressable key={k} onPress={() => setForm({ ...form, type: k })} style={[styles.chip, { backgroundColor: sel ? colors.primary : colors.surface, borderColor: sel ? colors.primary : colors.border, borderRadius: radius.pill }]}>
                    <AppText size={14} color={sel ? '#fff' : colors.textSecondary}>{v}</AppText>
                  </Pressable>
                );
              })}
            </View>

            <View style={[styles.row, { marginTop: 20, gap: 16 }]}>
              <View style={styles.flex1}>
                <AppText size={14} weight="medium" style={{ marginBottom: 8 }}>Bedrooms</AppText>
                <Counter value={form.bedrooms} onChange={(v) => setForm({ ...form, bedrooms: v })} />
              </View>
              <View style={styles.flex1}>
                <AppText size={14} weight="medium" style={{ marginBottom: 8 }}>Bathrooms</AppText>
                <Counter value={form.bathrooms} onChange={(v) => setForm({ ...form, bathrooms: v })} />
              </View>
            </View>

            <TextField label="Description" placeholder="Describe the property..." multiline numberOfLines={4} value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} style={{ marginTop: 20, minHeight: 80, textAlignVertical: 'top' }} />

            <AppText size={14} weight="medium" style={{ marginTop: 20, marginBottom: 8 }}>Amenities</AppText>
            <View style={styles.chipWrap}>
              {Object.entries(AMENITIES).map(([am, icon]) => {
                const sel = form.amenities.includes(am);
                return (
                  <Pressable key={am} onPress={() => toggleAmenity(am)} style={[styles.amenityChip, { backgroundColor: sel ? colors.primary : colors.surface, borderColor: sel ? colors.primary : colors.border, borderRadius: radius.pill }]}>
                    <Ionicons name={icon as any} size={16} color={sel ? '#fff' : colors.textTertiary} />
                    <AppText size={14} color={sel ? '#fff' : colors.textSecondary} style={{ marginLeft: 6 }}>{am}</AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {step === 1 && (
          <View>
            <AppText size={14} weight="medium" style={{ marginBottom: 8 }}>State</AppText>
            <View style={styles.chipWrap}>
              {STATES.map((s) => {
                const sel = form.state === s;
                return (
                  <Pressable key={s} onPress={() => setForm({ ...form, state: s })} style={[styles.chip, { backgroundColor: sel ? colors.primary : colors.surface, borderColor: sel ? colors.primary : colors.border, borderRadius: radius.pill }]}>
                    <AppText size={14} color={sel ? '#fff' : colors.textSecondary}>{s}</AppText>
                  </Pressable>
                );
              })}
            </View>
            <TextField label="City / LGA" placeholder="e.g. Lekki Phase 1" value={form.city} onChangeText={(v) => setForm({ ...form, city: v })} style={{ marginTop: 16 }} />
            <TextField label="Full Address" placeholder="Street address" value={form.address} onChangeText={(v) => setForm({ ...form, address: v })} icon="location-outline" style={{ marginTop: 16 }} />
            
            <View style={[styles.mapPlaceholder, { backgroundColor: colors.surfaceVariant, borderColor: colors.border, borderRadius: radius.lg, marginTop: 20 }]}>
              <Ionicons name="map-outline" size={40} color={colors.textTertiary} />
              <AppText color={colors.textTertiary} style={{ marginTop: 8 }}>Tap to pin location on map</AppText>
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <TextField label="Annual Rent (₦)" placeholder="e.g. 3,500,000" keyboardType="numeric" value={form.rent} onChangeText={(v) => setForm({ ...form, rent: v })} />
            <TextField label="Service Charge (₦)" placeholder="e.g. 1,000,000" keyboardType="numeric" value={form.serviceCharge} onChangeText={(v) => setForm({ ...form, serviceCharge: v })} style={{ marginTop: 16 }} />
            <TextField label="Agency Fee (₦)" keyboardType="numeric" style={{ marginTop: 16 }} />
            <TextField label="Legal Fee (₦)" keyboardType="numeric" style={{ marginTop: 16 }} />
            <TextField label="Caution Fee (₦)" keyboardType="numeric" style={{ marginTop: 16 }} />
          </View>
        )}

        {step === 3 && (
          <View>
            <AppText color={colors.textSecondary}>Upload property photos (min. 3, max. 20)</AppText>
            <Pressable onPress={() => toast.show('Image Picker coming soon!', 'info')} style={[styles.uploadBox, { backgroundColor: colors.surfaceVariant, borderColor: colors.primary, borderRadius: radius.lg, marginTop: 16 }]}>
              <View style={[styles.uploadIconWrap, { backgroundColor: colors.primarySurface, borderRadius: radius.md }]}>
                <Ionicons name="image-outline" size={32} color={colors.primary} />
              </View>
              <AppText weight="semibold" color={colors.primary} style={{ marginTop: 12 }}>Tap to upload photos</AppText>
              <AppText size={12} color={colors.textTertiary}>JPEG, PNG up to 10MB each</AppText>
            </Pressable>
            
            <View style={[styles.tipBox, { backgroundColor: `${palette.info}1A`, borderRadius: radius.md, marginTop: 32 }]}>
              <Ionicons name="bulb-outline" size={22} color={palette.info} />
              <AppText size={13} weight="medium" color={palette.info} style={{ flex: 1, marginLeft: 12 }}>
                Properties with 5+ quality photos get 3x more inquiries!
              </AppText>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        {step > 0 && (
          <Button label="Previous" variant="outline" onPress={prevStep} style={styles.flex1} />
        )}
        {step > 0 && <View style={{ width: 16 }} />}
        <Button label={step < 3 ? "Next" : "Publish Listing"} onPress={nextStep} style={styles.flex1} />
      </View>
    </KeyboardAvoidingView>
  );
}

function Counter({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const { colors, radius } = useTheme();
  return (
    <View style={[styles.counterWrap, { backgroundColor: colors.surfaceVariant, borderRadius: radius.md }]}>
      <Pressable onPress={() => value > 0 && onChange(value - 1)} style={styles.counterBtn}>
        <Ionicons name="remove" size={20} color={colors.textPrimary} />
      </Pressable>
      <AppText variant="headlineSmall">{value}</AppText>
      <Pressable onPress={() => onChange(value + 1)} style={styles.counterBtn}>
        <Ionicons name="add" size={20} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  progressWrap: { padding: 20, paddingBottom: 16 },
  progressBar: { height: 6, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: '100%' },
  scroll: { padding: 20, paddingBottom: 40 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1 },
  amenityChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1 },
  row: { flexDirection: 'row' },
  flex1: { flex: 1 },
  counterWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 6 },
  counterBtn: { padding: 4 },
  mapPlaceholder: { height: 200, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  uploadBox: { height: 180, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  uploadIconWrap: { width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
  tipBox: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  bottomBar: { flexDirection: 'row', padding: 20, paddingBottom: 32, borderTopWidth: 1 },
});
