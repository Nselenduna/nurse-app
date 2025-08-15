import { ScreenLayout } from '@/src/components/layouts/ScreenLayout';
import { Section } from '@/src/components/ui/Section';
import { SettingsItem } from '@/src/components/ui/SettingsItem';
import { APP_COLORS, REVALIDATION_REQUIREMENTS } from '@/src/constants';
import { STRINGS } from '@/src/constants/strings';
import { UI_CONFIG } from '@/src/constants/ui';
import { useCpd } from '@/src/hooks/useCpd';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function SettingsScreen() {
  const { 
    statistics, 
    exportData, 
    clearAll 
  } = useCpd();

  const handleClearAll = useCallback(async () => {
    Alert.alert(
      STRINGS.alerts.confirm.clearAll.title,
      STRINGS.alerts.confirm.clearAll.message,
      [
        { text: STRINGS.alerts.confirm.clearAll.cancelButton, style: 'cancel' },
        { 
          text: STRINGS.alerts.confirm.clearAll.confirmButton, 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAll();
              Alert.alert(STRINGS.alerts.titles.success, STRINGS.alerts.success.clear);
            } catch {
              Alert.alert(STRINGS.alerts.titles.error, STRINGS.alerts.error.clear);
            }
          }
        }
      ]
    );
  }, [clearAll]);

  const handleExportData = useCallback(async () => {
    try {
      const data = await exportData();
      // In a real app, you would share this data or save it to a file
      Alert.alert(STRINGS.alerts.titles.success, STRINGS.alerts.success.export);
      console.log('Exported data:', data);
    } catch {
      Alert.alert(STRINGS.alerts.titles.error, STRINGS.alerts.error.export);
    }
  }, [exportData]);

  const handleImportData = useCallback(async () => {
    Alert.alert(
      STRINGS.alerts.confirm.importData.title,
      STRINGS.alerts.confirm.importData.message,
      [
        { text: STRINGS.alerts.confirm.importData.cancelButton, style: 'cancel' },
        { 
          text: STRINGS.alerts.confirm.importData.confirmButton, 
          onPress: () => {
            // In a real app, you would open a file picker or paste data
            Alert.alert(STRINGS.alerts.titles.info, 'Import functionality would be implemented here');
          }
        }
      ]
    );
  }, []);



  const StatisticsSection = useCallback(() => (
    <Section title={STRINGS.sections.cpdSummary}>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{statistics.totalActivities}</Text>
          <Text style={styles.statLabel}>{STRINGS.labels.activities}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{statistics.totalHours.toFixed(1)}</Text>
          <Text style={styles.statLabel}>{STRINGS.labels.totalHours}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{statistics.voiceGeneratedCount}</Text>
          <Text style={styles.statLabel}>{STRINGS.labels.voiceLogs}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{Math.round(statistics.progressPercentage)}%</Text>
          <Text style={styles.statLabel}>{STRINGS.labels.progress}</Text>
        </View>
      </View>
    </Section>
  ), [statistics]);

  const RequirementsSection = useCallback(() => (
    <Section title={STRINGS.sections.requirements}>
      <View style={styles.requirementItem}>
        <Ionicons name="checkmark-circle" size={UI_CONFIG.iconSize.medium} color={APP_COLORS.success} />
        <Text style={styles.requirementText}>
          {REVALIDATION_REQUIREMENTS.targetHours} {STRINGS.requirements.targetHours}
        </Text>
      </View>
      
      <View style={styles.requirementItem}>
        <Ionicons name="checkmark-circle" size={UI_CONFIG.iconSize.medium} color={APP_COLORS.success} />
        <Text style={styles.requirementText}>
          {REVALIDATION_REQUIREMENTS.practiceHours} {STRINGS.requirements.practiceHours}
        </Text>
      </View>
      
      <View style={styles.requirementItem}>
        <Ionicons name="checkmark-circle" size={UI_CONFIG.iconSize.medium} color={APP_COLORS.success} />
        <Text style={styles.requirementText}>
          {REVALIDATION_REQUIREMENTS.participatoryLearning} {STRINGS.requirements.participatoryLearning}
        </Text>
      </View>
      
      <View style={styles.requirementItem}>
        <Ionicons name="checkmark-circle" size={UI_CONFIG.iconSize.medium} color={APP_COLORS.success} />
        <Text style={styles.requirementText}>
          {STRINGS.requirements.reflection}
        </Text>
      </View>
    </Section>
  ), []);

  return (
    <ScreenLayout
      title={STRINGS.screens.settings.title}
    >
      {StatisticsSection}
      {RequirementsSection}
      
      <Section title={STRINGS.sections.dataManagement}>
        <SettingsItem
          icon="download-outline"
          title={STRINGS.settingsItems.exportData.title}
          subtitle={STRINGS.settingsItems.exportData.subtitle}
          onPress={handleExportData}
        />
        <SettingsItem
          icon="upload-outline"
          title={STRINGS.settingsItems.importData.title}
          subtitle={STRINGS.settingsItems.importData.subtitle}
          onPress={handleImportData}
        />
        <SettingsItem
          icon="trash-outline"
          title={STRINGS.settingsItems.clearData.title}
          subtitle={STRINGS.settingsItems.clearData.subtitle}
          onPress={handleClearAll}
          destructive
        />
      </Section>
      
      <Section title={STRINGS.sections.appInformation}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{STRINGS.labels.version}</Text>
          <Text style={styles.infoValue}>{UI_CONFIG.version.number}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{STRINGS.labels.build}</Text>
          <Text style={styles.infoValue}>{UI_CONFIG.version.build}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{STRINGS.labels.dataStorage}</Text>
          <Text style={styles.infoValue}>{STRINGS.labels.localOnly}</Text>
        </View>
      </Section>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: UI_CONFIG.spacing.medium - 4 // 12px 
  },
  statItem: { 
    flex: 1, 
    minWidth: '45%', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderRadius: UI_CONFIG.borderRadius.medium, 
    padding: UI_CONFIG.spacing.medium 
  },
  statNumber: { 
    color: APP_COLORS.info, 
    fontSize: UI_CONFIG.fontSize.xlarge, 
    fontWeight: UI_CONFIG.fontWeight.bold 
  },
  statLabel: { 
    color: APP_COLORS.textSecondary, 
    fontSize: UI_CONFIG.fontSize.xsmall, 
    marginTop: UI_CONFIG.spacing.xsmall,
    textAlign: 'center'
  },
  
  // Requirements Section
  requirementItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: UI_CONFIG.spacing.medium - 4 // 12px 
  },
  requirementText: { 
    color: APP_COLORS.white, 
    fontSize: UI_CONFIG.fontSize.small, 
    marginLeft: UI_CONFIG.spacing.medium - 4, // 12px
    flex: 1
  },
  
  // Info Section
  infoItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: APP_COLORS.background, 
    borderRadius: UI_CONFIG.borderRadius.medium, 
    padding: UI_CONFIG.spacing.medium, 
    marginBottom: UI_CONFIG.spacing.small 
  },
  infoLabel: { 
    color: APP_COLORS.white, 
    fontSize: UI_CONFIG.fontSize.medium 
  },
  infoValue: { 
    color: APP_COLORS.textSecondary, 
    fontSize: UI_CONFIG.fontSize.medium 
  },
});


