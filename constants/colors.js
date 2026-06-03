/**
 * Deep Space Dark Theme — Color Design Tokens
 * 
 * Curated palette for immersive 3D auth experience.
 * All colors use HSL-derived hex values for precision.
 */

export const Colors = {
  // ━━━ Core Background Layers ━━━
  base: '#0a0a1a',
  surface: '#0f0f2a',
  surfaceElevated: '#161636',
  surfaceOverlay: 'rgba(15, 15, 42, 0.85)',

  // ━━━ Primary Accent — Electric Blue ━━━
  primary: '#4f8ef7',
  primaryLight: '#7aadff',
  primaryDark: '#2d6ed4',
  primaryMuted: 'rgba(79, 142, 247, 0.15)',
  primaryGlow: 'rgba(79, 142, 247, 0.4)',

  // ━━━ Secondary Accent — Violet ━━━
  violet: '#7c3aed',
  violetLight: '#a78bfa',
  violetDark: '#5b21b6',
  violetMuted: 'rgba(124, 58, 237, 0.15)',
  violetGlow: 'rgba(124, 58, 237, 0.4)',

  // ━━━ Tertiary Accent — Cyan ━━━
  cyan: '#06b6d4',
  cyanLight: '#22d3ee',
  cyanDark: '#0891b2',
  cyanMuted: 'rgba(6, 182, 212, 0.15)',

  // ━━━ Semantic Colors ━━━
  success: '#10b981',
  successMuted: 'rgba(16, 185, 129, 0.15)',
  error: '#ef4444',
  errorMuted: 'rgba(239, 68, 68, 0.12)',
  warning: '#f59e0b',
  warningMuted: 'rgba(245, 158, 11, 0.15)',

  // ━━━ Text Hierarchy ━━━
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.45)',
  textDisabled: 'rgba(255, 255, 255, 0.25)',

  // ━━━ Border & Divider ━━━
  border: 'rgba(255, 255, 255, 0.08)',
  borderFocused: 'rgba(79, 142, 247, 0.5)',
  borderError: 'rgba(239, 68, 68, 0.5)',
  divider: 'rgba(255, 255, 255, 0.06)',

  // ━━━ Glassmorphism ━━━
  glass: 'rgba(15, 15, 42, 0.65)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassHighlight: 'rgba(255, 255, 255, 0.05)',

  // ━━━ Gradient Presets ━━━
  gradients: {
    primaryButton: ['#4f8ef7', '#7c3aed'],
    secondaryButton: ['#06b6d4', '#4f8ef7'],
    background: ['#0a0a1a', '#0f0f2a', '#161636'],
    card: ['rgba(15, 15, 42, 0.8)', 'rgba(22, 22, 54, 0.6)'],
    accent: ['#7c3aed', '#4f8ef7', '#06b6d4'],
  },

  // ━━━ 3D Scene Colors ━━━
  scene: {
    fog: '#0a0a1a',
    ambient: '#1a1a3e',
    particlePrimary: '#4f8ef7',
    particleViolet: '#7c3aed',
    particleCyan: '#06b6d4',
  },
};

export default Colors;
