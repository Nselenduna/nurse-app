import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import CpdService from '../services/CpdService';
import { CpdCategory, CpdLog } from '../types';

/**
 * Action types for the reducer
 */
type ActionType = 
  | { type: 'SET_LOGS', payload: CpdLog[] }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: string | null }
  | { type: 'RESET_ERROR' }
  | { type: 'START_OPERATION', operationId: string }
  | { type: 'END_OPERATION', operationId: string };

/**
 * State interface for the reducer
 */
interface CpdState {
  logs: CpdLog[];
  loading: boolean;
  error: string | null;
  activeOperations: Set<string>;
}

/**
 * Initial state for the reducer
 */
const initialState: CpdState = {
  logs: [],
  loading: true,
  error: null,
  activeOperations: new Set(),
};

/**
 * Reducer function for managing CPD state
 * Provides atomic updates to state and prevents race conditions
 */
function cpdReducer(state: CpdState, action: ActionType): CpdState {
  switch (action.type) {
    case 'SET_LOGS':
      return { ...state, logs: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET_ERROR':
      return { ...state, error: null };
    
    case 'START_OPERATION': {
      const newOperations = new Set(state.activeOperations);
      newOperations.add(action.operationId);
      return { ...state, activeOperations: newOperations, loading: true };
    }
    
    case 'END_OPERATION': {
      const newOperations = new Set(state.activeOperations);
      newOperations.delete(action.operationId);
      // Only set loading to false if no operations are active
      return { 
        ...state, 
        activeOperations: newOperations,
        loading: newOperations.size > 0 
      };
    }
    
    default:
      return state;
  }
}

/**
 * Custom hook for accessing and managing CPD logs
 * Uses useReducer for atomic state updates to prevent race conditions
 * 
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
export const useCpdV2 = () => {
  const [state, dispatch] = useReducer(cpdReducer, initialState);
  const { logs, loading, error } = state;
  
  // Use a ref to track mounted state to prevent updates after unmount
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    // Set mounted to true when the component mounts
    isMountedRef.current = true;
    
    return () => {
      // Set mounted to false when the component unmounts
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Subscribe to CPD service changes
   * Updates local state when logs change in the service
   * Uses isMountedRef to prevent updates after unmount
   */
  useEffect(() => {
    const unsubscribe = CpdService.subscribe((newLogs) => {
      if (isMountedRef.current) {
        dispatch({ type: 'SET_LOGS', payload: newLogs });
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_ERROR', payload: null });
      }
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
    return logs.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + log.hours;
      return acc;
    }, {} as Record<string, number>);
  }, [logs]);

  /**
   * Memoized list of the 10 most recent logs
   * Updated when logs change
   */
  const recentLogs = useMemo(() => logs.slice(0, 10), [logs]);

  /**
   * Creates a unique operation ID based on the operation type and timestamp
   * Used to track concurrent operations
   * 
   * @param {string} operationType - The type of operation being performed
   * @returns {string} A unique operation ID
   */
  const createOperationId = useCallback((operationType: string): string => {
    return `${operationType}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  /**
   * Adds a new CPD log with race condition handling
   * 
   * @param {Omit<CpdLog, 'id' | 'createdAt'>} log - Log data without ID and timestamp
   * @returns {Promise<CpdLog>} The created log
   * @throws Will throw and set error state if operation fails
   */
  const addLog = useCallback(async (log: Omit<CpdLog, 'id' | 'createdAt'>) => {
    const operationId = createOperationId('add_log');
    
    try {
      // Start the operation with a unique ID
      dispatch({ type: 'START_OPERATION', operationId });
      
      const newLog = await CpdService.addLog(log);
      return newLog;
    } catch (err) {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: err instanceof Error ? err.message : 'Failed to add log'
        });
      }
      throw err;
    } finally {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        dispatch({ type: 'END_OPERATION', operationId });
      }
    }
  }, [createOperationId]);

  /**
   * Updates an existing CPD log with race condition handling
   * 
   * @param {string} id - ID of the log to update
   * @param {Partial<CpdLog>} updates - Partial log data to update
   * @returns {Promise<CpdLog | null>} The updated log or null if not found
   * @throws Will throw and set error state if operation fails
   */
  const updateLog = useCallback(async (id: string, updates: Partial<CpdLog>) => {
    const operationId = createOperationId('update_log');
    
    try {
      dispatch({ type: 'START_OPERATION', operationId });
      
      const updatedLog = await CpdService.updateLog(id, updates);
      return updatedLog;
    } catch (err) {
      if (isMountedRef.current) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: err instanceof Error ? err.message : 'Failed to update log'
        });
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        dispatch({ type: 'END_OPERATION', operationId });
      }
    }
  }, [createOperationId]);

  /**
   * Deletes a CPD log with race condition handling
   * 
   * @param {string} id - ID of the log to delete
   * @returns {Promise<boolean>} True if log was found and deleted
   * @throws Will throw and set error state if operation fails
   */
  const deleteLog = useCallback(async (id: string) => {
    const operationId = createOperationId('delete_log');
    
    try {
      dispatch({ type: 'START_OPERATION', operationId });
      
      const success = await CpdService.deleteLog(id);
      return success;
    } catch (err) {
      if (isMountedRef.current) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: err instanceof Error ? err.message : 'Failed to delete log'
        });
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        dispatch({ type: 'END_OPERATION', operationId });
      }
    }
  }, [createOperationId]);

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
   * Exports all CPD data as a JSON string with race condition handling
   * 
   * @returns {Promise<string>} JSON string containing all CPD data
   * @throws Will throw and set error state if operation fails
   */
  const exportData = useCallback(async () => {
    const operationId = createOperationId('export_data');
    
    try {
      dispatch({ type: 'START_OPERATION', operationId });
      
      return await CpdService.exportData();
    } catch (err) {
      if (isMountedRef.current) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: err instanceof Error ? err.message : 'Failed to export data'
        });
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        dispatch({ type: 'END_OPERATION', operationId });
      }
    }
  }, [createOperationId]);

  /**
   * Imports CPD data from a JSON string with race condition handling
   * 
   * @param {string} data - JSON string containing CPD data
   * @returns {Promise<void>}
   * @throws Will throw and set error state if operation fails
   */
  const importData = useCallback(async (data: string) => {
    const operationId = createOperationId('import_data');
    
    try {
      dispatch({ type: 'START_OPERATION', operationId });
      
      await CpdService.importData(data);
    } catch (err) {
      if (isMountedRef.current) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: err instanceof Error ? err.message : 'Failed to import data'
        });
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        dispatch({ type: 'END_OPERATION', operationId });
      }
    }
  }, [createOperationId]);

  /**
   * Clears all CPD logs with race condition handling
   * 
   * @returns {Promise<void>}
   * @throws Will throw and set error state if operation fails
   */
  const clearAll = useCallback(async () => {
    const operationId = createOperationId('clear_all');
    
    try {
      dispatch({ type: 'START_OPERATION', operationId });
      
      await CpdService.clearAll();
    } catch (err) {
      if (isMountedRef.current) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: err instanceof Error ? err.message : 'Failed to clear data'
        });
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        dispatch({ type: 'END_OPERATION', operationId });
      }
    }
  }, [createOperationId]);

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
    dispatch({ type: 'RESET_ERROR' });
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

export default useCpdV2;
