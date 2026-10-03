/// <reference types="expo/types" />

// Typed access to EXPO_PUBLIC_* variables used in services/api.ts.
declare namespace NodeJS {
  interface ProcessEnv {
    /** Full API base URL, e.g. https://api.rentnaija.com/api/v1 */
    EXPO_PUBLIC_API_URL?: string;
  }
}
