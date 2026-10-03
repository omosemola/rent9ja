// ============================================================================
// Auth store (replaces AuthBloc)
//
//   AuthInitial               → status 'idle'
//   AuthLoading               → status 'loading'
//   AuthAuthenticated         → status 'authenticated' (+ user, role)
//   AuthUnauthenticated       → status 'unauthenticated'
//   AuthError                 → status 'unauthenticated' + error message
//   AuthForgotPasswordSuccess → forgotPasswordSent = true
// ============================================================================

import { create } from 'zustand';
import * as authService from '@/services/authService';
import { setUnauthorizedHandler } from '@/services/api';
import type { LoginPayload, RegisterPayload, Role, User } from '@/types/user';
import { parseError } from '@/utils/parseError';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  user: User | null;
  role: Role | null;
  error: string | null;
  forgotPasswordSent: boolean;

  /** AuthCheckStatus: restore a session from secure storage on app start. */
  checkStatus: () => Promise<void>;
  /** Resolves true on success so screens can navigate without effect plumbing. */
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // A failed token refresh (see services/api.ts) signs the user out in the UI.
  setUnauthorizedHandler(() => set({ status: 'unauthenticated', user: null, role: null }));

  const authenticate = (user: User) =>
    set({ status: 'authenticated', user, role: user.role, error: null });

  return {
    status: 'idle',
    user: null,
    role: null,
    error: null,
    forgotPasswordSent: false,

    checkStatus: async () => {
      if (await authService.isLoggedIn()) {
        const user = await authService.getCurrentUser();
        if (user) {
          authenticate({ ...user, role: user.role ?? 'HUNTER' });
          return;
        }
      }
      set({ status: 'unauthenticated', user: null, role: null });
    },

    login: async (payload) => {
      set({ status: 'loading', error: null });
      try {
        const data = await authService.login(payload);
        authenticate(data.user);
        return true;
      } catch (e) {
        set({ status: 'unauthenticated', error: parseError(e) });
        return false;
      }
    },

    register: async (payload) => {
      set({ status: 'loading', error: null });
      try {
        const data = await authService.register(payload);
        authenticate(data.user);
        return true;
      } catch (e) {
        set({ status: 'unauthenticated', error: parseError(e) });
        return false;
      }
    },

    // The Flutter implementation used a placeholder Google client ID and never
    // worked. Until real Google OAuth credentials exist, surface a clear message.
    loginWithGoogle: async () => {
      set({ status: 'unauthenticated', error: 'Google Sign-In is coming soon!' });
      return false;
    },

    logout: async () => {
      await authService.logout();
      set({ status: 'unauthenticated', user: null, role: null, error: null });
    },

    forgotPassword: async (email) => {
      set({ status: 'loading', error: null, forgotPasswordSent: false });
      try {
        await authService.forgotPassword(email);
        set({ status: 'unauthenticated', forgotPasswordSent: true });
        return true;
      } catch (e) {
        set({ status: 'unauthenticated', error: parseError(e) });
        return false;
      }
    },

    clearError: () => set({ error: null }),
  };
});

/** Landlords and admins get the landlord tab set (see app/(tabs)/_layout.tsx). */
export const selectIsLandlord = (s: Pick<AuthState, 'role'>): boolean =>
  s.role === 'LANDLORD' || s.role === 'ADMIN';
