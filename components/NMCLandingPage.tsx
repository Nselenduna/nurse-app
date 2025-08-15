import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { useEffect } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface NMCLandingPageProps {
  onLogin: () => void;
}

export function NMCLandingPage({ onLogin }: NMCLandingPageProps) {
  // Create animated values for floating icons
  const floatingAnimations = [
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ];

  useEffect(() => {
    // Start floating animations
    floatingAnimations.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 8000 + index * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 8000 + index * 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const floatingIcons = [
    { icon: 'heart', x: 10, y: 20, color: '#f472b6', size: 32, anim: floatingAnimations[0] },
    { icon: 'medical', x: 85, y: 15, color: '#60a5fa', size: 28, anim: floatingAnimations[1] },
    { icon: 'shield', x: 15, y: 70, color: '#a78bfa', size: 30, anim: floatingAnimations[2] },
    { icon: 'add', x: 80, y: 75, color: '#14b8a6', size: 24, anim: floatingAnimations[3] },
    { icon: 'pulse', x: 20, y: 45, color: '#06b6d4', size: 26, anim: floatingAnimations[4] },
    { icon: 'checkmark-circle', x: 75, y: 45, color: '#6366f1', size: 28, anim: floatingAnimations[5] },
    { icon: 'heart', x: 45, y: 15, color: '#ec4899', size: 20, anim: floatingAnimations[6] },
    { icon: 'add', x: 55, y: 80, color: '#a855f7', size: 22, anim: floatingAnimations[7] }
  ];

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <LinearGradient
        colors={['#4f46e5', '#7c3aed', '#d946ef']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        <View style={styles.overlay} />
      </LinearGradient>

      {/* Floating Medical Icons */}
      {floatingIcons.map((iconData, index) => (
        <Animated.View
          key={index}
          style={[
            styles.floatingIcon,
            {
              left: `${iconData.x}%`,
              top: `${iconData.y}%`,
              transform: [{
                translateY: iconData.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -30]
                })
              }, {
                translateX: iconData.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 15]
                })
              }, {
                rotate: iconData.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })
              }],
              opacity: 0.2
            }
          ]}
        >
          <Ionicons name={iconData.icon as any} size={iconData.size} color={iconData.color} />
        </Animated.View>
      ))}

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Main Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.mainHeading}>
            Nurse{'\n'}
            <Text style={styles.accentText}>Revalidator</Text>
          </Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Empowering nurses and midwives
          to deliver exceptional  care through professional registration and development.
        </Text>

        {/* Central Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={onLogin}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#ffffff', '#f3f4f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Login to Portal</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Feature Cards */}
        <View style={styles.featureGrid}>
          {[
            {
              icon: 'checkmark-circle',
              title: "Registration",
              description: "Maintain your professional registration status"
            },
            {
              icon: 'pulse',
              title: "Continuing Development",
              description: "Track your professional development activities"
            },
            {
              icon: 'shield',
              title: "Professional Standards",
              description: "Access guidance on professional standards"
            }
          ].map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={32} color="#14b8a6" />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  floatingIcon: {
    position: 'absolute',
    zIndex: 1,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  headingContainer: {
    marginBottom: 6,
    alignItems: 'center',
  },
  mainHeading: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 64,
  },
  accentText: {
    color: '#06b6d4',
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 10,
    maxWidth: 600,
    lineHeight: 28,
  },
  loginButton: {
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingHorizontal: 48,
    paddingVertical: 24,
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4f46e5',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 18,
    maxWidth: 800,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minWidth: 200,
    flex: 1,
  },
  featureIcon: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
