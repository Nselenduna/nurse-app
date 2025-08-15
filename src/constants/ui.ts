/**
 * UI configuration constants
 * Contains standardized values for UI elements to ensure consistency
 */
export const UI_CONFIG = {
  /**
   * Pagination limits for different views
   */
  pagination: {
    dashboardRecentActivities: 3,
    cpdScreenRecentLogs: 10,
    maxRecentLogs: 5,
    maxCategoryDisplay: 10,
  },
  
  /**
   * Spacing values for margins and padding
   */
  spacing: {
    xsmall: 4,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
  },
  
  /**
   * Border radius values
   */
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    circle: 9999,
  },
  
  /**
   * Font sizes
   */
  fontSize: {
    xsmall: 12,
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 24,
    xxxlarge: 28,
  },
  
  /**
   * Font weights
   */
  fontWeight: {
    normal: '400',
    semibold: '600',
    bold: '700',
  },
  
  /**
   * Icon sizes
   */
  iconSize: {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 32,
    xxlarge: 48,
    xxxlarge: 64,
  },
  
  /**
   * Animation timing
   */
  animation: {
    short: 150,
    medium: 300,
    long: 500,
  },
  
  /**
   * App version information
   */
  version: {
    number: '1.0.0',
    build: '2024.1',
    codename: 'Nightingale',
  },
} as const;
