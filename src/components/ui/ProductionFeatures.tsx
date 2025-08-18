import { APP_COLORS } from '@/src/constants';
import { CONFIG, IS_PRODUCTION } from '@/src/constants/config';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Component to demonstrate production vs development features
 */
export function ProductionFeatures() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Running in {IS_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT'} Mode
      </Text>
      
      <View style={styles.featureRow}>
        <Text style={styles.featureLabel}>Logging:</Text>
        <Text style={styles.featureValue}>
          {CONFIG.enableLogging ? 'Enabled' : 'Disabled'}
        </Text>
      </View>
      
      <View style={styles.featureRow}>
        <Text style={styles.featureLabel}>Analytics:</Text>
        <Text style={styles.featureValue}>
          {CONFIG.enableAnalytics ? 'Enabled' : 'Disabled'}
        </Text>
      </View>
      
      <View style={styles.featureRow}>
        <Text style={styles.featureLabel}>Debug Buttons:</Text>
        <Text style={styles.featureValue}>
          {CONFIG.features.debugButtons ? 'Visible' : 'Hidden'}
        </Text>
      </View>
      
      <View style={styles.featureRow}>
        <Text style={styles.featureLabel}>Dev Tools:</Text>
        <Text style={styles.featureValue}>
          {CONFIG.features.devTools ? 'Available' : 'Unavailable'}
        </Text>
      </View>

      {!IS_PRODUCTION && (
        <Text style={styles.note}>
          Note: This component is only visible in development builds
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: APP_COLORS.background,
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    color: APP_COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  featureLabel: {
    color: APP_COLORS.textSecondary,
    fontSize: 14,
  },
  featureValue: {
    color: APP_COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  note: {
    color: APP_COLORS.textMuted,
    fontSize: 12,
    marginTop: 12,
    fontStyle: 'italic',
  },
});
