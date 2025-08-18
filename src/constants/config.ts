/**
 * App configuration
 */
import Constants from 'expo-constants';

// Check both environment variables and app.json extra for production mode
// This allows simulation of production mode in development
const SIMULATE_PRODUCTION = Constants.expoConfig?.extra?.simulateProduction === true;

// Check environment variables to determine build mode
export const IS_PRODUCTION = 
  process.env.APP_VARIANT === 'production' || 
  process.env.NODE_ENV === 'production' || 
  SIMULATE_PRODUCTION;

// Configuration values that differ between production and development
export const CONFIG = {
  // Set to false in production for security
  enableLogging: !IS_PRODUCTION,
  // Analytics could be enabled only in production
  enableAnalytics: IS_PRODUCTION,
  // Feature flags
  features: {
    debugButtons: !IS_PRODUCTION,
    devTools: !IS_PRODUCTION,
  }
};
