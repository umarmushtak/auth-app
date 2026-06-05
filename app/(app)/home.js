/**
 * Home Screen — Post-auth Dashboard
 * 
 * Premium landing page after authentication.
 * Shows user profile, session details, security status,
 * and quick actions. Fully web-compatible.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

import Scene3DBackground from '../../components/three/Scene3DBackground';
import PrimaryButton from '../../components/auth/PrimaryButton';
import useAuth from '../../hooks/useAuth';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';

const HomeScreen = () => {
  const { user, session, signOut, isAuthenticating } = useAuth();
  const [showSessionInfo, setShowSessionInfo] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return 'N/A'; }
  };

  const provider = user?.app_metadata?.provider || 'email';
  const isVerified = !!user?.email_confirmed_at;
  const createdAt = formatDate(user?.created_at);
  const lastSignIn = formatDate(user?.last_sign_in_at);

  return (
    <View style={styles.full}>
      <Scene3DBackground />
      <View style={styles.center}>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.card}>
          <View style={styles.inner}>

            {/* Avatar */}
            <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.avatarWrap}>
              <Text style={styles.avatarText}>
                {(user?.email || 'U').charAt(0).toUpperCase()}
              </Text>
              <View style={[styles.statusIndicator, { backgroundColor: isVerified ? Colors.success : Colors.warning }]} />
            </Animated.View>

            {/* Welcome */}
            <Animated.Text entering={FadeInDown.delay(250).duration(400)} style={styles.title}>
              Welcome back
            </Animated.Text>

            <Animated.Text entering={FadeInDown.delay(350).duration(400)} style={styles.email}>
              {user?.email || 'Authenticated User'}
            </Animated.Text>

            {/* User Info Card */}
            <Animated.View entering={FadeInDown.delay(450).duration(400)} style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>USER ID</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{user?.id?.slice(0, 12) || 'N/A'}...</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>AUTH PROVIDER</Text>
                <View style={styles.providerBadge}>
                  <Text style={styles.providerText}>{provider.charAt(0).toUpperCase() + provider.slice(1)}</Text>
                </View>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>EMAIL STATUS</Text>
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: isVerified ? Colors.success : Colors.warning }]} />
                  <Text style={[styles.statusText, { color: isVerified ? Colors.success : Colors.warning }]}>
                    {isVerified ? 'Verified' : 'Pending Verification'}
                  </Text>
                </View>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>MEMBER SINCE</Text>
                <Text style={styles.infoValue}>{createdAt}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>LAST SIGN IN</Text>
                <Text style={styles.infoValue}>{lastSignIn}</Text>
              </View>
            </Animated.View>

            {/* Session Info Toggle */}
            <Animated.View entering={FadeInDown.delay(500).duration(400)}>
              <TouchableOpacity
                style={styles.sessionToggle}
                onPress={() => setShowSessionInfo(v => !v)}
                activeOpacity={0.7}
              >
                <Text style={styles.sessionToggleText}>
                  {showSessionInfo ? '▼ Hide Session Details' : '▶ Show Session Details'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {showSessionInfo && session && (
              <Animated.View entering={FadeInDown.duration(300)} style={styles.sessionCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>ACCESS TOKEN</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>{session.access_token?.slice(0, 20) || 'N/A'}...</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>TOKEN TYPE</Text>
                  <Text style={styles.infoValue}>{session.token_type || 'bearer'}</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>EXPIRES IN</Text>
                  <Text style={styles.infoValue}>{session.expires_in ? `${session.expires_in}s` : 'N/A'}</Text>
                </View>
              </Animated.View>
            )}

            {/* Security Badge */}
            <Animated.View entering={FadeInDown.delay(550).duration(400)} style={styles.securityBadge}>
              <Text style={styles.securityIcon}>🔒</Text>
              <Text style={styles.securityText}>Your session is encrypted and secure</Text>
            </Animated.View>

            {/* Sign Out */}
            <Animated.View entering={FadeInDown.delay(600).duration(400)}>
              <PrimaryButton title="Sign Out" onPress={signOut} loading={isAuthenticating} variant="outline" testID="signout-btn" />
            </Animated.View>

          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const webCard = Platform.OS === 'web' ? {
  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
  boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 80px rgba(79,142,247,0.08)',
} : {};

const styles = StyleSheet.create({
  full: { flex: 1, backgroundColor: '#060614' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, zIndex: 2 },
  card: {
    borderRadius: 20, overflow: 'hidden', width: '100%', maxWidth: 420,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(10,10,30,0.75)', ...webCard,
  },
  inner: { padding: 32, alignItems: 'center' },
  avatarWrap: {
    width: 80, height: 80, borderRadius: 40, marginBottom: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(79,142,247,0.15)', borderWidth: 2, borderColor: 'rgba(79,142,247,0.3)',
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: Colors.primary },
  statusIndicator: {
    position: 'absolute', bottom: 2, right: 2, width: 14, height: 14,
    borderRadius: 7, borderWidth: 2, borderColor: 'rgba(10,10,30,0.9)',
  },
  title: { ...Typography.presets.screenTitle, color: Colors.textPrimary, marginBottom: 6 },
  email: { ...Typography.presets.bodyMedium, color: Colors.primary, marginBottom: 24 },
  infoCard: {
    width: '100%', backgroundColor: 'rgba(12,12,35,0.8)', borderRadius: 14,
    padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  infoDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.04)', marginVertical: 10 },
  infoLabel: { ...Typography.presets.overline, color: Colors.textTertiary, fontSize: 10, letterSpacing: 1.5 },
  infoValue: { ...Typography.presets.caption, color: Colors.textSecondary, fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  providerBadge: {
    backgroundColor: 'rgba(79,142,247,0.1)', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(79,142,247,0.15)',
  },
  providerText: { ...Typography.presets.caption, color: Colors.primary, fontWeight: '600', fontSize: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { ...Typography.presets.caption, fontWeight: '600', fontSize: 12 },
  sessionToggle: {
    paddingVertical: 8, paddingHorizontal: 12, marginBottom: 12,
    borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)',
  },
  sessionToggleText: { ...Typography.presets.caption, color: Colors.textTertiary, fontSize: 12 },
  sessionCard: {
    width: '100%', backgroundColor: 'rgba(12,12,35,0.6)', borderRadius: 12,
    padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
  },
  securityBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    backgroundColor: 'rgba(16,185,129,0.06)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.1)',
    marginBottom: 20, width: '100%', justifyContent: 'center',
  },
  securityIcon: { fontSize: 14 },
  securityText: { ...Typography.presets.caption, color: Colors.textTertiary, fontSize: 11 },
});

export default HomeScreen;
