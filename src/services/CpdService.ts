import { REVALIDATION_REQUIREMENTS, STORAGE_KEYS } from '../constants';
import { CpdCategory, CpdLog } from '../types';
import AuditLogService from './AuditLogService';
import LoggingService from './LoggingService';
import StorageService from './StorageService';

/**
 * Service for managing Continuing Professional Development (CPD) logs
 * Provides methods for CRUD operations on CPD logs and statistics calculation
 * Implements a singleton pattern with observer notifications
 * 
 * @class CpdService
 * @exports A singleton instance of CpdService
 */
class CpdService {
  private static instance: CpdService;
  private logs: CpdLog[] = [];
  private listeners: Set<(logs: CpdLog[]) => void> = new Set();

  private constructor() {
    this.loadLogs();
  }

  /**
   * Gets the singleton instance of the CpdService
   * 
   * @static
   * @returns {CpdService} The singleton instance
   */
  static getInstance(): CpdService {
    if (!CpdService.instance) {
      CpdService.instance = new CpdService();
    }
    return CpdService.instance;
  }

  /**
   * Loads CPD logs from persistent storage
   * Called during initialization
   * 
   * @private
   * @returns {Promise<void>}
   */
  private async loadLogs(): Promise<void> {
    try {
      const stored = await StorageService.get<CpdLog[]>(STORAGE_KEYS.cpdLogs);
      this.logs = stored || [];
      this.notifyListeners();
    } catch (error) {
      LoggingService.error('Failed to load CPD logs', error, 'CpdService');
      this.logs = [];
    }
  }

  /**
   * Saves CPD logs to persistent storage
   * 
   * @private
   * @returns {Promise<void>}
   * @throws Will throw an error if saving fails
   */
  private async saveLogs(): Promise<void> {
    try {
      await StorageService.set(STORAGE_KEYS.cpdLogs, this.logs);
    } catch (error) {
      LoggingService.error('Failed to save CPD logs', error, 'CpdService');
      throw error;
    }
  }

