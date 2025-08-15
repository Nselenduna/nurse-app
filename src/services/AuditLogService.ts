import { STORAGE_KEYS } from '../constants';
import StorageService from './StorageService';

/**
 * Interface for audit log entries
 */
interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  userId?: string;
  details: Record<string, any>;
  success: boolean;
  errorMessage?: string;
}

/**
 * Service for tracking audit logs of important operations
 * Implements a singleton pattern for consistent logging
 */
class AuditLogService {
  private static instance: AuditLogService;
  private logs: AuditLogEntry[] = [];
  private readonly MAX_LOGS = 1000;
  private readonly STORAGE_KEY = STORAGE_KEYS.auditLogs || 'audit_logs';

  private constructor() {
    this.loadLogs();
  }

  /**
   * Gets the singleton instance of the AuditLogService
   * 
   * @static
   * @returns {AuditLogService} The singleton instance
   */
  static getInstance(): AuditLogService {
    if (!AuditLogService.instance) {
      AuditLogService.instance = new AuditLogService();
    }
    return AuditLogService.instance;
  }

  /**
   * Loads audit logs from persistent storage
   * 
   * @private
   * @returns {Promise<void>}
   */
  private async loadLogs(): Promise<void> {
    try {
      const stored = await StorageService.get<AuditLogEntry[]>(this.STORAGE_KEY);
      this.logs = stored || [];
    } catch (error) {
      console.error('Error loading audit logs:', error);
      this.logs = [];
    }
  }

  /**
   * Saves audit logs to persistent storage
   * 
   * @private
   * @returns {Promise<void>}
   */
  private async saveLogs(): Promise<void> {
    try {
      await StorageService.set(this.STORAGE_KEY, this.logs);
    } catch (error) {
      console.error('Error saving audit logs:', error);
      throw error;
    }
  }

  /**
   * Logs a successful action
   * 
   * @param {string} action - The action being performed
   * @param {Record<string, any>} details - Additional details about the action
   * @param {string} [userId] - Optional user ID
   * @returns {Promise<void>}
   */
  async logSuccess(
    action: string,
    details: Record<string, any>,
    userId?: string
  ): Promise<void> {
    await this.addLog({
      id: Date.now().toString(),
      timestamp: Date.now(),
      action,
      userId,
      details,
      success: true,
    });
  }

  /**
   * Logs a failed action
   * 
   * @param {string} action - The action being performed
   * @param {Record<string, any>} details - Additional details about the action
   * @param {string} errorMessage - Description of the error
   * @param {string} [userId] - Optional user ID
   * @returns {Promise<void>}
   */
  async logFailure(
    action: string,
    details: Record<string, any>,
    errorMessage: string,
    userId?: string
  ): Promise<void> {
    await this.addLog({
      id: Date.now().toString(),
      timestamp: Date.now(),
      action,
      userId,
      details,
      success: false,
      errorMessage,
    });
  }

  /**
   * Adds a log entry and maintains the maximum log size
   * 
   * @private
   * @param {AuditLogEntry} log - The log entry to add
   * @returns {Promise<void>}
   */
  private async addLog(log: AuditLogEntry): Promise<void> {
    // Add new log at the beginning
    this.logs.unshift(log);
    
    // Trim logs if they exceed the maximum size
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }
    
    await this.saveLogs();
  }

  /**
   * Gets all audit logs
   * 
   * @returns {AuditLogEntry[]} Array of all audit logs
   */
  getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  /**
   * Gets logs filtered by action type
   * 
   * @param {string} action - The action to filter by
   * @returns {AuditLogEntry[]} Filtered logs
   */
  getLogsByAction(action: string): AuditLogEntry[] {
    return this.logs.filter(log => log.action === action);
  }

  /**
   * Gets logs filtered by success status
   * 
   * @param {boolean} success - Whether to get successful or failed logs
   * @returns {AuditLogEntry[]} Filtered logs
   */
  getLogsByStatus(success: boolean): AuditLogEntry[] {
    return this.logs.filter(log => log.success === success);
  }

  /**
   * Gets logs within a date range
   * 
   * @param {Date} startDate - Start of the range
   * @param {Date} endDate - End of the range
   * @returns {AuditLogEntry[]} Filtered logs
   */
  getLogsByDateRange(startDate: Date, endDate: Date): AuditLogEntry[] {
    return this.logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  /**
   * Clears all audit logs
   * Use with caution - typically only for testing or admin functions
   * 
   * @returns {Promise<void>}
   */
  async clearLogs(): Promise<void> {
    this.logs = [];
    await this.saveLogs();
  }

  /**
   * Exports audit logs as a JSON string
   * 
   * @returns {Promise<string>} JSON string of audit logs
   */
  async exportLogs(): Promise<string> {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      logs: this.logs,
    }, null, 2);
  }
}

export default AuditLogService.getInstance();
