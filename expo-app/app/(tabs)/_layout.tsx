// ============================================================================
// Tab shell (ports AppShell): role-aware bottom navigation
//   HUNTER   → Home / Search / Saved / Chat / Profile
//   LANDLORD → Dashboard / Listings / Add Property / Inquiries / Profile
//              ("Add Property" opens /create-property instead of switching tab)
// ============================================================================

import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { selectIsLandlord, useAuthStore } from '@/stores/authStore';

type IconName = keyof typeof Ionicons.glyphMap;

function icon(active: IconName, inactive: IconName) {
  // eslint-disable-next-line react/display-name
  return ({ color, focused }: { color: any; focused: boolean }) => (
    <Ionicons name={focused ? active : inactive} size={24} color={color} />
  );
}

export default function TabsLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts } = useTheme();
  // Unauthenticated users fall back to the HUNTER tab set, same as Flutter.
  const isLandlord = useAuthStore(selectIsLandlord);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 12 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          height: 72 + (Platform.OS === 'ios' ? 0 : insets.bottom),
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 8),
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -5 },
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: isLandlord ? 'Dashboard' : 'Home',
          tabBarIcon: isLandlord ? icon('grid', 'grid-outline') : icon('home', 'home-outline'),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: isLandlord ? 'Listings' : 'Search',
          tabBarIcon: icon('search', 'search-outline'),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Saved',
          href: isLandlord ? null : undefined,
          tabBarIcon: icon('heart', 'heart-outline'),
        }}
      />
      <Tabs.Screen
        name="add-property"
        options={{
          title: 'Add Property',
          href: isLandlord ? undefined : null,
          tabBarIcon: icon('add-circle', 'add-circle-outline'),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/create-property');
          },
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: isLandlord ? 'Inquiries' : 'Chat',
          tabBarIcon: icon('chatbubble', 'chatbubble-outline'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: icon('person', 'person-outline'),
        }}
      />
    </Tabs>
  );
}
