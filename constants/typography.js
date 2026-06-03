/**
 * Typography Design Tokens
 * 
 * Weight hierarchy optimized for dark theme readability.
 * Uses system fonts with Inter as preferred choice.
 */

import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const Typography = {
  // ━━━ Font Family ━━━
  fontFamily,

  // ━━━ Font Sizes ━━━
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
    '4xl': 48,
  },

  // ━━━ Font Weights ━━━
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // ━━━ Line Heights ━━━
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },

  // ━━━ Letter Spacing ━━━
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },

  // ━━━ Preset Styles ━━━
  presets: {
    heroTitle: {
      fontFamily,
      fontSize: 36,
      fontWeight: '800',
      letterSpacing: -0.5,
      lineHeight: 43,
    },
    screenTitle: {
      fontFamily,
      fontSize: 24,
      fontWeight: '700',
      letterSpacing: -0.3,
      lineHeight: 32,
    },
    sectionTitle: {
      fontFamily,
      fontSize: 20,
      fontWeight: '600',
      letterSpacing: 0,
      lineHeight: 28,
    },
    body: {
      fontFamily,
      fontSize: 15,
      fontWeight: '400',
      letterSpacing: 0,
      lineHeight: 22,
    },
    bodyMedium: {
      fontFamily,
      fontSize: 15,
      fontWeight: '500',
      letterSpacing: 0,
      lineHeight: 22,
    },
    caption: {
      fontFamily,
      fontSize: 13,
      fontWeight: '400',
      letterSpacing: 0.2,
      lineHeight: 18,
    },
    captionMedium: {
      fontFamily,
      fontSize: 13,
      fontWeight: '500',
      letterSpacing: 0.2,
      lineHeight: 18,
    },
    buttonLabel: {
      fontFamily,
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.3,
      lineHeight: 22,
    },
    inputText: {
      fontFamily,
      fontSize: 15,
      fontWeight: '400',
      letterSpacing: 0,
      lineHeight: 20,
    },
    inputLabel: {
      fontFamily,
      fontSize: 13,
      fontWeight: '500',
      letterSpacing: 0.3,
      lineHeight: 18,
    },
    link: {
      fontFamily,
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 0.2,
      lineHeight: 20,
    },
    overline: {
      fontFamily,
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 2,
      lineHeight: 16,
      textTransform: 'uppercase',
    },
  },
};

export default Typography;
