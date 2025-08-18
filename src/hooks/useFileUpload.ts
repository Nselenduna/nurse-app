import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { ErrorCode, ErrorService } from '../services/ErrorService';
import { getFileExtension, getFileName } from '../utils/fileUtils';

/**
 * File upload result interface
 */
export interface FileUploadResult {
  /**
   * URI of the uploaded file
   */
  uri: string;
  
  /**
   * Name of the uploaded file
   */
  name: string;
  
  /**
   * MIME type of the uploaded file
   */
  mimeType: string | null;
  
  /**
   * Size of the uploaded file in bytes
   */
  size: number;
  
  /**
   * Extension of the uploaded file
   */
  extension: string;
  
  /**
   * Content of the uploaded file (if read)
   */
  content?: string;
}

/**
 * Custom hook for handling file uploads
 * 
 * @param {Object} options - Hook options
 * @param {string[]} [options.allowedTypes] - Allowed MIME types
 * @param {number} [options.maxSizeBytes] - Maximum file size in bytes
 * @param {boolean} [options.readContent=false] - Whether to read the file content
 * @returns {Object} File upload state and handlers
 */
export function useFileUpload({
  allowedTypes,
  maxSizeBytes,
  readContent = false,
}: {
  allowedTypes?: string[];
  maxSizeBytes?: number;
  readContent?: boolean;
} = {}) {
  const [file, setFile] = useState<FileUploadResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Resets the file upload state
   */
  const resetFile = useCallback(() => {
    setFile(null);
    setError(null);
  }, []);
  
  /**
   * Validates a file
   * 
   * @param {DocumentPicker.DocumentResult} result - Document picker result
   * @returns {boolean} True if the file is valid
   */
  const validateFile = useCallback(
    (result: DocumentPicker.DocumentPickerAsset): boolean => {
      // Check if file was picked
      if (!result.uri) {
        setError('No file selected');
        return false;
      }
      
      // Check file type
      if (allowedTypes && allowedTypes.length > 0) {
        const mimeType = result.mimeType || '';
        if (!allowedTypes.includes(mimeType)) {
          setError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
          return false;
        }
      }
      
      // Check file size
      if (maxSizeBytes && result.size && result.size > maxSizeBytes) {
        const maxSizeMB = maxSizeBytes / (1024 * 1024);
        setError(`File is too large. Maximum size: ${maxSizeMB.toFixed(2)} MB`);
        return false;
      }
      
      return true;
    },
    [allowedTypes, maxSizeBytes]
  );
  
  /**
   * Picks a file from the device
   */
  const pickFile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Pick a document
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
      });
      
      // Check if the user cancelled
      if (result.canceled) {
        setIsLoading(false);
        return;
      }
      
      // Get the selected asset
      const asset = result.assets[0];
      
      // Validate the file
      if (!validateFile(asset)) {
        setIsLoading(false);
        return;
      }
      
      // Get file information
      const name = asset.name || getFileName(asset.uri);
      const extension = getFileExtension(name);
      
      // Create file result
      const fileResult: FileUploadResult = {
        uri: asset.uri,
        name,
        mimeType: asset.mimeType || null,
        size: asset.size || 0,
        extension,
      };
      
      // Read file content if needed
      if (readContent) {
        try {
          const content = await FileSystem.readAsStringAsync(asset.uri);
          fileResult.content = content;
        } catch (readError) {
          throw ErrorService.createError(
            ErrorCode.FILE_READ_ERROR,
            'pickFile',
            readError,
            'Failed to read file content'
          );
        }
      }
      
      setFile(fileResult);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to pick file';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [allowedTypes, readContent, validateFile]);
  
  return {
    file,
    isLoading,
    error,
    pickFile,
    resetFile,
  };
}
