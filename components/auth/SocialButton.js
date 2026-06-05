/**
 * SocialButton — Google OAuth Button with Official Logo
 * Uses Image for Google's multi-color logo.
 */

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';

// Official Google "G" logo as SVG data URI (multi-color)
const GOOGLE_LOGO_URI = 'data:image/svg+xml;base64,' + btoa(`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
  <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.93 23.93 0 000 24c0 3.77.87 7.36 2.56 10.78l7.97-6.19z"/>
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
</svg>`);

const SocialButton = ({ provider = 'google', onPress, loading = false, disabled = false, testID }) => {
  const [pressed, setPressed] = useState(false);
  const isDisabled = disabled || loading;

  const webShadow = Platform.OS === 'web'
    ? { boxShadow: pressed ? '0 1px 4px rgba(0,0,0,0.15)' : '0 2px 12px rgba(0,0,0,0.2)' }
    : {};
  const webTransition = Platform.OS === 'web' ? { transition: 'all 0.2s ease' } : {};
  const webPress = Platform.OS === 'web' && pressed ? { transform: [{ scale: 0.98 }] } : {};

  return (
    <TouchableOpacity
      style={[styles.button, webShadow, webTransition, webPress, isDisabled && styles.disabled]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={isDisabled}
      activeOpacity={0.8}
      testID={testID}
      accessibilityLabel="Sign in with Google"
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator size="small" color={Colors.textPrimary} />
      ) : (
        <>
          <View style={styles.logoWrap}>
            <Image source={{ uri: GOOGLE_LOGO_URI }} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.label}>Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 13, paddingHorizontal: 20, borderRadius: 12,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(12,12,35,0.7)', gap: 12, marginVertical: 6, minHeight: 52,
  },
  logoWrap: {
    width: 24, height: 24, alignItems: 'center', justifyContent: 'center',
  },
  logo: {
    width: 22, height: 22,
  },
  label: { ...Typography.presets.buttonLabel, color: Colors.textPrimary, fontWeight: '500', fontSize: 15 },
  disabled: { opacity: 0.45 },
});

export default React.memo(SocialButton);
