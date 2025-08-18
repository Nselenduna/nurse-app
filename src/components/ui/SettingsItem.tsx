import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { APP_COLORS } from '../../constants';
import { UI_CONFIG } from '../../constants/ui';

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  destructive?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = memo(({
  icon,
  title,
  subtitle,
  onPress,
  destructive = false
}) => (
  <TouchableOpacity
    style={[
      styles.settingsItem,
      destructive && styles.destructiveItem
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.settingsItemLeft}>
      <View style={[
        styles.settingsIcon,
        destructive && styles.destructiveIcon
      ]}>
        <Ionicons 
          name={icon as any} 
          size={UI_CONFIG.iconSize.medium} 
          color={destructive ? APP_COLORS.error : APP_COLORS.info} 
        />
      </View>
      <View style={styles.settingsText}>
        <Text style={[
          styles.settingsTitle,
          destructive && styles.destructiveText
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.settingsSubtitle,
          destructive && styles.destructiveSubtitle
        ]}>
          {subtitle}
        </Text>
      </View>
    </View>
    <Ionicons 
      name="chevron-forward" 
      size={UI_CONFIG.iconSize.small} 
      color={destructive ? APP_COLORS.error : APP_COLORS.textMuted} 
    />
  </TouchableOpacity>
));

SettingsItem.displayName = 'SettingsItem';

const styles = StyleSheet.create({
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: APP_COLORS.background,
    borderRadius: UI_CONFIG.borderRadius.medium,
    padding: UI_CONFIG.spacing.medium,
    marginBottom: UI_CONFIG.spacing.small,
  },
  destructiveItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: UI_CONFIG.spacing.medium,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  destructiveIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  settingsText: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: UI_CONFIG.fontSize.medium,
    fontWeight: UI_CONFIG.fontWeight.semibold,
    color: APP_COLORS.white,
  },
  destructiveText: {
    color: APP_COLORS.error,
  },
  settingsSubtitle: {
    color: APP_COLORS.textSecondary,
    fontSize: UI_CONFIG.fontSize.small,
    marginTop: UI_CONFIG.spacing.xsmall / 2,
  },
  destructiveSubtitle: {
    color: 'rgba(239, 68, 68, 0.8)',
  },
});
