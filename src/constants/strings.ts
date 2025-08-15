/**
 * Application string constants
 * Centralized location for all user-facing text
 * This facilitates internationalization and ensures consistency
 */
export const STRINGS = {
  /**
   * Screen titles and headers
   */
  screens: {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Track your revalidation journey',
    },
    cpd: {
      title: 'Your CPD Portfolio',
      subtitle: 'View and manage your CPD activities',
    },
    log: {
      title: 'Voice-Driven CPD Log',
      subtitle: 'Log your professional development activities',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your app preferences',
    },
  },
  
  /**
   * Alert messages
   */
  alerts: {
    titles: {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information',
      confirm: 'Confirm',
    },
    success: {
      export: 'Your CPD data has been exported successfully!',
      import: 'Your CPD data has been imported successfully!',
      clear: 'All CPD logs have been cleared',
      logAdded: 'CPD activity logged successfully!',
      logUpdated: 'CPD activity updated successfully!',
      logDeleted: 'CPD activity deleted successfully!',
    },
    error: {
      export: 'Failed to export data. Please try again.',
      import: 'Failed to import data. Please try again.',
      invalidImport: 'Invalid import data format. Please check your file.',
      clear: 'Failed to clear data. Please try again.',
      logAdd: 'Failed to save CPD activity. Please try again.',
      logUpdate: 'Failed to update CPD activity. Please try again.',
      logDelete: 'Failed to delete CPD activity. Please try again.',
      generic: 'An unexpected error occurred. Please try again.',
    },
    confirm: {
      clearAll: {
        title: 'Clear All Data',
        message: 'This will permanently delete all your CPD logs. This action cannot be undone.',
        cancelButton: 'Cancel',
        confirmButton: 'Clear All',
      },
      deleteLog: {
        title: 'Delete Activity',
        message: 'Are you sure you want to delete this CPD activity? This action cannot be undone.',
        cancelButton: 'Cancel',
        confirmButton: 'Delete',
      },
      importData: {
        title: 'Import Data',
        message: 'This will replace your current CPD data. Make sure you have a backup.',
        cancelButton: 'Cancel',
        confirmButton: 'Import',
      },
    },
  },
  
  /**
   * Button labels
   */
  buttons: {
    save: 'Save Activity',
    saving: 'Saving...',
    export: 'Export Data',
    exporting: 'Exporting...',
    import: 'Import Data',
    importing: 'Importing...',
    clear: 'Clear All',
    clearing: 'Clearing...',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    voiceInput: 'Voice Input',
    recording: 'Recording...',
    logFirst: 'Log First Activity',
  },
  
  /**
   * Empty state messages
   */
  emptyStates: {
    dashboard: {
      title: 'Start Your CPD Journey',
      subtitle: 'Begin logging your professional development activities to track your revalidation progress',
    },
    cpd: {
      title: 'No CPD entries yet',
      subtitle: 'Start logging your professional development activities from the Log tab',
    },
    search: {
      title: 'No results found',
      subtitle: 'Try changing your search terms or filters',
    },
  },
  
  /**
   * Section titles
   */
  sections: {
    recentActivities: 'Recent Activities',
    categoryOverview: 'Category Overview',
    quickActions: 'Quick Actions',
    revalidationProgress: 'Revalidation Progress',
    cpdSummary: 'CPD Summary',
    hoursByCategory: 'Hours by Category',
    dataManagement: 'Data Management',
    appInformation: 'App Information',
    requirements: 'NMC Revalidation Requirements',
  },
  
  /**
   * Labels and placeholders
   */
  labels: {
    hours: 'Hours:',
    totalHours: 'Total Hours',
    hoursCompleted: 'Hours Completed',
    hoursRemaining: 'Hours Remaining',
    complete: 'Complete',
    activities: 'Activities',
    voiceLogs: 'Voice Logs',
    progress: 'Progress',
    category: 'Category',
    description: 'Description',
    date: 'Date',
    version: 'Version',
    build: 'Build',
    dataStorage: 'Data Storage',
    localOnly: 'Local Only',
    required: 'Required',
  },
  
  /**
   * Placeholders
   */
  placeholders: {
    hours: '1',
    activityDescription: 'Describe your CPD activity or use voice input...',
    search: 'Search CPD activities...',
  },
  
  /**
   * Quick action labels
   */
  quickActions: {
    voiceLog: {
      title: 'Voice Log',
      subtitle: 'Record CPD activity',
    },
    viewPortfolio: {
      title: 'View Portfolio',
      subtitle: 'See all activities',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage data',
    },
  },
  
  /**
   * Settings items
   */
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
      subtitle: 'Permanently delete all logs',
    },
  },
  
  /**
   * Requirement texts
   */
  requirements: {
    targetHours: 'hours of CPD over 3 years',
    practiceHours: 'practice hours over 3 years',
    participatoryLearning: 'hours of participatory learning',
    reflection: 'Professional reflection and development planning',
  },
} as const;
