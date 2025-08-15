import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface NMCLandingPageProps {
  onLogin: () => void;
}

export function NMCLandingPage({ onLogin }: NMCLandingPageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nurse App</Text>
      <Text style={styles.subtitle}>Welcome to the Nursing Management System</Text>
      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});