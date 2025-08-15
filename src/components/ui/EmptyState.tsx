import { APP_COLORS } from '@/src/constants';
import { STRINGS } from '@/src/constants/strings';
import { UI_CONFIG } from '@/src/constants/ui';
import { EmptyStateProps } from '@/src/types/ui';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * A consistent empty state component for when there is no data to display
 * 
 * @param {EmptyStateProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {/* Large icon to draw attention */}
      <Ionicons
        name={icon}
        size={UI_CONFIG.iconSize.xxxlarge}
        color="rgba(255,255,255,0.5)"
      />

      {/* Clear, action-oriented heading */}
      <Text style={styles.title}>{title}</Text>

      {/* Explanatory text to guide the user */}
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* Optional call-to-action button */}
      {actionLabel && onAction && (
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={onAction}
          activeOpacity={0.8}
          accessibilityLabel={actionLabel}
          accessibilityRole="button"
        >
          <Text style={styles.ctaButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/**
 * Predefined empty state for the dashboard screen
 * 
 * @param {{ onAction?: () => void }} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
export function DashboardEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="add-circle-outline"
      title={STRINGS.emptyStates.dashboard.title}
      subtitle={STRINGS.emptyStates.dashboard.subtitle}
      actionLabel={STRINGS.buttons.logFirst}
      onAction={onAction}
    />
  );
}

/**
 * Predefined empty state for the CPD portfolio screen
 * 
 * @param {{ onAction?: () => void }} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
export function CpdEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="document-text-outline"
      title={STRINGS.emptyStates.cpd.title}
      subtitle={STRINGS.emptyStates.cpd.subtitle}
      actionLabel={STRINGS.buttons.logFirst}
      onAction={onAction}
    />
  );
}

/**
 * Predefined empty state for search results
 * 
 * @returns {React.ReactElement} Rendered component
 */
export function SearchEmptyState() {
  return (
    <EmptyState
      icon="search"
      title={STRINGS.emptyStates.search.title}
      subtitle={STRINGS.emptyStates.search.subtitle}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: UI_CONFIG.spacing.xlarge,
  },
  title: {
    color: APP_COLORS.white,
    fontSize: UI_CONFIG.fontSize.large,
    fontWeight: UI_CONFIG.fontWeight.semibold,
    marginTop: UI_CONFIG.spacing.medium,
    marginBottom: UI_CONFIG.spacing.small,
    textAlign: 'center',
  },
  subtitle: {
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
    fontSize: UI_CONFIG.fontSize.small,
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: UI_CONFIG.spacing.large,
  },
  ctaButton: {
    backgroundColor: APP_COLORS.white,
    paddingHorizontal: UI_CONFIG.spacing.large,
    paddingVertical: UI_CONFIG.spacing.medium,
    borderRadius: UI_CONFIG.borderRadius.medium,
  },
  ctaButtonText: {
    color: APP_COLORS.primary,
    fontWeight: UI_CONFIG.fontWeight.semibold,
    fontSize: UI_CONFIG.fontSize.medium,
  },
});
