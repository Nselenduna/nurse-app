import { ScreenLayout } from '@/src/components/layouts/ScreenLayout';
import { BuildModeIndicator } from '@/src/components/ui/BuildModeIndicator';
import { ProductionFeatures } from '@/src/components/ui/ProductionFeatures';
import { APP_COLORS } from '@/src/constants';
import { CONFIG, IS_PRODUCTION } from '@/src/constants/config';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Example screen to show production mode features
 */
export default function ProductionModeScreen() {
  return (
    <ScreenLayout 
      title="Production Mode Demo"
      scrollable
    >
      <View style={styles.container}>
        <Text style={styles.heading}>
          {IS_PRODUCTION ? '🚀 Production Mode' : '🔧 Development Mode'}
        </Text>
        
        <Text style={styles.description}>
          This screen demonstrates how the app behaves differently in production vs development modes.
          You can toggle production mode simulation by changing the "simulateProduction" flag in app.json.
        </Text>
        
        <ProductionFeatures />
        
        {!CONFIG.features.debugButtons ? (
          <Text style={styles.debugDisabled}>
            Debug buttons are disabled in production mode
          </Text>
        ) : (
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>Debug Options</Text>
            <Text style={styles.debugText}>
              These options would only appear in development builds
            </Text>
          </View>
        )}
        
        <Text style={styles.note}>
          In a real production build created with EAS, additional optimizations would be applied:
        </Text>
        
        <View style={styles.bulletContainer}>
          <Text style={styles.bullet}>• Smaller bundle size</Text>
          <Text style={styles.bullet}>• Faster startup time</Text>
          <Text style={styles.bullet}>• No developer tools or debug info</Text>
          <Text style={styles.bullet}>• Optimized asset loading</Text>
          <Text style={styles.bullet}>• ProGuard optimizations on Android</Text>
        </View>
      </View>
      
      <BuildModeIndicator />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: APP_COLORS.white,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: APP_COLORS.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  debugContainer: {
    backgroundColor: 'rgba(255, 255, 0, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  debugTitle: {
    color: APP_COLORS.warning,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  debugText: {
    color: APP_COLORS.textSecondary,
    fontSize: 14,
  },
  debugDisabled: {
    color: APP_COLORS.textMuted,
    fontStyle: 'italic',
    marginVertical: 16,
    textAlign: 'center',
  },
  note: {
    fontSize: 16,
    color: APP_COLORS.white,
    fontWeight: '500',
    marginTop: 24,
    marginBottom: 12,
  },
  bulletContainer: {
    marginLeft: 16,
  },
  bullet: {
    fontSize: 14,
    color: APP_COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
});
