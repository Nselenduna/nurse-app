import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { APP_COLORS } from '../../constants';
import { UI_CONFIG } from '../../constants/ui';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = memo(({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
));

Section.displayName = 'Section';

const styles = StyleSheet.create({
  section: {
    marginBottom: UI_CONFIG.spacing.large,
  },
  sectionTitle: {
    color: APP_COLORS.white,
    fontSize: UI_CONFIG.fontSize.large,
    fontWeight: UI_CONFIG.fontWeight.semibold,
    marginBottom: UI_CONFIG.spacing.medium,
  },
});
