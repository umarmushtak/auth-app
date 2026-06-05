/**
 * LoadingOverlay — Premium Fullscreen Loader
 */

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';

const LoadingOverlay = ({ visible = false, message = 'Loading...' }) => {
  if (!visible) return null;

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={styles.overlay}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6,6,20,0.88)',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
  },
  card: {
    backgroundColor: 'rgba(15,15,42,0.95)', borderRadius: 20,
    padding: 36, alignItems: 'center', gap: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 8px 40px rgba(79,142,247,0.15), 0 0 80px rgba(124,58,237,0.1)',
      backdropFilter: 'blur(20px)',
    } : {}),
  },
  message: { ...Typography.presets.bodyMedium, color: Colors.textSecondary },
});

export default React.memo(LoadingOverlay);
