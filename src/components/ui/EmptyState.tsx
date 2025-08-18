import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { APP_COLORS } from '../../constants';
import { UI_CONFIG } from '../../constants/ui';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = memo(({
  icon,
  title,
  subtitle,
  actionText,
  onAction
}) => (
  <View style={styles.emptyState}>
    <Ionicons 
      name={icon as any} 
      size={UI_CONFIG.iconSize.xxlarge} 
      color="rgba(255,255,255,0.5)" 
    />
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptySubtitle}>{subtitle}</Text>
    {actionText && onAction && (
      <TouchableOpacity 
        style={styles.ctaButton}
        onPress={onAction}
        activeOpacity={0.8}
      >
        <Text style={styles.ctaButtonText}>{actionText}</Text>
      </TouchableOpacity>
    )}
  </View>
));

EmptyState.displayName = 'EmptyState';

export const DashboardEmptyState: React.FC<{ onAction: () => void }> = memo(({ onAction }) => (
  <EmptyState
    icon="add-circle-outline"
    title="Start Your CPD Journey"
    subtitle="Begin logging your professional development activities to track your revalidation progress"
    actionText="Log First Activity"
    onAction={onAction}
  />
));

DashboardEmptyState.displayName = 'DashboardEmptyState';

export const CpdEmptyState: React.FC = memo(() => (
  <EmptyState
    icon="document-text-outline"
    title="No CPD entries yet"
    subtitle="Start logging your professional development activities from the Log tab"
  />
));

CpdEmptyState.displayName = 'CpdEmptyState';

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: UI_CONFIG.spacing.xlarge,
  },
  emptyTitle: {
    color: APP_COLORS.white,
    fontSize: UI_CONFIG.fontSize.large,
    fontWeight: UI_CONFIG.fontWeight.semibold,
    marginTop: UI_CONFIG.spacing.medium,
    marginBottom: UI_CONFIG.spacing.small,
    textAlign: 'center'
  },
  emptySubtitle: {
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
    fontSize: UI_CONFIG.fontSize.small,
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: UI_CONFIG.spacing.large
  },
  ctaButton: {
    backgroundColor: APP_COLORS.white,
    paddingHorizontal: UI_CONFIG.spacing.large,
    paddingVertical: UI_CONFIG.spacing.medium - 4,
    borderRadius: UI_CONFIG.borderRadius.medium
  },
  ctaButtonText: {
    color: APP_COLORS.primary,
    fontWeight: UI_CONFIG.fontWeight.semibold,
    fontSize: UI_CONFIG.fontSize.medium
  },
});
