import AsyncStorage from '@react-native-async-storage/async-storage';
import AuditLogService from '../AuditLogService';
import StorageService from '../StorageService';

describe('AuditLogService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    StorageService.clearCache();
    await AsyncStorage.clear();
  });

  it('should log successful actions', async () => {
    // Log a successful action
    await AuditLogService.logSuccess(
      'export_data',
      { format: 'json', fileSize: 1024 },
      'user123'
    );
    
    // Get logs
    const logs = AuditLogService.getLogs();
    
    // Verify log entry
    expect(logs).toHaveLength(1);
    expect(logs[0].action).toBe('export_data');
    expect(logs[0].success).toBe(true);
    expect(logs[0].userId).toBe('user123');
    expect(logs[0].details).toEqual({ format: 'json', fileSize: 1024 });
    expect(logs[0].errorMessage).toBeUndefined();
  });

  it('should log failed actions with error messages', async () => {
    // Log a failed action
    await AuditLogService.logFailure(
      'import_data',
      { source: 'file', fileName: 'import.json' },
      'Invalid file format',
      'user123'
    );
    
    // Get logs
    const logs = AuditLogService.getLogs();
    
    // Verify log entry
    expect(logs).toHaveLength(1);
    expect(logs[0].action).toBe('import_data');
    expect(logs[0].success).toBe(false);
    expect(logs[0].userId).toBe('user123');
    expect(logs[0].details).toEqual({ source: 'file', fileName: 'import.json' });
    expect(logs[0].errorMessage).toBe('Invalid file format');
  });

  it('should filter logs by action', async () => {
    // Log multiple actions
    await AuditLogService.logSuccess('export_data', { format: 'json' });
    await AuditLogService.logSuccess('import_data', { source: 'file' });
    await AuditLogService.logSuccess('export_data', { format: 'pdf' });
    
    // Get logs filtered by action
    const exportLogs = AuditLogService.getLogsByAction('export_data');
    
    // Verify filtered logs
    expect(exportLogs).toHaveLength(2);
    expect(exportLogs[0].details.format).toBe('pdf');
    expect(exportLogs[1].details.format).toBe('json');
  });

  it('should filter logs by success status', async () => {
    // Log both successful and failed actions
    await AuditLogService.logSuccess('action1', {});
    await AuditLogService.logFailure('action2', {}, 'Error');
    await AuditLogService.logSuccess('action3', {});
    await AuditLogService.logFailure('action4', {}, 'Another error');
    
    // Get successful logs
    const successLogs = AuditLogService.getLogsByStatus(true);
    
    // Verify successful logs
    expect(successLogs).toHaveLength(2);
    expect(successLogs[0].action).toBe('action3');
    expect(successLogs[1].action).toBe('action1');
    
    // Get failed logs
    const failedLogs = AuditLogService.getLogsByStatus(false);
    
    // Verify failed logs
    expect(failedLogs).toHaveLength(2);
    expect(failedLogs[0].action).toBe('action4');
    expect(failedLogs[1].action).toBe('action2');
  });

  it('should filter logs by date range', async () => {
    // Mock Date.now to control timestamps
    const originalNow = Date.now;
    
    // Create logs with specific timestamps
    const day1 = new Date('2023-01-01T12:00:00Z').getTime();
    const day2 = new Date('2023-01-02T12:00:00Z').getTime();
    const day3 = new Date('2023-01-03T12:00:00Z').getTime();
    
    try {
      // Create log on day 1
      Date.now = jest.fn().mockReturnValue(day1);
      await AuditLogService.logSuccess('day1', {});
      
      // Create log on day 2
      Date.now = jest.fn().mockReturnValue(day2);
      await AuditLogService.logSuccess('day2', {});
      
      // Create log on day 3
      Date.now = jest.fn().mockReturnValue(day3);
      await AuditLogService.logSuccess('day3', {});
      
      // Filter logs between day 1 and day 2
      const filteredLogs = AuditLogService.getLogsByDateRange(
        new Date('2023-01-01T00:00:00Z'),
        new Date('2023-01-02T23:59:59Z')
      );
      
      // Verify filtered logs
      expect(filteredLogs).toHaveLength(2);
      expect(filteredLogs[0].action).toBe('day2');
      expect(filteredLogs[1].action).toBe('day1');
    } finally {
      // Restore original Date.now
      Date.now = originalNow;
    }
  });

  it('should limit logs to maximum size', async () => {
    // Mock the MAX_LOGS property to a small number for testing
    Object.defineProperty(AuditLogService, 'MAX_LOGS', { value: 3 });
    
    // Log more actions than the maximum
    await AuditLogService.logSuccess('action1', {});
    await AuditLogService.logSuccess('action2', {});
    await AuditLogService.logSuccess('action3', {});
    await AuditLogService.logSuccess('action4', {});
    await AuditLogService.logSuccess('action5', {});
    
    // Get all logs
    const logs = AuditLogService.getLogs();
    
    // Verify logs are limited to maximum size
    expect(logs).toHaveLength(3);
    expect(logs[0].action).toBe('action5');
    expect(logs[1].action).toBe('action4');
    expect(logs[2].action).toBe('action3');
  });

  it('should export logs as JSON', async () => {
    // Log some actions
    await AuditLogService.logSuccess('action1', { data: 'test1' });
    await AuditLogService.logFailure('action2', { data: 'test2' }, 'Error');
    
    // Export logs
    const exportedData = await AuditLogService.exportLogs();
    const parsed = JSON.parse(exportedData);
    
    // Verify exported data
    expect(parsed).toHaveProperty('exportDate');
    expect(parsed).toHaveProperty('logs');
    expect(parsed.logs).toHaveLength(2);
    expect(parsed.logs[0].action).toBe('action2');
    expect(parsed.logs[1].action).toBe('action1');
  });

  it('should clear all logs', async () => {
    // Log some actions
    await AuditLogService.logSuccess('action1', {});
    await AuditLogService.logSuccess('action2', {});
    
    // Verify logs exist
    expect(AuditLogService.getLogs()).toHaveLength(2);
    
    // Clear logs
    await AuditLogService.clearLogs();
    
    // Verify logs are cleared
    expect(AuditLogService.getLogs()).toHaveLength(0);
  });

  it('should persist logs across service instances', async () => {
    // Log an action
    await AuditLogService.logSuccess('action1', {});
    
    // Force reload logs from storage by creating a new instance
    await AuditLogService['instance']['loadLogs']();
    
    // Verify logs are still available
    expect(AuditLogService.getLogs()).toHaveLength(1);
    expect(AuditLogService.getLogs()[0].action).toBe('action1');
  });
});
