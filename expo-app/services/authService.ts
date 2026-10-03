// ============================================================================
// Auth service (ports AuthRepository)
// ============================================================================

import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types/user';
import { api } from './api';
import { storage } from './storage';

async function persistSession(data: AuthResponse): Promise<void> {
  if (data.accessToken && data.refreshToken) {
    await storage.saveTokens(data.accessToken, data.refreshToken);
    await storage.saveUserId(data.user.id);
    await storage.saveUserRole(data.user.role);
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const phone = payload.phone?.trim();
  const { data } = await api.post<AuthResponse>('/auth/register', {
    email: payload.email,
    password: payload.password,
    fullName: payload.fullName,
    role: payload.role,
    ...(phone ? { phone } : {}),
  });
  await persistSession(data);
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  await persistSession(data);
  return data;
}

/**
 * Exchanges a Google ID token for a session. Obtaining the ID token is not
 * wired up yet (see stores/authStore.ts); the endpoint call is ready for it.
 */
export async function loginWithGoogleIdToken(idToken: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/google', { idToken });
  await persistSession(data);
  return data;
}

export async function logout(): Promise<void> {
  try {
    const refreshToken = await storage.getRefreshToken();
    await api.post('/auth/logout', { refreshToken });
  } catch {
    // Clear local storage regardless of API server state.
  } finally {
    await storage.clearAll();
  }
}

export async function forgotPassword(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email });
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<void> {
  await api.post('/auth/reset-password', { email, code, newPassword });
}

export async function verifyEmail(code: string): Promise<void> {
  await api.post('/auth/verify-email', { code });
}

export const isLoggedIn = (): Promise<boolean> => storage.isLoggedIn();
export const getUserRole = (): Promise<string | null> => storage.getUserRole();

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await api.get<User>('/users/me');
    return data;
  } catch {
    return null;
  }
}
