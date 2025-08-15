import { useRouter } from 'expo-router';
import * as React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NMCLandingPage } from '../components/NMCLandingPage';

export default function App() {
  const router = useRouter();

  const handleLogin = () => {
    // Use push instead of replace for navigation
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      <NMCLandingPage onLogin={handleLogin} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4f46e5',
  },
});
