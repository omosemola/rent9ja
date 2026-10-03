// ============================================================================
// Home tab: landlords/admins see the dashboard, everyone else the hunter home
// (ports HomeScreen's role switch)
// ============================================================================

import { HunterHome } from '@/components/home/HunterHome';
import { LandlordDashboard } from '@/components/landlord/LandlordDashboard';
import { selectIsLandlord, useAuthStore } from '@/stores/authStore';

export default function HomeScreen() {
  const isLandlord = useAuthStore(selectIsLandlord);
  return isLandlord ? <LandlordDashboard /> : <HunterHome />;
}
