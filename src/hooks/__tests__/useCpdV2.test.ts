import { act, renderHook } from '@testing-library/react-hooks';
import CpdService from '../../services/CpdService';
import { useCpdV2 } from '../useCpdV2';

// Mock the CpdService
jest.mock('../../services/CpdService', () => ({
  subscribe: jest.fn(),
  getStatistics: jest.fn(),
  addLog: jest.fn(),
  updateLog: jest.fn(),
  deleteLog: jest.fn(),
  clearAll: jest.fn(),
  exportData: jest.fn(),
  importData: jest.fn(),
  getLogsByCategory: jest.fn(),
  searchLogs: jest.fn(),
  getLogsByDateRange: jest.fn(),
}));

describe('useCpdV2', () => {
  // Sample data for tests
  const sampleLogs = [
    {
      id: '1',
      text: 'Sample CPD activity 1',
      category: 'Clinical Practice',
      hours: 2,
      createdAt: Date.now(),
      isVoiceGenerated: false
    },
    {
      id: '2',
      text: 'Sample CPD activity 2',
      category: 'Education & Training',
      hours: 3,
      createdAt: Date.now() - 86400000, // 1 day ago
      isVoiceGenerated: true
    }
  ];

  const sampleStatistics = {
    totalHours: 5,
    totalActivities: 2,
    voiceGeneratedCount: 1,
    categoryBreakdown: {
      'Clinical Practice': 2,
      'Education & Training': 3
    },
    progressPercentage: 14.29,
    remainingHours: 30,
    targetHours: 35
  };

  // Set up mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the subscribe function to immediately call the callback with sample data
    (CpdService.subscribe as jest.Mock).mockImplementation((callback) => {
      callback(sampleLogs);
      return () => {}; // Return unsubscribe function
    });
    
    // Mock getStatistics to return sample statistics
    (CpdService.getStatistics as jest.Mock).mockReturnValue(sampleStatistics);
  });

  it('should load logs and set loading to false on initialization', () => {
    const { result } = renderHook(() => useCpdV2());
    
    expect(result.current.logs).toEqual(sampleLogs);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(CpdService.subscribe).toHaveBeenCalled();
  });

  it('should provide statistics and derived data', () => {
    const { result } = renderHook(() => useCpdV2());
    
    expect(result.current.statistics).toEqual(sampleStatistics);
    expect(result.current.recentLogs).toEqual(sampleLogs);
    
    // Test categoryBreakdown calculation
    expect(result.current.categoryBreakdown).toEqual({
      'Clinical Practice': 2,
      'Education & Training': 3
    });
  });

  it('should handle adding a log successfully', async () => {
    const newLog = {
      text: 'New CPD activity',
      category: 'Research & Development',
      hours: 1.5,
      isVoiceGenerated: false
    };
    
    const createdLog = {
      ...newLog,
      id: '3',
      createdAt: Date.now()
    };
    
    // Mock addLog to return the created log
    (CpdService.addLog as jest.Mock).mockResolvedValue(createdLog);
    
    const { result, waitForNextUpdate } = renderHook(() => useCpdV2());
    
    // Initial state should have loading as false
    expect(result.current.loading).toBe(false);
    
    // Call addLog and wait for it to resolve
    let returnedLog;
    await act(async () => {
      returnedLog = await result.current.addLog(newLog);
    });
    
    // The returned log should match the created log
    expect(returnedLog).toEqual(createdLog);
    
    // Verify that loading is reset to false
    expect(result.current.loading).toBe(false);
    
    // Verify that CpdService.addLog was called with the correct parameters
    expect(CpdService.addLog).toHaveBeenCalledWith(newLog);
  });

  it('should handle add log failure', async () => {
    const error = new Error('Failed to add log');
    (CpdService.addLog as jest.Mock).mockRejectedValue(error);
    
    const { result } = renderHook(() => useCpdV2());
    
    await expect(act(() => 
      result.current.addLog({
        text: 'Will fail',
        category: 'Clinical Practice',
        hours: 1,
        isVoiceGenerated: false
      })
    )).rejects.toThrow('Failed to add log');
    
    // Verify error state is set
    expect(result.current.error).toBe('Failed to add log');
    expect(result.current.loading).toBe(false);
  });

  it('should handle multiple concurrent operations', async () => {
    // Mock implementation for operations that take time
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    // First operation resolves after a delay
    (CpdService.exportData as jest.Mock).mockImplementation(async () => {
      await delay(50);
      return JSON.stringify(sampleLogs);
    });
    
    // Second operation resolves immediately
    (CpdService.clearAll as jest.Mock).mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useCpdV2());
    
    // Start two concurrent operations
    let exportPromise: Promise<string>;
    let clearPromise: Promise<void>;
    
    await act(async () => {
      exportPromise = result.current.exportData();
      // Loading should be true as soon as the first operation starts
      expect(result.current.loading).toBe(true);
      
      clearPromise = result.current.clearAll();
      // Loading should remain true with two pending operations
      expect(result.current.loading).toBe(true);
      
      // Wait for the second operation to complete
      await clearPromise;
      // Loading should still be true because exportData is still pending
      expect(result.current.loading).toBe(true);
      
      // Wait for the first operation to complete
      await exportPromise;
      // Now loading should be false as all operations are complete
      expect(result.current.loading).toBe(false);
    });
  });

  it('should reset error state', () => {
    const { result } = renderHook(() => useCpdV2());
    
    // Manually set error state
    act(() => {
      // @ts-ignore - accessing private dispatch
      result.current.dispatch({ type: 'SET_ERROR', payload: 'Test error' });
    });
    
    expect(result.current.error).toBe('Test error');
    
    // Reset error state
    act(() => {
      result.current.resetError();
    });
    
    expect(result.current.error).toBe(null);
  });
});
