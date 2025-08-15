import { ScreenLayout } from '@/src/components/layouts/ScreenLayout';
import { Section } from '@/src/components/ui/Section';
import { APP_COLORS } from '@/src/constants';
import { UI_CONFIG } from '@/src/constants/ui';
import SensitiveDataService, { UserCredentials } from '@/src/services/SensitiveDataService';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

/**
 * Example screen demonstrating the use of secure storage
 */
export default function SecureStorageExample() {
  // State for demo data
  const [nmcNumber, setNmcNumber] = useState('');
  const [pin, setPin] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [secureData, setSecureData] = useState<UserCredentials | null>(null);

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load user credentials
        const credentials = await SensitiveDataService.getUserCredentials();
        if (credentials) {
          setSecureData(credentials);
          setNmcNumber(credentials.nmcNumber);
        }
        
        // Load PIN code
        const savedPin = await SensitiveDataService.getPinCode();
        if (savedPin) {
          setPin(savedPin);
        }
        
        // Load biometric preference
        const bioEnabled = await SensitiveDataService.getBiometricEnabled();
        setBiometricEnabled(bioEnabled);
      } catch (error) {
        console.error('Error loading saved data:', error);
        Alert.alert('Error', 'Failed to load saved data');
      } finally {
        setLoading(false);
      }
    };

    loadSavedData();
  }, []);

  // Save user credentials
  const handleSaveCredentials = useCallback(async () => {
    if (!nmcNumber) {
      Alert.alert('Error', 'Please enter an NMC number');
      return;
    }

    try {
      setLoading(true);
      
      // Generate a random user ID for demo
      const userId = `user_${Math.floor(Math.random() * 10000)}`;
      
      // Save credentials using SensitiveDataService
      await SensitiveDataService.saveUserCredentials({
        nmcNumber,
        userId,
      });
      
      // Refresh displayed secure data
      const credentials = await SensitiveDataService.getUserCredentials();
      setSecureData(credentials);
      
      Alert.alert('Success', 'Credentials saved securely');
    } catch (error) {
      console.error('Error saving credentials:', error);
      Alert.alert('Error', 'Failed to save credentials');
    } finally {
      setLoading(false);
    }
  }, [nmcNumber]);

  // Save PIN code
  const handleSavePin = useCallback(async () => {
    if (!pin || pin.length < 4) {
      Alert.alert('Error', 'Please enter a PIN with at least 4 digits');
      return;
    }

    try {
      setLoading(true);
      await SensitiveDataService.savePinCode(pin);
      Alert.alert('Success', 'PIN saved securely');
    } catch (error) {
      console.error('Error saving PIN:', error);
      Alert.alert('Error', 'Failed to save PIN');
    } finally {
      setLoading(false);
    }
  }, [pin]);

  // Toggle biometric authentication
  const handleToggleBiometric = useCallback(async (value: boolean) => {
    try {
      setLoading(true);
      await SensitiveDataService.setBiometricEnabled(value);
      setBiometricEnabled(value);
    } catch (error) {
      console.error('Error setting biometric preference:', error);
      Alert.alert('Error', 'Failed to update biometric preference');
      // Revert the switch if saving failed
      setBiometricEnabled(!value);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear all sensitive data
  const handleClearData = useCallback(async () => {
    try {
      setLoading(true);
      await SensitiveDataService.clearAllSensitiveData();
      
      // Clear local state
      setNmcNumber('');
      setPin('');
      setBiometricEnabled(false);
      setSecureData(null);
      
      Alert.alert('Success', 'All sensitive data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('Error', 'Failed to clear sensitive data');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ScreenLayout
      title="Secure Storage"
      subtitle="Demo of encrypted storage capabilities"
      loading={loading}
    >
      <Section title="User Credentials">
        <View style={styles.inputContainer}>
          <Text style={styles.label}>NMC Number</Text>
          <TextInput
            value={nmcNumber}
            onChangeText={setNmcNumber}
            style={styles.input}
            placeholder="Enter NMC number"
            placeholderTextColor={APP_COLORS.textMuted}
          />
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleSaveCredentials}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Save Credentials</Text>
        </TouchableOpacity>
      </Section>
      
      <Section title="App Security">
        <View style={styles.inputContainer}>
          <Text style={styles.label}>PIN Code</Text>
          <TextInput
            value={pin}
            onChangeText={setPin}
            style={styles.input}
            placeholder="Enter PIN"
            placeholderTextColor={APP_COLORS.textMuted}
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleSavePin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Save PIN</Text>
        </TouchableOpacity>
        
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Enable Biometric Authentication</Text>
          <Switch
            value={biometricEnabled}
            onValueChange={handleToggleBiometric}
            trackColor={{ false: APP_COLORS.textMuted, true: APP_COLORS.primary }}
            disabled={loading}
          />
        </View>
      </Section>
      
      <Section title="Stored Secure Data">
        {secureData ? (
          <View style={styles.dataContainer}>
            <Text style={styles.dataLabel}>NMC Number:</Text>
            <Text style={styles.dataValue}>{secureData.nmcNumber}</Text>
            
            <Text style={styles.dataLabel}>User ID:</Text>
            <Text style={styles.dataValue}>{secureData.userId}</Text>
            
            <Text style={styles.dataLabel}>PIN Set:</Text>
            <Text style={styles.dataValue}>{pin ? 'Yes' : 'No'}</Text>
            
            <Text style={styles.dataLabel}>Biometrics:</Text>
            <Text style={styles.dataValue}>{biometricEnabled ? 'Enabled' : 'Disabled'}</Text>
          </View>
        ) : (
          <Text style={styles.emptyText}>
            No secure data stored. Add credentials using the form above.
          </Text>
        )}
        
        <TouchableOpacity
          style={[styles.button, styles.destructiveButton]}
          onPress={handleClearData}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Clear All Secure Data</Text>
        </TouchableOpacity>
      </Section>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: UI_CONFIG.spacing.medium,
  },
  label: {
    color: APP_COLORS.white,
    fontSize: UI_CONFIG.fontSize.small,
    marginBottom: UI_CONFIG.spacing.xsmall,
  },
  input: {
    backgroundColor: APP_COLORS.background,
    color: APP_COLORS.white,
    borderRadius: UI_CONFIG.borderRadius.medium,
    paddingHorizontal: UI_CONFIG.spacing.medium,
    paddingVertical: UI_CONFIG.spacing.small,
  },
  button: {
    backgroundColor: APP_COLORS.primary,
    paddingVertical: UI_CONFIG.spacing.medium,
    borderRadius: UI_CONFIG.borderRadius.medium,
    alignItems: 'center',
    marginVertical: UI_CONFIG.spacing.small,
  },
  destructiveButton: {
    backgroundColor: APP_COLORS.error,
    marginTop: UI_CONFIG.spacing.medium,
  },
  buttonText: {
    color: APP_COLORS.white,
    fontWeight: UI_CONFIG.fontWeight.semibold,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: UI_CONFIG.spacing.medium,
  },
  dataContainer: {
    backgroundColor: APP_COLORS.background,
    borderRadius: UI_CONFIG.borderRadius.medium,
    padding: UI_CONFIG.spacing.medium,
    marginBottom: UI_CONFIG.spacing.medium,
  },
  dataLabel: {
    color: APP_COLORS.textSecondary,
    fontSize: UI_CONFIG.fontSize.small,
    marginBottom: UI_CONFIG.spacing.xsmall,
  },
  dataValue: {
    color: APP_COLORS.white,
    fontSize: UI_CONFIG.fontSize.medium,
    marginBottom: UI_CONFIG.spacing.medium,
  },
  emptyText: {
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
    padding: UI_CONFIG.spacing.medium,
    marginBottom: UI_CONFIG.spacing.medium,
  },
});
