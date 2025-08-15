# Sensitive Data Handling

This document explains how sensitive data is handled securely in the application.

## Overview

The application handles sensitive user data including:

- User credentials (NMC number, user ID)

- Authentication tokens

- PIN codes for app access

- Biometric authentication preferences

- Personal CPD logs and reflections

## Security Architecture

### Secure Storage

All sensitive data is stored using `expo-secure-store`, which:

- Encrypts data at rest

- Uses the device's secure keychain/keystore

- Protects against unauthorized access

### SensitiveDataService

The `SensitiveDataService` provides a high-level API for handling sensitive data:


```typescript
class SensitiveDataService {
  // User credentials
  async saveUserCredentials(credentials: UserCredentials): Promise<void>;
  async getUserCredentials(): Promise<UserCredentials | null>;

  // Authentication tokens
  async saveAuthToken(token: AuthToken): Promise<void>;
  async getAuthToken(): Promise<AuthToken | null>;

  // PIN code
  async savePinCode(pin: string): Promise<void>;
  async getPinCode(): Promise<string | null>;

  // Biometric authentication
  async setBiometricEnabled(enabled: boolean): Promise<void>;
  async getBiometricEnabled(): Promise<boolean>;

  // Data management
  async clearAllSensitiveData(): Promise<void>;

  // Status checks
  async hasValidCredentials(): Promise<boolean>;
  async hasValidAuthToken(): Promise<boolean>;
}

```


## Key Types


```typescript
// User credentials
interface UserCredentials {
  nmcNumber: string;
  userId: string;
}

// Authentication token
interface AuthToken {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

```


## Implementation Details

### Secure Storage Keys

Sensitive data is stored using the `SECURE_` prefix and constants for key names:


```typescript
private readonly KEYS = {
  userCredentials: SecureStorageService.makeSecureKey(STORAGE_KEYS.userCredentials),
  authToken: SecureStorageService.makeSecureKey(STORAGE_KEYS.authToken),
  pinCode: SecureStorageService.makeSecureKey(STORAGE_KEYS.pinCode),
  biometricEnabled: SecureStorageService.makeSecureKey(STORAGE_KEYS.biometricEnabled),
};

```


### Authentication Process

1. User enters credentials or uses biometric authentication

2. Credentials are validated

3. Authentication tokens are stored securely

4. Token expiration is checked on each use

5. Tokens are refreshed automatically when needed

### PIN Code Authentication

PIN codes are stored securely and used for local authentication:


```typescript
async savePinCode(pin: string): Promise<void> {
  // In a real app, hash the PIN before storing
  await SecureStorageService.set(this.KEYS.pinCode, { pin });
}

```


> Note: In a production app, PINs should be hashed before storage.

### Biometric Authentication

Biometric authentication preferences are stored securely:


```typescript
async setBiometricEnabled(enabled: boolean): Promise<void> {
  await SecureStorageService.set(this.KEYS.biometricEnabled, { enabled });
}

```


## Usage Example


```typescript
import SensitiveDataService from '@/src/services/SensitiveDataService';

// Store user credentials
await SensitiveDataService.saveUserCredentials({
  nmcNumber: '12345678',
  userId: 'user-123'
});

// Check if user is logged in
const isLoggedIn = await SensitiveDataService.hasValidCredentials();

// Store PIN code
await SensitiveDataService.savePinCode('1234');

// Check if PIN is set
const pin = await SensitiveDataService.getPinCode();
const hasPinSet = !!pin;

// Clear sensitive data on logout
await SensitiveDataService.clearAllSensitiveData();

```


## Security Best Practices

1. **Minimal Storage**: Only store necessary sensitive information

2. **Expiration**: Use expiration times for tokens

3. **Clear on Logout**: Clear all sensitive data when the user logs out

4. **No Hardcoded Secrets**: Never hardcode sensitive values in the code

5. **Encrypted Exports**: Encrypt any data exports

6. **Validate Tokens**: Validate token expiration before use

7. **Error Handling**: Clear sensitive data if errors indicate compromised state

8. **Biometric Security**: Use device biometric authentication when available

9. **Automatic Timeouts**: Implement automatic session timeouts

## GDPR Compliance

The application is designed with GDPR compliance in mind:

- **Data Minimization**: Only collecting necessary information

- **Purpose Limitation**: Clear explanation of how data is used

- **Storage Limitation**: Data retention controls

- **User Control**: Full ability to export or delete personal data

- **Local Storage**: All data stored locally on the device by default

Users can:

- View all stored personal data

- Export data in a machine-readable format

- Delete individual records

- Completely wipe all personal data

## Audit Logging

Security-related events are logged using `AuditLogService`:


```typescript
await AuditLogService.logSuccess('user_login', { userId });
await AuditLogService.logFailure('user_login', { attempt: 3 }, 'Invalid credentials');

```


These logs can be used for:

- Security auditing

- Debugging authentication issues

- Monitoring suspicious activity