  /**
   * Notifies all registered listeners with the current logs
   * Provides a defensive copy of the logs array
   * 
   * @private
   * @returns {void}
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.logs]));
  }

  /**
   * Subscribes to changes in the CPD logs collection
   * Immediately calls the listener with current data
   * 
   * @param {function} listener - Function to call when logs change
   * @returns {function} Unsubscribe function to remove the listener
   */
  subscribe(listener: (logs: CpdLog[]) => void): () => void {
    this.listeners.add(listener);
    // Immediately call with current data
    listener([...this.logs]);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Gets all CPD logs
   * Returns a defensive copy of the logs array
   * 
   * @returns {CpdLog[]} Array of all CPD logs
   */
  getLogs(): CpdLog[] {
    return [...this.logs];
  }

  /**
   * Gets logs filtered by category
   * 
   * @param {CpdCategory} category - The category to filter by
   * @returns {CpdLog[]} Array of logs matching the specified category
   */
  getLogsByCategory(category: CpdCategory): CpdLog[] {
    return this.logs.filter(log => log.category === category);
  }

  /**
   * Gets logs within a specified date range
   * 
   * @param {Date} startDate - Start date of the range (inclusive)
   * @param {Date} endDate - End date of the range (inclusive)
   * @returns {CpdLog[]} Array of logs within the date range
   */
  getLogsByDateRange(startDate: Date, endDate: Date): CpdLog[] {
    return this.logs.filter(log => {
      const logDate = new Date(log.createdAt);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  /**
   * Adds a new CPD log
   * Generates ID and timestamp automatically
   * 
   * @param {Omit<CpdLog, 'id' | 'createdAt'>} log - Log data without ID and creation timestamp
   * @returns {Promise<CpdLog>} The created log with ID and timestamp
   * @throws Will throw an error if saving fails
   */
  async addLog(log: Omit<CpdLog, 'id' | 'createdAt'>): Promise<CpdLog> {
    const newLog: CpdLog = {
      ...log,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };

    this.logs.unshift(newLog);
    await this.saveLogs();
    this.notifyListeners();
    
    return newLog;
  }

  /**
   * Updates an existing CPD log
   * Automatically adds updatedAt timestamp
   * 
   * @param {string} id - ID of the log to update
   * @param {Partial<CpdLog>} updates - Partial log data to update
   * @returns {Promise<CpdLog | null>} The updated log or null if not found
   * @throws Will throw an error if saving fails
   */
  async updateLog(id: string, updates: Partial<CpdLog>): Promise<CpdLog | null> {
    const index = this.logs.findIndex(log => log.id === id);
    if (index === -1) return null;

    this.logs[index] = {
      ...this.logs[index],
      ...updates,
      updatedAt: Date.now(),
    };

    await this.saveLogs();
    this.notifyListeners();
    
    return this.logs[index];
  }

  /**
   * Deletes a CPD log by ID
   * 
   * @param {string} id - ID of the log to delete
   * @returns {Promise<boolean>} True if log was found and deleted, false otherwise
   * @throws Will throw an error if saving fails
   */
  async deleteLog(id: string): Promise<boolean> {
    const index = this.logs.findIndex(log => log.id === id);
    if (index === -1) return false;

    this.logs.splice(index, 1);
    await this.saveLogs();
    this.notifyListeners();
    
    return true;
  }

  /**
   * Calculates statistics based on the current CPD logs
   * 
   * @returns {Object} Statistics object containing:
   *  - totalHours: Total hours across all logs
   *  - totalActivities: Number of CPD activities
   *  - voiceGeneratedCount: Number of voice-generated logs
   *  - categoryBreakdown: Hours per category
   *  - progressPercentage: Percentage of target hours completed (capped at 100%)
   *  - remainingHours: Hours remaining to reach target (minimum 0)
   *  - targetHours: The required hours from configuration
   */
  getStatistics() {
    // Calculate total hours across all logs using reduce
    // Initial value of 0 handles empty logs array edge case
    const totalHours = this.logs.reduce((sum, log) => sum + log.hours, 0);
    
    // Simple count of all activities
    const totalActivities = this.logs.length;
    
    // Count logs created through voice input
    // Used for analytics and feature usage tracking
    const voiceGeneratedCount = this.logs.filter(log => log.isVoiceGenerated).length;
    
    // Build a breakdown of hours by category
    // Creates an object with categories as keys and total hours as values
    // The || 0 handles the case when a category is encountered for the first time
    const categoryBreakdown = this.logs.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + log.hours;
      return acc;
    }, {} as Record<string, number>);

    // Calculate progress percentage but cap at 100%
    // Prevents progress bar from exceeding container bounds
    // Division by zero is handled implicitly (will result in 0%)
    const progressPercentage = Math.min(
      (totalHours / REVALIDATION_REQUIREMENTS.targetHours) * 100, 
      100
    );

    // Calculate remaining hours but ensure it never goes below zero
    // Prevents negative values when user exceeds target hours
    const remainingHours = Math.max(
      REVALIDATION_REQUIREMENTS.targetHours - totalHours, 
      0
    );

    // Return a comprehensive statistics object with all calculated metrics
    return {
      totalHours,
      totalActivities,
      voiceGeneratedCount,
      categoryBreakdown,
      progressPercentage,
      remainingHours,
      targetHours: REVALIDATION_REQUIREMENTS.targetHours,
    };
  }

  /**
   * Searches logs by text content, category, or tags
   * Case-insensitive search
   * 
   * @param {string} query - Search query string
   * @returns {CpdLog[]} Array of logs matching the search query
   */
  searchLogs(query: string): CpdLog[] {
    const lowerQuery = query.toLowerCase();
    return this.logs.filter(log => 
      log.text.toLowerCase().includes(lowerQuery) ||
      log.category.toLowerCase().includes(lowerQuery) ||
      (log.tags && log.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }

  /**
   * Gets the most recent CPD logs
   * 
   * @param {number} limit - Maximum number of logs to return (default: 10)
   * @returns {CpdLog[]} Array of the most recent logs
   */
  getRecentLogs(limit: number = 10): CpdLog[] {
    return this.logs.slice(0, limit);
  }

  /**
   * Exports all CPD data as a JSON string
   * Includes logs, statistics, and export date
   * 
   * @returns {Promise<string>} JSON string containing all CPD data
   * @throws Will throw an error if export fails
   */
  async exportData(): Promise<string> {
    try {
      // Create an export object with metadata and logs
      // This structure allows for future expansion of export data
      const exportData = {
        // Include timestamp to track when the export was created
        // ISO format ensures consistent date formatting across platforms
        exportDate: new Date().toISOString(),
        
        // Include pre-calculated statistics for convenience
        // This saves the importing application from having to recalculate
        statistics: this.getStatistics(),
        
        // Include the complete logs array
        // Using the raw logs ensures no data is lost in the export
        logs: this.logs,
      };
      
      // Convert to JSON with pretty-printing (2-space indentation)
      // Pretty-printing makes the exported JSON human-readable
      const jsonData = JSON.stringify(exportData, null, 2);
      
      // Log successful export
      await AuditLogService.logSuccess(
        'export_data',
        {
          format: 'json',
          logCount: this.logs.length,
          dataSize: jsonData.length,
        }
      );
      
      return jsonData;
    } catch (error) {
      // Log export failure
      await AuditLogService.logFailure(
        'export_data',
        {
          format: 'json',
          logCount: this.logs.length,
        },
        error instanceof Error ? error.message : 'Unknown error during export'
      );
      
      // Re-throw the error
      throw error;
    }
  }

  /**
   * Imports CPD data from a JSON string
   * Replaces all existing logs with imported data
   * 
   * @param {string} data - JSON string containing CPD data
   * @returns {Promise<void>}
   * @throws Will throw an error if data format is invalid or saving fails
   */
  async importData(data: string): Promise<void> {
    // Store original logs for rollback in case of failure
    const originalLogs = [...this.logs];
    
    try {
      // Parse the JSON string into a JavaScript object
      // This will throw if the JSON is malformed
      const parsed = JSON.parse(data);
      
      // Validate that the parsed data has a logs array
      // This ensures we're importing valid CPD data
      if (parsed.logs && Array.isArray(parsed.logs)) {
        // Replace the current logs with the imported ones
        // This is a complete replacement, not a merge
        this.logs = parsed.logs;
        
        // Persist the imported logs to storage
        await this.saveLogs();
        
        // Notify all subscribers about the data change
        // This updates any UI components displaying the logs
        this.notifyListeners();
        
        // Log successful import
        await AuditLogService.logSuccess(
          'import_data',
          {
            logCount: parsed.logs.length,
            importDate: parsed.exportDate || 'unknown',
          }
        );
      } else {
        // Log warning for invalid structure but don't throw
        await AuditLogService.logFailure(
          'import_data',
          { dataSize: data.length },
          'Invalid data structure: missing logs array'
        );
      }
    } catch (error) {
      // Rollback to original logs
      this.logs = originalLogs;
      
      // Log the import failure
      await AuditLogService.logFailure(
        'import_data',
        { dataSize: data.length },
        error instanceof Error ? error.message : 'Unknown error during import'
      );
      
      // Log the original error for debugging
      LoggingService.error('Failed to import CPD data', error, 'CpdService');
      
      // Throw a more user-friendly error
      // This abstracts away the technical details of the failure
      throw new Error('Invalid import data format');
    }
  }

  /**
   * Clears all CPD logs
   * 
   * @returns {Promise<void>}
   * @throws Will throw an error if saving fails
   */
  async clearAll(): Promise<void> {
    try {
      const logCount = this.logs.length;
      this.logs = [];
      await this.saveLogs();
      this.notifyListeners();
      
      // Log successful clear operation
      await AuditLogService.logSuccess(
        'clear_logs',
        { logCount }
      );
    } catch (error) {
      // Log failure
      await AuditLogService.logFailure(
        'clear_logs',
        {},
        error instanceof Error ? error.message : 'Unknown error during clear operation'
      );
      
      // Re-throw the error
      throw error;
    }
  }
}

export default CpdService.getInstance();
