/**
 * Truncates a string to a maximum length and adds an ellipsis if needed
 * 
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export function truncateString(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) {
    return str;
  }
  
  return `${str.substring(0, maxLength)}...`;
}

/**
 * Capitalizes the first letter of a string
 * 
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str || str.length === 0) {
    return str;
  }
  
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string to title case
 * 
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export function toTitleCase(str: string): string {
  if (!str || str.length === 0) {
    return str;
  }
  
  return str
    .split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
}

/**
 * Converts a string to kebab case
 * 
 * @param {string} str - String to convert
 * @returns {string} Kebab case string
 */
export function toKebabCase(str: string): string {
  if (!str || str.length === 0) {
    return str;
  }
  
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Converts a string to camel case
 * 
 * @param {string} str - String to convert
 * @returns {string} Camel case string
 */
export function toCamelCase(str: string): string {
  if (!str || str.length === 0) {
    return str;
  }
  
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/[\s-_]+/g, '');
}

/**
 * Converts a string to snake case
 * 
 * @param {string} str - String to convert
 * @returns {string} Snake case string
 */
export function toSnakeCase(str: string): string {
  if (!str || str.length === 0) {
    return str;
  }
  
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Removes HTML tags from a string
 * 
 * @param {string} str - String with HTML tags
 * @returns {string} String without HTML tags
 */
export function stripHtml(str: string): string {
  if (!str || str.length === 0) {
    return str;
  }
  
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Removes special characters from a string
 * 
 * @param {string} str - String with special characters
 * @returns {string} String without special characters
 */
export function removeSpecialCharacters(str: string): string {
  if (!str || str.length === 0) {
    return str;
  }
  
  return str.replace(/[^\w\s]/gi, '');
}

/**
 * Generates a slug from a string
 * 
 * @param {string} str - String to convert to slug
 * @returns {string} Slug
 */
export function slugify(str: string): string {
  if (!str || str.length === 0) {
    return str;
  }
  
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extracts the first N words from a string
 * 
 * @param {string} str - String to extract words from
 * @param {number} wordCount - Number of words to extract
 * @returns {string} First N words
 */
export function extractFirstNWords(str: string, wordCount: number): string {
  if (!str || str.length === 0) {
    return str;
  }
  
  const words = str.split(/\s+/);
  return words.slice(0, wordCount).join(' ');
}

/**
 * Formats a number as a file size string (e.g., "1.5 MB")
 * 
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 Bytes';
  }
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
