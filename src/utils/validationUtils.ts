/**
 * Validates an email address
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a UK postcode
 * 
 * @param {string} postcode - Postcode to validate
 * @returns {boolean} True if the postcode is valid
 */
export function isValidUKPostcode(postcode: string): boolean {
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
  return postcodeRegex.test(postcode);
}

/**
 * Validates a UK phone number
 * 
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if the phone number is valid
 */
export function isValidUKPhoneNumber(phone: string): boolean {
  // Remove spaces, dashes, and parentheses
  const cleanedPhone = phone.replace(/[\s\-()]/g, '');
  
  // UK phone numbers start with 0 and are 10-11 digits long
  const phoneRegex = /^0[0-9]{9,10}$/;
  return phoneRegex.test(cleanedPhone);
}

/**
 * Validates an NMC PIN (Nursing and Midwifery Council Personal Identification Number)
 * 
 * @param {string} pin - NMC PIN to validate
 * @returns {boolean} True if the PIN is valid
 */
export function isValidNMCPin(pin: string): boolean {
  // NMC PINs are typically 8 digits
  // Format: 2 digits, followed by letter(s), followed by 5 digits
  const pinRegex = /^\d{2}[A-Z]{1,2}\d{5}$/;
  return pinRegex.test(pin.toUpperCase());
}

/**
 * Validates a password against common security rules
 * 
 * @param {string} password - Password to validate
 * @returns {{ isValid: boolean, errors: string[] }} Validation result and errors
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a CPD log entry
 * 
 * @param {{ text: string, category: string, hours: number }} log - CPD log to validate
 * @returns {{ isValid: boolean, errors: string[] }} Validation result and errors
 */
export function validateCpdLog(log: {
  text: string;
  category: string;
  hours: number;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!log.text || log.text.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (!log.category || log.category.trim().length === 0) {
    errors.push('Category is required');
  }
  
  if (log.hours <= 0) {
    errors.push('Hours must be greater than 0');
  }
  
  if (log.hours > 24) {
    errors.push('Hours cannot exceed 24 per activity');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, or empty object)
 * 
 * @param {any} value - Value to check
 * @returns {boolean} True if the value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string' && value.trim().length === 0) {
    return true;
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }
  
  return false;
}

/**
 * Checks if a value is a number
 * 
 * @param {any} value - Value to check
 * @returns {boolean} True if the value is a number
 */
export function isNumber(value: any): boolean {
  if (typeof value === 'number' && !isNaN(value)) {
    return true;
  }
  
  if (typeof value === 'string') {
    return !isNaN(Number(value));
  }
  
  return false;
}

/**
 * Checks if a value is a valid date
 * 
 * @param {any} value - Value to check
 * @returns {boolean} True if the value is a valid date
 */
export function isValidDate(value: any): boolean {
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }
  
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  
  return false;
}
