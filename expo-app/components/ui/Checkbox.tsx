// ============================================================================
// Checkbox (Material Checkbox equivalent, 24x24, 4px radius)
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/hooks/useTheme';

export interface CheckboxProps {
  value: boolean;
  onChange: (next: boolean) => void;
  label?: string;
}

export function Checkbox({ value, onChange, label }: CheckboxProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={styles.row}
    >
      <View
        style={[
          styles.box,
          {
            backgroundColor: value ? colors.primary : 'transparent',
            borderColor: value ? colors.primary : colors.textTertiary,
          },
        ]}
      >
        {value ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
      </View>
      {label ? (
        <AppText variant="bodyMedium" style={styles.label}>
          {label}
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  box: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { marginLeft: 8 },
});
