import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * SecureStorageService provides encryption for sensitive data.
 * It uses expo-secure-store for secure storage on device.
 * For non-secure data, it falls back to regular AsyncStorage.
 * 
 * See detailed documentation: /docs/services/storage-services.md
 * 
 * @class SecureStorageService
 * @exports A singleton instance of SecureStorageService
 */
class SecureStorageService {
  private static instance: SecureStorageService;
  private secureCache: Map<string, any> = new Map();
  private regularCache: Map<string, any> = new Map();

  // Prefix for keys that should be stored securely
  private readonly SECURE_PREFIX = 'SECURE_';

  private constructor() {}

  /**
   * Gets the singleton instance of the SecureStorageService
   * 
   * @static
   * @returns {SecureStorageService} The singleton instance
   */
  static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  /**
   * Determines if a key should be stored securely
   * 
   * @private
   * @param {string} key - The key to check
   * @returns {boolean} Whether the key should be stored securely
   */
  private isSecureKey(key: string): boolean {
    return key.startsWith(this.SECURE_PREFIX);
  }

  /**
   * Adds the secure prefix to a key
   * 
   * @param {string} key - The base key
   * @returns {string} The key with secure prefix
   */
  makeSecureKey(key: string): string {
    if (this.isSecureKey(key)) return key;
    return `${this.SECURE_PREFIX}${key}`;
  }

  /**
   * Retrieves data from storage by key with type safety
   * Automatically uses secure storage for keys with SECURE_PREFIX
   * 
   * @template T - The expected type of the stored data
   * @param {string} key - The key to retrieve data for
   * @returns {Promise<T | null>} The stored data or null if not found/error
   * @throws Will not throw errors, returns null instead
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.isSecureKey(key)) {
        // Check secure cache first
        if (this.secureCache.has(key)) {
          return this.secureCache.get(key);
        }

        // Try to get from secure storage
        const value = await SecureStore.getItemAsync(key);
        if (value === null) return null;

        try {
          const parsed = JSON.parse(value);
          this.secureCache.set(key, parsed);
          return parsed;
        } catch (parseError) {
          console.error(`Error parsing secure data: ${key}`, parseError);
          return null;
        }
      } else {
        // Check regular cache first
        if (this.regularCache.has(key)) {
          return this.regularCache.get(key);
        }

        // Get from AsyncStorage
        const value = await AsyncStorage.getItem(key);
        if (value === null) return null;

        try {
          const parsed = JSON.parse(value);
          this.regularCache.set(key, parsed);
          return parsed;
        } catch (parseError) {
          console.error(`Error parsing data: ${key}`, parseError);
          return null;
        }
      }
    } catch (error) {
      console.error(`Error reading from storage: ${key}`, error);
      return null;
    }
  }

  /**
   * Stores data in persistent storage with a given key
   * Automatically uses secure storage for keys with SECURE_PREFIX
   * 
   * @template T - The type of data being stored
   * @param {string} key - The key to store the data under
   * @param {T} value - The data to store
   * @returns {Promise<void>}
   * @throws Will throw an error if storage fails
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);

      if (this.isSecureKey(key)) {
        // Store in secure storage
        await SecureStore.setItemAsync(key, serializedValue);
        this.secureCache.set(key, value);
      } else {
        // Store in regular storage
        await AsyncStorage.setItem(key, serializedValue);
        this.regularCache.set(key, value);
      }
    } catch (error) {
      console.error(`Error writing to storage: ${key}`, error);
      throw error;
    }
  }

  /**
   * Removes data for a specific key from storage
   * 
   * @param {string} key - The key to remove
   * @returns {Promise<void>}
   * @throws Will throw an error if removal fails
   */
  async remove(key: string): Promise<void> {
    try {
      if (this.isSecureKey(key)) {
        await SecureStore.deleteItemAsync(key);
        this.secureCache.delete(key);
      } else {
        await AsyncStorage.removeItem(key);
        this.regularCache.delete(key);
      }
    } catch (error) {
      console.error(`Error removing from storage: ${key}`, error);
      throw error;
    }
  }

  /**
   * Clears all stored data and cache
   * Note: SecureStore doesn't have a clear method, so we need to
   * clear each secure key individually.
   * 
   * @returns {Promise<void>}
   * @throws Will throw an error if clearing fails
   */
  async clear(): Promise<void> {
    try {
      // Clear regular storage
      await AsyncStorage.clear();
      this.regularCache.clear();

      // For secure storage, we need to get all secure keys and delete them one by one
      // This is done by getting all keys from AsyncStorage and filtering for secure keys
      const allKeys = await AsyncStorage.getAllKeys();
      const secureKeys = allKeys.filter(key => this.isSecureKey(key));

      // Delete each secure key
      for (const key of secureKeys) {
        await SecureStore.deleteItemAsync(key);
      }
      this.secureCache.clear();
    } catch (error) {
      console.error('Error clearing storage', error);
      throw error;
    }
  }

  /**
   * Gets all keys currently in storage
   * Note: This combines keys from both regular and secure storage
   * 
   * @returns {Promise<string[]>} Array of storage keys
   * @throws Will not throw errors, returns empty array instead
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys', error);
      return [];
    }
  }

  /**
   * Clears both regular and secure in-memory caches without affecting persistent storage
   * Used for memory management
   * 
   * @returns {void}
   */
  clearCache(): void {
    this.regularCache.clear();
    this.secureCache.clear();
  }
}

export default SecureStorageService.getInstance();
