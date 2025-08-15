import { STORAGE_KEYS } from '../constants';
import SecureStorageService from './SecureStorageService';

// Define types for sensitive data
export interface UserCredentials {
  nmcNumber: string;
  userId: string;
}

export interface AuthToken {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * Service to handle sensitive data operations with encryption
 * Provides methods to store, retrieve, and manage sensitive user data
 * 
 * See detailed documentation: /docs/services/sensitive-data.md
 * 
 * @class SensitiveDataService
 * @exports A singleton instance of SensitiveDataService
 */
class SensitiveDataService {
  private static instance: SensitiveDataService;

  // Secure storage keys with prefix already applied
  private readonly KEYS = {
    userCredentials: SecureStorageService.makeSecureKey(STORAGE_KEYS.userCredentials),
    authToken: SecureStorageService.makeSecureKey(STORAGE_KEYS.authToken),
    pinCode: SecureStorageService.makeSecureKey(STORAGE_KEYS.pinCode),
    biometricEnabled: SecureStorageService.makeSecureKey(STORAGE_KEYS.biometricEnabled),
  };

  private constructor() {}

  /**
   * Gets the singleton instance of SensitiveDataService
   * 
   * @static
   * @returns {SensitiveDataService} The singleton instance
   */
  static getInstance(): SensitiveDataService {
    if (!SensitiveDataService.instance) {
      SensitiveDataService.instance = new SensitiveDataService();
    }
    return SensitiveDataService.instance;
  }

  /**
   * Stores user credentials securely
   * 
   * @param {UserCredentials} credentials - The user credentials to store
   * @returns {Promise<void>}
   * @throws Will throw an error if storage fails
   */
  async saveUserCredentials(credentials: UserCredentials): Promise<void> {
    await SecureStorageService.set(this.KEYS.userCredentials, credentials);
  }

  /**
   * Retrieves stored user credentials
   * 
   * @returns {Promise<UserCredentials | null>} The user credentials or null if not found
   */
  async getUserCredentials(): Promise<UserCredentials | null> {
    return SecureStorageService.get<UserCredentials>(this.KEYS.userCredentials);
  }

  /**
   * Stores authentication tokens securely
   * 
   * @param {AuthToken} token - The authentication token to store
   * @returns {Promise<void>}
   * @throws Will throw an error if storage fails
   */
  async saveAuthToken(token: AuthToken): Promise<void> {
    await SecureStorageService.set(this.KEYS.authToken, token);
  }

  /**
   * Retrieves stored authentication token
   * 
   * @returns {Promise<AuthToken | null>} The auth token or null if not found
   */
  async getAuthToken(): Promise<AuthToken | null> {
    return SecureStorageService.get<AuthToken>(this.KEYS.authToken);
  }

  /**
   * Stores app PIN code securely
   * 
   * @param {string} pin - The PIN code to store (should be hashed before storage in production)
   * @returns {Promise<void>}
   * @throws Will throw an error if storage fails
   */
  async savePinCode(pin: string): Promise<void> {
    // In a real app, you'd want to hash this PIN before storing
    await SecureStorageService.set(this.KEYS.pinCode, { pin });
  }

  /**
   * Retrieves stored PIN code
   * 
   * @returns {Promise<string | null>} The PIN code or null if not found
   */
  async getPinCode(): Promise<string | null> {
    const data = await SecureStorageService.get<{ pin: string }>(this.KEYS.pinCode);
    return data?.pin || null;
  }

  /**
   * Sets biometric authentication preference
   * 
   * @param {boolean} enabled - Whether biometric auth is enabled
   * @returns {Promise<void>}
   * @throws Will throw an error if storage fails
   */
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await SecureStorageService.set(this.KEYS.biometricEnabled, { enabled });
  }

  /**
   * Gets biometric authentication preference
   * 
   * @returns {Promise<boolean>} Whether biometric auth is enabled
   */
  async getBiometricEnabled(): Promise<boolean> {
    const data = await SecureStorageService.get<{ enabled: boolean }>(this.KEYS.biometricEnabled);
    return data?.enabled || false;
  }

  /**
   * Clears all sensitive data
   * Use this for logout or account deletion
   * 
   * @returns {Promise<void>}
   * @throws Will throw an error if operation fails
   */
  async clearAllSensitiveData(): Promise<void> {
    try {
      await SecureStorageService.remove(this.KEYS.userCredentials);
      await SecureStorageService.remove(this.KEYS.authToken);
      await SecureStorageService.remove(this.KEYS.pinCode);
      await SecureStorageService.remove(this.KEYS.biometricEnabled);
    } catch (error) {
      console.error('Failed to clear sensitive data', error);
      throw error;
    }
  }

  /**
   * Validates if the user credentials exist
   * Used to determine if the user is logged in
   * 
   * @returns {Promise<boolean>} Whether valid credentials exist
   */
  async hasValidCredentials(): Promise<boolean> {
    const credentials = await this.getUserCredentials();
    return Boolean(credentials?.nmcNumber && credentials?.userId);
  }

  /**
   * Checks if the authentication token is valid and not expired
   * 
   * @returns {Promise<boolean>} Whether the token is valid
   */
  async hasValidAuthToken(): Promise<boolean> {
    const token = await this.getAuthToken();
    if (!token) return false;
    
    // Check if token is expired
    const now = Date.now();
    return Boolean(token.token && token.expiresAt > now);
  }
}

export default SensitiveDataService.getInstance();
