import {
    formatDate,
    formatRelativeTime,
    getDateRangeForPeriod,
    getDaysInMonth,
    getMonthDateRange,
    isToday,
    isWithinLastDays,
} from '../dateUtils';

describe('dateUtils', () => {
  // Mock Date for consistent testing
  const mockDate = new Date(2023, 5, 15, 12, 0, 0); // June 15, 2023, 12:00:00
  const originalDate = global.Date;
  
  beforeEach(() => {
    global.Date = class extends Date {
      constructor(date?: any) {
        if (date) {
          return new originalDate(date);
        }
        return mockDate;
      }
      
      static now() {
        return mockDate.getTime();
      }
    } as any;
  });
  
  afterEach(() => {
    global.Date = originalDate;
  });
  
  describe('formatDate', () => {
    it('should format a Date object correctly', () => {
      const date = new Date(2023, 0, 1); // January 1, 2023
      expect(formatDate(date)).toBe('1 Jan 2023');
    });
    
    it('should format a timestamp correctly', () => {
      const timestamp = new Date(2023, 11, 31).getTime(); // December 31, 2023
      expect(formatDate(timestamp)).toBe('31 Dec 2023');
    });
  });
  
  describe('formatRelativeTime', () => {
    it('should return "just now" for times less than a minute ago', () => {
      const date = new Date(mockDate.getTime() - 30 * 1000); // 30 seconds ago
      expect(formatRelativeTime(date)).toBe('just now');
    });
    
    it('should return minutes for times less than an hour ago', () => {
      const date = new Date(mockDate.getTime() - 10 * 60 * 1000); // 10 minutes ago
      expect(formatRelativeTime(date)).toBe('10 minutes ago');
      
      const singleMinute = new Date(mockDate.getTime() - 1 * 60 * 1000); // 1 minute ago
      expect(formatRelativeTime(singleMinute)).toBe('1 minute ago');
    });
    
    it('should return hours for times less than a day ago', () => {
      const date = new Date(mockDate.getTime() - 5 * 60 * 60 * 1000); // 5 hours ago
      expect(formatRelativeTime(date)).toBe('5 hours ago');
      
      const singleHour = new Date(mockDate.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago
      expect(formatRelativeTime(singleHour)).toBe('1 hour ago');
    });
    
    it('should return days for times less than a month ago', () => {
      const date = new Date(mockDate.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
      expect(formatRelativeTime(date)).toBe('5 days ago');
      
      const singleDay = new Date(mockDate.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day ago
      expect(formatRelativeTime(singleDay)).toBe('1 day ago');
    });
  });
  
  describe('getDateRangeForPeriod', () => {
    it('should return correct range for "day"', () => {
      const { start, end } = getDateRangeForPeriod('day');
      
      expect(start.getFullYear()).toBe(2023);
      expect(start.getMonth()).toBe(5); // June
      expect(start.getDate()).toBe(15);
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
      
      expect(end.getFullYear()).toBe(2023);
      expect(end.getMonth()).toBe(5); // June
      expect(end.getDate()).toBe(15);
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
      expect(end.getSeconds()).toBe(59);
    });
    
    it('should return correct range for "month"', () => {
      const { start, end } = getDateRangeForPeriod('month');
      
      expect(start.getFullYear()).toBe(2023);
      expect(start.getMonth()).toBe(5); // June
      expect(start.getDate()).toBe(1);
      expect(start.getHours()).toBe(0);
      
      expect(end.getFullYear()).toBe(2023);
      expect(end.getMonth()).toBe(5); // June
      expect(end.getDate()).toBe(15); // Current day
      expect(end.getHours()).toBe(23);
    });
  });
  
  describe('getMonthDateRange', () => {
    it('should return correct range for a month', () => {
      const { start, end } = getMonthDateRange(1, 2023); // February 2023
      
      expect(start.getFullYear()).toBe(2023);
      expect(start.getMonth()).toBe(1); // February
      expect(start.getDate()).toBe(1);
      expect(start.getHours()).toBe(0);
      
      expect(end.getFullYear()).toBe(2023);
      expect(end.getMonth()).toBe(1); // February
      expect(end.getDate()).toBe(28); // Last day of February 2023
      expect(end.getHours()).toBe(23);
    });
    
    it('should handle leap years correctly', () => {
      const { start, end } = getMonthDateRange(1, 2024); // February 2024 (leap year)
      
      expect(start.getFullYear()).toBe(2024);
      expect(start.getMonth()).toBe(1); // February
      expect(start.getDate()).toBe(1);
      
      expect(end.getFullYear()).toBe(2024);
      expect(end.getMonth()).toBe(1); // February
      expect(end.getDate()).toBe(29); // Last day of February 2024 (leap year)
    });
  });
  
  describe('getDaysInMonth', () => {
    it('should return correct number of days for various months', () => {
      expect(getDaysInMonth(0, 2023)).toBe(31); // January
      expect(getDaysInMonth(1, 2023)).toBe(28); // February (non-leap)
      expect(getDaysInMonth(1, 2024)).toBe(29); // February (leap)
      expect(getDaysInMonth(3, 2023)).toBe(30); // April
      expect(getDaysInMonth(7, 2023)).toBe(31); // August
    });
  });
  
  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date(2023, 5, 15); // Same as mock date
      expect(isToday(today)).toBe(true);
    });
    
    it('should return false for other days', () => {
      const yesterday = new Date(2023, 5, 14);
      expect(isToday(yesterday)).toBe(false);
      
      const tomorrow = new Date(2023, 5, 16);
      expect(isToday(tomorrow)).toBe(false);
    });
  });
  
  describe('isWithinLastDays', () => {
    it('should return true for dates within the specified days', () => {
      const twoDaysAgo = new Date(2023, 5, 13);
      expect(isWithinLastDays(twoDaysAgo, 3)).toBe(true);
      
      const today = new Date(2023, 5, 15);
      expect(isWithinLastDays(today, 1)).toBe(true);
    });
    
    it('should return false for dates outside the specified days', () => {
      const fiveDaysAgo = new Date(2023, 5, 10);
      expect(isWithinLastDays(fiveDaysAgo, 3)).toBe(false);
    });
  });
});
