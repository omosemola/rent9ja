// ============================================================================
// Profile Screen (ports profile_screen.dart)
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useToast } from '@/components/ui/Toast';
import { palette } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';
import { initials as getInitials } from '@/utils/format';

type IconName = ComponentProps<typeof Ionicons>['name'];

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: IconName; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: `${color}14` }]}>
      <Ionicons name={icon} size={24} color={color} />
      <AppText size={20} weight="extrabold" color={color} style={styles.statValue}>
        {value}
      </AppText>
      <AppText size={12} color={colors.textTertiary}>
        {label}
      </AppText>
    </View>
  );
}

interface MenuItemDef {
  icon: IconName;
  label: string;
  onPress: () => void;
  trailing?: ReactNode;
}

function MenuSection({ title, items }: { title: string; items: MenuItemDef[] }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <AppText variant="labelMedium" size={13} color={colors.textSecondary} style={styles.sectionTitle}>
        {title}
      </AppText>
      <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {items.map((item) => (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            onPress={item.onPress}
            style={styles.menuItem}
          >
            <Ionicons name={item.icon} size={22} color={colors.textSecondary} />
            <AppText size={15} style={styles.menuLabel}>
              {item.label}
            </AppText>
            {item.trailing ?? <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const authRole = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);

  const role = authRole ?? 'HUNTER';
  const fullName = user?.fullName || (role === 'LANDLORD' ? 'Chief Adebayo Ogundimu' : 'Tunde Bakare');
  const roleLabel =
    role === 'LANDLORD' ? 'Landlord / Property Agent' : role === 'ADMIN' ? 'Administrator' : 'House Hunter';
  const initials = getInitials(fullName) || 'U';
  const isLandlord = role === 'LANDLORD';
  const comingSoon = (feature: string) => () => toast.show(`${feature} coming soon!`, 'info');

  const handleLogout = async () => {
    await logout();
    router.replace('/onboarding');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Profile"
        showBack={false}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            hitSlop={8}
            onPress={comingSoon('Settings')}
            style={styles.action}
          >
            <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile card (gradient flattened to the primary colour) */}
        <View style={[styles.profileCard, { backgroundColor: colors.primary }]}>
          <View style={styles.avatar}>
            <AppText size={20} weight="bold" color="#FFFFFF">
              {initials}
            </AppText>
          </View>
          <View style={styles.profileInfo}>
            <AppText size={18} weight="bold" color="#FFFFFF" numberOfLines={1}>
              {fullName}
            </AppText>
            <AppText size={13} color="rgba(255,255,255,0.8)" style={styles.roleLabel}>
              {roleLabel}
            </AppText>
            <View style={styles.verified}>
              <Ionicons name="checkmark-circle" size={14} color="rgba(255,255,255,0.9)" />
              <AppText size={12} weight="semibold" color="rgba(255,255,255,0.9)" style={styles.verifiedText}>
                Verified
              </AppText>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            hitSlop={8}
            onPress={() => router.push('/edit-profile')}
            style={styles.edit}
          >
            <Ionicons name="create-outline" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <StatCard
            label={isLandlord ? 'Listings' : 'Saved'}
            value={isLandlord ? '8' : '12'}
            icon={isLandlord ? 'business' : 'heart'}
            color={isLandlord ? palette.primary : palette.error}
          />
          <View style={styles.statGap} />
          <StatCard label="Viewed" value="48" icon="eye" color={palette.info} />
          <View style={styles.statGap} />
          <StatCard label="Chats" value="6" icon="chatbubble" color={palette.primary} />
        </View>

        {role === 'LANDLORD' || role === 'ADMIN' ? (
          <MenuSection
            title="Landlord & Agent Tools"
            items={[
              { icon: 'add-circle-outline', label: 'Post New Property', onPress: () => router.push('/create-property') },
              { icon: 'star-outline', label: 'Subscription Plans', onPress: () => router.push('/subscriptions') },
            ]}
          />
        ) : null}

        <MenuSection
          title="Account"
          items={[
            { icon: 'person-outline', label: 'Edit Profile', onPress: () => router.push('/edit-profile') },
            { icon: 'lock-closed-outline', label: 'Change Password', onPress: comingSoon('Change Password') },
            { icon: 'notifications-outline', label: 'Notifications', onPress: () => router.push('/notifications') },
            { icon: 'shield-outline', label: 'Verification', onPress: comingSoon('Verification') },
          ]}
        />

        <MenuSection
          title="Preferences"
          items={[
            {
              icon: 'moon-outline',
              label: 'Dark Mode',
              onPress: comingSoon('Dark Mode'),
              trailing: (
                <Switch
                  value={false}
                  onValueChange={comingSoon('Dark Mode')}
                  trackColor={{ true: colors.primary, false: colors.border }}
                />
              ),
            },
            {
              icon: 'language-outline',
              label: 'Language',
              onPress: comingSoon('Language'),
              trailing: (
                <AppText color={colors.textTertiary}>English</AppText>
              ),
            },
            { icon: 'location-outline', label: 'Preferred Locations', onPress: comingSoon('Preferred Locations') },
          ]}
        />

        <MenuSection
          title="Support"
          items={[
            { icon: 'help-circle-outline', label: 'Help Center', onPress: comingSoon('Help Center') },
            { icon: 'shield-checkmark-outline', label: 'Privacy Policy', onPress: comingSoon('Privacy Policy') },
            { icon: 'document-text-outline', label: 'Terms of Service', onPress: comingSoon('Terms of Service') },
            { icon: 'information-circle-outline', label: 'About RentNaija', onPress: comingSoon('About RentNaija') },
          ]}
        />

        <Pressable
          accessibilityRole="button"
          onPress={handleLogout}
          style={[styles.logout, { borderColor: colors.error }]}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <AppText weight="semibold" color={colors.error} style={styles.logoutText}>
            Sign Out
          </AppText>
        </Pressable>

        <AppText variant="bodySmall" color={colors.textSecondary} align="center" style={styles.version}>
          Version 1.0.0
        </AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  action: { padding: 8, marginRight: 8 },
  content: { padding: 20, paddingBottom: 48 },

  profileCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20 },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: { flex: 1, marginLeft: 16 },
  roleLabel: { marginTop: 4 },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  verifiedText: { marginLeft: 4 },
  edit: { padding: 8 },

  stats: { flexDirection: 'row', marginTop: 24, marginBottom: 24 },
  statGap: { width: 12 },
  stat: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 14 },
  statValue: { marginTop: 8 },

  section: { marginBottom: 16 },
  sectionTitle: { marginBottom: 10 },
  menuCard: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  menuLabel: { flex: 1, marginLeft: 16 },

  logout: {
    marginTop: 8,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: { marginLeft: 8 },
  version: { marginTop: 16 },
});
