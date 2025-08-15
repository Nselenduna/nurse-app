import { APP_COLORS } from '@/src/constants';
import { UI_CONFIG } from '@/src/constants/ui';
import { SettingsItemProps } from '@/src/types/ui';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * A consistent settings item component for use in settings screens
 * 
 * @param {SettingsItemProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
export function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  destructive = false,
  showChevron = true,
  accessibilityLabel,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityHint={subtitle}
    >
      <View style={styles.content}>
        {/* Icon container */}
        <View
          style={[
            styles.iconContainer,
            destructive && styles.destructiveIconContainer,
          ]}
        >
          <Ionicons
            name={icon}
            size={UI_CONFIG.iconSize.medium}
            color={destructive ? APP_COLORS.white : APP_COLORS.info}
          />
        </View>

        {/* Text content */}
        <View style={styles.textContainer}>
          <Text
            style={[styles.title, destructive && styles.destructiveTitle]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>

        {/* Chevron icon */}
        {showChevron && (
          <Ionicons
            name="chevron-forward"
            size={UI_CONFIG.iconSize.medium}
            color={APP_COLORS.textMuted}
            style={styles.chevron}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

/**
 * A variant of SettingsItem without an icon
 * 
 * @param {Omit<SettingsItemProps, 'icon'>} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
export function SimpleSettingsItem({
  title,
  subtitle,
  onPress,
  destructive = false,
  showChevron = true,
  accessibilityLabel,
}: Omit<SettingsItemProps, 'icon'>) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityHint={subtitle}
    >
      <View style={styles.content}>
        {/* Text content */}
        <View style={styles.textContainerNoIcon}>
          <Text
            style={[styles.title, destructive && styles.destructiveTitle]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>

        {/* Chevron icon */}
        {showChevron && (
          <Ionicons
            name="chevron-forward"
            size={UI_CONFIG.iconSize.medium}
            color={APP_COLORS.textMuted}
            style={styles.chevron}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

/**
 * A settings item that displays a value instead of a chevron
 * 
 * @param {Omit<SettingsItemProps, 'showChevron'> & { value: string }} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
export function ValueSettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  destructive = false,
  value,
  accessibilityLabel,
}: Omit<SettingsItemProps, 'showChevron'> & { value: string }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || `${title}: ${value}`}
      accessibilityRole="button"
      accessibilityHint={subtitle}
    >
      <View style={styles.content}>
        {/* Icon container */}
        <View
          style={[
            styles.iconContainer,
            destructive && styles.destructiveIconContainer,
          ]}
        >
          <Ionicons
            name={icon}
            size={UI_CONFIG.iconSize.medium}
            color={destructive ? APP_COLORS.white : APP_COLORS.info}
          />
        </View>

        {/* Text content */}
        <View style={styles.textContainer}>
          <Text
            style={[styles.title, destructive && styles.destructiveTitle]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>

        {/* Value text */}
        <Text style={styles.value}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: APP_COLORS.background,
    borderRadius: UI_CONFIG.borderRadius.medium,
    marginBottom: UI_CONFIG.spacing.small,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: UI_CONFIG.spacing.medium,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: UI_CONFIG.spacing.medium,
  },
  destructiveIconContainer: {
    backgroundColor: APP_COLORS.error,
  },
  textContainer: {
    flex: 1,
    marginRight: UI_CONFIG.spacing.small,
  },
  textContainerNoIcon: {
    flex: 1,
    marginRight: UI_CONFIG.spacing.small,
  },
  title: {
    color: APP_COLORS.white,
    fontSize: UI_CONFIG.fontSize.medium,
    fontWeight: UI_CONFIG.fontWeight.semibold,
    marginBottom: 2,
  },
  destructiveTitle: {
    color: APP_COLORS.error,
  },
  subtitle: {
    color: APP_COLORS.textSecondary,
    fontSize: UI_CONFIG.fontSize.small,
  },
  chevron: {
    marginLeft: UI_CONFIG.spacing.small,
  },
  value: {
    color: APP_COLORS.textSecondary,
    fontSize: UI_CONFIG.fontSize.medium,
    marginLeft: UI_CONFIG.spacing.small,
  },
});
