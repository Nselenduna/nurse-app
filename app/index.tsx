import * as React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NMCLandingPage } from '../components/NMCLandingPage';
import { LoginSignupPage } from '../components/LoginSignupPage';

type AppState = 'landing' | 'auth';

export default function App() {
  const [currentPage, setCurrentPage] = React.useState<AppState>('landing');

  const handleLogin = () => {
    setCurrentPage('auth');
  };

  const handleBackToHome = () => {
    setCurrentPage('landing');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      {currentPage === 'landing' && (
        <NMCLandingPage onLogin={handleLogin} />
      )}
      
      {currentPage === 'auth' && (
        <LoginSignupPage onBack={handleBackToHome} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4f46e5',
  },
}); 
