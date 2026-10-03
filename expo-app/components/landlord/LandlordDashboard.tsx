// ============================================================================
// LandlordDashboard (ports landlord_dashboard_screen.dart)
// Rendered as the Home tab for LANDLORD / ADMIN roles. All figures are static
// demo data in the Flutter app and are kept as-is.
//
// Flutter used a few 2-colour gradients here; they are rendered as solid
// mid-tone fills to avoid adding expo-linear-gradient.
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { useToast } from '@/components/ui/Toast';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';

type IconName = keyof typeof Ionicons.glyphMap;

const EMERALD = '#064E3B';

const ACTIVITIES: ReadonlyArray<{
  icon: IconName;
  color: string;
  title: string;
  text: string;
  time: string;
}> = [
  { icon: 'eye', color: '#3B82F6', title: 'New View', text: 'Tunde Bakare viewed your property in Lekki Phase 1', time: '2 min ago' },
  { icon: 'chatbubble', color: '#10B981', title: 'New Message', text: 'Ngozi Eze sent a message about Ajah Duplex', time: '15 min ago' },
  { icon: 'calendar', color: '#8B5CF6', title: 'Inspection Booked', text: 'Inspection booked for Saturday at 11:00 AM', time: '1 hour ago' },
  { icon: 'star', color: '#F59E0B', title: 'New Review', text: '5-star review from Bola Adeyemo', time: 'Yesterday' },
];

const TOP_PROPERTIES = [
  { title: 'Luxury 3-Bed Lekki Phase 1', price: '₦4,500,000/yr', status: 'Active', statusColor: '#10B981', views: '342', inquiries: '12' },
  { title: 'Spacious 4-Bed Duplex Ajah', price: '₦6,000,000/yr', status: 'Active', statusColor: '#10B981', views: '187', inquiries: '8' },
  { title: 'Modern Studio VI', price: '₦2,500,000/yr', status: 'Pending Review', statusColor: '#F59E0B', views: '—', inquiries: '—' },
] as const;

function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

function StatMini({ label, value, trend, icon }: { label: string; value: string; trend: string; icon: IconName }) {
  return (
    <View style={styles.statMini}>
      <Ionicons name={icon} size={24} color="#A7F3D0" />
      <AppText size={20} weight="extrabold" color="#FFFFFF" style={styles.mt8}>
        {value}
      </AppText>
      <AppText size={12} weight="medium" color="#D1FAE5" style={styles.mt2}>
        {label}
      </AppText>
      <View style={styles.trend}>
        <AppText size={10} weight="bold" color="#6EE7B7">
          {trend}
        </AppText>
      </View>
    </View>
  );
}

