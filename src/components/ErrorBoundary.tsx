import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LoggingService from '../services/LoggingService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of the component tree that crashed
 * 
 * @component
 * @param {Props} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our logging service
    LoggingService.critical('React Error Boundary caught an error', error, 'ErrorBoundary');
    
    // Log additional error info for debugging
    LoggingService.error('Error info', errorInfo, 'ErrorBoundary');
    
    // Update state with error info
    this.setState({ error, errorInfo });
  }

  handleRetry = (): void => {
    // Reset the error state to allow the app to retry
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReportError = (): void => {
    // In a real app, this would send the error to a remote logging service
    const { error, errorInfo } = this.state;
    
    if (error && errorInfo) {
      LoggingService.critical('User requested error report', {
        error: error.message,
        componentStack: errorInfo.componentStack,
        stack: error.stack
      }, 'ErrorBoundary');
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry, but something unexpected happened. Please try again.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={this.handleReportError}>
              <Text style={styles.buttonText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
          
          {__DEV__ && this.state.error && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugTitle}>Debug Information (Development Only)</Text>
              <Text style={styles.debugText}>Error: {this.state.error.message}</Text>
              {this.state.errorInfo && (
                <Text style={styles.debugText}>
                  Component Stack: {this.state.errorInfo.componentStack}
                </Text>
              )}
            </View>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  debugContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#6c757d',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
});

export default ErrorBoundary;

