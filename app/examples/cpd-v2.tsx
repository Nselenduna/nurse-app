import { ScreenLayout } from '@/src/components/layouts/ScreenLayout';
import { CardSection, Section } from '@/src/components/ui/Section';
import { APP_COLORS } from '@/src/constants';
import { UI_CONFIG } from '@/src/constants/ui';
import { useCpdV2 } from '@/src/hooks/useCpdV2';
import React, { useCallback } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

/**
 * Example screen demonstrating the use of the useCpdV2 hook
 * This hook provides improved race condition handling
 */
export default function CpdV2ExampleScreen() {
  const {
    logs,
    loading,
    error,
    statistics,
    recentLogs,
    addLog,
    clearAll,
    resetError
  } = useCpdV2();

  // Handler for adding a sample log
  const handleAddSample = useCallback(async () => {
    try {
      await addLog({
        text: 'Example log entry created with useCpdV2',
        category: 'Clinical Practice',
        hours: 1,
        isVoiceGenerated: false,
        tags: ['example', 'test']
      });
      Alert.alert('Success', 'Sample log added successfully');
    } catch (err) {
      // Error handling is already done in the hook
      // This is just for demonstration
      console.error('Failed to add log:', err);
    }
  }, [addLog]);

  // Handler for clearing all logs
  const handleClearAll = useCallback(async () => {
    try {
      await clearAll();
      Alert.alert('Success', 'All logs cleared successfully');
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  }, [clearAll]);

  // Reset error state
  const handleResetError = useCallback(() => {
    resetError();
  }, [resetError]);

  return (
    <ScreenLayout
      title="useCpdV2 Demo"
      subtitle="Enhanced race condition handling"
      loading={loading}
    >
      {/* Error banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={handleResetError}>
            <Text style={styles.errorDismiss}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Statistics section */}
      <CardSection title="Statistics">
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statistics.totalActivities}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statistics.totalHours.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{Math.round(statistics.progressPercentage)}%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>
      </CardSection>

      {/* Actions section */}
      <Section title="Actions">
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddSample}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>Add Sample Log</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.destructiveButton]}
            onPress={handleClearAll}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>Clear All Logs</Text>
          </TouchableOpacity>
        </View>
      </Section>

      {/* Recent logs section */}
      <Section title="Recent Logs">
        {recentLogs.length > 0 ? (
          <View>
            {recentLogs.map((log) => (
              <View key={log.id} style={styles.logItem}>
                <View style={styles.logHeader}>
                  <Text style={styles.logCategory}>{log.category}</Text>
                  <Text style={styles.logHours}>{log.hours}h</Text>
                </View>
                <Text style={styles.logText}>{log.text}</Text>
                <Text style={styles.logDate}>
                  {new Date(log.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No logs found. Add some using the button above.</Text>
        )}
      </Section>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  // Error banner
  errorBanner: {
    backgroundColor: APP_COLORS.error,
    padding: UI_CONFIG.spacing.medium,
    borderRadius: UI_CONFIG.borderRadius.medium,
    marginBottom: UI_CONFIG.spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: APP_COLORS.white,
    fontSize: UI_CONFIG.fontSize.medium,
    flex: 1,
  },
  errorDismiss: {
    color: APP_COLORS.white,
    fontSize: UI_CONFIG.fontSize.small,
    fontWeight: UI_CONFIG.fontWeight.bold,
  },

  // Statistics
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: UI_CONFIG.spacing.medium,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: UI_CONFIG.spacing.small,
  },
  statNumber: {
    fontSize: UI_CONFIG.fontSize.xxlarge,
    fontWeight: UI_CONFIG.fontWeight.bold,
    color: APP_COLORS.info,
  },
  statLabel: {
    fontSize: UI_CONFIG.fontSize.small,
    color: APP_COLORS.textSecondary,
    marginTop: UI_CONFIG.spacing.xsmall,
  },

  // Actions
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: UI_CONFIG.spacing.medium,
  },
  actionButton: {
    flex: 1,
    backgroundColor: APP_COLORS.primary,
    padding: UI_CONFIG.spacing.medium,
    borderRadius: UI_CONFIG.borderRadius.medium,
    alignItems: 'center',
  },
  destructiveButton: {
    backgroundColor: APP_COLORS.error,
  },
  actionButtonText: {
    color: APP_COLORS.white,
    fontWeight: UI_CONFIG.fontWeight.semibold,
  },

  // Logs
  logItem: {
    backgroundColor: APP_COLORS.background,
    borderRadius: UI_CONFIG.borderRadius.medium,
    padding: UI_CONFIG.spacing.medium,
    marginBottom: UI_CONFIG.spacing.medium,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: UI_CONFIG.spacing.small,
  },
  logCategory: {
    color: APP_COLORS.info,
    fontSize: UI_CONFIG.fontSize.small,
    fontWeight: UI_CONFIG.fontWeight.semibold,
  },
  logHours: {
    color: APP_COLORS.success,
    fontSize: UI_CONFIG.fontSize.small,
    fontWeight: UI_CONFIG.fontWeight.semibold,
  },
  logText: {
    color: APP_COLORS.text,
    fontSize: UI_CONFIG.fontSize.small,
    marginBottom: UI_CONFIG.spacing.small,
  },
  logDate: {
    color: APP_COLORS.textMuted,
    fontSize: UI_CONFIG.fontSize.xsmall,
  },
  emptyText: {
    color: APP_COLORS.textSecondary,
    fontSize: UI_CONFIG.fontSize.medium,
    textAlign: 'center',
    padding: UI_CONFIG.spacing.large,
  },
});
