/**
 * ForgotPasswordScreen — Premium Password Reset
 * Glassmorphism card, animated BG, fully functional on web.
 * All buttons and navigation work properly.
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, StyleSheet,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import Scene3DBackground from '../components/three/Scene3DBackground';
import AuthHeader from '../components/auth/AuthHeader';
import CustomInput from '../components/auth/CustomInput';
import PasswordInput from '../components/auth/PasswordInput';
import PrimaryButton from '../components/auth/PrimaryButton';
import LoadingOverlay from '../components/auth/LoadingOverlay';

import useAuth from '../hooks/useAuth';
import {
  validateEmail, validatePassword,
  validateForgotPasswordForm, validateResetPasswordForm, sanitizeEmail,
} from '../utils/validation';
import Colors from '../constants/colors';
import Typography from '../constants/typography';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { forgotPassword, updatePassword, isAuthenticating, authError, clearError, session } = useAuth();
  const isResetMode = !!session;

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [emailSent, setEmailSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const markTouched = useCallback((f) => setTouched(p => ({ ...p, [f]: true })), []);

  // ━━━ Back to Sign In navigation ━━━
  const navigateBackToSignIn = useCallback(() => {
    clearError();
    router.replace('/(auth)/login');
  }, [clearError, router]);

  const handleForgotSubmit = useCallback(async () => {
    const v = validateForgotPasswordForm(email);
    setErrors(v.errors); setTouched({ email: true });
    if (!v.isValid) return;
    clearError();
    const { success } = await forgotPassword(sanitizeEmail(email));
    if (success) setEmailSent(true);
  }, [email, forgotPassword, clearError]);

  const handleResetSubmit = useCallback(async () => {
    const v = validateResetPasswordForm(newPassword, confirmPassword);
    setErrors(v.errors); setTouched({ password: true, confirmPassword: true });
    if (!v.isValid) return;
    clearError();
    const { success } = await updatePassword(newPassword);
    if (success) setResetSuccess(true);
  }, [newPassword, confirmPassword, updatePassword, clearError]);

  const pwStrength = validatePassword(newPassword);

  // ━━━ Success ━━━
  if (resetSuccess) {
    return (
      <View style={styles.full}>
        <Scene3DBackground />
        <View style={styles.center}>
          <Animated.View entering={FadeInUp.duration(500)} style={styles.card}>
            <View style={styles.inner}>
              <View style={styles.successIcon}><Text style={styles.successGlyph}>✓</Text></View>
              <Text style={styles.successTitle}>Password Updated</Text>
              <Text style={styles.successBody}>Your password has been successfully reset.</Text>
              <PrimaryButton title="Continue to Sign In" onPress={navigateBackToSignIn} testID="reset-continue-btn" />
            </View>
          </Animated.View>
        </View>
      </View>
    );
  }

  // ━━━ Email Sent ━━━
  if (emailSent) {
    return (
      <View style={styles.full}>
        <Scene3DBackground />
        <View style={styles.center}>
          <Animated.View entering={FadeInUp.duration(500)} style={styles.card}>
            <View style={styles.inner}>
              <View style={styles.emailIcon}><Text style={styles.emailGlyph}>✉</Text></View>
              <Text style={styles.successTitle}>Check Your Inbox</Text>
              <Text style={styles.successBody}>
                We've sent a password reset link to your email.{'\n'}It may take a moment to arrive.
              </Text>
              <PrimaryButton title="Back to Sign In" onPress={navigateBackToSignIn} variant="outline" testID="email-sent-back-btn" />
            </View>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.full}>
      <Scene3DBackground />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.card}>
            <View style={styles.inner}>
              <AuthHeader
                title={isResetMode ? 'New Password' : 'Reset Password'}
                subtitle={isResetMode ? 'Choose a strong new password' : "We'll email you a reset link"}
                showBack onBack={navigateBackToSignIn}
              />
              {authError && (
                <Animated.View entering={FadeInDown.duration(250)} style={styles.errorBanner}>
                  <View style={styles.errorDot} />
                  <Text style={styles.errorText}>{authError}</Text>
                </Animated.View>
              )}
              {isResetMode ? (
                <>
                  <PasswordInput label="New password" value={newPassword}
                    onChangeText={v => { setNewPassword(v); clearError(); }}
                    placeholder="Min 8 characters" error={touched.password ? errors.password : null}
                    showStrength strengthData={pwStrength} onBlur={() => markTouched('password')}
                    testID="reset-password-input" />
                  <PasswordInput label="Confirm password" value={confirmPassword}
                    onChangeText={v => { setConfirmPassword(v); clearError(); }}
                    placeholder="Re-enter password" error={touched.confirmPassword ? errors.confirmPassword : null}
                    onBlur={() => markTouched('confirmPassword')}
                    testID="reset-confirm-input" />
                  <PrimaryButton title="Update Password" onPress={handleResetSubmit} loading={isAuthenticating} testID="reset-submit-btn" />
                </>
              ) : (
                <>
                  <CustomInput label="Email address" value={email}
                    onChangeText={v => { setEmail(v); clearError(); }}
                    placeholder="name@company.com" error={touched.email ? errors.email : null}
                    keyboardType="email-address" autoCapitalize="none" onBlur={() => markTouched('email')}
                    testID="forgot-email-input" />
                  <PrimaryButton title="Send Reset Link" onPress={handleForgotSubmit} loading={isAuthenticating} testID="forgot-submit-btn" />
                </>
              )}
              <TouchableOpacity onPress={navigateBackToSignIn} style={styles.linkBtn} activeOpacity={0.7}>
                <Text style={styles.linkText}>← Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingOverlay visible={isAuthenticating} message="Please wait..." />
    </View>
  );
};

const webCard = Platform.OS === 'web' ? {
  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
  boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 80px rgba(79,142,247,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
} : {};

const styles = StyleSheet.create({
  full: { flex: 1, backgroundColor: '#060614' },
  kav: { flex: 1, zIndex: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, zIndex: 2 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 40 },
  card: {
    borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(10,10,30,0.75)', maxWidth: 420, width: '100%', alignSelf: 'center', ...webCard,
  },
  inner: { padding: 32 },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 10,
    padding: 12, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
  },
  errorDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error },
  errorText: { ...Typography.presets.caption, color: Colors.error, flex: 1 },
  linkBtn: { marginTop: 20, alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 16 },
  linkText: { ...Typography.presets.link, color: Colors.primary },
  successIcon: {
    width: 72, height: 72, borderRadius: 36, alignSelf: 'center', marginBottom: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(16,185,129,0.1)', borderWidth: 1.5, borderColor: 'rgba(16,185,129,0.25)',
  },
  successGlyph: { fontSize: 32, color: Colors.success },
  emailIcon: {
    width: 72, height: 72, borderRadius: 36, alignSelf: 'center', marginBottom: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(79,142,247,0.1)', borderWidth: 1.5, borderColor: 'rgba(79,142,247,0.2)',
  },
  emailGlyph: { fontSize: 32, color: Colors.primary },
  successTitle: { ...Typography.presets.screenTitle, color: Colors.textPrimary, textAlign: 'center', marginBottom: 12 },
  successBody: { ...Typography.presets.body, color: Colors.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
});

export default ForgotPasswordScreen;
