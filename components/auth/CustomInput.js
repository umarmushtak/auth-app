/**
 * CustomInput — Premium Glass Input
 * Uses standard TouchableOpacity + TextInput. No animated Pressable.
 * Fully functional on web — handles browser autofill styling override.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';

// ━━━ Inject global CSS to override browser autofill styles ━━━
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'custom-input-autofill-fix';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Override browser autofill background color */
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 60px rgba(12,12,35,0.95) inset !important;
        box-shadow: 0 0 0 60px rgba(12,12,35,0.95) inset !important;
        -webkit-text-fill-color: #ffffff !important;
        caret-color: #4f8ef7 !important;
        transition: background-color 5000s ease-in-out 0s !important;
      }
      /* Also handle autocomplete suggestion selection */
      input:-internal-autofill-selected {
        background-color: transparent !important;
        -webkit-box-shadow: 0 0 0 60px rgba(12,12,35,0.95) inset !important;
        -webkit-text-fill-color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);
  }
}

const CustomInput = ({
  label, value, onChangeText, placeholder, error,
  keyboardType = 'default', autoCapitalize = 'none', autoCorrect = false,
  maxLength = 200, editable = true, testID, accessibilityLabel,
  onFocus: onFocusProp, onBlur: onBlurProp, ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocusProp?.();
  }, [onFocusProp]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlurProp?.();
  }, [onBlurProp]);

  const borderColor = error ? Colors.borderError : isFocused ? Colors.borderFocused : Colors.border;
  const webShadow = Platform.OS === 'web'
    ? { boxShadow: isFocused ? '0 0 20px rgba(79,142,247,0.2), 0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.2)' }
    : {};
  const webTransition = Platform.OS === 'web' ? { transition: 'all 0.25s ease' } : {};

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.container,
        { borderColor },
        isFocused && styles.containerFocused,
        webShadow,
        webTransition,
      ]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textTertiary}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={Colors.primary}
          testID={testID}
          accessibilityLabel={accessibilityLabel || label}
          {...rest}
        />
      </View>
      {error && (
        <Animated.Text entering={FadeIn.duration(250)} style={styles.errorText}>
          {error}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { ...Typography.presets.inputLabel, color: Colors.textSecondary, marginBottom: 8, marginLeft: 2 },
  container: {
    backgroundColor: 'rgba(12,12,35,0.8)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  containerFocused: {
    backgroundColor: 'rgba(15,15,42,0.9)',
  },
  input: {
    ...Typography.presets.inputText,
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'web' ? 14 : 14,
    minHeight: 48,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none', backgroundColor: 'transparent' } : {}),
  },
  errorText: { ...Typography.presets.caption, color: Colors.error, marginTop: 6, marginLeft: 2 },
});

export default React.memo(CustomInput);
