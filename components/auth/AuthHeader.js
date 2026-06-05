/**
 * AuthHeader — Premium Animated Header
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';

const AuthHeader = ({ title, subtitle, onBack, showBack = false }) => {
  return (
    <View style={styles.container}>
      {showBack && (
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.iconWrap}>
        <View style={styles.iconRing}>
          <View style={styles.iconInner}>
            <Text style={styles.iconGlyph}>⬡</Text>
          </View>
        </View>
      </Animated.View>
      <Animated.Text entering={FadeInDown.delay(200).duration(500)} style={styles.title}>
        {title}
      </Animated.Text>
      {subtitle && (
        <Animated.Text entering={FadeInDown.delay(300).duration(500)} style={styles.subtitle}>
          {subtitle}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 28, alignItems: 'center' },
  backBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 20, paddingVertical: 4 },
  backArrow: { fontSize: 28, color: Colors.primary, marginRight: 4, marginTop: -2 },
  backText: { ...Typography.presets.bodyMedium, color: Colors.primary },
  iconWrap: { marginBottom: 16 },
  iconRing: {
    width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.primaryMuted,
    ...Platform.select({ web: { boxShadow: '0 0 30px rgba(79,142,247,0.3), 0 0 60px rgba(124,58,237,0.15)' }, default: {} }),
  },
  iconInner: {
    width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(79,142,247,0.1)',
  },
  iconGlyph: { fontSize: 26, color: Colors.primary },
  title: { ...Typography.presets.heroTitle, color: Colors.textPrimary, textAlign: 'center', fontSize: 28, fontWeight: '700' },
  subtitle: { ...Typography.presets.body, color: Colors.textTertiary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});

export default React.memo(AuthHeader);
