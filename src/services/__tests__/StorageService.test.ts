import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageService from '../StorageService';

describe('StorageService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Clear the cache
    StorageService.clearCache();
  });

  describe('get', () => {
    it('should return null for non-existent keys', async () => {
      // Mock AsyncStorage to return null
      AsyncStorage.getItem = jest.fn().mockResolvedValue(null);
      
      const result = await StorageService.get('nonexistent');
      
      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('nonexistent');
    });

    it('should return cached value if available', async () => {
      // Set up cache by setting a value
      await StorageService.set('testKey', { data: 'test' });
      
      // Clear the AsyncStorage mock to verify cache is used
      AsyncStorage.getItem = jest.fn();
      
      const result = await StorageService.get('testKey');
      
      expect(result).toEqual({ data: 'test' });
      expect(AsyncStorage.getItem).not.toHaveBeenCalled();
    });

    it('should handle JSON parse errors', async () => {
      // Mock invalid JSON response
      AsyncStorage.getItem = jest.fn().mockResolvedValue('invalid json');
      
      const result = await StorageService.get('testKey');
      
      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('testKey');
    });
  });

  describe('set', () => {
    it('should store and cache values', async () => {
      const testData = { data: 'test' };
      
      await StorageService.set('testKey', testData);
      
      // Verify AsyncStorage was called with correct arguments
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'testKey', 
        JSON.stringify(testData)
      );
      
      // Verify cache was updated by checking cache size
      expect(StorageService.getCacheSize()).toBe(1);
      
      // Verify cached value by getting it without hitting AsyncStorage
      AsyncStorage.getItem = jest.fn();
      const cachedValue = await StorageService.get('testKey');
      expect(cachedValue).toEqual(testData);
      expect(AsyncStorage.getItem).not.toHaveBeenCalled();
    });

    it('should throw when AsyncStorage fails', async () => {
      // Mock AsyncStorage to throw an error
      const mockError = new Error('Storage error');
      AsyncStorage.setItem = jest.fn().mockRejectedValue(mockError);
      
      await expect(StorageService.set('testKey', { data: 'test' }))
        .rejects.toThrow('Storage error');
    });
  });

  describe('remove', () => {
    it('should remove item from storage and cache', async () => {
      // First set a value
      await StorageService.set('testKey', { data: 'test' });
      
      // Then remove it
      await StorageService.remove('testKey');
      
      // Verify AsyncStorage.removeItem was called
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('testKey');
      
      // Verify item was removed from cache by trying to get it
      AsyncStorage.getItem = jest.fn().mockResolvedValue(null);
      const result = await StorageService.get('testKey');
      expect(result).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear storage and cache', async () => {
      // Set multiple values
      await StorageService.set('key1', 'value1');
      await StorageService.set('key2', 'value2');
      
      // Clear everything
      await StorageService.clear();
      
      // Verify AsyncStorage.clear was called
      expect(AsyncStorage.clear).toHaveBeenCalled();
      
      // Verify cache was cleared
      expect(StorageService.getCacheSize()).toBe(0);
    });
  });
});
