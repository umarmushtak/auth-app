/**
 * Root Layout
 * 
 * App-level provider with auth state management and routing.
 * Handles auto-login redirect based on session state.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import useAuth from '../hooks/useAuth';
import Colors from '../constants/colors';
import LoadingOverlay from '../components/auth/LoadingOverlay';

const RootLayoutNav = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // ━━━ Auto-redirect based on auth state ━━━
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      // Authenticated user on auth page → redirect to home
      router.replace('/(app)/home');
    } else if (!isAuthenticated && !inAuthGroup) {
      // Unauthenticated user on protected page → redirect to auth
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingOverlay visible message="Restoring session..." />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor={Colors.base} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.base },
          animation: 'fade',
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.base,
  },
});

export default RootLayoutNav;
