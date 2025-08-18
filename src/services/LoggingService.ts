/**
 * LoggingService provides structured logging with different levels
 * and proper error handling for production environments
 * 
 * @class LoggingService
 * @exports A singleton instance of LoggingService
 */
class LoggingService {
  private static instance: LoggingService;
  private isProduction: boolean;

  private constructor() {
    // In production, this would be set via environment variables
    this.isProduction = __DEV__ === false;
  }

  /**
   * Gets the singleton instance of the LoggingService
   * 
   * @static
   * @returns {LoggingService} The singleton instance
   */
  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  /**
   * Logs debug information (only in development)
   * 
   * @param {string} message - The debug message
   * @param {any} [data] - Optional data to log
   * @param {string} [context] - Optional context (e.g., service name)
   */
  debug(message: string, data?: any, context?: string): void {
    if (!this.isProduction) {
      const logMessage = this.formatMessage('DEBUG', message, context);
      console.log(logMessage, data || '');
    }
  }

  /**
   * Logs informational messages
   * 
   * @param {string} message - The info message
   * @param {any} [data] - Optional data to log
   * @param {string} [context] - Optional context (e.g., service name)
   */
  info(message: string, data?: any, context?: string): void {
    const logMessage = this.formatMessage('INFO', message, context);
    console.info(logMessage, data || '');
  }

  /**
   * Logs warning messages
   * 
   * @param {string} message - The warning message
   * @param {any} [data] - Optional data to log
   * @param {string} [context] - Optional context (e.g., service name)
   */
  warn(message: string, data?: any, context?: string): void {
    const logMessage = this.formatMessage('WARN', message, context);
    console.warn(logMessage, data || '');
  }

  /**
   * Logs error messages with sanitized data
   * 
   * @param {string} message - The error message
   * @param {any} [error] - Optional error object
   * @param {string} [context] - Optional context (e.g., service name)
   */
  error(message: string, error?: any, context?: string): void {
    const logMessage = this.formatMessage('ERROR', message, context);
    const sanitizedError = this.sanitizeError(error);
    console.error(logMessage, sanitizedError);
    
    // In production, you might want to send this to a remote logging service
    if (this.isProduction) {
      this.sendToRemoteLogging(logMessage, sanitizedError);
    }
  }

  /**
   * Logs critical errors that require immediate attention
   * 
   * @param {string} message - The critical error message
   * @param {any} [error] - Optional error object
   * @param {string} [context] - Optional context (e.g., service name)
   */
  critical(message: string, error?: any, context?: string): void {
    const logMessage = this.formatMessage('CRITICAL', message, context);
    const sanitizedError = this.sanitizeError(error);
    console.error(logMessage, sanitizedError);
    
    // Always send critical errors to remote logging
    this.sendToRemoteLogging(logMessage, sanitizedError);
  }

  /**
   * Formats a log message with timestamp and context
   * 
   * @private
   * @param {string} level - The log level
   * @param {string} message - The log message
   * @param {string} [context] - Optional context
   * @returns {string} Formatted log message
   */
  private formatMessage(level: string, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    return `[${timestamp}] ${level}${contextStr}: ${message}`;
  }

  /**
   * Sanitizes error objects to prevent sensitive information leakage
   * 
   * @private
   * @param {any} error - The error to sanitize
   * @returns {any} Sanitized error object
   */
  private sanitizeError(error: any): any {
    if (!error) return error;

    // If it's an Error object, extract safe properties
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: this.isProduction ? undefined : error.stack,
        // Don't include any custom properties that might contain sensitive data
      };
    }

    // If it's a plain object, be very conservative
    if (typeof error === 'object') {
      // Only include safe, non-sensitive properties
      const safeError: any = {};
      
      // Common safe properties
      if (error.code && typeof error.code === 'string') {
        safeError.code = error.code;
      }
      if (error.status && typeof error.status === 'number') {
        safeError.status = error.status;
      }
      if (error.type && typeof error.type === 'string') {
        safeError.type = error.type;
      }
      
      // In development, include more details
      if (!this.isProduction) {
        safeError.originalError = error;
      }
      
      return safeError;
    }

    // For primitive values, return as-is
    return error;
  }

  /**
   * Sends logs to remote logging service (placeholder for production)
   * 
   * @private
   * @param {string} message - The log message
   * @param {any} error - The sanitized error
   */
  private sendToRemoteLogging(message: string, error: any): void {
    // TODO: Implement remote logging service integration
    // Examples: Sentry, LogRocket, Firebase Crashlytics, etc.
    
    // For now, just store in memory for potential batch sending
    // In a real implementation, you'd send this to your logging service
    try {
      // This is a placeholder - replace with actual remote logging
      if (global.__REMOTE_LOGGING_QUEUE__) {
        global.__REMOTE_LOGGING_QUEUE__.push({
          timestamp: Date.now(),
          message,
          error,
          level: 'ERROR'
        });
      }
    } catch (loggingError) {
      // Fallback to console if remote logging fails
      console.error('Failed to send to remote logging:', loggingError);
    }
  }

  /**
   * Sets the production mode
   * 
   * @param {boolean} isProduction - Whether the app is in production mode
   */
  setProductionMode(isProduction: boolean): void {
    this.isProduction = isProduction;
  }

  /**
   * Gets the current production mode
   * 
   * @returns {boolean} Whether the app is in production mode
   */
  getProductionMode(): boolean {
    return this.isProduction;
  }
}

// Initialize global logging queue for production
if (typeof global !== 'undefined') {
  global.__REMOTE_LOGGING_QUEUE__ = [];
}

export default LoggingService.getInstance();
