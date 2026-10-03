// ============================================================================
// Secure storage (ports SecureStorageService)
// expo-secure-store has no web implementation, so on web we fall back to
// localStorage purely so `expo start --web` stays usable during development.
// ============================================================================

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEYS = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  userId: 'user_id',
  userRole: 'user_role',
} as const;

async function read(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function write(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function remove(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export const storage = {
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await write(KEYS.accessToken, accessToken);
    await write(KEYS.refreshToken, refreshToken);
  },
  getAccessToken: () => read(KEYS.accessToken),
  getRefreshToken: () => read(KEYS.refreshToken),

  saveUserId: (userId: string) => write(KEYS.userId, userId),
  getUserId: () => read(KEYS.userId),

  saveUserRole: (role: string) => write(KEYS.userRole, role),
  getUserRole: () => read(KEYS.userRole),

  async clearAll(): Promise<void> {
    await Promise.all(Object.values(KEYS).map(remove));
  },

  async isLoggedIn(): Promise<boolean> {
    const token = await read(KEYS.accessToken);
    return token != null && token.length > 0;
  },
};
