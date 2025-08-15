/**
 * Formats a date as a string in the format "DD MMM YYYY"
 * 
 * @param {Date | number} date - Date object or timestamp to format
 * @returns {string} Formatted date string
 */
export function formatDate(date: Date | number): string {
  const dateObj = typeof date === 'number' ? new Date(date) : date;
  
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getFullYear();
  
  return `${day} ${month} ${year}`;
}

/**
 * Formats a date as a relative time string (e.g., "2 days ago")
 * 
 * @param {Date | number} date - Date object or timestamp to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date: Date | number): string {
  const dateObj = typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  }
}

/**
 * Returns the start and end dates for a given time period
 * 
 * @param {'day' | 'week' | 'month' | 'year' | 'all'} period - Time period
 * @returns {{ start: Date, end: Date }} Start and end dates
 */
export function getDateRangeForPeriod(
  period: 'day' | 'week' | 'month' | 'year' | 'all'
): { start: Date; end: Date } {
  const end = new Date();
  end.setHours(23, 59, 59, 999); // End of day
  
  const start = new Date();
  start.setHours(0, 0, 0, 0); // Start of day
  
  switch (period) {
    case 'day':
      // Already set to today
      break;
    case 'week':
      // Start of week (Sunday)
      start.setDate(start.getDate() - start.getDay());
      break;
    case 'month':
      // Start of month
      start.setDate(1);
      break;
    case 'year':
      // Start of year
      start.setMonth(0, 1);
      break;
    case 'all':
      // Far in the past
      start.setFullYear(2000, 0, 1);
      break;
  }
  
  return { start, end };
}

/**
 * Returns the start and end dates for a specific month
 * 
 * @param {number} month - Month (0-11)
 * @param {number} year - Year
 * @returns {{ start: Date, end: Date }} Start and end dates
 */
export function getMonthDateRange(month: number, year: number): { start: Date; end: Date } {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

/**
 * Returns the number of days in a month
 * 
 * @param {number} month - Month (0-11)
 * @param {number} year - Year
 * @returns {number} Number of days in the month
 */
export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Groups dates by month
 * 
 * @param {Array<Date | number>} dates - Array of dates or timestamps
 * @returns {Record<string, Array<Date>>} Dates grouped by month (format: "YYYY-MM")
 */
export function groupDatesByMonth(dates: Array<Date | number>): Record<string, Array<Date>> {
  return dates.reduce((groups, dateOrTimestamp) => {
    const date = typeof dateOrTimestamp === 'number' ? new Date(dateOrTimestamp) : dateOrTimestamp;
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month.toString().padStart(2, '0')}`;
    
    if (!groups[key]) {
      groups[key] = [];
    }
    
    groups[key].push(date);
    
    return groups;
  }, {} as Record<string, Array<Date>>);
}

/**
 * Formats a month name
 * 
 * @param {number} month - Month (0-11)
 * @param {'long' | 'short'} format - Format of the month name
 * @returns {string} Formatted month name
 */
export function formatMonth(month: number, format: 'long' | 'short' = 'long'): string {
  const date = new Date(2000, month, 1);
  return date.toLocaleString('default', { month: format });
}

/**
 * Checks if a date is today
 * 
 * @param {Date | number} date - Date to check
 * @returns {boolean} True if the date is today
 */
export function isToday(date: Date | number): boolean {
  const dateObj = typeof date === 'number' ? new Date(date) : date;
  const today = new Date();
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if a date is within the last N days
 * 
 * @param {Date | number} date - Date to check
 * @param {number} days - Number of days
 * @returns {boolean} True if the date is within the last N days
 */
export function isWithinLastDays(date: Date | number, days: number): boolean {
  const dateObj = typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  
  // Subtract days from now
  const compareDate = new Date();
  compareDate.setDate(now.getDate() - days);
  
  return dateObj >= compareDate;
}
