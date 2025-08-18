/**
 * This script sets environment variables to simulate production mode
 * while running in development
 */

process.env.APP_VARIANT = 'production';
process.env.NODE_ENV = 'production';
console.log('🚀 Running in production simulation mode');
