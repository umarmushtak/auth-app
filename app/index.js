/**
 * App Entry — Index Route
 * Redirects to appropriate screen based on auth state.
 */

import { Redirect } from 'expo-router';
import useAuth from '../hooks/useAuth';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Redirect href="/(app)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
};

export default Index;
