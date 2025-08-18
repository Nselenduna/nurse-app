import AsyncStorage from '@react-native-async-storage/async-storage';
import LoggingService from './LoggingService';

/**
 * StorageService provides a singleton interface for managing persistent data storage
 * with caching capabilities to improve performance.
 * 
 * @class StorageService
 * @exports A singleton instance of StorageService
 */
class StorageService {
  private static instance: StorageService;
  private cache: Map<string, any> = new Map();

  private constructor() {}

  /**
   * Gets the singleton instance of the StorageService
   * 
   * @static
   * @returns {StorageService} The singleton instance
   */
  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
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
      if (this.cache.has(key)) {
        return this.cache.get(key);
      }

      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;

      const parsed = JSON.parse(value);
      this.cache.set(key, parsed);
      return parsed;
    } catch (error) {
      LoggingService.error(`Failed to read from storage: ${key}`, error, 'StorageService');
      return null;
    }
  }

  /**
   * Stores data in persistent storage with a given key
   * 
   * @template T - The type of data being stored
   * @param {string} key - The key to store the data under
   * @param {T} value - The data to store
   * @returns {Promise<void>}
   * @throws Will throw an error if storage fails
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      this.cache.set(key, value);
    } catch (error) {
      LoggingService.error(`Failed to write to storage: ${key}`, error, 'StorageService');
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
      await AsyncStorage.removeItem(key);
      this.cache.delete(key);
    } catch (error) {
      LoggingService.error(`Failed to remove from storage: ${key}`, error, 'StorageService');
      throw error;
    }
  }

  /**
   * Clears all stored data and cache
   * 
   * @returns {Promise<void>}
   * @throws Will throw an error if clearing fails
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
      this.cache.clear();
    } catch (error) {
      LoggingService.error('Failed to clear storage', error, 'StorageService');
      throw error;
    }
  }

  /**
   * Gets all keys currently in storage
   * 
   * @returns {Promise<string[]>} Array of storage keys
   * @throws Will not throw errors, returns empty array instead
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return Array.from(keys); // Convert readonly array to mutable array
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Retrieves multiple items from storage in a single batch operation
   * 
   * @param {string[]} keys - Array of keys to retrieve
   * @returns {Promise<[string, any][]>} Array of [key, value] pairs
   * @throws Will not throw errors, returns empty array instead
   */
  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      return Array.from(pairs); // Convert readonly array to mutable array
    } catch (error) {
      console.error('Error getting multiple values:', error);
      return keys.map(key => [key, null]);
    }
  }

  /**
   * Stores multiple items in storage in a single batch operation
   * 
   * @param {[string, any][]} keyValuePairs - Array of [key, value] pairs to store
   * @returns {Promise<void>}
   * @throws Will throw an error if batch storage fails
   */
  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    try {
      // Ensure each pair has exactly 2 elements
      const validPairs = keyValuePairs.filter(pair => pair.length === 2) as [string, string][];
      await AsyncStorage.multiSet(validPairs);
    } catch (error) {
      console.error('Error setting multiple values:', error);
      throw error;
    }
  }

  /**
   * Clears the in-memory cache without affecting persistent storage
   * Used for memory management
   * 
   * @returns {void}
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Returns the current number of items in the cache
   * Useful for debugging and memory management
   * 
   * @returns {number} Number of cached items
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}

export default StorageService.getInstance();
