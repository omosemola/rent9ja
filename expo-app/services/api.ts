// ============================================================================
// API client (ports ApiClient / Dio configuration)
//  - base URL, 15s timeouts, JSON headers
//  - Authorization header from secure storage
//  - on 401: refresh the token once (single-flight) and retry the request
// ============================================================================

import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { storage } from './storage';

const API_PORT = 3001;
const API_PREFIX = '/api/v1';

/**
 * Flutter hardcoded 10.0.2.2 (Android emulator only). In Expo Go on a physical
 * device the backend lives on the dev machine's LAN IP, which is the same host
 * Metro is served from, so derive it from `hostUri`. Override with
 * EXPO_PUBLIC_API_URL (e.g. https://api.rentnaija.com/api/v1).
 */
export function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, '');

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];
  if (host) return `http://${host}:${API_PORT}${API_PREFIX}`;

  if (Platform.OS === 'android') return `http://10.0.2.2:${API_PORT}${API_PREFIX}`;
  return `http://localhost:${API_PORT}${API_PREFIX}`;
}

export const BASE_URL = resolveBaseUrl();

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let onUnauthorized: (() => void) | null = null;

/** The auth store registers this so a failed refresh logs the user out in the UI. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

const AUTH_PATHS_WITHOUT_REFRESH = ['/auth/login', '/auth/register', '/auth/google', '/auth/refresh'];

let refreshInFlight: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await storage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  // Plain axios (not `api`) so this request skips our own interceptors.
  const response = await axios.post<{ accessToken: string; refreshToken: string }>(
    `${BASE_URL}/auth/refresh`,
    { refreshToken },
    { timeout: 15000 },
  );
  const { accessToken, refreshToken: newRefresh } = response.data;
  await storage.saveTokens(accessToken, newRefresh);
  return accessToken;
}

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await storage.getAccessToken();
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (__DEV__) console.log(`[api] ${response.config.method?.toUpperCase()} ${response.config.url} → ${response.status}`);
    return response;
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      console.log(
        `[api] ${error.config?.method?.toUpperCase()} ${error.config?.url} → ${error.response?.status ?? 'no response'}`,
      );
    }

    const original = error.config as RetriableConfig | undefined;
    const url = original?.url ?? '';
    const skip = AUTH_PATHS_WITHOUT_REFRESH.some((p) => url.includes(p));

    if (error.response?.status === 401 && original && !original._retry && !skip) {
      original._retry = true;
      try {
        // Parallel 401s share one refresh call.
        refreshInFlight ??= refreshAccessToken().finally(() => {
          refreshInFlight = null;
        });
        const newToken = await refreshInFlight;
        original.headers.set('Authorization', `Bearer ${newToken}`);
        return api.request(original);
      } catch {
        await storage.clearAll();
        onUnauthorized?.();
      }
    }
    return Promise.reject(error);
  },
);
