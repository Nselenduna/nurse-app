import {
  capitalizeFirstLetter,
  extractFirstNWords,
  formatFileSize,
  removeSpecialCharacters,
  slugify,
  stripHtml,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  toTitleCase,
  truncateString,
} from '../stringUtils';

describe('stringUtils', () => {
  describe('truncateString', () => {
    it('should truncate strings longer than maxLength', () => {
      expect(truncateString('Hello, world!', 5)).toBe('Hello...');
    });
    
    it('should not truncate strings shorter than maxLength', () => {
      expect(truncateString('Hello', 10)).toBe('Hello');
    });
    
    it('should handle empty strings', () => {
      expect(truncateString('', 5)).toBe('');
    });
    
    it('should handle null or undefined', () => {
      expect(truncateString(null as any, 5)).toBe(null);
      expect(truncateString(undefined as any, 5)).toBe(undefined);
    });
  });
  
  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
    });
    
    it('should handle already capitalized strings', () => {
      expect(capitalizeFirstLetter('Hello')).toBe('Hello');
    });
    
    it('should handle empty strings', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });
    
    it('should handle null or undefined', () => {
      expect(capitalizeFirstLetter(null as any)).toBe(null);
      expect(capitalizeFirstLetter(undefined as any)).toBe(undefined);
    });
  });
  
  describe('toTitleCase', () => {
    it('should convert string to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
    });
    
    it('should handle already title case strings', () => {
      expect(toTitleCase('Hello World')).toBe('Hello World');
    });
    
    it('should handle empty strings', () => {
      expect(toTitleCase('')).toBe('');
    });
    
    it('should handle null or undefined', () => {
      expect(toTitleCase(null as any)).toBe(null);
      expect(toTitleCase(undefined as any)).toBe(undefined);
    });
  });
  
  describe('toKebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
    });
    
    it('should convert spaces to hyphens', () => {
      expect(toKebabCase('hello world')).toBe('hello-world');
    });
    
    it('should convert PascalCase to kebab-case', () => {
      expect(toKebabCase('HelloWorld')).toBe('hello-world');
    });
    
    it('should handle empty strings', () => {
      expect(toKebabCase('')).toBe('');
    });
    
    it('should handle null or undefined', () => {
      expect(toKebabCase(null as any)).toBe(null);
      expect(toKebabCase(undefined as any)).toBe(undefined);
    });
  });
  
  describe('toCamelCase', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
    });
    
    it('should convert spaces to camelCase', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
    });
    
    it('should convert snake_case to camelCase', () => {
      expect(toCamelCase('hello_world')).toBe('helloWorld');
    });
    
    it('should handle empty strings', () => {
      expect(toCamelCase('')).toBe('');
    });
    
    it('should handle null or undefined', () => {
      expect(toCamelCase(null as any)).toBe(null);
      expect(toCamelCase(undefined as any)).toBe(undefined);
    });
  });
  
  describe('toSnakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
    });
    
    it('should convert spaces to underscores', () => {
      expect(toSnakeCase('hello world')).toBe('hello_world');
    });
    
    it('should convert kebab-case to snake_case', () => {
      expect(toSnakeCase('hello-world')).toBe('hello_world');
    });
    
    it('should handle empty strings', () => {
      expect(toSnakeCase('')).toBe('');
    });
    
    it('should handle null or undefined', () => {
      expect(toSnakeCase(null as any)).toBe(null);
      expect(toSnakeCase(undefined as any)).toBe(undefined);
    });
  });
  
  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Hello <strong>world</strong>!</p>')).toBe('Hello world!');
    });
    
    it('should handle strings without HTML', () => {
      expect(stripHtml('Hello world!')).toBe('Hello world!');
    });
    
    it('should handle empty strings', () => {
      expect(stripHtml('')).toBe('');
    });
    
    it('should handle null or undefined', () => {
      expect(stripHtml(null as any)).toBe(null);
      expect(stripHtml(undefined as any)).toBe(undefined);
    });
  });
  
  describe('removeSpecialCharacters', () => {
    it('should remove special characters', () => {
      expect(removeSpecialCharacters('Hello, world!')).toBe('Hello world');
    });
    
    it('should handle strings without special characters', () => {
      expect(removeSpecialCharacters('Hello world')).toBe('Hello world');
    });
    
    it('should handle empty strings', () => {
      expect(removeSpecialCharacters('')).toBe('');
    });
    
    it('should handle null or undefined', () => {
      expect(removeSpecialCharacters(null as any)).toBe(null);
      expect(removeSpecialCharacters(undefined as any)).toBe(undefined);
    });
  });
  
  describe('slugify', () => {
    it('should convert string to slug', () => {
      expect(slugify('Hello, world!')).toBe('hello-world');
    });
    
    it('should handle strings with multiple spaces and special characters', () => {
      expect(slugify('Hello   world! This is a test.')).toBe('hello-world-this-is-a-test');
    });
    
    it('should handle empty strings', () => {
      expect(slugify('')).toBe('');
    });
    
    it('should handle null or undefined', () => {
      expect(slugify(null as any)).toBe(null);
      expect(slugify(undefined as any)).toBe(undefined);
    });
  });
  
  describe('extractFirstNWords', () => {
    it('should extract the first N words', () => {
      expect(extractFirstNWords('Hello world this is a test', 3)).toBe('Hello world this');
    });
    
    it('should handle strings with fewer words than requested', () => {
      expect(extractFirstNWords('Hello world', 5)).toBe('Hello world');
    });
    
    it('should handle empty strings', () => {
      expect(extractFirstNWords('', 3)).toBe('');
    });
    
    it('should handle null or undefined', () => {
      expect(extractFirstNWords(null as any, 3)).toBe(null);
      expect(extractFirstNWords(undefined as any, 3)).toBe(undefined);
    });
  });
  
  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 Bytes');
    });
    
    it('should format kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });
    
    it('should format megabytes correctly', () => {
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(2097152)).toBe('2 MB');
    });
    
    it('should format gigabytes correctly', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
    
    it('should handle zero bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });
  });
});
