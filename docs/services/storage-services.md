# Storage Services

This document explains the storage services available in the application.

## Overview

The application uses two main storage services:

1. **StorageService**: For non-sensitive data storage using AsyncStorage

2. **SecureStorageService**: For sensitive data storage using expo-secure-store

## StorageService

`StorageService` provides a wrapper around AsyncStorage with additional features:

- Type-safe operations

- In-memory caching for improved performance

- Error handling

- Batch operations

### API Reference


```typescript
class StorageService {
  // Get data with type safety
  async get<T>(key: string): Promise<T | null>;

  // Store data with type safety
  async set<T>(key: string, value: T): Promise<void>;

  // Remove data for a specific key
  async remove(key: string): Promise<void>;

  // Clear all stored data
  async clear(): Promise<void>;

  // Get all keys in storage
  async getAllKeys(): Promise<string[]>;

  // Multiple operations
  async multiGet(keys: string[]): Promise<[string, any][]>;
  async multiSet(keyValuePairs: [string, any][]): Promise<void>;

  // Cache management
  clearCache(): void;
  getCacheSize(): number;
}

```


### Usage Example


```typescript
import StorageService from '@/src/services/StorageService';

// Store data
await StorageService.set('app_settings', { theme: 'dark', notifications: true });

// Retrieve data
const settings = await StorageService.get('app_settings');

// Remove data
await StorageService.remove('app_settings');

```


## SecureStorageService

`SecureStorageService` provides encrypted storage for sensitive data:

- Uses expo-secure-store for encrypted storage

- Falls back to AsyncStorage for non-sensitive data

- Automatic routing based on key prefixes

- In-memory caching for both secure and regular data

### API Reference


```typescript
class SecureStorageService {
  // Create a secure key with prefix
  makeSecureKey(key: string): string;

  // Get data with type safety
  async get<T>(key: string): Promise<T | null>;

  // Store data with type safety
  async set<T>(key: string, value: T): Promise<void>;

  // Remove data for a specific key
  async remove(key: string): Promise<void>;

  // Clear all stored data
  async clear(): Promise<void>;

  // Get all keys in storage
  async getAllKeys(): Promise<string[]>;

  // Cache management
  clearCache(): void;
}

```


### Usage Example


```typescript
import SecureStorageService from '@/src/services/SecureStorageService';

// Store sensitive data securely
const secureKey = SecureStorageService.makeSecureKey('user_data');
await SecureStorageService.set(secureKey, { username: 'nurse123', token: 'abc123' });

// Retrieve secure data
const userData = await SecureStorageService.get(secureKey);

// Regular storage still works for non-sensitive data
await SecureStorageService.set('app_settings', { theme: 'dark' });

```


## Implementation Details

### Storage Keys

Storage keys are defined in the constants file for consistent usage:


```typescript
export const STORAGE_KEYS = {
  cpdLogs: 'cpd_logs',
  voiceRecordings: 'voice_recordings',
  userProfile: 'user_profile',
  // Additional keys...
};

```


### Secure Key Prefix

Secure keys are identified by a prefix:


```typescript
private readonly SECURE_PREFIX = 'SECURE_';

```


Any key that starts with this prefix is automatically stored using secure storage.

### Caching

Both services implement in-memory caching for improved performance:


```typescript
// StorageService
private cache: Map<string, any> = new Map();

// SecureStorageService
private secureCache: Map<string, any> = new Map();
private regularCache: Map<string, any> = new Map();

```


Cache is used for read operations and updated on write operations. Cache can be cleared manually when needed.

## Testing

Both services have comprehensive test suites in the `__tests__` directory:

- `StorageService.test.ts`

- `SecureStorageService.test.ts`

These tests verify:

- Get/set/remove operations

- Caching behavior

- Error handling

- Key prefixing

- Clear operations

## Best Practices

When using storage services:

1. **Use Constants**: Always use constants for storage keys

2. **Type Safety**: Provide explicit types when getting/setting data

3. **Error Handling**: Handle potential storage errors

4. **Sensitive Data**: Use SecureStorageService for any sensitive information

5. **Cache Lifecycle**: Clear cache when appropriate to prevent stale data
