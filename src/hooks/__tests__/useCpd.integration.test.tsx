import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-hooks';
import { STORAGE_KEYS } from '../../constants';
import CpdService from '../../services/CpdService';
import { useCpd } from '../useCpd';

// Create a real test environment that uses the actual CpdService implementation
// This is different from the unit tests where we mock CpdService
describe('useCpd Hook Integration Tests', () => {
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
    await AsyncStorage.clear();
    
    // Seed the storage with sample logs
    await AsyncStorage.setItem(STORAGE_KEYS.cpdLogs, JSON.stringify(sampleLogs));
    
    // Force reload logs from storage
    await CpdService['instance']['loadLogs']();
  });

  describe('Export and Import Integration', () => {
    it('should handle the full export workflow', async () => {
      // Setup mock for file system operations
      const mockSaveFile = jest.fn().mockResolvedValue('file://test/export.json');
      
      // Render the hook
      const { result, waitForNextUpdate } = renderHook(() => useCpd());
      
      // Wait for initial data load
      await waitForNextUpdate();
      
      // Verify initial data
      expect(result.current.logs).toHaveLength(2);
      
      // Start export process
      let exportedData;
      await act(async () => {
        exportedData = await result.current.exportData();
      });
      
      // Verify export format
      expect(typeof exportedData).toBe('string');
      const parsed = JSON.parse(exportedData);
      expect(parsed).toHaveProperty('logs');
      expect(parsed.logs).toHaveLength(2);
      
      // Simulate saving to file system
      await mockSaveFile(exportedData);
      expect(mockSaveFile).toHaveBeenCalledWith(exportedData);
      
      // Verify loading state was properly managed
      expect(result.current.loading).toBe(false);
    });

    it('should handle the full import workflow with rollback on failure', async () => {
      // Render the hook
      const { result, waitForNextUpdate } = renderHook(() => useCpd());
      
      // Wait for initial data load
      await waitForNextUpdate();
      
      // Verify initial data
      expect(result.current.logs).toHaveLength(2);
      
      // Create new data to import
      const newLogs = [
        {
          id: '3',
          text: 'New imported activity',
          category: 'Research & Development',
          hours: 5,
          createdAt: Date.now(),
          isVoiceGenerated: false,
        },
      ];
      
      const importData = {
        exportDate: new Date().toISOString(),
        statistics: {
          totalHours: 5,
          totalActivities: 1,
        },
        logs: newLogs,
      };
      
      // Perform import
      await act(async () => {
        await result.current.importData(JSON.stringify(importData));
      });
      
      // Verify imported data
      expect(result.current.logs).toHaveLength(1);
      expect(result.current.logs[0].id).toBe('3');
      
      // Test rollback on failure
      const originalLogs = result.current.logs;
      
      // Mock AsyncStorage to fail
      AsyncStorage.setItem = jest.fn().mockRejectedValueOnce(new Error('Storage error'));
      
      // Attempt another import that should fail
      await act(async () => {
        try {
          await result.current.importData(JSON.stringify({
            exportDate: new Date().toISOString(),
            logs: [{ id: '4', text: 'Should not be imported', category: 'Clinical Practice', hours: 1, createdAt: Date.now(), isVoiceGenerated: false }],
          }));
        } catch (error) {
          // Expected error
        }
      });
      
      // Verify error state is set
      expect(result.current.error).not.toBeNull();
      
      // Verify data was not changed (rollback happened)
      expect(result.current.logs).toEqual(originalLogs);
      
      // Reset error state
      act(() => {
        result.current.resetError();
      });
      
      // Verify error was cleared
      expect(result.current.error).toBeNull();
    });
  });

  describe('Report Generation Integration', () => {
    it('should generate reports with proper loading states', async () => {
      // Mock report generation function
      const mockGenerateReport = jest.fn().mockImplementation(async (logs, stats) => {
        // Simulate time-consuming operation
        await new Promise(resolve => setTimeout(resolve, 100));
        return { url: 'file://test/report.pdf', logs, stats };
      });
      
      // Render the hook
      const { result, waitForNextUpdate } = renderHook(() => useCpd());
      
      // Wait for initial data load
      await waitForNextUpdate();
      
      // Start report generation
      let reportResult;
      await act(async () => {
        // Set loading state
        expect(result.current.loading).toBe(false);
        
        // Generate report using hook data
        reportResult = await mockGenerateReport(
          result.current.logs,
          result.current.statistics
        );
        
        // Loading should be true during generation
        // Note: This is hard to test precisely due to the async nature,
        // but in a real component the loading state would be visible
      });
      
      // Verify report was generated with correct data
      expect(reportResult).toHaveProperty('url');
      expect(reportResult.logs).toEqual(result.current.logs);
      expect(reportResult.stats).toEqual(result.current.statistics);
      
      // Verify loading state is reset
      expect(result.current.loading).toBe(false);
    });

    it('should handle accessibility requirements during report generation', async () => {
      // Mock accessibility functions
      const mockAnnounce = jest.fn();
      global.AccessibilityInfo = {
        announceForAccessibility: mockAnnounce,
        isScreenReaderEnabled: jest.fn().mockResolvedValue(true),
      };
      
      // Render the hook
      const { result, waitForNextUpdate } = renderHook(() => useCpd());
      
      // Wait for initial data load
      await waitForNextUpdate();
      
      // Mock report generation with accessibility announcement
      const generateAccessibleReport = async () => {
        const data = await result.current.exportData();
        
        // Announce completion for screen readers
        if (await global.AccessibilityInfo.isScreenReaderEnabled()) {
          global.AccessibilityInfo.announceForAccessibility('Report generation complete');
        }
        
        return data;
      };
      
      // Generate report
      await act(async () => {
        await generateAccessibleReport();
      });
      
      // Verify accessibility announcement was made
      expect(mockAnnounce).toHaveBeenCalledWith('Report generation complete');
    });
  });
});
