# useCpd vs useCpdV2

This document compares the original `useCpd` hook with the improved `useCpdV2` hook and provides guidance on migration.

## useCpd

The original `useCpd` hook provides access to the CPD service functionality. However, it has some limitations:

1. **Race Conditions**: When multiple async operations are in progress simultaneously, the loading state may be set incorrectly.

2. **Memory Leaks**: No protection against state updates after component unmount.

3. **State Updates**: Uses separate useState calls, which can lead to inconsistent state.

## useCpdV2 (Recommended)

The improved `useCpdV2` hook addresses these issues:

1. **Race Condition Handling**: Uses a reducer with operation tracking to correctly manage loading state.

2. **Memory Leak Protection**: Uses a ref to track mounted state and prevents updates after unmount.

3. **Atomic State Updates**: Uses useReducer for consistent atomic state updates.

4. **Operation Tracking**: Each operation gets a unique ID, allowing multiple concurrent operations.

## Usage Example


```jsx
import { useCpdV2 } from '@/src/hooks/useCpdV2';

function MyComponent() {
  const {
    logs,
    loading,
    error,
    statistics,
    addLog,
    clearAll,
    resetError
  } = useCpdV2();

  const handleAddLog = async () => {
    try {
      await addLog({
        text: 'New log entry',
        category: 'Clinical Practice',
        hours: 1,
        isVoiceGenerated: false
      });
      // Success handling
    } catch (err) {
      // Error is already set in the hook state
      // Additional error handling if needed
    }
  };

  return (
    <View>
      {loading && <LoadingIndicator />}
      {error && <ErrorMessage message={error} onDismiss={resetError} />}

      {/* Render content based on logs and statistics */}
    </View>
  );
}

```


## API Reference

Both hooks provide the following API:


```typescript
interface UseCpdReturn {
  // State
  logs: CpdLog[];
  loading: boolean;
  error: string | null;

  // Statistics
  statistics: {
    totalHours: number;
    totalActivities: number;
    voiceGeneratedCount: number;
    categoryBreakdown: Record<string, number>;
    progressPercentage: number;
    remainingHours: number;
    targetHours: number;
  };
  categoryBreakdown: Record<string, number>;
  recentLogs: CpdLog[];

  // Actions
  addLog: (log: Omit<CpdLog, 'id' | 'createdAt'>) => Promise<CpdLog>;
  updateLog: (id: string, updates: Partial<CpdLog>) => Promise<CpdLog | null>;
  deleteLog: (id: string) => Promise<boolean>;
  getLogsByCategory: (category: CpdCategory) => CpdLog[];
  searchLogs: (query: string) => CpdLog[];
  exportData: () => Promise<string>;
  importData: (data: string) => Promise<void>;
  clearAll: () => Promise<void>;
  getLogsByDateRange: (startDate: Date, endDate: Date) => CpdLog[];
  resetError: () => void;
}

```


## Key Differences in Implementation

### useCpd Implementation


```typescript
export const useCpd = () => {
  const [logs, setLogs] = useState<CpdLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to service changes
  useEffect(() => {
    const unsubscribe = CpdService.subscribe((newLogs) => {
      setLogs(newLogs);
      setLoading(false);
      setError(null);
    });
    return unsubscribe;
  }, []);

  const addLog = useCallback(async (log: Omit<CpdLog, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      const newLog = await CpdService.addLog(log);
      return newLog;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add log');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Other methods...
}

```


### useCpdV2 Implementation


```typescript
export const useCpdV2 = () => {
  const [state, dispatch] = useReducer(cpdReducer, initialState);
  const { logs, loading, error } = state;

  // Use a ref to track mounted state
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Subscribe to service changes
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

  const addLog = useCallback(async (log: Omit<CpdLog, 'id' | 'createdAt'>) => {
    const operationId = createOperationId('add_log');

    try {
      dispatch({ type: 'START_OPERATION', operationId });
      const newLog = await CpdService.addLog(log);
      return newLog;
    } catch (err) {
      if (isMountedRef.current) {
        dispatch({
          type: 'SET_ERROR',
          payload: err instanceof Error ? err.message : 'Failed to add log'
        });
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        dispatch({ type: 'END_OPERATION', operationId });
      }
    }
  }, [createOperationId]);

  // Other methods...
}

```


## Migration Guide

To migrate from `useCpd` to `useCpdV2`:

1. Update your imports:

```diff
- import { useCpd } from '@/src/hooks/useCpd';

+ import { useCpdV2 } from '@/src/hooks/useCpdV2';

```


2. Replace hook usage:

```diff
- const { logs, loading, error, /* other values */ } = useCpd();

+ const { logs, loading, error, /* other values */ } = useCpdV2();

```


3. The API surface is identical, so no other changes are needed.

## Testing

A comprehensive test suite is available for `useCpdV2` in `__tests__/useCpdV2.test.ts`. The tests verify:

- Initial state loading

- Statistics and derived data calculations

- Successful and failed log operations

- Concurrent operation handling

- Error state management
