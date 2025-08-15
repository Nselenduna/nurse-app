import { APP_COLORS } from '@/src/constants';
import { UI_CONFIG } from '@/src/constants/ui';
import { SectionProps } from '@/src/types/ui';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * A reusable section component with consistent styling
 * Used to group related content with a title
 * 
 * @param {SectionProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
export function Section({ title, subtitle, children }: SectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

/**
 * A section variant with a card-like background
 * 
 * @param {SectionProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
export function CardSection({ title, subtitle, children }: SectionProps) {
  return (
    <View style={[styles.container, styles.cardContainer]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: UI_CONFIG.spacing.large,
  },
  cardContainer: {
    backgroundColor: APP_COLORS.background,
    borderRadius: UI_CONFIG.borderRadius.large,
    padding: UI_CONFIG.spacing.large,
  },
  header: {
    marginBottom: UI_CONFIG.spacing.medium,
  },
  title: {
    color: APP_COLORS.white,
    fontSize: UI_CONFIG.fontSize.large,
    fontWeight: UI_CONFIG.fontWeight.semibold,
  },
  subtitle: {
    color: APP_COLORS.textSecondary,
    fontSize: UI_CONFIG.fontSize.small,
    marginTop: UI_CONFIG.spacing.xsmall,
  },
  content: {
    // Content styling is minimal to allow flexibility in children
  },
});
