import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import SecureStorageService from '../SecureStorageService';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

describe('SecureStorageService', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Clear the cache between tests
    SecureStorageService.clearCache();
  });

  describe('makeSecureKey', () => {
    it('should add secure prefix to regular keys', () => {
      const regularKey = 'test_key';
      const secureKey = SecureStorageService.makeSecureKey(regularKey);
      
      expect(secureKey).toBe('SECURE_test_key');
    });

    it('should not add prefix if key already has it', () => {
      const alreadySecureKey = 'SECURE_test_key';
      const secureKey = SecureStorageService.makeSecureKey(alreadySecureKey);
      
      expect(secureKey).toBe('SECURE_test_key');
    });
  });

  describe('get', () => {
    it('should retrieve data from SecureStore for secure keys', async () => {
      const secureKey = 'SECURE_test_key';
      const testData = { secret: 'sensitive data' };
      
      // Mock SecureStore.getItemAsync to return serialized data
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(JSON.stringify(testData));
      
      const result = await SecureStorageService.get(secureKey);
      
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith(secureKey);
      expect(AsyncStorage.getItem).not.toHaveBeenCalled();
      expect(result).toEqual(testData);
    });

    it('should retrieve data from AsyncStorage for regular keys', async () => {
      const regularKey = 'regular_key';
      const testData = { data: 'regular data' };
      
      // Mock AsyncStorage.getItem to return serialized data
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(testData));
      
      const result = await SecureStorageService.get(regularKey);
      
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(regularKey);
      expect(SecureStore.getItemAsync).not.toHaveBeenCalled();
      expect(result).toEqual(testData);
    });

    it('should return null if data is not found', async () => {
      const secureKey = 'SECURE_nonexistent';
      
      // Mock SecureStore.getItemAsync to return null (not found)
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      
      const result = await SecureStorageService.get(secureKey);
      
      expect(result).toBeNull();
    });

    it('should use cache for repeated secure key accesses', async () => {
      const secureKey = 'SECURE_cached_key';
      const testData = { secret: 'cached data' };
      
      // Mock SecureStore.getItemAsync to return serialized data
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(JSON.stringify(testData));
      
      // First access should hit storage
      await SecureStorageService.get(secureKey);
      
      // Second access should use cache
      await SecureStorageService.get(secureKey);
      
      // SecureStore should only be called once
      expect(SecureStore.getItemAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe('set', () => {
    it('should store data in SecureStore for secure keys', async () => {
      const secureKey = 'SECURE_set_test';
      const testData = { secret: 'set test data' };
      
      await SecureStorageService.set(secureKey, testData);
      
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        secureKey, 
        JSON.stringify(testData)
      );
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should store data in AsyncStorage for regular keys', async () => {
      const regularKey = 'regular_set_test';
      const testData = { data: 'regular test data' };
      
      await SecureStorageService.set(regularKey, testData);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        regularKey, 
        JSON.stringify(testData)
      );
      expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove data from SecureStore for secure keys', async () => {
      const secureKey = 'SECURE_remove_test';
      
      await SecureStorageService.remove(secureKey);
      
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(secureKey);
      expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    });

    it('should remove data from AsyncStorage for regular keys', async () => {
      const regularKey = 'regular_remove_test';
      
      await SecureStorageService.remove(regularKey);
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(regularKey);
      expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('should clear both AsyncStorage and SecureStore data', async () => {
      // Mock getAllKeys to return some keys
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
        'regular_key', 
        'SECURE_key1', 
        'SECURE_key2'
      ]);
      
      await SecureStorageService.clear();
      
      // Should clear AsyncStorage
      expect(AsyncStorage.clear).toHaveBeenCalled();
      
      // Should delete secure keys individually
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('SECURE_key1');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('SECURE_key2');
    });
  });

  describe('getAllKeys', () => {
    it('should return all keys from AsyncStorage', async () => {
      const mockKeys = ['key1', 'key2', 'SECURE_key3'];
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue(mockKeys);
      
      const keys = await SecureStorageService.getAllKeys();
      
      expect(keys).toEqual(mockKeys);
    });
  });
});
