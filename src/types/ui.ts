import { ReactNode } from 'react';

/**
 * Icon names used in the application
 * This provides type safety for Ionicons names
 */
export type IconName = 
  | 'add-circle-outline'
  | 'checkmark-circle'
  | 'chevron-forward'
  | 'document-text-outline'
  | 'download-outline'
  | 'home'
  | 'list'
  | 'mic'
  | 'mic-outline'
  | 'pulse'
  | 'settings'
  | 'trash-outline'
  | 'upload-outline';

/**
 * Common props for all screen components
 */
export interface ScreenProps {
  /**
   * Optional title to display at the top of the screen
   */
  title?: string;
  
  /**
   * Optional subtitle to display below the title
   */
  subtitle?: string;
  
  /**
   * Whether to show a loading indicator
   */
  loading?: boolean;
  
  /**
   * Whether to show a refresh control
   */
  refreshable?: boolean;
  
  /**
   * Function to call when the screen is refreshed
   */
  onRefresh?: () => void;
  
  /**
   * Children to render inside the screen
   */
  children: ReactNode;
}

/**
 * Props for section components
 */
export interface SectionProps {
  /**
   * Title of the section
   */
  title: string;
  
  /**
   * Optional subtitle for the section
   */
  subtitle?: string;
  
  /**
   * Children to render inside the section
   */
  children: ReactNode;
}

/**
 * Props for card components
 */
export interface CardProps {
  /**
   * Optional title for the card
   */
  title?: string;
  
  /**
   * Optional function to call when the card is pressed
   */
  onPress?: () => void;
  
  /**
   * Children to render inside the card
   */
  children: ReactNode;
  
  /**
   * Optional style overrides
   */
  style?: any;
}

/**
 * Props for button components
 */
export interface ButtonProps {
  /**
   * Text to display on the button
   */
  label: string;
  
  /**
   * Function to call when the button is pressed
   */
  onPress: () => void;
  
  /**
   * Optional icon name to display on the button
   */
  icon?: IconName;
  
  /**
   * Whether the button is in a loading state
   */
  loading?: boolean;
  
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the button is a destructive action
   */
  destructive?: boolean;
  
  /**
   * Optional style overrides
   */
  style?: any;
  
  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
}

/**
 * Props for settings item components
 */
export interface SettingsItemProps {
  /**
   * Icon to display for the settings item
   */
  icon: IconName;
  
  /**
   * Title of the settings item
   */
  title: string;
  
  /**
   * Subtitle or description of the settings item
   */
  subtitle: string;
  
  /**
   * Function to call when the settings item is pressed
   */
  onPress: () => void;
  
  /**
   * Whether this is a destructive action
   */
  destructive?: boolean;
  
  /**
   * Whether to show a chevron icon
   */
  showChevron?: boolean;
  
  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
}

/**
 * Props for empty state components
 */
export interface EmptyStateProps {
  /**
   * Icon to display in the empty state
   */
  icon: IconName;
  
  /**
   * Title of the empty state
   */
  title: string;
  
  /**
   * Subtitle or description of the empty state
   */
  subtitle: string;
  
  /**
   * Optional action button label
   */
  actionLabel?: string;
  
  /**
   * Optional function to call when the action button is pressed
   */
  onAction?: () => void;
}
