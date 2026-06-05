/**
 * PasswordInput — Premium Password Field
 * Show/hide toggle + strength meter. Fully functional on web.
 * Handles browser autofill styling properly.
 */

import React, { useState, useCallback } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';

// ━━━ Inject global CSS to override browser autofill for password fields ━━━
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'password-input-autofill-fix';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      input[type="password"]:-webkit-autofill,
      input[type="password"]:-webkit-autofill:hover,
      input[type="password"]:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 60px rgba(12,12,35,0.95) inset !important;
        box-shadow: 0 0 0 60px rgba(12,12,35,0.95) inset !important;
        -webkit-text-fill-color: #ffffff !important;
        caret-color: #4f8ef7 !important;
        transition: background-color 5000s ease-in-out 0s !important;
      }
    `;
    document.head.appendChild(style);
  }
}

const PasswordInput = ({
  label = 'Password', value, onChangeText, placeholder = 'Enter your password',
  error, showStrength = false, strengthData = null, editable = true,
  testID, accessibilityLabel, onFocus: onFocusProp, onBlur: onBlurProp, ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => { setIsFocused(true); onFocusProp?.(); }, [onFocusProp]);
  const handleBlur = useCallback(() => { setIsFocused(false); onBlurProp?.(); }, [onBlurProp]);

  const borderColor = error ? Colors.borderError : isFocused ? Colors.borderFocused : Colors.border;
  const webShadow = Platform.OS === 'web'
    ? { boxShadow: isFocused ? '0 0 20px rgba(79,142,247,0.2), 0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.2)' }
    : {};
  const webTransition = Platform.OS === 'web' ? { transition: 'all 0.25s ease' } : {};

  const getStrengthColor = (s) => s <= 0.25 ? Colors.error : s <= 0.5 ? Colors.warning : s <= 0.75 ? Colors.cyan : Colors.success;
  const getStrengthLabel = (s) => s <= 0.25 ? 'Weak' : s <= 0.5 ? 'Fair' : s <= 0.75 ? 'Good' : 'Strong';

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.container, { borderColor }, isFocused && styles.containerFocused, webShadow, webTransition]}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={Colors.textTertiary}
            secureTextEntry={!isVisible}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={128}
            editable={editable}
            onFocus={handleFocus}
            onBlur={handleBlur}
            selectionColor={Colors.primary}
            testID={testID}
            accessibilityLabel={accessibilityLabel || label}
            {...rest}
          />
          <TouchableOpacity style={styles.toggleBtn} onPress={() => setIsVisible(v => !v)} activeOpacity={0.6}>
            <Text style={styles.toggleText}>{isVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && !showStrength && (
        <Animated.Text entering={FadeIn.duration(250)} style={styles.errorText}>{error}</Animated.Text>
      )}

      {showStrength && value?.length > 0 && strengthData && (
        <Animated.View entering={FadeInDown.duration(300)} style={styles.strengthWrap}>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, {
              width: `${strengthData.strength * 100}%`,
              backgroundColor: getStrengthColor(strengthData.strength),
              ...(Platform.OS === 'web' ? { transition: 'width 0.3s ease, background-color 0.3s ease' } : {}),
            }]} />
          </View>
          <Text style={[styles.strengthLabel, { color: getStrengthColor(strengthData.strength) }]}>
            {getStrengthLabel(strengthData.strength)}
          </Text>
          <View style={styles.rulesWrap}>
            {strengthData.rules?.map(r => (
              <View key={r.id} style={styles.ruleRow}>
                <View style={[styles.ruleDot, r.passed && styles.ruleDotPass]} />
                <Text style={[styles.ruleText, r.passed && styles.ruleTextPass]}>{r.message}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { ...Typography.presets.inputLabel, color: Colors.textSecondary, marginBottom: 8, marginLeft: 2 },
  container: {
    backgroundColor: 'rgba(12,12,35,0.8)',
    borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border,
  },
  containerFocused: { backgroundColor: 'rgba(15,15,42,0.9)' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    ...Typography.presets.inputText, color: Colors.textPrimary,
    paddingHorizontal: 16, paddingVertical: 14, flex: 1, minHeight: 48,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none', backgroundColor: 'transparent' } : {}),
  },
  toggleBtn: { paddingHorizontal: 14, paddingVertical: 12 },
  toggleText: { ...Typography.presets.caption, color: Colors.primary, fontWeight: '600', fontSize: 13 },
  errorText: { ...Typography.presets.caption, color: Colors.error, marginTop: 6, marginLeft: 2 },
  strengthWrap: { marginTop: 10, paddingHorizontal: 2 },
  barTrack: { height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  barFill: { height: '100%', borderRadius: 2 },
  strengthLabel: { ...Typography.presets.caption, fontWeight: '600', marginBottom: 6, fontSize: 11 },
  rulesWrap: { gap: 4 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ruleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.15)' },
  ruleDotPass: { backgroundColor: Colors.success },
  ruleText: { ...Typography.presets.caption, color: Colors.textTertiary, fontSize: 12 },
  ruleTextPass: { color: 'rgba(255,255,255,0.5)' },
});

export default React.memo(PasswordInput);
