import { CpdCategory, NmcPillar } from '../types';

export const APP_COLORS = {
  primary: '#4f46e5',
  secondary: '#7c3aed',
  accent: '#d946ef',
  success: '#14b8a6',
  info: '#06b6d4',
  warning: '#f59e0b',
  error: '#ef4444',
  white: '#ffffff',
  background: 'rgba(255,255,255,0.15)',
  text: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.8)',
  textMuted: 'rgba(255,255,255,0.6)',
} as const;

export const CPD_CATEGORIES: CpdCategory[] = [
  'Clinical Practice',
  'Leadership & Management',
  'Education & Training',
  'Research & Development',
  'Quality Improvement',
  'Professional Development'
];

export const NMC_PILLARS: NmcPillar[] = [
  'Prioritise People',
  'Practise Effectively',
  'Preserve Safety',
  'Promote Professionalism and Trust'
];

export const REVALIDATION_REQUIREMENTS = {
  targetHours: 35,
  practiceHours: 450,
  participatoryLearning: 20,
  reflectionRequired: true,
} as const;

export const STORAGE_KEYS = {
  cpdLogs: 'cpd_logs',
  voiceRecordings: 'voice_recordings',
  nmcForms: 'nmc_forms',
  userProfile: 'user_profile',
  learningMaterials: 'learning_materials',
  settings: 'app_settings',
  auditLogs: 'audit_logs',
  // Sensitive data keys (will be prefixed with SECURE_ by the SecureStorageService)
  userCredentials: 'user_credentials',
  authToken: 'auth_token',
  pinCode: 'pin_code',
  biometricEnabled: 'biometric_enabled',
} as const;


