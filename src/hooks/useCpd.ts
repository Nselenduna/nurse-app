import { useCallback, useEffect, useMemo, useState } from 'react';
import CpdService from '../services/CpdService';
import { CpdCategory, CpdLog } from '../types';

/**
 * Custom hook for accessing and managing CPD logs
 * Provides reactive state and methods for interacting with the CpdService
 * 
 * NOTE: Consider using useCpdV2 instead which addresses race conditions and memory leaks
 * See detailed documentation: /docs/hooks/usecpd.md
 * 
 * @returns {Object} Object containing:
 *  - logs: Array of CPD logs
 *  - loading: Boolean indicating if an operation is in progress
 *  - error: Error message or null
 *  - statistics: Calculated statistics for CPD logs
 *  - categoryBreakdown: Hours per category
 *  - recentLogs: Most recent logs (up to 10)
 *  - Various methods for managing logs
 */
export const useCpd = () => {
  const [logs, setLogs] = useState<CpdLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Subscribe to CPD service changes
   * Updates local state when logs change in the service
   */
  useEffect(() => {
    const unsubscribe = CpdService.subscribe((newLogs) => {
      setLogs(newLogs);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  /**
   * Memoized statistics for CPD logs
   * Recalculated when logs change
   */
  const statistics = useMemo(() => CpdService.getStatistics(), [logs]);

  /**
   * Memoized category breakdown showing hours per category
   * Recalculated when logs change
   */
  const categoryBreakdown = useMemo(() => {
    // Use reduce to build a mapping of categories to total hours
    // This is a common pattern for grouping and summing data
    return logs.reduce((acc, log) => {
      // For each log, add its hours to the accumulated value for its category
      // If the category doesn't exist yet in our accumulator, initialize it to 0
      // This handles the case of encountering a new category for the first time
      acc[log.category] = (acc[log.category] || 0) + log.hours;
      
      // Return the updated accumulator for the next iteration
      return acc;
      
      // Initialize with an empty object that will be populated with category totals
      // TypeScript cast ensures proper type inference for the accumulator
    }, {} as Record<string, number>);
    
    // The dependency array ensures this calculation reruns when logs change
    // This prevents unnecessary recalculations while ensuring data is current
  }, [logs]);

  /**
   * Memoized list of the 10 most recent logs
   * Updated when logs change
   */
  const recentLogs = useMemo(() => logs.slice(0, 10), [logs]);

  /**
   * Adds a new CPD log
   * Updates loading state during operation
   * 
   * @param {Omit<CpdLog, 'id' | 'createdAt'>} log - Log data without ID and timestamp
   * @returns {Promise<CpdLog>} The created log
   * @throws Will throw and set error state if operation fails
   */
  const addLog = useCallback(async (log: Omit<CpdLog, 'id' | 'createdAt'>) => {
    try {
      // Set loading state to true to show UI feedback during async operation
      setLoading(true);
      
      // Delegate the actual log creation to the service layer
      // This keeps business logic in the service and UI concerns in the hook
      const newLog = await CpdService.addLog(log);
      return newLog;
    } catch (err) {
      // Error handling with type narrowing for better error messages
      // If err is an Error object, use its message; otherwise use a generic message
      // This prevents undefined errors when non-Error objects are thrown
      setError(err instanceof Error ? err.message : 'Failed to add log');
      
      // Re-throw the error to allow calling code to handle it if needed
      // This enables components to implement their own error handling if desired
      throw err;
    } finally {
      // Always reset loading state regardless of success or failure
      // The finally block ensures this runs even if an error is thrown
      setLoading(false);
    }
  }, []);

  /**
   * Updates an existing CPD log
   * Updates loading state during operation
   * 
   * @param {string} id - ID of the log to update
   * @param {Partial<CpdLog>} updates - Partial log data to update
   * @returns {Promise<CpdLog | null>} The updated log or null if not found
   * @throws Will throw and set error state if operation fails
   */
  const updateLog = useCallback(async (id: string, updates: Partial<CpdLog>) => {
    try {
      setLoading(true);
      const updatedLog = await CpdService.updateLog(id, updates);
      return updatedLog;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update log');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deletes a CPD log
   * Updates loading state during operation
   * 
   * @param {string} id - ID of the log to delete
   * @returns {Promise<boolean>} True if log was found and deleted
   * @throws Will throw and set error state if operation fails
   */
  const deleteLog = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const success = await CpdService.deleteLog(id);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete log');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Gets logs filtered by category
   * 
   * @param {CpdCategory} category - The category to filter by
   * @returns {CpdLog[]} Array of logs matching the category
   */
  const getLogsByCategory = useCallback((category: CpdCategory) => {
    return CpdService.getLogsByCategory(category);
  }, []);

  /**
   * Searches logs by text content, category, or tags
   * 
   * @param {string} query - Search query string
   * @returns {CpdLog[]} Array of logs matching the search query
   */
  const searchLogs = useCallback((query: string) => {
    return CpdService.searchLogs(query);
  }, []);

  /**
   * Exports all CPD data as a JSON string
   * Updates loading state during operation
   * 
   * @returns {Promise<string>} JSON string containing all CPD data
   * @throws Will throw and set error state if operation fails
   */
  const exportData = useCallback(async () => {
    try {
      setLoading(true);
      return await CpdService.exportData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Imports CPD data from a JSON string
   * Updates loading state during operation
   * 
   * @param {string} data - JSON string containing CPD data
   * @returns {Promise<void>}
   * @throws Will throw and set error state if operation fails
   */
  const importData = useCallback(async (data: string) => {
    try {
      setLoading(true);
      await CpdService.importData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clears all CPD logs
   * Updates loading state during operation
   * 
   * @returns {Promise<void>}
   * @throws Will throw and set error state if operation fails
   */
  const clearAll = useCallback(async () => {
    try {
      setLoading(true);
      await CpdService.clearAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Gets logs within a specified date range
   * 
   * @param {Date} startDate - Start date of the range (inclusive)
   * @param {Date} endDate - End date of the range (inclusive)
   * @returns {CpdLog[]} Array of logs within the date range
   */
  const getLogsByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return CpdService.getLogsByDateRange(startDate, endDate);
  }, []);

  /**
   * Resets the error state
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    logs,
    loading,
    error,
    
    // Statistics
    statistics,
    categoryBreakdown,
    recentLogs,
    
    // Actions
    addLog,
    updateLog,
    deleteLog,
    getLogsByCategory,
    searchLogs,
    exportData,
    importData,
    clearAll,
    getLogsByDateRange,
    resetError,
  };
};
