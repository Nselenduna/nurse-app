import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * SecureStorageService provides encryption for sensitive data.
 * It uses expo-secure-store for secure storage on device.
 * For non-secure data, it falls back to regular AsyncStorage.
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
   * 
   * @template T - The expected type of the stored data
   * @param {string} key - The key to retrieve data for
   * @returns {Promise<T | null>} The stored data or null if not found/error
   * @throws Will not throw errors, returns null instead
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      // Check cache first
      if (this.secureCache.has(key)) {
        return this.secureCache.get(key);
      }

      if (this.regularCache.has(key)) {
        return this.regularCache.get(key);
      }

      if (this.isSecureKey(key)) {
        // Use secure storage for sensitive data
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
        // Use AsyncStorage for non-sensitive data
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
      console.error(`Error retrieving data for key: ${key}`, error);
      return null;
    }
  }

  /**
   * Stores data in storage by key
   * 
   * @template T - The type of data to store
   * @param {string} key - The key to store data under
   * @param {T} value - The data to store
   * @returns {Promise<void>}
   * @throws Will throw an error if storage fails
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);

      if (this.isSecureKey(key)) {
        // Use secure storage for sensitive data
        await SecureStore.setItemAsync(key, serialized);
        this.secureCache.set(key, value);
      } else {
        // Use AsyncStorage for non-sensitive data
        await AsyncStorage.setItem(key, serialized);
        this.regularCache.set(key, value);
      }
    } catch (error) {
      console.error(`Error storing data for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Removes data from storage by key
   * 
   * @param {string} key - The key to remove data for
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
      console.error(`Error removing data for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Clears all data from storage
   * 
   * @returns {Promise<void>}
   * @throws Will throw an error if clearing fails
   */
  async clear(): Promise<void> {
    try {
      // Clear secure storage
      const secureKeys = await SecureStore.getAllKeysAsync();
      for (const key of secureKeys) {
        if (key.startsWith(this.SECURE_PREFIX)) {
          await SecureStore.deleteItemAsync(key);
        }
      }

      // Clear AsyncStorage
      await AsyncStorage.clear();

      // Clear caches
      this.secureCache.clear();
      this.regularCache.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Gets all keys from storage
   * 
   * @returns {Promise<string[]>} Array of all storage keys
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const secureKeys = await SecureStore.getAllKeysAsync();
      const regularKeys = await AsyncStorage.getAllKeys();
      
      return [...secureKeys, ...regularKeys];
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Checks if a key exists in storage
   * 
   * @param {string} key - The key to check
   * @returns {Promise<boolean>} Whether the key exists
   * @throws Will not throw errors, returns false instead
   */
  async hasKey(key: string): Promise<boolean> {
    try {
      const keys = await this.getAllKeys();
      return keys.includes(key);
    } catch (error) {
      console.error(`Error checking if key exists: ${key}`, error);
      return false;
    }
  }

  /**
   * Gets the size of stored data for a key
   * 
   * @param {string} key - The key to check
   * @returns {Promise<number>} Size in bytes
   * @throws Will not throw errors, returns 0 instead
   */
  async getSize(key: string): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return 0;
      return new Blob([value]).size;
    } catch (error) {
      console.error(`Error getting size for key: ${key}`, error);
      return 0;
    }
  }

  /**
   * Gets the total size of all stored data
   * 
   * @returns {Promise<number>} Total size in bytes
   * @throws Will not throw errors, returns 0 instead
   */
  async getTotalSize(): Promise<number> {
    try {
      const keys = await this.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        totalSize += await this.getSize(key);
      }
      
      return totalSize;
    } catch (error) {
      console.error('Error getting total size', error);
      return 0;
    }
  }

  /**
   * Migrates data from one key to another
   * 
   * @param {string} oldKey - The old key
   * @param {string} newKey - The new key
   * @returns {Promise<boolean>} Whether migration was successful
   * @throws Will not throw errors, returns false instead
   */
  async migrateKey(oldKey: string, newKey: string): Promise<boolean> {
    try {
      const value = await this.get(oldKey);
      if (value === null) return false;
      
      await this.set(newKey, value);
      await this.remove(oldKey);
      return true;
    } catch (error) {
      console.error(`Error migrating key from ${oldKey} to ${newKey}`, error);
      return false;
    }
  }

  /**
   * Exports all stored data as a JSON object
   * 
   * @returns {Promise<Record<string, any>>} All stored data
   * @throws Will not throw errors, returns empty object instead
   */
  async exportData(): Promise<Record<string, any>> {
    try {
      const keys = await this.getAllKeys();
      const data: Record<string, any> = {};
      
      for (const key of keys) {
        const value = await this.get(key);
        if (value !== null) {
          data[key] = value;
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error exporting data', error);
      return {};
    }
  }

  /**
   * Imports data from a JSON object
   * 
   * @param {Record<string, any>} data - The data to import
   * @returns {Promise<boolean>} Whether import was successful
   * @throws Will not throw errors, returns false instead
   */
  async importData(data: Record<string, any>): Promise<boolean> {
    try {
      for (const [key, value] of Object.entries(data)) {
        await this.set(key, value);
      }
      return true;
    } catch (error) {
      console.error('Error importing data', error);
      return false;
    }
  }
}

export default SecureStorageService.getInstance();
