import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for monitoring network connectivity
 * 
 * @returns {Object} Network status information and handlers
 */
export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [connectionDetails, setConnectionDetails] = useState<NetInfoState | null>(null);
  
  /**
   * Updates network state from NetInfo
   * 
   * @param {NetInfoState} state - Network state
   */
  const updateNetworkState = useCallback((state: NetInfoState) => {
    setIsConnected(state.isConnected);
    setIsInternetReachable(state.isInternetReachable);
    setConnectionType(state.type);
    setConnectionDetails(state);
  }, []);
  
  /**
   * Manually fetches the current network state
   */
  const checkConnection = useCallback(async () => {
    const state = await NetInfo.fetch();
    updateNetworkState(state);
    return state;
  }, [updateNetworkState]);
  
  // Subscribe to network state changes
  useEffect(() => {
    // Initial check
    checkConnection();
    
    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener(updateNetworkState);
    
    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, [checkConnection, updateNetworkState]);
  
  return {
    isConnected,
    isInternetReachable,
    connectionType,
    connectionDetails,
    checkConnection,
  };
}
