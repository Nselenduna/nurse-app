module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // This allows path aliases to work properly
      ['module-resolver', {
        alias: {
          '@': '.',
        },
      }],
      'react-native-reanimated/plugin',
    ],
  };
};
