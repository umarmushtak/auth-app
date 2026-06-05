/**
 * AuthScreen — Premium Authentication Screen
 * 
 * Smooth fade transitions between modes (no broken flip).
 * All inputs/buttons fully functional on web.
 * Glassmorphism card with backdrop blur floating over animated BG.
 * Google OAuth fully functional on web via Supabase redirect.
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import Scene3DBackground from '../components/three/Scene3DBackground';
import AuthHeader from '../components/auth/AuthHeader';
import CustomInput from '../components/auth/CustomInput';
import PasswordInput from '../components/auth/PasswordInput';
import PrimaryButton from '../components/auth/PrimaryButton';
import SocialButton from '../components/auth/SocialButton';
import LoadingOverlay from '../components/auth/LoadingOverlay';

import useAuth from '../hooks/useAuth';
import {
  validateEmail, validatePassword, validateConfirmPassword,
  validateSignInForm, validateSignUpForm, sanitizeEmail,
} from '../utils/validation';
import Colors from '../constants/colors';
import Typography from '../constants/typography';

// Google Sign-In (lazy, skip configure on web)
let GoogleSignin;
try {
  const mod = require('@react-native-google-signin/google-signin');
  GoogleSignin = mod.GoogleSignin;
  if (Platform.OS !== 'web') {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true,
    });
  }
} catch (e) {}

const AuthScreen = () => {
  const router = useRouter();
  const {
    signUp, signIn, signInWithGoogleNative, signInWithGoogleWeb,
    isAuthenticating, authError, clearError,
    needsVerification, verificationEmail, resendVerification,
  } = useAuth();

  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [animKey, setAnimKey] = useState(0); // Force re-mount for fade animation

  // ━━━ Toggle Mode — Smooth Fade ━━━
  const toggleMode = useCallback(() => {
    clearError();
    setErrors({});
    setTouched({});
    setPassword('');
    setConfirmPassword('');
    setResendSuccess(false);
    setMode(m => m === 'signin' ? 'signup' : 'signin');
    setAnimKey(k => k + 1); // re-mount card for fresh entrance anim
  }, [clearError]);

  // ━━━ Back to Sign In from verification page ━━━
  const handleBackToSignIn = useCallback(() => {
    clearError();
    setErrors({});
    setTouched({});
    setPassword('');
    setConfirmPassword('');
    setResendSuccess(false);
    setMode('signin');
    setAnimKey(k => k + 1);
    // Force navigation back to login route to fully reset state
    router.replace('/(auth)/login');
  }, [clearError, router]);

  // ━━━ Validation ━━━
  const handleEmailChange = useCallback((val) => {
    setEmail(val);
    if (touched.email) {
      const r = validateEmail(val);
      setErrors(prev => ({ ...prev, email: r.error }));
    }
    clearError();
  }, [touched.email, clearError]);

  const handlePasswordChange = useCallback((val) => {
    setPassword(val);
    if (touched.password && mode === 'signup') {
      const r = validatePassword(val);
      setErrors(prev => ({ ...prev, password: r.error }));
    }
    clearError();
  }, [touched.password, mode, clearError]);

  const handleConfirmChange = useCallback((val) => {
    setConfirmPassword(val);
    if (touched.confirmPassword) {
      const r = validateConfirmPassword(password, val);
      setErrors(prev => ({ ...prev, confirmPassword: r.error }));
    }
    clearError();
  }, [touched.confirmPassword, password, clearError]);

  const markTouched = useCallback((f) => setTouched(prev => ({ ...prev, [f]: true })), []);

  const pwStrength = mode === 'signup' ? validatePassword(password) : null;

  // ━━━ Submit ━━━
  const handleSubmit = useCallback(async () => {
    if (mode === 'signin') {
      const v = validateSignInForm(email, password);
      setErrors(v.errors);
      setTouched({ email: true, password: true });
      if (!v.isValid) return;
      await signIn(sanitizeEmail(email), password);
    } else {
      const v = validateSignUpForm(email, password, confirmPassword);
      setErrors(v.errors);
      setTouched({ email: true, password: true, confirmPassword: true });
      if (!v.isValid) return;
      await signUp(sanitizeEmail(email), password);
    }
  }, [mode, email, password, confirmPassword, signIn, signUp]);

  // ━━━ Google Sign-In — Works on both Web and Native ━━━
  const handleGoogle = useCallback(async () => {
    setGoogleLoading(true);
    clearError();

    try {
      if (Platform.OS === 'web') {
        // Web: Use Supabase OAuth redirect flow
        const result = await signInWithGoogleWeb();
        if (result?.error) {
          if (Platform.OS === 'web' && typeof alert !== 'undefined') {
            alert('Google sign-in failed: ' + result.error);
          } else {
            Alert.alert('Error', 'Google sign-in failed: ' + result.error);
          }
        }
        // On success, browser redirects to Google consent → Supabase handles callback
      } else {
        // Native: Use idToken flow
        if (!GoogleSignin) {
          Alert.alert('Error', 'Google Sign-In is not available on this device.');
          return;
        }
        await GoogleSignin.hasPlayServices();
        const info = await GoogleSignin.signIn();
        const token = info?.data?.idToken || info?.idToken;
        if (token) await signInWithGoogleNative(token);
      }
    } catch (e) {
      if (e?.code !== 'SIGN_IN_CANCELLED') {
        const msg = e?.message || 'Google sign-in failed.';
        if (Platform.OS === 'web' && typeof alert !== 'undefined') {
          alert(msg);
        } else {
          Alert.alert('Error', msg);
        }
      }
    } finally {
      setGoogleLoading(false);
    }
  }, [signInWithGoogleNative, signInWithGoogleWeb, clearError]);

  // ━━━ Resend Verification Email ━━━
  const handleResend = useCallback(async () => {
    setResendLoading(true);
    setResendSuccess(false);
    const result = await resendVerification(verificationEmail || email);
    if (result?.success) {
      setResendSuccess(true);
      // Auto-clear success message after 5 seconds
      setTimeout(() => setResendSuccess(false), 5000);
    }
    setResendLoading(false);
  }, [resendVerification, verificationEmail, email]);

  // ━━━ Email Verification UI ━━━
  if (needsVerification) {
    return (
      <View style={styles.full}>
        <Scene3DBackground />
        <View style={styles.center}>
          <Animated.View entering={FadeInUp.duration(500)} style={styles.card}>
            <View style={styles.cardInner}>
              <View style={styles.verifyIconWrap}>
                <Text style={styles.verifyIconText}>✉</Text>
              </View>
              <Text style={styles.verifyTitle}>Check Your Email</Text>
              <Text style={styles.verifyBody}>
                We've sent a verification link to{'\n'}
                <Text style={styles.verifyEmail}>{verificationEmail || email}</Text>
              </Text>
              <Text style={styles.verifyHint}>
                Click the link to verify, then return here to sign in.
              </Text>

              {/* Resend success feedback */}
              {resendSuccess && (
                <Animated.View entering={FadeInDown.duration(300)} style={styles.successBanner}>
                  <Text style={styles.successBannerText}>✓ Verification email sent successfully!</Text>
                </Animated.View>
              )}

              {/* Auth error on resend */}
              {authError && (
                <Animated.View entering={FadeInDown.duration(250)} style={styles.errorBanner}>
                  <View style={styles.errorDot} />
                  <Text style={styles.errorText}>{authError}</Text>
                </Animated.View>
              )}

              <PrimaryButton
                title={resendLoading ? 'Sending...' : 'Resend Verification Email'}
                onPress={handleResend}
                loading={resendLoading}
                variant="outline"
                testID="resend-email-btn"
              />
              <TouchableOpacity onPress={handleBackToSignIn} style={styles.linkBtn} activeOpacity={0.7}>
                <Text style={styles.linkText}>← Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    );
  }

  // ━━━ Main UI ━━━
  return (
    <View style={styles.full}>
      <Scene3DBackground />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.kav}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View key={animKey} entering={FadeIn.duration(400)} style={styles.card}>
            <View style={styles.cardInner}>

              <AuthHeader
                title={mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                subtitle={mode === 'signin' ? 'Sign in to your account' : 'Start your journey with us'}
              />

              {/* Error Banner */}
              {authError && (
                <Animated.View entering={FadeInDown.duration(250)} style={styles.errorBanner}>
                  <View style={styles.errorDot} />
                  <Text style={styles.errorText}>{authError}</Text>
                </Animated.View>
              )}

              {/* Email */}
              <CustomInput
                label="Email address"
                value={email}
                onChangeText={handleEmailChange}
                placeholder="name@company.com"
                error={touched.email ? errors.email : null}
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={() => markTouched('email')}
                testID="auth-email-input"
              />

              {/* Password */}
              <PasswordInput
                label="Password"
                value={password}
                onChangeText={handlePasswordChange}
                placeholder={mode === 'signin' ? '••••••••' : 'Min 8 characters'}
                error={touched.password ? errors.password : null}
                showStrength={mode === 'signup'}
                strengthData={pwStrength}
                onBlur={() => markTouched('password')}
                testID="auth-password-input"
              />

              {/* Confirm Password */}
              {mode === 'signup' && (
                <Animated.View entering={FadeInDown.delay(50).duration(300)}>
                  <PasswordInput
                    label="Confirm password"
                    value={confirmPassword}
                    onChangeText={handleConfirmChange}
                    placeholder="Re-enter password"
                    error={touched.confirmPassword ? errors.confirmPassword : null}
                    onBlur={() => markTouched('confirmPassword')}
                    testID="auth-confirm-input"
                  />
                </Animated.View>
              )}

              {/* Forgot Password */}
              {mode === 'signin' && (
                <TouchableOpacity onPress={() => router.push('/forgot-password')} style={styles.forgotBtn}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              )}

              {/* Submit */}
              <View style={{ marginTop: 4 }}>
                <PrimaryButton
                  title={mode === 'signin' ? 'Sign In' : 'Create Account'}
                  onPress={handleSubmit}
                  loading={isAuthenticating}
                  testID="auth-submit-btn"
                />
              </View>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google */}
              <SocialButton provider="google" onPress={handleGoogle} loading={googleLoading} testID="auth-google-btn" />

              {/* Toggle Mode */}
              <View style={styles.toggleRow}>
                <Text style={styles.toggleText}>
                  {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                </Text>
                <TouchableOpacity onPress={toggleMode}>
                  <Text style={styles.toggleLink}>{mode === 'signin' ? 'Sign up' : 'Sign in'}</Text>
                </TouchableOpacity>
              </View>

            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={isAuthenticating && !authError} message="Authenticating..." />
    </View>
  );
};

