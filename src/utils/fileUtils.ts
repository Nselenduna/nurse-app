import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ErrorCode, ErrorService } from '../services/ErrorService';
import { formatFileSize } from './stringUtils';

/**
 * Gets the file extension from a file path
 * 
 * @param {string} filePath - File path
 * @returns {string} File extension (without the dot)
 */
export function getFileExtension(filePath: string): string {
  return filePath.split('.').pop() || '';
}

/**
 * Gets the file name from a file path
 * 
 * @param {string} filePath - File path
 * @returns {string} File name (with extension)
 */
export function getFileName(filePath: string): string {
  return filePath.split('/').pop() || '';
}

/**
 * Gets the file name without extension from a file path
 * 
 * @param {string} filePath - File path
 * @returns {string} File name (without extension)
 */
export function getFileNameWithoutExtension(filePath: string): string {
  const fileName = getFileName(filePath);
  const extension = getFileExtension(filePath);
  return fileName.replace(`.${extension}`, '');
}

/**
 * Checks if a file exists
 * 
 * @param {string} filePath - File path
 * @returns {Promise<boolean>} True if the file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    return fileInfo.exists;
  } catch (error) {
    throw ErrorService.handleFileError(error, 'check', filePath);
  }
}

/**
 * Reads a file as text
 * 
 * @param {string} filePath - File path
 * @returns {Promise<string>} File contents
 */
export async function readTextFile(filePath: string): Promise<string> {
  try {
    return await FileSystem.readAsStringAsync(filePath);
  } catch (error) {
    throw ErrorService.handleFileError(error, 'read', filePath);
  }
}

/**
 * Writes text to a file
 * 
 * @param {string} filePath - File path
 * @param {string} content - Content to write
 * @returns {Promise<void>}
 */
export async function writeTextFile(filePath: string, content: string): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(filePath, content);
  } catch (error) {
    throw ErrorService.handleFileError(error, 'write', filePath);
  }
}

/**
 * Deletes a file
 * 
 * @param {string} filePath - File path
 * @returns {Promise<void>}
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(filePath);
  } catch (error) {
    throw ErrorService.handleFileError(error, 'delete', filePath);
  }
}

/**
 * Creates a directory if it doesn't exist
 * 
 * @param {string} dirPath - Directory path
 * @returns {Promise<void>}
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(dirPath);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
    }
  } catch (error) {
    throw ErrorService.createError(
      ErrorCode.FILE_WRITE_ERROR,
      'ensureDirectory',
      error,
      `Failed to create directory: ${dirPath}`
    );
  }
}

/**
 * Gets the app's document directory
 * 
 * @returns {string} Document directory
 */
export function getDocumentDirectory(): string {
  return FileSystem.documentDirectory || '';
}

/**
 * Gets the app's cache directory
 * 
 * @returns {string} Cache directory
 */
export function getCacheDirectory(): string {
  return FileSystem.cacheDirectory || '';
}

/**
 * Gets a temporary file path
 * 
 * @param {string} fileName - File name
 * @returns {string} Temporary file path
 */
export function getTempFilePath(fileName: string): string {
  return `${getCacheDirectory()}${fileName}`;
}

/**
 * Gets a document file path
 * 
 * @param {string} fileName - File name
 * @returns {string} Document file path
 */
export function getDocumentFilePath(fileName: string): string {
  return `${getDocumentDirectory()}${fileName}`;
}

/**
 * Shares a file
 * 
 * @param {string} filePath - File path
 * @param {string} [contentType] - Content type (MIME type)
 * @returns {Promise<void>}
 */
export async function shareFile(filePath: string, contentType?: string): Promise<void> {
  try {
    // Check if sharing is available
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      throw new Error('Sharing is not available on this device');
    }
    
    // Share the file
    await Sharing.shareAsync(filePath, {
      mimeType: contentType,
      dialogTitle: `Share ${getFileName(filePath)}`,
    });
  } catch (error) {
    throw ErrorService.createError(
      ErrorCode.UNEXPECTED_ERROR,
      'shareFile',
      error,
      'Failed to share file'
    );
  }
}

/**
 * Gets the size of a file
 * 
 * @param {string} filePath - File path
 * @returns {Promise<number>} File size in bytes
 */
export async function getFileSize(filePath: string): Promise<number> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    return fileInfo.exists ? (fileInfo as any).size || 0 : 0;
  } catch (error) {
    throw ErrorService.handleFileError(error, 'getSize', filePath);
  }
}

/**
 * Gets the formatted size of a file
 * 
 * @param {string} filePath - File path
 * @returns {Promise<string>} Formatted file size
 */
export async function getFormattedFileSize(filePath: string): Promise<string> {
  const size = await getFileSize(filePath);
  return formatFileSize(size);
}

/**
 * Exports data to a file and shares it
 * 
 * @param {string} data - Data to export
 * @param {string} fileName - File name
 * @param {string} [contentType='application/json'] - Content type (MIME type)
 * @returns {Promise<string>} File path
 */
export async function exportAndShareFile(
  data: string,
  fileName: string,
  contentType = 'application/json'
): Promise<string> {
  try {
    // Ensure the document directory exists
    const directory = getDocumentDirectory();
    await ensureDirectory(directory);
    
    // Create the file path
    const filePath = getDocumentFilePath(fileName);
    
    // Write the data to the file
    await writeTextFile(filePath, data);
    
    // Share the file
    await shareFile(filePath, contentType);
    
    return filePath;
  } catch (error) {
    throw ErrorService.createError(
      ErrorCode.FILE_WRITE_ERROR,
      'exportAndShareFile',
      error,
      'Failed to export and share file'
    );
  }
}

/**
 * Gets the MIME type for a file extension
 * 
 * @param {string} extension - File extension (without the dot)
 * @returns {string} MIME type
 */
export function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    json: 'application/json',
    txt: 'text/plain',
    html: 'text/html',
    csv: 'text/csv',
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    wav: 'audio/wav',
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}
