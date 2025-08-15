import { act, renderHook } from '@testing-library/react-hooks';
import CpdService from '../../services/CpdService';
import { useCpd } from '../useCpd';

// Mock the CpdService
jest.mock('../../services/CpdService', () => ({
  subscribe: jest.fn(),
  getStatistics: jest.fn(),
  addLog: jest.fn(),
  updateLog: jest.fn(),
  deleteLog: jest.fn(),
  getLogsByCategory: jest.fn(),
  searchLogs: jest.fn(),
  exportData: jest.fn(),
  importData: jest.fn(),
  clearAll: jest.fn(),
  getLogsByDateRange: jest.fn(),
}));

describe('useCpd', () => {
  // Sample test data
  const sampleLogs = [
    {
      id: '1',
      text: 'Test CPD activity',
      category: 'Clinical Practice',
      hours: 2,
      createdAt: Date.now(),
      isVoiceGenerated: false
    },
    {
      id: '2',
      text: 'Another activity',
      category: 'Education & Training',
      hours: 3,
      createdAt: Date.now() - 86400000, // 1 day ago
      isVoiceGenerated: true
    }
  ];
  
  const mockStatistics = {
    totalHours: 5,
    totalActivities: 2,
    voiceGeneratedCount: 1,
    categoryBreakdown: {
      'Clinical Practice': 2,
      'Education & Training': 3
    },
    progressPercentage: 14.3,
    remainingHours: 30,
    targetHours: 35
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    (CpdService.subscribe as jest.Mock).mockImplementation((callback) => {
      callback(sampleLogs);
      return jest.fn(); // Return unsubscribe function
    });
    
    (CpdService.getStatistics as jest.Mock).mockReturnValue(mockStatistics);
  });
  
  it('should initialize with logs from CpdService', () => {
    const { result } = renderHook(() => useCpd());
    
    expect(result.current.logs).toEqual(sampleLogs);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  it('should return statistics from CpdService', () => {
    const { result } = renderHook(() => useCpd());
    
    expect(result.current.statistics).toEqual(mockStatistics);
    expect(CpdService.getStatistics).toHaveBeenCalled();
  });
  
  it('should calculate categoryBreakdown correctly', () => {
    const { result } = renderHook(() => useCpd());
    
    expect(result.current.categoryBreakdown).toEqual({
      'Clinical Practice': 2,
      'Education & Training': 3
    });
  });
  
  it('should return recentLogs limited to 10', () => {
    // Create more than 10 logs
    const manyLogs = Array(15).fill(null).map((_, i) => ({
      ...sampleLogs[0],
      id: String(i)
    }));
    
    // Override the default mock for this test
    (CpdService.subscribe as jest.Mock).mockImplementation((callback) => {
      callback(manyLogs);
      return jest.fn();
    });
    
    const { result } = renderHook(() => useCpd());
    
    expect(result.current.recentLogs.length).toBe(10);
  });
  
  it('should handle addLog success', async () => {
    const newLog = {
      text: 'New activity',
      category: 'Research & Development',
      hours: 1,
      isVoiceGenerated: false
    };
    
    const addedLog = { 
      ...newLog, 
      id: '3', 
      createdAt: Date.now() 
    };
    
    (CpdService.addLog as jest.Mock).mockResolvedValue(addedLog);
    
    const { result, waitForNextUpdate } = renderHook(() => useCpd());
    
    let returnedLog;
    
    act(() => {
      returnedLog = result.current.addLog(newLog);
    });
    
    // Check loading state is true during the operation
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    // Verify the result and that loading is reset
    expect(returnedLog).resolves.toEqual(addedLog);
    expect(CpdService.addLog).toHaveBeenCalledWith(newLog);
    expect(result.current.loading).toBe(false);
  });
  
  it('should handle addLog error', async () => {
    const error = new Error('Failed to add log');
    (CpdService.addLog as jest.Mock).mockRejectedValue(error);
    
    const { result, waitForNextUpdate } = renderHook(() => useCpd());
    
    act(() => {
      result.current.addLog({ 
        text: 'Test', 
        category: 'Test', 
        hours: 1, 
        isVoiceGenerated: false 
      }).catch(() => {}); // Catch to prevent test failure
    });
    
    await waitForNextUpdate();
    
    // Verify error state is set and loading is reset
    expect(result.current.error).toBe(error.message);
    expect(result.current.loading).toBe(false);
  });
  
  it('should reset error state', () => {
    // Setup hook with an error
    (CpdService.subscribe as jest.Mock).mockImplementation((callback) => {
      callback([]);
      return jest.fn();
    });
    
    const { result } = renderHook(() => useCpd());
    
    // Set error manually
    act(() => {
      result.current.addLog({
        text: 'Test',
        category: 'Test',
        hours: 1,
        isVoiceGenerated: false
      }).catch(() => {});
    });
    
    // Reset error
    act(() => {
      result.current.resetError();
    });
    
    // Verify error is reset
    expect(result.current.error).toBeNull();
  });
});
