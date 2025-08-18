/**
 * Application string constants
 * Centralized location for all user-facing text
 * This facilitates internationalization and ensures consistency
 */
export const STRINGS = {
  screens: {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Track your revalidation journey',
    },
    log: {
      title: 'Voice-Driven CPD Log',
      subtitle: 'Log your professional development activities',
    },
    cpd: {
      title: 'Your CPD Portfolio',
    },
    settings: {
      title: 'Settings',
    },
  },
  sections: {
    recentActivities: 'Recent Activities',
    cpdSummary: 'CPD Summary',
    hoursByCategory: 'Hours by Category',
    requirements: 'NMC Revalidation Requirements',
    dataManagement: 'Data Management',
    appInformation: 'App Information',
  },
  labels: {
    hours: 'Hours:',
    totalHours: 'Total Hours',
    activities: 'Activities',
    voiceLogs: 'Voice Logs',
    progress: 'Progress',
    version: 'Version',
    build: 'Build',
    dataStorage: 'Data Storage',
    localOnly: 'Local Only (Privacy-First)',
  },
  placeholders: {
    hours: '1',
    activityDescription: 'Describe your CPD activity or use voice input...',
  },
  buttons: {
    voiceInput: 'Voice Input',
    recording: 'Recording...',
    save: 'Save Activity',
    saving: 'Saving...',
  },
  alerts: {
    titles: {
      success: 'Success',
      error: 'Error',
      info: 'Information',
    },
    success: {
      logAdded: 'CPD activity logged successfully!',
      export: 'Your CPD data has been exported successfully!',
      clear: 'All CPD data has been cleared successfully.',
    },
    error: {
      logAdd: 'Failed to save CPD activity. Please try again.',
      export: 'Failed to export data. Please try again.',
      clear: 'Failed to clear data. Please try again.',
      generic: 'An unexpected error occurred. Please try again.',
      invalidImport: 'Invalid import data format. Please check your file.',
    },
    confirm: {
      clearAll: {
        title: 'Clear All Data',
        message: 'This will permanently delete all your CPD data. This action cannot be undone.',
        cancelButton: 'Cancel',
        confirmButton: 'Clear All',
      },
      importData: {
        title: 'Import Data',
        message: 'Import functionality will be implemented soon.',
        cancelButton: 'Cancel',
        confirmButton: 'OK',
      },
    },
  },
  requirements: {
    targetHours: 'hours of CPD over 3 years',
    practiceHours: 'practice hours over 3 years',
    participatoryLearning: 'hours of participatory learning',
    reflection: 'Professional reflection and development planning',
  },
  settingsItems: {
    exportData: {
      title: 'Export CPD Data',
      subtitle: 'Download your data as JSON',
    },
    importData: {
      title: 'Import CPD Data',
      subtitle: 'Restore from backup',
    },
    clearData: {
      title: 'Clear All Data',
      subtitle: 'Permanently delete all data',
    },
  },
} as const;
