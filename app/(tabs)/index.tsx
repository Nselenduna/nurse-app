import CpdLogCard from '@/src/components/CpdLogCard';
import { ScreenLayout } from '@/src/components/layouts/ScreenLayout';
import { DashboardEmptyState } from '@/src/components/ui/EmptyState';
import { APP_COLORS, REVALIDATION_REQUIREMENTS } from '@/src/constants';
import { STRINGS } from '@/src/constants/strings';
import { UI_CONFIG } from '@/src/constants/ui';
import { useCpd } from '@/src/hooks/useCpd';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function DashboardScreen() {
  const router = useRouter();
  const { 
    logs, 
    statistics, 
    categoryBreakdown, 
    recentLogs 
  } = useCpd();

  // Define QuickActionButton component with memoization to prevent unnecessary re-renders
  // This is a performance optimization for components that don't need to re-render often
  const QuickActionButton = useMemo(() => {
    // Define a component within the memo to keep it stable across renders
    // This component is only recreated when dependencies in the dependency array change
    const ButtonComponent = ({ icon, title, subtitle, onPress, color }: {
      icon: string;
      title: string;
      subtitle: string;
      onPress: () => void;
      color: string;
    }) => (
      <TouchableOpacity style={styles.quickActionButton} onPress={onPress} activeOpacity={0.8}>
        <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
          {/* Cast to any is needed because Ionicons types don't include all possible icon names */}
          <Ionicons name={icon as any} size={UI_CONFIG.iconSize.large} color={APP_COLORS.white} />
        </View>
        <View style={styles.quickActionText}>
          <Text style={styles.quickActionTitle}>{title}</Text>
          <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
    );
    
    // Set display name for better debugging in React DevTools
    ButtonComponent.displayName = 'QuickActionButton';
    
    return ButtonComponent;
    // Empty dependency array means this component is created once and never recreated
  }, []);

  const ProgressSection = useMemo(() => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>Revalidation Progress</Text>
        <Text style={styles.progressTarget}>{REVALIDATION_REQUIREMENTS.targetHours}h required</Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${statistics.progressPercentage}%` }
          ]} 
        />
      </View>
      
      <View style={styles.progressStats}>
        <View style={styles.progressStat}>
          <Text style={styles.progressNumber}>{statistics.totalHours.toFixed(1)}</Text>
          <Text style={styles.progressLabel}>Hours Completed</Text>
        </View>
        <View style={styles.progressStat}>
          <Text style={styles.progressNumber}>{statistics.remainingHours.toFixed(1)}</Text>
          <Text style={styles.progressLabel}>Hours Remaining</Text>
        </View>
        <View style={styles.progressStat}>
          <Text style={styles.progressNumber}>{Math.round(statistics.progressPercentage)}%</Text>
          <Text style={styles.progressLabel}>Complete</Text>
        </View>
      </View>
    </View>
  ), [statistics]);

  const QuickActionsSection = useMemo(() => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        <QuickActionButton
          icon="mic"
          title="Voice Log"
          subtitle="Record CPD activity"
          onPress={() => router.push('/(tabs)/log')}
          color={APP_COLORS.info}
        />
        <QuickActionButton
          icon="pulse"
          title="View Portfolio"
          subtitle="See all activities"
          onPress={() => router.push('/(tabs)/cpd')}
          color={APP_COLORS.success}
        />
        <QuickActionButton
          icon="settings"
          title="Settings"
          subtitle="Manage data"
          onPress={() => router.push('/(tabs)/settings')}
          color={APP_COLORS.secondary}
        />
      </View>
    </View>
  ), [QuickActionButton, router]);

  // Memoize the RecentActivitiesSection to prevent unnecessary re-renders
  // This section only needs to update when recentLogs changes
  const RecentActivitiesSection = useMemo(() => {
    // Handle empty state - don't render anything if there are no logs
    // This prevents showing an empty section header with no content
    if (recentLogs.length === 0) return null;
    
    return (
      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {/* Limit to displaying only the 3 most recent logs to avoid cluttering the UI */}
        {recentLogs.slice(0, 3).map((activity) => (
          <CpdLogCard 
            key={activity.id} 
            log={activity} 
            style={styles.activityCard}
          />
        ))}
      </View>
    );
    // Only recalculate when recentLogs changes
  }, [recentLogs]);

  // Memoize the CategoryOverviewSection to prevent unnecessary re-renders
  // This section only needs to update when categoryBreakdown changes
  const CategoryOverviewSection = useMemo(() => {
    // Handle empty state - don't render anything if there are no categories
    // This prevents showing an empty section when the user has no logs
    if (Object.keys(categoryBreakdown).length === 0) return null;
    
    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.sectionTitle}>Category Overview</Text>
        {/* Convert the categoryBreakdown object to an array of [category, hours] pairs
            This allows us to map over it and create a row for each category */}
        {Object.entries(categoryBreakdown).map(([category, hours]) => (
          <View key={category} style={styles.categoryRow}>
            <Text style={styles.categoryName}>{category}</Text>
            {/* Format hours to 1 decimal place for readability */}
            <Text style={styles.categoryHours}>{hours.toFixed(1)}h</Text>
          </View>
        ))}
      </View>
    );
    // Only recalculate when categoryBreakdown changes
  }, [categoryBreakdown]);



  return (
    <ScreenLayout
      title={STRINGS.screens.dashboard.title}
      subtitle={STRINGS.screens.dashboard.subtitle}
    >
      {/* Conditionally render dashboard sections */}
      {/* Each section is a memoized component to optimize performance */}
      {ProgressSection}
      {QuickActionsSection}
      {RecentActivitiesSection}
      {CategoryOverviewSection}
      
      {/* Show empty state only when there are no logs */}
      {logs.length === 0 && <DashboardEmptyState onAction={() => router.push('/(tabs)/log')} />}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  
  // Progress Section
  progressContainer: { 
    backgroundColor: APP_COLORS.background, 
    borderRadius: UI_CONFIG.borderRadius.large, 
    padding: UI_CONFIG.spacing.large, 
    marginBottom: UI_CONFIG.spacing.large 
  },
  progressHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: UI_CONFIG.spacing.medium
  },
  progressTitle: { 
    color: APP_COLORS.white, 
    fontSize: UI_CONFIG.fontSize.large, 
    fontWeight: UI_CONFIG.fontWeight.semibold
  },
  progressTarget: { 
    color: APP_COLORS.textSecondary, 
    fontSize: UI_CONFIG.fontSize.small
  },
  progressBar: { 
    height: 8, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: UI_CONFIG.borderRadius.small / 2, 
    marginBottom: UI_CONFIG.spacing.medium
  },
  progressFill: { 
    height: '100%', 
    backgroundColor: APP_COLORS.success, 
    borderRadius: UI_CONFIG.borderRadius.small / 2
  },
  progressStats: { 
    flexDirection: 'row', 
    justifyContent: 'space-around' 
  },
  progressStat: { 
    alignItems: 'center' 
  },
  progressNumber: { 
    color: APP_COLORS.info, 
    fontSize: UI_CONFIG.fontSize.xlarge, 
    fontWeight: UI_CONFIG.fontWeight.bold
  },
  progressLabel: { 
    color: APP_COLORS.textSecondary, 
    fontSize: UI_CONFIG.fontSize.xsmall, 
    marginTop: UI_CONFIG.spacing.xsmall
  },

  // Quick Actions
  quickActionsContainer: { 
    marginBottom: UI_CONFIG.spacing.large 
  },
  sectionTitle: { 
    color: APP_COLORS.white, 
    fontSize: UI_CONFIG.fontSize.large, 
    fontWeight: UI_CONFIG.fontWeight.semibold, 
    marginBottom: UI_CONFIG.spacing.medium
  },
  quickActionsGrid: { 
    gap: UI_CONFIG.spacing.medium - 4 // 12px
  },
  quickActionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: APP_COLORS.background, 
    borderRadius: UI_CONFIG.borderRadius.medium, 
    padding: UI_CONFIG.spacing.medium
  },
  quickActionIcon: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: UI_CONFIG.spacing.medium
  },
  quickActionText: { 
    flex: 1 
  },
  quickActionTitle: { 
    color: APP_COLORS.white, 
    fontSize: UI_CONFIG.fontSize.medium, 
    fontWeight: UI_CONFIG.fontWeight.semibold
  },
  quickActionSubtitle: { 
    color: APP_COLORS.textSecondary, 
    fontSize: UI_CONFIG.fontSize.small, 
    marginTop: UI_CONFIG.spacing.xsmall / 2 // 2px
  },

  // Recent Activities
  recentContainer: { 
    marginBottom: UI_CONFIG.spacing.large 
  },
  activityCard: { 
    marginBottom: UI_CONFIG.spacing.medium - 4 // 12px
  },

  // Category Overview
  categoryContainer: { 
    marginBottom: UI_CONFIG.spacing.large 
  },
  categoryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: UI_CONFIG.spacing.medium - 4, // 12px
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
});


