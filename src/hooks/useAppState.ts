import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Custom hook for monitoring app state changes
 * 
 * @returns {Object} App state information and handlers
 */
export function useAppState() {
  const appStateRef = useRef(AppState.currentState);
  const [appState, setAppState] = useState(appStateRef.current);
  const [isActive, setIsActive] = useState(appState === 'active');
  const [isBackground, setIsBackground] = useState(appState === 'background');
  const [isInactive, setIsInactive] = useState(appState === 'inactive');
  
  /**
   * Handles app state changes
   * 
   * @param {AppStateStatus} nextAppState - Next app state
   */
  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    // Check if app is coming from background to foreground
    const isComingFromBackground = 
      appStateRef.current.match(/inactive|background/) && nextAppState === 'active';
    
    // Check if app is going from foreground to background
    const isGoingToBackground = 
      appStateRef.current === 'active' && nextAppState.match(/inactive|background/);
    
    // Update state
    appStateRef.current = nextAppState;
    setAppState(nextAppState);
    setIsActive(nextAppState === 'active');
    setIsBackground(nextAppState === 'background');
    setIsInactive(nextAppState === 'inactive');
    
    // Call lifecycle callbacks
    if (isComingFromBackground) {
      onForeground();
    } else if (isGoingToBackground) {
      onBackground();
    }
  }, []);
  
  /**
   * Called when the app comes to the foreground
   */
  const onForeground = useCallback(() => {
    // Add your foreground logic here
    // For example: refresh data, restart animations, etc.
  }, []);
  
  /**
   * Called when the app goes to the background
   */
  const onBackground = useCallback(() => {
    // Add your background logic here
    // For example: pause timers, save state, etc.
  }, []);
  
  // Subscribe to app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);
  
  return {
    appState,
    isActive,
    isBackground,
    isInactive,
    onForeground,
    onBackground,
  };
}
