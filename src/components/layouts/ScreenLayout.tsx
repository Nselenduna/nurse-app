import { APP_COLORS } from '@/src/constants';
import { UI_CONFIG } from '@/src/constants/ui';
import { ScreenProps } from '@/src/types/ui';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text
} from 'react-native';

/**
 * A consistent layout component for all screens in the application
 * Provides common styling, background gradient, and scroll behavior
 * 
 * @param {ScreenProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
export function ScreenLayout({
  title,
  subtitle,
  loading = false,
  refreshable = false,
  onRefresh,
  children,
}: ScreenProps) {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Background gradient */}
      <LinearGradient
        colors={[APP_COLORS.primary, APP_COLORS.secondary, APP_COLORS.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      {/* Main content area */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          refreshable ? (
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              tintColor={APP_COLORS.white}
              colors={[APP_COLORS.white]}
            />
          ) : undefined
        }
      >
        {/* Optional title and subtitle */}
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        {/* Main content */}
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: UI_CONFIG.spacing.medium,
  },
  contentContainer: {
    paddingBottom: UI_CONFIG.spacing.large,
  },
  title: {
    fontSize: UI_CONFIG.fontSize.xxxlarge,
    fontWeight: UI_CONFIG.fontWeight.bold,
    color: APP_COLORS.white,
    textAlign: 'center',
    marginTop: UI_CONFIG.spacing.large,
    marginBottom: UI_CONFIG.spacing.small,
  },
  subtitle: {
    fontSize: UI_CONFIG.fontSize.medium,
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: UI_CONFIG.spacing.large,
  },
});
