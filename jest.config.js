module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/e2e/'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@react-navigation|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)'
  ],
};
