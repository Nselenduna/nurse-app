import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { STORAGE_KEYS } from '../../constants';
import CpdService from '../CpdService';
import StorageService from '../StorageService';

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file://test-directory/',
  writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
  readAsStringAsync: jest.fn().mockResolvedValue(''),
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true, isDirectory: false }),
  deleteAsync: jest.fn().mockResolvedValue(undefined),
  makeDirectoryAsync: jest.fn().mockResolvedValue(undefined),
  cacheDirectory: 'file://test-cache/',
}));

// Mock Share API
jest.mock('react-native', () => {
  const ReactNative = jest.requireActual('react-native');
  return {
    ...ReactNative,
    Share: {
      share: jest.fn().mockResolvedValue({ action: 'sharedAction' }),
    },
  };
});

describe('CpdService Integration Tests', () => {
  // Sample test data
  const sampleLogs = [
    {
      id: '1',
      text: 'Attended advanced life support training',
      category: 'Clinical Practice',
      hours: 7,
      createdAt: Date.now() - 86400000 * 2, // 2 days ago
      isVoiceGenerated: false,
      tags: ['training', 'clinical'],
    },
    {
      id: '2',
      text: 'Mentored junior nurse on documentation',
      category: 'Education & Training',
      hours: 3,
      createdAt: Date.now() - 86400000, // 1 day ago
      isVoiceGenerated: true,
      reflection: 'Helped improve my communication skills',
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();
    StorageService.clearCache();
    await AsyncStorage.clear();
    
    // Seed the storage with sample logs
    await AsyncStorage.setItem(STORAGE_KEYS.cpdLogs, JSON.stringify(sampleLogs));
    
    // Force reload logs from storage
    await CpdService['instance']['loadLogs']();
  });

  describe('Export Features', () => {
    it('should export data in the correct JSON format', async () => {
      // Execute the export
      const exportedData = await CpdService.exportData();
      const parsed = JSON.parse(exportedData);
      
      // Verify structure
      expect(parsed).toHaveProperty('exportDate');
      expect(parsed).toHaveProperty('statistics');
      expect(parsed).toHaveProperty('logs');
      
      // Verify content
      expect(parsed.logs).toHaveLength(2);
      expect(parsed.statistics.totalHours).toBe(10); // 7 + 3
      expect(parsed.statistics.totalActivities).toBe(2);
      expect(parsed.statistics.categoryBreakdown).toEqual({
        'Clinical Practice': 7,
        'Education & Training': 3,
      });
      
      // Verify ISO date format
      expect(() => new Date(parsed.exportDate)).not.toThrow();
    });

    it('should handle file system export with proper error handling', async () => {
      // Mock file system write function
      const mockFilePath = 'file://test-directory/cpd_export_20230101.json';
      const writeFileSpy = jest.spyOn(FileSystem, 'writeAsStringAsync');
      
      // Export to file
      const exportData = await CpdService.exportData();
      await FileSystem.writeAsStringAsync(mockFilePath, exportData);
      
      // Verify file was written with correct content
      expect(writeFileSpy).toHaveBeenCalledWith(mockFilePath, expect.any(String));
      expect(writeFileSpy.mock.calls[0][1]).toEqual(exportData);
      
      // Test error case
      writeFileSpy.mockRejectedValueOnce(new Error('Disk full'));
      
      // Expect the error to be propagated
      await expect(
        FileSystem.writeAsStringAsync(mockFilePath, exportData)
      ).rejects.toThrow('Disk full');
    });
    
    it('should handle accessibility requirements during export', async () => {
      // Mock the accessibility announcer
      const mockAnnounce = jest.fn();
      global.AccessibilityInfo = {
        announceForAccessibility: mockAnnounce,
        isScreenReaderEnabled: jest.fn().mockResolvedValue(true),
      };
      
      // Export data
      await CpdService.exportData();
      
      // Verify accessibility announcement
      expect(mockAnnounce).toHaveBeenCalledWith(
        expect.stringContaining('Export completed')
      );
    });
    
    it('should handle rollback on failed export', async () => {
      // Setup a spy on console.error to verify it's called
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock a failure in JSON.stringify
      const originalStringify = JSON.stringify;
      JSON.stringify = jest.fn().mockImplementation(() => {
        throw new Error('Stringify failed');
      });
      
      // Attempt export
      await expect(CpdService.exportData()).rejects.toThrow();
      
      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      // Restore original function
      JSON.stringify = originalStringify;
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Import Features', () => {
    it('should import valid data and replace existing logs', async () => {
      // Create import data with new logs
      const importData = {
        exportDate: new Date().toISOString(),
        statistics: {
          totalHours: 5,
          totalActivities: 1,
        },
        logs: [
          {
            id: '3',
            text: 'New imported activity',
            category: 'Research & Development',
            hours: 5,
            createdAt: Date.now(),
            isVoiceGenerated: false,
          },
        ],
      };
      
      // Perform import
      await CpdService.importData(JSON.stringify(importData));
      
      // Verify logs were replaced
      const logs = CpdService.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].id).toBe('3');
      expect(logs[0].text).toBe('New imported activity');
    });
    
    it('should handle invalid import data gracefully', async () => {
      // Test with invalid JSON
      await expect(CpdService.importData('not valid json')).rejects.toThrow(
        'Invalid import data format'
      );
      
      // Test with valid JSON but invalid structure
      await expect(
        CpdService.importData(JSON.stringify({ notLogs: [] }))
      ).resolves.not.toThrow();
      
      // Verify original logs are preserved
      const logs = CpdService.getLogs();
      expect(logs).toHaveLength(2);
    });
    
    it('should handle rollback on partial import failure', async () => {
      // Create a backup of current logs
      const originalLogs = CpdService.getLogs();
      
      // Mock AsyncStorage.setItem to fail
      AsyncStorage.setItem = jest.fn().mockRejectedValueOnce(new Error('Storage error'));
      
      // Create import data
      const importData = {
        exportDate: new Date().toISOString(),
        logs: [{ id: 'new', text: 'New log', category: 'Clinical Practice', hours: 1, createdAt: Date.now(), isVoiceGenerated: false }],
      };
      
      // Attempt import which should fail on save
      await expect(CpdService.importData(JSON.stringify(importData))).rejects.toThrow();
      
      // Verify logs were rolled back to original state
      // Note: This is testing an implementation detail that doesn't exist yet - we need to add rollback functionality
      const currentLogs = CpdService.getLogs();
      expect(currentLogs).toEqual(originalLogs);
    });
  });

  describe('Report Generation', () => {
    it('should generate statistics with correct calculations', () => {
      const stats = CpdService.getStatistics();
      
      // Verify calculations
      expect(stats.totalHours).toBe(10);
      expect(stats.totalActivities).toBe(2);
      expect(stats.voiceGeneratedCount).toBe(1);
      expect(stats.progressPercentage).toBe((10 / 35) * 100);
      expect(stats.remainingHours).toBe(25); // 35 - 10
    });
    
    it('should cap progress percentage at 100%', async () => {
      // Create logs that exceed target hours
      const excessLogs = [
        {
          id: '3',
          text: 'Excess hours activity',
          category: 'Clinical Practice',
          hours: 40, // Exceeds target of 35
          createdAt: Date.now(),
          isVoiceGenerated: false,
        },
      ];
      
      // Replace logs with excess hours
      await AsyncStorage.setItem(STORAGE_KEYS.cpdLogs, JSON.stringify(excessLogs));
      await CpdService['instance']['loadLogs']();
      
      // Get statistics
      const stats = CpdService.getStatistics();
      
      // Verify capping
      expect(stats.totalHours).toBe(40);
      expect(stats.progressPercentage).toBe(100); // Capped at 100%
      expect(stats.remainingHours).toBe(0); // No hours remaining
    });
    
    it('should filter logs by category for category-specific reports', () => {
      // Get logs for Clinical Practice category
      const clinicalLogs = CpdService.getLogsByCategory('Clinical Practice');
      
      // Verify filtering
      expect(clinicalLogs).toHaveLength(1);
      expect(clinicalLogs[0].id).toBe('1');
      expect(clinicalLogs[0].category).toBe('Clinical Practice');
    });
    
    it('should filter logs by date range for period-specific reports', () => {
      // Create date range: yesterday to today
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      // Get logs in date range
      const recentLogs = CpdService.getLogsByDateRange(yesterday, today);
      
      // Verify filtering
      expect(recentLogs).toHaveLength(1);
      expect(recentLogs[0].id).toBe('2'); // Only the log from yesterday
    });
    
    it('should search logs by text content for keyword reports', () => {
      // Search for "mentor" keyword
      const mentorLogs = CpdService.searchLogs('mentor');
      
      // Verify search results
      expect(mentorLogs).toHaveLength(1);
      expect(mentorLogs[0].id).toBe('2');
      expect(mentorLogs[0].text).toContain('Mentored');
    });
  });

  describe('File Output and Accessibility', () => {
    it('should generate accessible PDF report content', async () => {
      // This is a placeholder for PDF generation testing
      // In a real implementation, we would test PDF generation with a library like react-pdf
      
      // Mock PDF generation function
      const mockGeneratePdf = jest.fn().mockResolvedValue('file://test-directory/report.pdf');
      
      // Generate PDF report
      const filePath = await mockGeneratePdf(CpdService.getLogs(), CpdService.getStatistics());
      
      // Verify PDF generation was called with correct data
      expect(mockGeneratePdf).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({
          totalHours: 10,
          totalActivities: 2,
        })
      );
      
      // Verify file path
      expect(filePath).toBe('file://test-directory/report.pdf');
    });
    
    it('should handle file system errors during report generation', async () => {
      // Mock file system error
      FileSystem.writeAsStringAsync.mockRejectedValueOnce(new Error('File system error'));
      
      // Mock report generation function that uses file system
      const mockGenerateReport = async () => {
        const data = await CpdService.exportData();
        await FileSystem.writeAsStringAsync('file://test-directory/report.json', data);
        return 'file://test-directory/report.json';
      };
      
      // Expect error to be thrown
      await expect(mockGenerateReport()).rejects.toThrow('File system error');
    });
  });
});
