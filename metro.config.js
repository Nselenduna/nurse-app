// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Support @ alias for imports
config.resolver.extraNodeModules = {
  '@': __dirname,
};

// Add Expo Web support if needed
if (process.env.EXPO_PLATFORM === 'web') {
  config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];
}

module.exports = config;
