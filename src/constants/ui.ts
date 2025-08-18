/**
 * UI configuration constants
 * Contains standardized values for UI elements to ensure consistency
 */
export const UI_CONFIG = {
  spacing: {
    xsmall: 4,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
    xxlarge: 48,
  },
  fontSize: {
    xsmall: 10,
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 18,
    xxlarge: 20,
    xxxlarge: 24,
    huge: 28,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20,
    xxlarge: 24,
  },
  iconSize: {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 32,
    xxlarge: 48,
  },
  version: {
    number: '1.0.0',
    build: '2024.1',
  },
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
} as const;
