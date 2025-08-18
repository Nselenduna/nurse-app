import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { APP_COLORS } from '../../constants';
import { UI_CONFIG } from '../../constants/ui';

interface ScreenLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  refreshable?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  title,
  subtitle,
  children,
  loading = false,
  refreshable = false,
  onRefresh,
  refreshing = false
}) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[APP_COLORS.primary, APP_COLORS.secondary, APP_COLORS.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={APP_COLORS.white} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[APP_COLORS.primary, APP_COLORS.secondary, APP_COLORS.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          refreshable && onRefresh ? (
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={APP_COLORS.white}
              colors={[APP_COLORS.white]}
            />
          ) : undefined
        }
      >
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  background: { 
    ...StyleSheet.absoluteFillObject 
  },
  content: { 
    flex: 1, 
    padding: UI_CONFIG.spacing.medium
  },
  contentContainer: {
    paddingBottom: UI_CONFIG.spacing.large,
  },
  title: { 
    fontSize: UI_CONFIG.fontSize.xxlarge, 
    fontWeight: UI_CONFIG.fontWeight.bold, 
    color: APP_COLORS.white, 
    textAlign: 'center', 
    marginTop: UI_CONFIG.spacing.large, 
    marginBottom: UI_CONFIG.spacing.small
  },
  subtitle: { 
    fontSize: UI_CONFIG.fontSize.medium, 
    color: APP_COLORS.textSecondary, 
    textAlign: 'center', 
    marginBottom: UI_CONFIG.spacing.large
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: APP_COLORS.white,
    fontSize: UI_CONFIG.fontSize.medium,
    marginTop: UI_CONFIG.spacing.medium,
  },
});
