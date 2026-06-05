/**
 * Auth Group Layout
 * Wraps authentication screens with shared config.
 */

import { Stack } from 'expo-router';
import Colors from '../../constants/colors';

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.base },
        animation: 'slide_from_right',
      }}
    />
  );
};

export default AuthLayout;