function DashCard({ icon, label, value, color }: { icon: IconName; label: string; value: string; color: string }) {
  const { colors } = useTheme();
  return (
    <Card style={styles.dashCard}>
      <View style={[styles.dashIcon, { backgroundColor: `${color}1A` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <AppText size={28} weight="extrabold" style={styles.dashValue}>
        {value}
      </AppText>
      <AppText size={13} weight="medium" color={colors.textSecondary} style={styles.mt4}>
        {label}
      </AppText>
    </Card>
  );
}

function ActionButton({ icon, label, color, onPress }: { icon: IconName; label: string; color: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.action, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Ionicons name={icon} size={28} color={color} />
      <AppText size={13} weight="semibold" align="center" style={styles.actionLabel}>
        {label}
      </AppText>
    </Pressable>
  );
}

function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionRow}>
      <AppText size={18} weight="bold">
        {title}
      </AppText>
      {action ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}>
          <AppText weight="bold" color={colors.primary}>
            {action}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

function StatBadge({ icon, value, label }: { icon: IconName; value: string; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.statBadge}>
      <Ionicons name={icon} size={16} color={colors.textSecondary} />
      <AppText size={13} weight="bold" style={styles.badgeValue}>
        {value}
      </AppText>
      <AppText size={12} color={colors.textTertiary} style={styles.mt0}>
        {label}
      </AppText>
    </View>
  );
}

export function LandlordDashboard() {
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const fullName = useAuthStore((s) => s.user?.fullName) ?? 'Landlord';

  const comingSoon = (feature: string) => toast.show(`${feature} coming soon!`, 'success');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* App bar */}
      <View style={[styles.appBar, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <View style={styles.appBarInner}>
          <View style={styles.appBarLeft}>
            <View style={styles.logo}>
              <Ionicons name="grid" size={22} color="#FFFFFF" />
            </View>
            <AppText variant="headlineMedium" weight="extrabold" style={styles.appBarTitle}>
              Dashboard
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => router.push('/notifications')}
            style={[styles.bell, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Welcome card */}
        <View style={styles.welcome}>
          <View style={styles.welcomeTop}>
            <View style={styles.flex1}>
              <AppText size={15} weight="medium" color="#A7F3D0">
                Welcome Back,
              </AppText>
              <AppText size={26} weight="extrabold" color="#FFFFFF" numberOfLines={1} style={styles.name}>
                {fullName}
              </AppText>
            </View>
            <View style={styles.verified}>
              <Ionicons name="checkmark-circle" size={16} color="#FBBF24" />
              <AppText size={13} weight="bold" color="#FFFFFF" style={styles.verifiedText}>
                Verified
              </AppText>
            </View>
          </View>

          <View style={styles.statsStrip}>
            <StatMini label="Total Views" value="1,247" trend="+12%" icon="eye" />
            <View style={styles.divider} />
            <StatMini label="Inquiries" value="38" trend="+5%" icon="chatbubble" />
            <View style={styles.divider} />
            <StatMini label="Conversion" value="3.1%" trend="+0.2%" icon="trending-up" />
          </View>
        </View>

        {/* Overview */}
        <View style={styles.section}>
          <AppText size={18} weight="bold" style={styles.mb16}>
            Overview
          </AppText>
          <View style={styles.row}>
            <DashCard icon="business" label="Active Listings" value="8" color="#3B82F6" />
            <View style={styles.gap16} />
            <DashCard icon="time" label="Pending" value="2" color="#F59E0B" />
          </View>
          <View style={[styles.row, styles.mt16]}>
            <DashCard icon="calendar" label="Appointments" value="5" color="#8B5CF6" />
            <View style={styles.gap16} />
            <DashCard icon="heart" label="Saved" value="42" color="#EF4444" />
          </View>
        </View>

        {/* Quick actions */}
        <View style={[styles.section, styles.mt32]}>
          <AppText size={18} weight="bold" style={styles.mb16}>
            Quick Actions
          </AppText>
          <View style={styles.row}>
            <ActionButton icon="home" label="Add Property" color="#10B981" onPress={() => router.push('/create-property')} />
            <View style={styles.gap16} />
            <ActionButton icon="bar-chart" label="Analytics" color="#3B82F6" onPress={() => comingSoon('Analytics')} />
            <View style={styles.gap16} />
            <ActionButton icon="ribbon" label="Upgrade" color="#F59E0B" onPress={() => router.push('/subscriptions')} />
          </View>
        </View>

        {/* Recent activity */}
        <View style={[styles.section, styles.mt32]}>
          <SectionTitle title="Recent Activity" action="View All" onAction={() => comingSoon('Activity History')} />
          {ACTIVITIES.map((a) => (
            <Card key={a.title} style={styles.activity}>
              <View style={[styles.activityIcon, { backgroundColor: `${a.color}1A` }]}>
                <Ionicons name={a.icon} size={20} color={a.color} />
              </View>
              <View style={styles.flex1}>
                <View style={styles.activityTop}>
                  <AppText size={14} weight="bold">
                    {a.title}
                  </AppText>
                  <AppText size={12} weight="medium" color={colors.textTertiary}>
                    {a.time}
                  </AppText>
                </View>
                <AppText size={13} color={colors.textSecondary} style={styles.activityText}>
                  {a.text}
                </AppText>
              </View>
            </Card>
          ))}
        </View>

        {/* Top performing */}
        <View style={[styles.section, styles.mt32]}>
          <SectionTitle title="Top Performing" action="Manage" onAction={() => comingSoon('Property Management')} />
          {TOP_PROPERTIES.map((p) => (
            <Card key={p.title} style={styles.propertyCard}>
              <View style={styles.propertyHeader}>
                <Ionicons name="business" size={48} color="rgba(255,255,255,0.5)" />
                <View style={styles.statusPill}>
                  <AppText size={11} weight="bold" color={p.statusColor}>
                    {p.status}
                  </AppText>
                </View>
              </View>
              <View style={styles.propertyBody}>
                <View style={styles.propertyTitleRow}>
                  <AppText size={16} weight="bold" style={styles.flex1}>
                    {p.title}
                  </AppText>
                  <AppText size={14} weight="extrabold" color={colors.primary} style={styles.price}>
                    {p.price}
                  </AppText>
                </View>
                <View style={styles.propertyStats}>
                  <StatBadge icon="eye" value={p.views} label="Views" />
                  <View style={styles.gap16} />
                  <StatBadge icon="chatbubble" value={p.inquiries} label="Inquiries" />
                  <View style={styles.flex1} />
                  <View style={[styles.edit, { backgroundColor: colors.surfaceVariant }]}>
                    <Ionicons name="pencil" size={16} color={colors.textSecondary} />
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="List Property"
        onPress={() => router.push('/create-property')}
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.9 }]}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <AppText weight="bold" color="#FFFFFF" style={styles.fabLabel}>
          List Property
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex1: { flex: 1 },
  row: { flexDirection: 'row' },
  gap16: { width: 16 },
  mt0: { marginLeft: 4 },
  mt2: { marginTop: 2 },
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
  mt32: { marginTop: 32 },
  mb16: { marginBottom: 16 },
  scroll: { paddingBottom: 100 },
  section: { paddingHorizontal: 20 },

  appBar: {},
  appBarInner: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appBarLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EMERALD,
    shadowColor: '#0A6847',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  appBarTitle: { marginLeft: 12, letterSpacing: -0.5 },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  welcome: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#043D2F',
    shadowColor: EMERALD,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  welcomeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { marginTop: 6, letterSpacing: -0.5 },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginLeft: 8,
  },
  verifiedText: { marginLeft: 6 },
  statsStrip: {
    marginTop: 30,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statMini: { alignItems: 'center' },
  trend: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(52,211,153,0.2)',
  },
  divider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },

  card: {
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#94A3B8',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  dashCard: { flex: 1, padding: 20 },
  dashIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashValue: { marginTop: 16, letterSpacing: -0.5 },

  action: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  actionLabel: { marginTop: 12 },

  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activity: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, marginBottom: 12, borderRadius: 16 },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityTop: { flexDirection: 'row', justifyContent: 'space-between' },
  activityText: { marginTop: 6, lineHeight: 18 },

  propertyCard: { marginBottom: 16, overflow: 'hidden' },
  propertyHeader: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A7B3C4',
  },
  statusPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  propertyBody: { padding: 16 },
  propertyTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { marginLeft: 8 },
  propertyStats: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  statBadge: { flexDirection: 'row', alignItems: 'center' },
  badgeValue: { marginLeft: 6 },
  edit: { padding: 8, borderRadius: 10 },

  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 52,
    borderRadius: 16,
    backgroundColor: EMERALD,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabLabel: { marginLeft: 8, letterSpacing: 0.5 },
});
