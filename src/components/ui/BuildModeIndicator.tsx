import { APP_COLORS } from '@/src/constants';
import { IS_PRODUCTION } from '@/src/constants/config';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Component to indicate the current build mode (production or development)
 * This is only visible in development mode, not in actual production builds
 */
export function BuildModeIndicator() {
  if (IS_PRODUCTION) {
    // Don't show anything in actual production mode
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {IS_PRODUCTION ? 'PRODUCTION MODE' : 'DEVELOPMENT MODE'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: APP_COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  text: {
    color: APP_COLORS.white,
    fontSize: 10,
  },
});
