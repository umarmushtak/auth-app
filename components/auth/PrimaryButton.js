/**
 * PrimaryButton — Premium Gradient Button
 * Uses standard TouchableOpacity. Works perfectly on web.
 */

import React, { useState } from 'react';
import { Text, ActivityIndicator, StyleSheet, TouchableOpacity, Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';

const PrimaryButton = ({
  title, onPress, loading = false, disabled = false,
  variant = 'primary', icon, testID, accessibilityLabel,
}) => {
  const [pressed, setPressed] = useState(false);
  const isDisabled = disabled || loading;

  const webTransition = Platform.OS === 'web' ? { transition: 'all 0.2s ease, transform 0.15s ease' } : {};
  const webTransformPress = Platform.OS === 'web' && pressed ? { transform: [{ scale: 0.97 }, { translateY: 2 }] } : {};

  if (variant === 'outline') {
    const webOutlineShadow = Platform.OS === 'web'
      ? { boxShadow: pressed ? '0 2px 8px rgba(79,142,247,0.15)' : '0 4px 16px rgba(79,142,247,0.1)' }
      : {};
    return (
      <TouchableOpacity
        style={[styles.outlineBtn, webOutlineShadow, webTransition, webTransformPress, isDisabled && styles.disabled]}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={isDisabled}
        activeOpacity={0.8}
        testID={testID}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole="button"
      >
        {loading ? <ActivityIndicator size="small" color={Colors.primary} />
          : <><View style={styles.iconWrap}>{icon}</View><Text style={styles.outlineText}>{title}</Text></>}
      </TouchableOpacity>
    );
  }

  const gradientColors = variant === 'secondary' ? Colors.gradients.secondaryButton : Colors.gradients.primaryButton;
  const webGradientShadow = Platform.OS === 'web'
    ? { boxShadow: pressed ? '0 2px 12px rgba(79,142,247,0.3)' : '0 6px 24px rgba(79,142,247,0.25), 0 2px 8px rgba(124,58,237,0.2)' }
    : {};

  return (
    <TouchableOpacity
      style={[styles.btnWrap, webGradientShadow, webTransition, webTransformPress, isDisabled && styles.disabled]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={isDisabled}
      activeOpacity={0.85}
      testID={testID}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
    >
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        {loading ? <ActivityIndicator size="small" color="#fff" />
          : <><View style={styles.iconWrap}>{icon}</View><Text style={styles.btnText}>{title}</Text></>}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnWrap: { borderRadius: 12, overflow: 'hidden', marginVertical: 6 },
  gradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 15, paddingHorizontal: 24, gap: 8, minHeight: 52,
  },
  btnText: { ...Typography.presets.buttonLabel, color: '#fff', fontWeight: '600', letterSpacing: 0.3 },
  outlineBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: 'rgba(79,142,247,0.25)',
    backgroundColor: 'rgba(12,12,35,0.6)', gap: 8, marginVertical: 6, minHeight: 52,
  },
  outlineText: { ...Typography.presets.buttonLabel, color: Colors.textPrimary, fontWeight: '500' },
  iconWrap: {},
  disabled: { opacity: 0.45 },
});

export default React.memo(PrimaryButton);
