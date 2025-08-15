import CpdLogCard from '@/src/components/CpdLogCard';
import { ScreenLayout } from '@/src/components/layouts/ScreenLayout';
import { CpdEmptyState } from '@/src/components/ui/EmptyState';
import { APP_COLORS } from '@/src/constants';
import { STRINGS } from '@/src/constants/strings';
import { UI_CONFIG } from '@/src/constants/ui';
import { useCpd } from '@/src/hooks/useCpd';
import React, { useCallback, useMemo } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function CpdScreen() {
  const { 
    logs, 
    loading, 
    statistics, 
    categoryBreakdown, 
    recentLogs
  } = useCpd();

  const handleRefresh = useCallback(async () => {
    // The refresh is handled automatically by the service subscription
    // This is just a placeholder for the RefreshControl
  }, []);

  const renderLogCard = useCallback(({ item }: { item: any }) => (
    <CpdLogCard log={item} />
  ), []);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const AnalyticsSection = useMemo(() => (
    <View style={styles.analyticsContainer}>
      <Text style={styles.analyticsTitle}>{STRINGS.sections.cpdSummary}</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{statistics.totalHours.toFixed(1)}</Text>
          <Text style={styles.statLabel}>{STRINGS.labels.totalHours}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{statistics.totalActivities}</Text>
          <Text style={styles.statLabel}>{STRINGS.labels.activities}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{statistics.voiceGeneratedCount}</Text>
          <Text style={styles.statLabel}>{STRINGS.labels.voiceLogs}</Text>
        </View>
      </View>

      {Object.keys(categoryBreakdown).length > 0 && (
        <View style={styles.categoryBreakdown}>
          <Text style={styles.breakdownTitle}>{STRINGS.sections.hoursByCategory}</Text>
          {Object.entries(categoryBreakdown).map(([category, hours]) => (
            <View key={category} style={styles.categoryRow}>
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.categoryHours}>{hours.toFixed(1)}h</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  ), [statistics, categoryBreakdown]);



  return (
    <ScreenLayout
      title={STRINGS.screens.cpd.title}
      loading={loading}
      refreshable={true}
      onRefresh={handleRefresh}
    >
      {logs.length > 0 ? (
        <>
          {AnalyticsSection}
          
          <Text style={styles.sectionTitle}>{STRINGS.sections.recentActivities}</Text>
          <FlatList
            data={recentLogs}
            keyExtractor={keyExtractor}
            renderItem={renderLogCard}
            scrollEnabled={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            contentContainerStyle={styles.logsContainer}
          />
          
          {logs.length > 10 && (
            <Text style={styles.viewAllText}>
              Showing 10 of {logs.length} activities
            </Text>
          )}
        </>
      ) : (
        <CpdEmptyState />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  analyticsContainer: { 
    marginBottom: UI_CONFIG.spacing.large
  },
  analyticsTitle: { 
    color: APP_COLORS.white, 
    fontSize: UI_CONFIG.fontSize.large, 
    fontWeight: UI_CONFIG.fontWeight.semibold, 
    marginBottom: UI_CONFIG.spacing.medium
  },
  statsRow: { 
    flexDirection: 'row', 
    gap: UI_CONFIG.spacing.medium - 4, // 12px
    marginBottom: UI_CONFIG.spacing.large - 4 // 20px
  },
  statCard: { 
    flex: 1, 
    backgroundColor: APP_COLORS.background, 
    borderRadius: UI_CONFIG.borderRadius.medium, 
    padding: UI_CONFIG.spacing.medium,
    alignItems: 'center'
  },
  statNumber: { 
    color: APP_COLORS.info, 
    fontSize: UI_CONFIG.fontSize.xxlarge, 
    fontWeight: UI_CONFIG.fontWeight.bold
  },
  statLabel: { 
    color: APP_COLORS.textSecondary, 
    fontSize: UI_CONFIG.fontSize.xsmall, 
    marginTop: UI_CONFIG.spacing.xsmall
  },
  categoryBreakdown: { 
    marginTop: UI_CONFIG.spacing.medium
  },
  breakdownTitle: { 
    color: APP_COLORS.white, 
    fontSize: UI_CONFIG.fontSize.medium, 
    fontWeight: UI_CONFIG.fontWeight.semibold, 
    marginBottom: UI_CONFIG.spacing.medium - 4 // 12px
  },
  categoryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: UI_CONFIG.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  categoryName: { 
    color: APP_COLORS.white, 
    fontSize: UI_CONFIG.fontSize.small
  },
  categoryHours: { 
    color: APP_COLORS.success, 
    fontSize: UI_CONFIG.fontSize.small, 
    fontWeight: UI_CONFIG.fontWeight.semibold
  },
  sectionTitle: { 
    color: APP_COLORS.white, 
    fontSize: UI_CONFIG.fontSize.large, 
    fontWeight: UI_CONFIG.fontWeight.semibold, 
    marginBottom: UI_CONFIG.spacing.medium
  },
  logsContainer: { 
    paddingVertical: UI_CONFIG.spacing.small
  },
  viewAllText: { 
    color: APP_COLORS.textMuted, 
    textAlign: 'center', 
    marginTop: UI_CONFIG.spacing.medium,
    fontSize: UI_CONFIG.fontSize.xsmall
  },
});


