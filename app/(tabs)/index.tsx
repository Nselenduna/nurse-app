import CpdLogCard from '@/src/components/CpdLogCard';
import { APP_COLORS, REVALIDATION_REQUIREMENTS } from '@/src/constants';
import { useCpd } from '@/src/hooks/useCpd';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
    ScrollView,
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
          <Ionicons name={icon as any} size={24} color={APP_COLORS.white} />
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

  // Memoize the EmptyState component that's shown when there are no logs
  // This provides a helpful onboarding experience for new users
  const EmptyState = useMemo(() => (
    <View style={styles.emptyState}>
      {/* Large icon to draw attention */}
      <Ionicons name="add-circle-outline" size={64} color="rgba(255,255,255,0.5)" />
      
      {/* Clear, action-oriented heading */}
      <Text style={styles.emptyTitle}>Start Your CPD Journey</Text>
      
      {/* Explanatory text to guide the user */}
      <Text style={styles.emptySubtitle}>
        Begin logging your professional development activities to track your revalidation progress
      </Text>
      
      {/* Call-to-action button that navigates to the logging screen */}
      <TouchableOpacity 
        style={styles.ctaButton}
        onPress={() => router.push('/(tabs)/log')}
        activeOpacity={0.8}
      >
        <Text style={styles.ctaButtonText}>Log First Activity</Text>
      </TouchableOpacity>
    </View>
  ), [router]); // Only recreate when router changes

  return (
    <View style={styles.container}>
      {/* Background gradient that spans the entire screen */}
      <LinearGradient
        colors={[APP_COLORS.primary, APP_COLORS.secondary, APP_COLORS.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />
      
      {/* Main scrollable content area */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false} // Hide scrollbar for cleaner UI
        contentContainerStyle={styles.contentContainer}
      >
        {/* Dashboard header */}
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Track your revalidation journey</Text>

        {/* Conditionally render dashboard sections */}
        {/* Each section is a memoized component to optimize performance */}
        {ProgressSection}
        {QuickActionsSection}
        {RecentActivitiesSection}
        {CategoryOverviewSection}
        
        {/* Show empty state only when there are no logs */}
        {/* This is a conditional rendering pattern for handling empty states */}
        {logs.length === 0 && EmptyState}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  background: { 
    ...StyleSheet.absoluteFillObject 
  },
  content: { 
    flex: 1, 
    padding: 16 
  },
  contentContainer: {
    paddingBottom: 24,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: APP_COLORS.white, 
    textAlign: 'center', 
    marginTop: 24, 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    color: APP_COLORS.textSecondary, 
    textAlign: 'center', 
    marginBottom: 24 
  },
  
  // Progress Section
  progressContainer: { 
    backgroundColor: APP_COLORS.background, 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 24 
  },
  progressHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  progressTitle: { 
    color: APP_COLORS.white, 
    fontSize: 18, 
    fontWeight: '600' 
  },
  progressTarget: { 
    color: APP_COLORS.textSecondary, 
    fontSize: 14 
  },
  progressBar: { 
    height: 8, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 4, 
    marginBottom: 16 
  },
  progressFill: { 
    height: '100%', 
    backgroundColor: APP_COLORS.success, 
    borderRadius: 4 
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
    fontSize: 20, 
    fontWeight: '700' 
  },
  progressLabel: { 
    color: APP_COLORS.textSecondary, 
    fontSize: 12, 
    marginTop: 4 
  },

  // Quick Actions
  quickActionsContainer: { 
    marginBottom: 24 
  },
  sectionTitle: { 
    color: APP_COLORS.white, 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 16 
  },
  quickActionsGrid: { 
    gap: 12 
  },
  quickActionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: APP_COLORS.background, 
    borderRadius: 12, 
    padding: 16 
  },
  quickActionIcon: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16 
  },
  quickActionText: { 
    flex: 1 
  },
  quickActionTitle: { 
    color: APP_COLORS.white, 
    fontSize: 16, 
    fontWeight: '600' 
  },
  quickActionSubtitle: { 
    color: APP_COLORS.textSecondary, 
    fontSize: 14, 
    marginTop: 2 
  },

  // Recent Activities
  recentContainer: { 
    marginBottom: 24 
  },
  activityCard: { 
    marginBottom: 12 
  },

  // Category Overview
  categoryContainer: { 
    marginBottom: 24 
  },
  categoryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  categoryName: { 
    color: APP_COLORS.white, 
    fontSize: 14 
  },
  categoryHours: { 
    color: APP_COLORS.success, 
    fontSize: 14, 
    fontWeight: '600' 
  },

  // Empty State
  emptyState: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 40 
  },
  emptyTitle: { 
    color: APP_COLORS.white, 
    fontSize: 18, 
    fontWeight: '600', 
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center'
  },
  emptySubtitle: { 
    color: APP_COLORS.textSecondary, 
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: 24
  },
  ctaButton: { 
    backgroundColor: APP_COLORS.white, 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 12 
  },
  ctaButtonText: { 
    color: APP_COLORS.primary, 
    fontWeight: '600', 
    fontSize: 16 
  },
});


