/**
 * Platform-safe shadow utility
 * Uses boxShadow on web, shadow* props on native.
 */

import { Platform } from 'react-native';

export const createShadow = (color, offsetY, blur, opacity) => {
  if (Platform.OS === 'web') {
    return { boxShadow: `0px ${offsetY}px ${blur}px rgba(0,0,0,${opacity})` };
  }
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blur,
    elevation: Math.round(offsetY),
  };
};

export default createShadow;
