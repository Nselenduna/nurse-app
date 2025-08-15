/**
 * Log level enum for controlling logging verbosity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Configuration for the logging service
 */
interface LoggingConfig {
  /**
   * Minimum log level to display
   * Logs with lower levels will be suppressed
   */
  minLevel: LogLevel;
  
  /**
   * Whether to include timestamps in log messages
   */
  includeTimestamp: boolean;
  
  /**
   * Whether to include the log level in log messages
   */
  includeLevel: boolean;
  
  /**
   * Whether to include the context in log messages
   */
  includeContext: boolean;
  
  /**
   * Whether to enable remote logging
   */
  enableRemoteLogging: boolean;
}

/**
 * Service for consistent logging throughout the application
 * Provides different log levels and formatting options
 */
export class LoggingService {
  /**
   * Default configuration for production environment
   */
  private static readonly PRODUCTION_CONFIG: LoggingConfig = {
    minLevel: LogLevel.WARN,
    includeTimestamp: true,
    includeLevel: true,
    includeContext: true,
    enableRemoteLogging: true,
  };
  
  /**
   * Default configuration for development environment
   */
  private static readonly DEV_CONFIG: LoggingConfig = {
    minLevel: LogLevel.DEBUG,
    includeTimestamp: true,
    includeLevel: true,
    includeContext: true,
    enableRemoteLogging: false,
  };
  
  /**
   * Current configuration
   */
  private static config: LoggingConfig = 
    process.env.NODE_ENV === 'production'
      ? LoggingService.PRODUCTION_CONFIG
      : LoggingService.DEV_CONFIG;
  
  /**
   * Whether we are in a production environment
   */
  private static readonly isProduction = process.env.NODE_ENV === 'production';
  
  /**
   * Configure the logging service
   * 
   * @param {Partial<LoggingConfig>} config - Configuration options
   */
  static configure(config: Partial<LoggingConfig>): void {
    LoggingService.config = {
      ...LoggingService.config,
      ...config,
    };
  }
  
  /**
   * Format a log message with optional context and timestamp
   * 
   * @param {LogLevel} level - Log level
   * @param {string} message - Log message
   * @param {string} [context] - Optional context for the log
   * @returns {string} Formatted log message
   */
  private static formatMessage(level: LogLevel, message: string, context?: string): string {
    const parts: string[] = [];
    
    if (LoggingService.config.includeTimestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }
    
    if (LoggingService.config.includeLevel) {
      parts.push(`[${LogLevel[level]}]`);
    }
    
    if (LoggingService.config.includeContext && context) {
      parts.push(`[${context}]`);
    }
    
    parts.push(message);
    
    return parts.join(' ');
  }
  
  /**
   * Send a log to remote logging service
   * 
   * @param {LogLevel} level - Log level
   * @param {string} message - Log message
   * @param {string} [context] - Optional context for the log
   * @param {unknown} [data] - Optional data to include with the log
   */
  private static sendRemoteLog(level: LogLevel, message: string, context?: string, data?: unknown): void {
    // In a real app, this would send the log to a remote service like Sentry, LogRocket, etc.
    // For now, we'll just stub this out
    if (LoggingService.config.enableRemoteLogging) {
      // Implementation would go here
    }
  }
  
  /**
   * Log a debug message
   * 
   * @param {string} message - Log message
   * @param {string} [context] - Optional context for the log
   * @param {unknown} [data] - Optional data to include with the log
   */
  static debug(message: string, context?: string, data?: unknown): void {
    if (LoggingService.config.minLevel <= LogLevel.DEBUG) {
      const formattedMessage = LoggingService.formatMessage(LogLevel.DEBUG, message, context);
      console.debug(formattedMessage, data || '');
    }
  }
  
  /**
   * Log an info message
   * 
   * @param {string} message - Log message
   * @param {string} [context] - Optional context for the log
   * @param {unknown} [data] - Optional data to include with the log
   */
  static info(message: string, context?: string, data?: unknown): void {
    if (LoggingService.config.minLevel <= LogLevel.INFO) {
      const formattedMessage = LoggingService.formatMessage(LogLevel.INFO, message, context);
      console.info(formattedMessage, data || '');
    }
  }
  
  /**
   * Log a warning message
   * 
   * @param {string} message - Log message
   * @param {string} [context] - Optional context for the log
   * @param {unknown} [data] - Optional data to include with the log
   */
  static warn(message: string, context?: string, data?: unknown): void {
    if (LoggingService.config.minLevel <= LogLevel.WARN) {
      const formattedMessage = LoggingService.formatMessage(LogLevel.WARN, message, context);
      console.warn(formattedMessage, data || '');
      
      // Send to remote logging service
      LoggingService.sendRemoteLog(LogLevel.WARN, message, context, data);
    }
  }
  
  /**
   * Log an error message
   * 
   * @param {string} message - Log message
   * @param {unknown} [error] - Optional error object
   * @param {string} [context] - Optional context for the log
   */
  static error(message: string, error?: unknown, context?: string): void {
    if (LoggingService.config.minLevel <= LogLevel.ERROR) {
      const formattedMessage = LoggingService.formatMessage(LogLevel.ERROR, message, context);
      console.error(formattedMessage, error || '');
      
      // Send to remote logging service
      LoggingService.sendRemoteLog(LogLevel.ERROR, message, context, error);
    }
  }
}
