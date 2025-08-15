import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface LoginSignupPageProps {
  onBack: () => void;
}

export function LoginSignupPage({ onBack }: LoginSignupPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleSocialLogin = (provider: string) => {
    console.log(`Signing in with ${provider}`);
    // Implement social login logic here
  };

  const handleLogin = () => {
    console.log('Logging in with:', loginData);
    // Implement login logic here
  };

  if (mode === 'signup') {
    return <SignupForm onBack={onBack} onSwitchToLogin={() => setMode('login')} />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4f46e5', '#7c3aed', '#d946ef']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        <View style={styles.overlay} />
      </LinearGradient>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to access your NMC professional portal
            </Text>
          </View>

          {/* Social Login Options */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('Google')}
            >
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('Apple')}
            >
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
              <View style={styles.separator} />
              <Text style={styles.separatorText}>or sign in with email</Text>
              <View style={styles.separator} />
            </View>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={loginData.email}
                onChangeText={(text) => setLoginData(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={loginData.password}
                  onChangeText={(text) => setLoginData(prev => ({ ...prev, password: text }))}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <LinearGradient
                colors={['#7c3aed', '#d946ef']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Switch to Signup */}
            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>
                Don't have an account?{' '}
                <Text style={styles.switchLink} onPress={() => setMode('signup')}>
                  Create one here
                </Text>
              </Text>
            </View>
          </View>

          {/* Terms and Privacy */}
          <Text style={styles.termsText}>
            By signing in, you agree to our{' '}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Signup Form Component
function SignupForm({ onBack, onSwitchToLogin }: { onBack: () => void; onSwitchToLogin: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    organization: '',
    jobTitle: ''
  });

  const steps = [
    { id: 1, title: 'Account Details', icon: 'mail-outline' },
    { id: 2, title: 'Personal Info', icon: 'person-outline' },
    { id: 3, title: 'Professional Info', icon: 'business-outline' }
  ];

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Signing up with ${provider}`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4f46e5', '#7c3aed', '#d946ef']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        <View style={styles.overlay} />
      </LinearGradient>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Your Account</Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.stepsContainer}>
              {steps.map((step) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <View key={step.id} style={styles.stepContainer}>
                    <View style={[
                      styles.stepIcon,
                      isCompleted ? styles.stepCompleted : isCurrent ? styles.stepCurrent : styles.stepInactive
                    ]}>
                      {isCompleted ? (
                        <Ionicons name="checkmark" size={20} color="#ffffff" />
                      ) : (
                        <Ionicons name={step.icon as any} size={20} color={isCurrent ? "#ffffff" : "#9CA3AF"} />
                      )}
                    </View>
                    <Text style={[
                      styles.stepTitle,
                      isCurrent ? styles.stepTitleCurrent : styles.stepTitleInactive
                    ]}>
                      {step.title}
                    </Text>
                    {isCurrent && <View style={styles.currentStepIndicator} />}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Social Login Options - Only on first step */}
          {currentStep === 1 && (
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Google')}
              >
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Apple')}
              >
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>

              <View style={styles.separatorContainer}>
                <View style={styles.separator} />
                <Text style={styles.separatorText}>or continue with email</Text>
                <View style={styles.separator} />
              </View>
            </View>
          )}

          {/* Form Steps */}
          <View style={styles.form}>
            {currentStep === 1 && (
              <View style={styles.formStep}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={formData.email}
                    onChangeText={(text) => updateFormData('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Create a secure password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.password}
                    onChangeText={(text) => updateFormData('password', text)}
                    secureTextEntry
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.confirmPassword}
                    onChangeText={(text) => updateFormData('confirmPassword', text)}
                    secureTextEntry
                  />
                </View>
              </View>
            )}

            {currentStep === 2 && (
              <View style={styles.formStep}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your first name"
                    placeholderTextColor="#9CA3AF"
                    value={formData.firstName}
                    onChangeText={(text) => updateFormData('firstName', text)}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your last name"
                    placeholderTextColor="#9CA3AF"
                    value={formData.lastName}
                    onChangeText={(text) => updateFormData('lastName', text)}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            {currentStep === 3 && (
              <View style={styles.formStep}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Organization</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your organization"
                    placeholderTextColor="#9CA3AF"
                    value={formData.organization}
                    onChangeText={(text) => updateFormData('organization', text)}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Job Title</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your job title"
                    placeholderTextColor="#9CA3AF"
                    value={formData.jobTitle}
                    onChangeText={(text) => updateFormData('jobTitle', text)}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.backStepButton}
              onPress={prevStep}
              disabled={currentStep === 1}
            >
              <Ionicons name="arrow-back" size={20} color="#6B7280" />
              <Text style={styles.backStepButtonText}>Back</Text>
            </TouchableOpacity>
            
            {currentStep < 3 ? (
              <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                <LinearGradient
                  colors={['#7c3aed', '#d946ef']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.nextButton}>
                <LinearGradient
                  colors={['#7c3aed', '#d946ef']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Create Account</Text>
                  <Ionicons name="checkmark" size={20} color="#ffffff" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* Switch to Login */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              Already have an account?{' '}
              <Text style={styles.switchLink} onPress={onSwitchToLogin}>
                Sign in here
              </Text>
            </Text>
          </View>

          {/* Terms and Privacy */}
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  formContainer: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  progressContainer: {
    marginBottom: 24,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCompleted: {
    backgroundColor: '#10B981',
  },
  stepCurrent: {
    backgroundColor: '#7c3aed',
  },
  stepInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  stepTitle: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  stepTitleCurrent: {
    color: '#ffffff',
  },
  stepTitleInactive: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  currentStepIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 40,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  socialContainer: {
    marginBottom: 24,
  },
  socialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4f46e5',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  separatorText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  form: {
    marginBottom: 24,
  },
  formStep: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingRight: 60,
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  eyeButton: {
    position: 'absolute',
    right: 20,
    top: 16,
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    minWidth: 120,
  },
  backStepButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4f46e5',
    marginLeft: 8,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 120,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginRight: 8,
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  switchContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  switchText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  switchLink: {
    color: '#ffffff',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  termsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
});
