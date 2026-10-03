// ============================================================================
// Appointment Booking Screen
// ============================================================================

import { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/useTheme';

const AVAILABLE_TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AppointmentBookingScreen() {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const params = useLocalSearchParams<{ id: string }>();

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const handleBook = async () => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 2000));
    setIsLoading(false);
    toast.show('Inspection booked successfully! 🎉', 'success');
    router.back();
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerTitle: 'Book Inspection' }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Property Card */}
        <View style={[styles.propertyCard, { backgroundColor: colors.primarySurface, borderRadius: radius.lg }]}>
          <View style={[styles.propertyIcon, { backgroundColor: `${colors.primary}33`, borderRadius: radius.md }]}>
            <Ionicons name="home" size={28} color={colors.primary} />
          </View>
          <View style={styles.propertyInfo}>
            <AppText size={16} weight="bold" numberOfLines={1}>3-Bedroom Luxury Duplex</AppText>
            <AppText size={13} color={colors.textSecondary} style={{ marginTop: 4 }}>Listed by Chief Adebayo</AppText>
          </View>
        </View>

        <AppText variant="headlineSmall" style={styles.sectionTitle}>Select Date</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesScroll}>
          {dates.map((d, i) => {
            const isSelected = d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth();
            return (
              <Pressable
                key={i}
                onPress={() => setSelectedDate(d)}
                style={[
                  styles.dateBox,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderRadius: radius.md,
                    borderWidth: isSelected ? 2 : 0.5,
                  }
                ]}
              >
                <AppText size={12} weight="medium" color={isSelected ? 'rgba(255,255,255,0.7)' : colors.textTertiary}>
                  {DAY_NAMES[d.getDay()]}
                </AppText>
                <AppText size={20} weight="bold" color={isSelected ? '#FFFFFF' : colors.textPrimary} style={{ marginVertical: 6 }}>
                  {d.getDate()}
                </AppText>
                <AppText size={11} color={isSelected ? 'rgba(255,255,255,0.7)' : colors.textTertiary}>
                  {MONTH_NAMES[d.getMonth()]}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>

        <AppText variant="headlineSmall" style={[styles.sectionTitle, { marginTop: 28 }]}>Select Time</AppText>
        <View style={styles.timesWrap}>
          {AVAILABLE_TIMES.map((time) => {
            const isSelected = time === selectedTime;
            return (
              <Pressable
                key={time}
                onPress={() => setSelectedTime(time)}
                style={[
                  styles.timeBox,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderRadius: radius.sm,
                    borderWidth: isSelected ? 2 : 0.5,
                  }
                ]}
              >
                <AppText size={14} weight={isSelected ? 'bold' : 'medium'} color={isSelected ? '#FFFFFF' : colors.textSecondary}>
                  {time}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <AppText variant="headlineSmall" style={[styles.sectionTitle, { marginTop: 28 }]}>Notes (Optional)</AppText>
        <TextField
          value={notes}
          onChangeText={setNotes}
          placeholder="Any special requests or questions..."
          multiline
          numberOfLines={3}
          style={styles.notesInput}
        />

        <Button
          label="Confirm Booking"
          onPress={handleBook}
          loading={isLoading}
          style={{ marginTop: 36, marginBottom: 24 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: 20 },
  propertyCard: { padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  propertyIcon: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  propertyInfo: { flex: 1, marginLeft: 14 },
  sectionTitle: { marginBottom: 16 },
  datesScroll: { paddingRight: 20, gap: 10 },
  dateBox: { width: 60, height: 90, alignItems: 'center', justifyContent: 'center' },
  timesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeBox: { paddingHorizontal: 18, paddingVertical: 12 },
  notesInput: { minHeight: 80, textAlignVertical: 'top' },
});
