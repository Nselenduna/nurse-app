import { APP_COLORS } from '@/src/constants';
import { UI_CONFIG } from '@/src/constants/ui';
import { ButtonProps } from '@/src/types/ui';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

/**
 * Primary button component with consistent styling
 * 
 * @param {ButtonProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
export function Button({
  label,
  onPress,
  icon,
  loading = false,
  disabled = false,
  destructive = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  // Determine button style based on props
  const buttonStyle = [
    styles.button,
    destructive && styles.destructiveButton,
    (disabled || loading) && styles.disabledButton,
    style,
  ];

  // Determine text style based on props
  const textStyle = [
    styles.buttonText,
    destructive && styles.destructiveText,
    (disabled || loading) && styles.disabledText,
  ];

  // Determine icon color based on props
  const iconColor = destructive
    ? APP_COLORS.white
    : disabled || loading
    ? APP_COLORS.textMuted
    : APP_COLORS.white;

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityRole="button"
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={APP_COLORS.white} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={UI_CONFIG.iconSize.medium}
              color={iconColor}
              style={styles.icon}
            />
          )}
          <Text style={textStyle}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

/**
 * Secondary button with outline styling
 * 
 * @param {ButtonProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
export function OutlineButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      style={[styles.outlineButton, props.style]}
    />
  );
}

/**
 * Icon-only button for compact UI elements
 * 
 * @param {Omit<ButtonProps, 'label'> & { icon: IconName }} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
export function IconButton({
  icon,
  onPress,
  loading = false,
  disabled = false,
  destructive = false,
  style,
  accessibilityLabel,
}: Omit<ButtonProps, 'label'> & { icon: NonNullable<ButtonProps['icon']> }) {
  return (
    <TouchableOpacity
      style={[
        styles.iconButton,
        destructive && styles.destructiveButton,
        (disabled || loading) && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={APP_COLORS.white} />
      ) : (
        <Ionicons
          name={icon}
          size={UI_CONFIG.iconSize.medium}
          color={
            destructive
              ? APP_COLORS.white
              : disabled
              ? APP_COLORS.textMuted
              : APP_COLORS.white
          }
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: APP_COLORS.primary,
    paddingVertical: UI_CONFIG.spacing.medium,
    paddingHorizontal: UI_CONFIG.spacing.large,
    borderRadius: UI_CONFIG.borderRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: APP_COLORS.primary,
  },
  destructiveButton: {
    backgroundColor: APP_COLORS.error,
  },
  disabledButton: {
    backgroundColor: APP_COLORS.textMuted,
    opacity: 0.7,
  },
  buttonText: {
    color: APP_COLORS.white,
    fontSize: UI_CONFIG.fontSize.medium,
    fontWeight: UI_CONFIG.fontWeight.semibold,
    textAlign: 'center',
  },
  destructiveText: {
    color: APP_COLORS.white,
  },
  disabledText: {
    color: APP_COLORS.textSecondary,
  },
  icon: {
    marginRight: UI_CONFIG.spacing.small,
  },
  iconButton: {
    backgroundColor: APP_COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
