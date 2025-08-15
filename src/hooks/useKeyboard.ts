import { useCallback, useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, KeyboardEventName, Platform } from 'react-native';

/**
 * Custom hook for monitoring keyboard visibility and dimensions
 * 
 * @returns {Object} Keyboard information and handlers
 */
export function useKeyboard() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardAnimationDuration, setKeyboardAnimationDuration] = useState(0);
  
  /**
   * Handles keyboard show event
   * 
   * @param {KeyboardEvent} event - Keyboard event
   */
  const handleKeyboardShow = useCallback((event: KeyboardEvent) => {
    const { height, duration } = event.endCoordinates;
    setIsKeyboardVisible(true);
    setKeyboardHeight(height);
    setKeyboardAnimationDuration(duration);
  }, []);
  
  /**
   * Handles keyboard hide event
   * 
   * @param {KeyboardEvent} event - Keyboard event
   */
  const handleKeyboardHide = useCallback((event: KeyboardEvent) => {
    const { duration } = event.endCoordinates;
    setIsKeyboardVisible(false);
    setKeyboardHeight(0);
    setKeyboardAnimationDuration(duration);
  }, []);
  
  /**
   * Dismisses the keyboard
   */
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);
  
  // Subscribe to keyboard events
  useEffect(() => {
    // Event names differ between iOS and Android
    const showEvent: KeyboardEventName = 
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent: KeyboardEventName = 
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    
    // Add event listeners
    const showSubscription = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);
    
    // Cleanup subscriptions
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [handleKeyboardShow, handleKeyboardHide]);
  
  return {
    isKeyboardVisible,
    keyboardHeight,
    keyboardAnimationDuration,
    dismissKeyboard,
  };
}
