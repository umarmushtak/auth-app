/**
 * Scene3DBackground — Premium Interactive Animated Background
 * 
 * Floating gradient orbs with blur, particle field, subtle grid,
 * and cursor-following interactive glow effect on web.
 * pointerEvents='none' — NEVER blocks user interaction.
 * 
 * All web CSS properties use long-form (no shorthand `background`).
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Platform, Animated, Dimensions } from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');

// ━━━ Floating Gradient Orb ━━━
const FloatingOrb = ({ color, size, x, y, dur, delay: d }) => {
  const ty = useRef(new Animated.Value(0)).current;
  const tx = useRef(new Animated.Value(0)).current;
  const sc = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(sc, { toValue: 1, duration: 2000, delay: d, useNativeDriver: true }).start();
    Animated.timing(op, { toValue: 1, duration: 2500, delay: d, useNativeDriver: true }).start();

    Animated.loop(Animated.sequence([
      Animated.timing(ty, { toValue: -(20 + Math.random() * 30), duration: dur, useNativeDriver: true }),
      Animated.timing(ty, { toValue: (20 + Math.random() * 30), duration: dur * 1.1, useNativeDriver: true }),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(tx, { toValue: -(15 + Math.random() * 15), duration: dur * 1.3, useNativeDriver: true }),
      Animated.timing(tx, { toValue: (15 + Math.random() * 15), duration: dur * 1.2, useNativeDriver: true }),
    ])).start();
  }, []);

  // Web: use radial-gradient via backgroundImage (long-form, not shorthand)
  const webStyle = Platform.OS === 'web' ? {
    backgroundImage: `radial-gradient(circle, ${color}66 0%, ${color}22 40%, transparent 70%)`,
    filter: `blur(${Math.round(size * 0.25)}px)`,
  } : { backgroundColor: color, opacity: 0.15 };

  return (
    <Animated.View style={[{
      position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: size / 2,
    }, webStyle, { transform: [{ translateX: tx }, { translateY: ty }, { scale: sc }], opacity: op }]} />
  );
};

// ━━━ Pulsing Particle ━━━
const Particle = ({ x, y, s, d }) => {
  const o = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(0)).current;
  const tx = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(o, { toValue: 0.6, duration: 2500 + Math.random() * 2000, delay: d, useNativeDriver: true }),
      Animated.timing(o, { toValue: 0.05, duration: 2500 + Math.random() * 2000, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(ty, { toValue: -10, duration: 5000, useNativeDriver: true }),
      Animated.timing(ty, { toValue: 10, duration: 5000, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(tx, { toValue: -5, duration: 6000, useNativeDriver: true }),
      Animated.timing(tx, { toValue: 5, duration: 6000, useNativeDriver: true }),
    ])).start();
  }, []);

  const colors = ['#4f8ef7', '#7c3aed', '#06b6d4', '#a78bfa', '#22d3ee'];
  return <Animated.View style={{ position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: s,
    backgroundColor: colors[Math.floor(Math.random() * 5)], opacity: o,
    transform: [{ translateY: ty }, { translateX: tx }] }} />;
};

// ━━━ Cursor-Following Glow (Web Only) ━━━
const CursorGlow = () => {
  const [pos, setPos] = useState({ x: SW / 2, y: SH / 2 });

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    let animFrame;
    let targetX = SW / 2;
    let targetY = SH / 2;
    let currentX = SW / 2;
    let currentY = SH / 2;

    const handleMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      // Smooth lerp toward cursor position
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      setPos({ x: currentX, y: currentY });
      animFrame = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    animFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  if (Platform.OS !== 'web') return null;

  return (
    <View style={[styles.cursorGlow, {
      left: pos.x - 200,
      top: pos.y - 200,
    }]} />
  );
};

// ━━━ Shooting Star (Web Only) ━━━
const ShootingStar = ({ delay }) => {
  const tx = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0)).current;
  const startX = Math.random() * SW;
  const startY = Math.random() * SH * 0.5;

  useEffect(() => {
    const runAnimation = () => {
      tx.setValue(0);
      op.setValue(0);
      Animated.sequence([
        Animated.delay(delay + Math.random() * 8000),
        Animated.parallel([
          Animated.timing(tx, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(op, { toValue: 0.8, duration: 200, useNativeDriver: true }),
            Animated.timing(op, { toValue: 0, duration: 1000, useNativeDriver: true }),
          ]),
        ]),
      ]).start(runAnimation);
    };
    runAnimation();
  }, []);

  const translateX = tx.interpolate({ inputRange: [0, 1], outputRange: [0, 250] });
  const translateY = tx.interpolate({ inputRange: [0, 1], outputRange: [0, 150] });

  return (
    <Animated.View style={{
      position: 'absolute', left: startX, top: startY,
      width: 60, height: 1.5, borderRadius: 1,
      backgroundColor: '#4f8ef7',
      opacity: op,
      transform: [{ translateX }, { translateY }, { rotate: '35deg' }],
    }} />
  );
};

// ━━━ Main Component ━━━
const Scene3DBackground = () => {
  const particles = useRef(Array.from({ length: 60 }, (_, i) => ({
    id: i, x: Math.random() * SW, y: Math.random() * SH,
    s: 1 + Math.random() * 3, d: Math.random() * 4000,
  }))).current;

  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.base} />

      {/* Gradient orbs — more depth with varied sizes */}
      <FloatingOrb color="#4f8ef7" size={360} x={-120} y={-100} dur={7000} delay={0} />
      <FloatingOrb color="#7c3aed" size={280} x={SW * 0.55} y={SH * 0.05} dur={8000} delay={400} />
      <FloatingOrb color="#06b6d4" size={220} x={SW * 0.1} y={SH * 0.55} dur={6000} delay={800} />
      <FloatingOrb color="#7c3aed" size={200} x={SW * 0.7} y={SH * 0.6} dur={9000} delay={200} />
      <FloatingOrb color="#4f8ef7" size={160} x={SW * 0.35} y={SH * 0.3} dur={7500} delay={600} />
      <FloatingOrb color="#06b6d4" size={120} x={SW * 0.85} y={SH * 0.35} dur={6500} delay={1000} />
      <FloatingOrb color="#a78bfa" size={240} x={SW * 0.2} y={SH * 0.8} dur={8500} delay={1200} />
      <FloatingOrb color="#22d3ee" size={140} x={SW * 0.6} y={SH * 0.85} dur={7000} delay={1400} />

      {/* Particles */}
      {particles.map(p => <Particle key={p.id} x={p.x} y={p.y} s={p.s} d={p.d} />)}

      {/* Shooting stars (web only) */}
      {Platform.OS === 'web' && (
        <>
          <ShootingStar delay={0} />
          <ShootingStar delay={3000} />
          <ShootingStar delay={6000} />
          <ShootingStar delay={9000} />
        </>
      )}

      {/* Grid overlay (web only) */}
      {Platform.OS === 'web' && <View style={styles.grid} />}

      {/* Cursor-following glow (web only) */}
      <CursorGlow />

      {/* Vignette */}
      <View style={styles.vignette} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { ...StyleSheet.absoluteFillObject, zIndex: 0, overflow: 'hidden' },
  base: { ...StyleSheet.absoluteFillObject, backgroundColor: '#060614' },
  grid: Platform.OS === 'web' ? {
    ...StyleSheet.absoluteFillObject, opacity: 0.025,
    backgroundImage: 'linear-gradient(rgba(79,142,247,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.4) 1px, transparent 1px)',
    backgroundSize: '80px 80px',
  } : {},
  vignette: Platform.OS === 'web' ? {
    ...StyleSheet.absoluteFillObject,
    backgroundImage: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,6,20,0.8) 100%)',
  } : { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
  cursorGlow: Platform.OS === 'web' ? {
    position: 'absolute', width: 400, height: 400, borderRadius: 200,
    backgroundImage: 'radial-gradient(circle, rgba(79,142,247,0.12) 0%, rgba(124,58,237,0.06) 40%, transparent 70%)',
    filter: 'blur(40px)',
    pointerEvents: 'none',
  } : { display: 'none' },
});

export default React.memo(Scene3DBackground);
