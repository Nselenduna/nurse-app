import AsyncStorage from '@react-native-async-storage/async-storage';

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
      console.error(`Error reading from storage: ${key}`, error);
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
      await AsyncStorage.removeItem(key);
      this.cache.delete(key);
    } catch (error) {
      console.error(`Error removing from storage: ${key}`, error);
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
      console.error('Error clearing storage', error);
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
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys', error);
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
  async multiGet(keys: string[]): Promise<[string, any][]> {
    try {
      const values = await AsyncStorage.multiGet(keys);
      return values.map(([key, value]) => [
        key,
        value ? JSON.parse(value) : null
      ]);
    } catch (error) {
      console.error('Error in multiGet', error);
      return [];
    }
  }

  /**
   * Stores multiple items in storage in a single batch operation
   * 
   * @param {[string, any][]} keyValuePairs - Array of [key, value] pairs to store
   * @returns {Promise<void>}
   * @throws Will throw an error if batch storage fails
   */
  async multiSet(keyValuePairs: [string, any][]): Promise<void> {
    try {
      const serializedPairs = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value)
      ]);
      await AsyncStorage.multiSet(serializedPairs);
      
      // Update cache
      keyValuePairs.forEach(([key, value]) => {
        this.cache.set(key, value);
      });
    } catch (error) {
      console.error('Error in multiSet', error);
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
