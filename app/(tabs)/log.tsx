import CategorySelector from '@/src/components/CategorySelector';
import CpdLogCard from '@/src/components/CpdLogCard';
import { ScreenLayout } from '@/src/components/layouts/ScreenLayout';
import { APP_COLORS, CPD_CATEGORIES } from '@/src/constants';
import { STRINGS } from '@/src/constants/strings';
import { UI_CONFIG } from '@/src/constants/ui';
import { VOICE_SIMULATION, getRandomVoiceSample } from '@/src/constants/voice';
import { useCpd } from '@/src/hooks/useCpd';
import { CpdCategory } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function LogScreen() {
  const { addLog, logs, loading } = useCpd();
  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CpdCategory>(CPD_CATEGORIES[0]);
  const [hours, setHours] = useState('1');
  const [isRecording, setIsRecording] = useState(false);

  // Memoized recent logs for better performance
  const recentLogs = useMemo(() => logs.slice(0, 5), [logs]);

  const simulateVoiceInput = useCallback(() => {
    setIsRecording(true);
    // Simulate voice processing delay
    setTimeout(() => {
      const randomText = getRandomVoiceSample();
      setInput(randomText);
      setIsRecording(false);
      Alert.alert(
        VOICE_SIMULATION.alerts.successTitle, 
        VOICE_SIMULATION.alerts.successMessage
      );
    }, VOICE_SIMULATION.processingDelay);
  }, []);

  const handleAddLog = useCallback(async () => {
    if (!input.trim()) return;
    
    try {
      await addLog({
        text: input.trim(),
        category: selectedCategory,
        hours: parseFloat(hours) || 1,
        isVoiceGenerated: isRecording,
        tags: [selectedCategory.toLowerCase().replace(/\s+/g, '_')],
      });
      
      setInput('');
      Alert.alert(STRINGS.alerts.titles.success, STRINGS.alerts.success.logAdded);
    } catch (error) {
      Alert.alert(STRINGS.alerts.titles.error, STRINGS.alerts.error.logAdd);
    }
  }, [input, selectedCategory, hours, isRecording, addLog]);

  const handleCategorySelect = useCallback((category: CpdCategory) => {
    setSelectedCategory(category);
  }, []);

  const renderRecentLog = useCallback(({ item }: { item: any }) => (
    <CpdLogCard log={item} />
  ), []);

  const keyExtractor = useCallback((item: any) => item.id, []);

  return (
    <ScreenLayout
      title={STRINGS.screens.log.title}
      subtitle={STRINGS.screens.log.subtitle}
      loading={loading}
    >      
      <CategorySelector
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      
      <View style={styles.hoursContainer}>
        <Text style={styles.hoursLabel}>{STRINGS.labels.hours}</Text>
        <TextInput
          value={hours}
          onChangeText={setHours}
          style={styles.hoursInput}
          keyboardType="numeric"
          placeholder={STRINGS.placeholders.hours}
          placeholderTextColor={APP_COLORS.textMuted}
        />
      </View>

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={STRINGS.placeholders.activityDescription}
          placeholderTextColor={APP_COLORS.textMuted}
          style={styles.input}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[
            styles.voiceButton, 
            isRecording && styles.voiceButtonRecording
          ]} 
          onPress={simulateVoiceInput}
          disabled={isRecording || loading}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isRecording ? "mic" : "mic-outline"} 
            size={UI_CONFIG.iconSize.large} 
            color={isRecording ? APP_COLORS.white : APP_COLORS.primary} 
          />
          <Text style={[
            styles.voiceButtonText, 
            isRecording && styles.voiceButtonTextRecording
          ]}>
            {isRecording ? STRINGS.buttons.recording : STRINGS.buttons.voiceInput}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
          onPress={handleAddLog}
          disabled={loading || !input.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {loading ? STRINGS.buttons.saving : STRINGS.buttons.save}
          </Text>
        </TouchableOpacity>
      </View>

      {recentLogs.length > 0 && (
        <>
          <Text style={styles.recentLabel}>{STRINGS.sections.recentActivities}:</Text>
          <FlatList
            data={recentLogs}
            keyExtractor={keyExtractor}
            renderItem={renderRecentLog}
            contentContainerStyle={styles.recentList}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={5}
          />
        </>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hoursContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: UI_CONFIG.spacing.medium
  },
  hoursLabel: { 
    color: APP_COLORS.white, 
    fontSize: UI_CONFIG.fontSize.medium, 
    fontWeight: UI_CONFIG.fontWeight.semibold, 
    marginRight: UI_CONFIG.spacing.medium - 4 // 12px
  },
  hoursInput: { 
    backgroundColor: APP_COLORS.background, 
    color: APP_COLORS.white, 
    borderRadius: UI_CONFIG.borderRadius.small, 
    paddingHorizontal: UI_CONFIG.spacing.medium - 4, // 12px
    paddingVertical: UI_CONFIG.spacing.small,
    width: 60,
    textAlign: 'center'
  },
  inputRow: { 
    marginBottom: UI_CONFIG.spacing.medium
  },
  input: { 
    backgroundColor: APP_COLORS.background, 
    color: APP_COLORS.white, 
    borderRadius: UI_CONFIG.borderRadius.medium, 
    paddingHorizontal: UI_CONFIG.spacing.medium, 
    paddingVertical: UI_CONFIG.spacing.medium - 4, // 12px
    minHeight: 80,
    textAlignVertical: 'top'
  },
  buttonRow: { 
    flexDirection: 'row', 
    gap: UI_CONFIG.spacing.medium - 4, // 12px
    marginBottom: UI_CONFIG.spacing.large - 4 // 20px
  },
  voiceButton: { 
    flex: 1, 
    backgroundColor: APP_COLORS.white, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: UI_CONFIG.spacing.medium - 4, // 12px
    borderRadius: UI_CONFIG.borderRadius.medium,
    gap: UI_CONFIG.spacing.small
  },
  voiceButtonRecording: { 
    backgroundColor: APP_COLORS.error 
  },
  voiceButtonText: { 
    color: APP_COLORS.primary, 
    fontWeight: UI_CONFIG.fontWeight.semibold
  },
  voiceButtonTextRecording: { 
    color: APP_COLORS.white 
  },
  saveButton: { 
    flex: 1, 
    backgroundColor: APP_COLORS.primary, 
    paddingVertical: UI_CONFIG.spacing.medium - 4, // 12px
    borderRadius: UI_CONFIG.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveButtonDisabled: {
    backgroundColor: APP_COLORS.textMuted,
  },
  saveButtonText: { 
    color: APP_COLORS.white, 
    fontWeight: UI_CONFIG.fontWeight.semibold
  },
  recentLabel: { 
    color: APP_COLORS.white, 
    fontSize: UI_CONFIG.fontSize.medium, 
    fontWeight: UI_CONFIG.fontWeight.semibold, 
    marginBottom: UI_CONFIG.spacing.small
  },
  recentList: { 
    paddingTop: UI_CONFIG.spacing.small
  },
});


