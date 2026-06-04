/**
 * Supabase Client Configuration
 * 
 * Uses expo-secure-store for persistent, encrypted session storage.
 * Auto-refreshes tokens and manages auth state changes.
 */

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// ━━━ Safe localStorage check (SSR-safe) ━━━
const canUseLocalStorage =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// ━━━ Secure Store Adapter ━━━
// Uses expo-secure-store for native and localStorage for web
const SecureStoreAdapter = {
  getItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        if (!canUseLocalStorage) return null;
        return window.localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn('[SecureStore] getItem failed:', key);
      return null;
    }
  },

  setItem: async (key, value) => {
    try {
      if (Platform.OS === 'web') {
        if (!canUseLocalStorage) return;
        window.localStorage.setItem(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn('[SecureStore] setItem failed:', key);
    }
  },

  removeItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        if (!canUseLocalStorage) return;
        window.localStorage.removeItem(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn('[SecureStore] removeItem failed:', key);
    }
  },
};

// ━━━ Environment Variables ━━━
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing environment variables. Copy .env.example to .env and fill in your values.'
  );
}

// ━━━ Client Initialization ━━━
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      storage: SecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web', // Auto-detect on web for OAuth redirect flow
    },
  }
);

export default supabase;
