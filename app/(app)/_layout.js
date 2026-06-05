/**
 * App Group Layout
 * Protected routes — only accessible when authenticated.
 */

import { Stack } from 'expo-router';
import Colors from '../../constants/colors';

const AppLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.base },
        animation: 'fade',
      }}
    />
  );
};

export default AppLayout;