const webCard = Platform.OS === 'web' ? {
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 80px rgba(79,142,247,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
} : {};

const styles = StyleSheet.create({
  full: { flex: 1, backgroundColor: '#060614' },
  kav: { flex: 1, zIndex: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, zIndex: 2 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 40 },
  card: {
    borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(10,10,30,0.75)',
    maxWidth: 420, width: '100%', alignSelf: 'center',
    ...webCard,
  },
  cardInner: { padding: 32 },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 10,
    padding: 12, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
  },
  errorDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error },
  errorText: { ...Typography.presets.caption, color: Colors.error, flex: 1 },
  successBanner: {
    backgroundColor: 'rgba(16,185,129,0.08)', borderRadius: 10,
    padding: 12, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)',
  },
  successBannerText: { ...Typography.presets.caption, color: Colors.success, textAlign: 'center', fontWeight: '500' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 4, marginTop: -6 },
  forgotText: { ...Typography.presets.caption, color: Colors.primary, fontWeight: '600', fontSize: 13 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  dividerText: { ...Typography.presets.caption, color: Colors.textTertiary, fontSize: 12 },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 6 },
  toggleText: { ...Typography.presets.caption, color: Colors.textTertiary, fontSize: 14 },
  toggleLink: { ...Typography.presets.link, color: Colors.primary, fontSize: 14 },
  // Verification
  verifyIconWrap: {
    width: 72, height: 72, borderRadius: 36, alignSelf: 'center', marginBottom: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(79,142,247,0.1)', borderWidth: 1.5, borderColor: 'rgba(79,142,247,0.2)',
  },
  verifyIconText: { fontSize: 32, color: Colors.primary },
  verifyTitle: { ...Typography.presets.screenTitle, color: Colors.textPrimary, textAlign: 'center', marginBottom: 12 },
  verifyBody: { ...Typography.presets.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  verifyEmail: { color: Colors.primary, fontWeight: '600' },
  verifyHint: { ...Typography.presets.caption, color: Colors.textTertiary, textAlign: 'center', marginTop: 12, marginBottom: 24 },
  linkBtn: { marginTop: 16, alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 16 },
  linkText: { ...Typography.presets.link, color: Colors.primary },
});

export default AuthScreen;
