import { STRINGS } from '../constants/strings';
import { LoggingService } from './LoggingService';

/**
 * Error codes for categorizing different types of errors
 */
export enum ErrorCode {
  // Storage errors
  STORAGE_READ_ERROR = 'STORAGE_READ_ERROR',
  STORAGE_WRITE_ERROR = 'STORAGE_WRITE_ERROR',
  STORAGE_DELETE_ERROR = 'STORAGE_DELETE_ERROR',
  
  // Data errors
  INVALID_DATA_FORMAT = 'INVALID_DATA_FORMAT',
  DATA_NOT_FOUND = 'DATA_NOT_FOUND',
  DATA_VALIDATION_ERROR = 'DATA_VALIDATION_ERROR',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // File system errors
  FILE_READ_ERROR = 'FILE_READ_ERROR',
  FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',
  FILE_DELETE_ERROR = 'FILE_DELETE_ERROR',
  
  // User errors
  INVALID_INPUT = 'INVALID_INPUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  
  // Application errors
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}

/**
 * Custom error class with additional metadata
 */
export class AppError extends Error {
  /**
   * Error code for categorizing the error
   */
  code: ErrorCode;
  
  /**
   * Context where the error occurred
   */
  context: string;
  
  /**
   * Original error that caused this error
   */
  originalError?: unknown;
  
  /**
   * Create a new AppError
   * 
   * @param {string} message - Error message
   * @param {ErrorCode} code - Error code
   * @param {string} context - Context where the error occurred
   * @param {unknown} [originalError] - Original error that caused this error
   */
  constructor(message: string, code: ErrorCode, context: string, originalError?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.originalError = originalError;
  }
}

/**
 * Service for handling errors consistently throughout the application
 */
export class ErrorService {
  /**
   * Map error codes to user-friendly messages
   */
  private static readonly ERROR_MESSAGES: Record<ErrorCode, string> = {
    [ErrorCode.STORAGE_READ_ERROR]: STRINGS.alerts.error.generic,
    [ErrorCode.STORAGE_WRITE_ERROR]: STRINGS.alerts.error.generic,
    [ErrorCode.STORAGE_DELETE_ERROR]: STRINGS.alerts.error.generic,
    [ErrorCode.INVALID_DATA_FORMAT]: STRINGS.alerts.error.invalidImport,
    [ErrorCode.DATA_NOT_FOUND]: 'The requested data could not be found.',
    [ErrorCode.DATA_VALIDATION_ERROR]: 'The data is invalid or incomplete.',
    [ErrorCode.NETWORK_ERROR]: 'Network connection error. Please check your connection and try again.',
    [ErrorCode.API_ERROR]: 'Server error. Please try again later.',
    [ErrorCode.TIMEOUT_ERROR]: 'The operation timed out. Please try again.',
    [ErrorCode.FILE_READ_ERROR]: 'Could not read the file. It may be corrupted or inaccessible.',
    [ErrorCode.FILE_WRITE_ERROR]: 'Could not write to the file. Please check your storage permissions.',
    [ErrorCode.FILE_DELETE_ERROR]: 'Could not delete the file. It may be in use or protected.',
    [ErrorCode.INVALID_INPUT]: 'The input is invalid. Please check and try again.',
    [ErrorCode.UNAUTHORIZED]: 'You are not authorized to perform this action.',
    [ErrorCode.UNEXPECTED_ERROR]: STRINGS.alerts.error.generic,
  };
  
  /**
   * Create a standardized error object
   * 
   * @param {ErrorCode} code - Error code
   * @param {string} context - Context where the error occurred
   * @param {unknown} [originalError] - Original error that caused this error
   * @param {string} [customMessage] - Custom message to override the default
   * @returns {AppError} Standardized error object
   */
  static createError(
    code: ErrorCode,
    context: string,
    originalError?: unknown,
    customMessage?: string
  ): AppError {
    const message = customMessage || this.ERROR_MESSAGES[code];
    return new AppError(message, code, context, originalError);
  }
  
  /**
   * Handle an error by logging it and returning a user-friendly message
   * 
   * @param {unknown} error - Error to handle
   * @param {string} context - Context where the error occurred
   * @returns {string} User-friendly error message
   */
  static handleError(error: unknown, context: string): string {
    // Log the error
    LoggingService.error(`Error in ${context}:`, error);
    
    // Determine the user-friendly message
    if (error instanceof AppError) {
      return error.message;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return this.ERROR_MESSAGES[ErrorCode.UNEXPECTED_ERROR];
    }
  }
  
  /**
   * Handle a storage error
   * 
   * @param {unknown} error - Error to handle
   * @param {string} operation - Storage operation that failed (e.g., 'read', 'write')
   * @param {string} key - Storage key that was being accessed
   * @returns {AppError} Standardized error object
   */
  static handleStorageError(error: unknown, operation: string, key: string): AppError {
    const context = `Storage ${operation} (${key})`;
    
    let code: ErrorCode;
    switch (operation.toLowerCase()) {
      case 'read':
        code = ErrorCode.STORAGE_READ_ERROR;
        break;
      case 'write':
      case 'set':
        code = ErrorCode.STORAGE_WRITE_ERROR;
        break;
      case 'delete':
      case 'remove':
        code = ErrorCode.STORAGE_DELETE_ERROR;
        break;
      default:
        code = ErrorCode.UNEXPECTED_ERROR;
    }
    
    const appError = this.createError(code, context, error);
    LoggingService.error(appError.message, error, context);
    
    return appError;
  }
  
  /**
   * Handle a data validation error
   * 
   * @param {string} message - Validation error message
   * @param {string} context - Context where the error occurred
   * @returns {AppError} Standardized error object
   */
  static handleValidationError(message: string, context: string): AppError {
    const appError = this.createError(
      ErrorCode.DATA_VALIDATION_ERROR,
      context,
      null,
      message
    );
    LoggingService.error(appError.message, null, context);
    
    return appError;
  }
  
  /**
   * Handle a file system error
   * 
   * @param {unknown} error - Error to handle
   * @param {string} operation - File operation that failed (e.g., 'read', 'write')
   * @param {string} filePath - Path of the file that was being accessed
   * @returns {AppError} Standardized error object
   */
  static handleFileError(error: unknown, operation: string, filePath: string): AppError {
    const context = `File ${operation} (${filePath})`;
    
    let code: ErrorCode;
    switch (operation.toLowerCase()) {
      case 'read':
        code = ErrorCode.FILE_READ_ERROR;
        break;
      case 'write':
        code = ErrorCode.FILE_WRITE_ERROR;
        break;
      case 'delete':
        code = ErrorCode.FILE_DELETE_ERROR;
        break;
      default:
        code = ErrorCode.UNEXPECTED_ERROR;
    }
    
    const appError = this.createError(code, context, error);
    LoggingService.error(appError.message, error, context);
    
    return appError;
  }
}
