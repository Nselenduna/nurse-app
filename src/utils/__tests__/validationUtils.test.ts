import {
  isEmpty,
  isNumber,
  isValidDate,
  isValidEmail,
  isValidNMCPin,
  isValidUKPhoneNumber,
  isValidUKPostcode,
  validateCpdLog,
  validatePassword,
} from '../validationUtils';

describe('validationUtils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('test.user@example.co.uk')).toBe(true);
      expect(isValidEmail('test+filter@example.com')).toBe(true);
    });
    
    it('should reject invalid email addresses', () => {
      expect(isValidEmail('test')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
    });
  });
  
  describe('isValidUKPostcode', () => {
    it('should validate correct UK postcodes', () => {
      expect(isValidUKPostcode('SW1A 1AA')).toBe(true);
      expect(isValidUKPostcode('M1 1AA')).toBe(true);
      expect(isValidUKPostcode('B33 8TH')).toBe(true);
      expect(isValidUKPostcode('CR2 6XH')).toBe(true);
      expect(isValidUKPostcode('DN55 1PT')).toBe(true);
    });
    
    it('should handle postcodes without spaces', () => {
      expect(isValidUKPostcode('SW1A1AA')).toBe(true);
      expect(isValidUKPostcode('M11AA')).toBe(true);
    });
    
    it('should reject invalid UK postcodes', () => {
      expect(isValidUKPostcode('1234 567')).toBe(false);
      expect(isValidUKPostcode('ABCD EFG')).toBe(false);
      expect(isValidUKPostcode('SW1A')).toBe(false);
      expect(isValidUKPostcode('SW1A 1A')).toBe(false);
    });
  });
  
  describe('isValidUKPhoneNumber', () => {
    it('should validate correct UK phone numbers', () => {
      expect(isValidUKPhoneNumber('07123456789')).toBe(true);
      expect(isValidUKPhoneNumber('02071234567')).toBe(true);
      expect(isValidUKPhoneNumber('01234567890')).toBe(true);
    });
    
    it('should handle phone numbers with spaces and formatting', () => {
      expect(isValidUKPhoneNumber('07123 456789')).toBe(true);
      expect(isValidUKPhoneNumber('0207 123 4567')).toBe(true);
      expect(isValidUKPhoneNumber('(0123) 456-7890')).toBe(true);
    });
    
    it('should reject invalid UK phone numbers', () => {
      expect(isValidUKPhoneNumber('123456789')).toBe(false);
      expect(isValidUKPhoneNumber('17123456789')).toBe(false);
      expect(isValidUKPhoneNumber('+447123456789')).toBe(false);
    });
  });
  
  describe('isValidNMCPin', () => {
    it('should validate correct NMC PINs', () => {
      expect(isValidNMCPin('12A12345')).toBe(true);
      expect(isValidNMCPin('12AB12345')).toBe(false); // Too long
      expect(isValidNMCPin('12a12345')).toBe(true); // Case insensitive
    });
    
    it('should reject invalid NMC PINs', () => {
      expect(isValidNMCPin('1234567')).toBe(false);
      expect(isValidNMCPin('ABCDEFGH')).toBe(false);
      expect(isValidNMCPin('12345678')).toBe(false);
    });
  });
  
  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongP@ss123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should reject passwords without uppercase letters', () => {
      const result = validatePassword('strongp@ss123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });
    
    it('should reject passwords without lowercase letters', () => {
      const result = validatePassword('STRONGP@SS123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });
    
    it('should reject passwords without numbers', () => {
      const result = validatePassword('StrongP@ssword');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });
    
    it('should reject passwords without special characters', () => {
      const result = validatePassword('StrongPass123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });
    
    it('should reject short passwords', () => {
      const result = validatePassword('Sh@rt1');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });
  });
  
  describe('validateCpdLog', () => {
    it('should validate valid CPD logs', () => {
      const result = validateCpdLog({
        text: 'Attended a workshop',
        category: 'Education & Training',
        hours: 2,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should reject logs without text', () => {
      const result = validateCpdLog({
        text: '',
        category: 'Education & Training',
        hours: 2,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description is required');
    });
    
    it('should reject logs without category', () => {
      const result = validateCpdLog({
        text: 'Attended a workshop',
        category: '',
        hours: 2,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Category is required');
    });
    
    it('should reject logs with zero or negative hours', () => {
      const result = validateCpdLog({
        text: 'Attended a workshop',
        category: 'Education & Training',
        hours: 0,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Hours must be greater than 0');
      
      const negativeResult = validateCpdLog({
        text: 'Attended a workshop',
        category: 'Education & Training',
        hours: -1,
      });
      expect(negativeResult.isValid).toBe(false);
      expect(negativeResult.errors).toContain('Hours must be greater than 0');
    });
    
    it('should reject logs with excessive hours', () => {
      const result = validateCpdLog({
        text: 'Attended a workshop',
        category: 'Education & Training',
        hours: 25,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Hours cannot exceed 24 per activity');
    });
  });
  
  describe('isEmpty', () => {
    it('should identify empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });
    
    it('should identify non-empty values', () => {
      expect(isEmpty('text')).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ key: 'value' })).toBe(false);
    });
  });
  
  describe('isNumber', () => {
    it('should identify numeric values', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-123)).toBe(true);
      expect(isNumber('123')).toBe(true);
      expect(isNumber('0')).toBe(true);
      expect(isNumber('-123')).toBe(true);
    });
    
    it('should reject non-numeric values', () => {
      expect(isNumber('abc')).toBe(false);
      expect(isNumber('123abc')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
    });
  });
  
  describe('isValidDate', () => {
    it('should identify valid dates', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate('2023-01-01')).toBe(true);
      expect(isValidDate(1672531200000)).toBe(true); // January 1, 2023 timestamp
    });
    
    it('should reject invalid dates', () => {
      expect(isValidDate('not a date')).toBe(false);
      expect(isValidDate('2023-13-01')).toBe(false); // Invalid month
      expect(isValidDate({})).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
    });
  });
});
