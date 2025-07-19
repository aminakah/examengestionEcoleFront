import {
  formatDate,
  formatGrade,
  getMention,
  formatFileSize,
  formatPhone,
  getInitials,
  isValidEmail,
  calculateAge,
  capitalize,
  formatFullName,
  gradeToPercentage,
  calculateStats
} from '../utils/helpers';

describe('Helpers Utilities', () => {
  describe('formatDate', () => {
    test('formats date correctly in short format', () => {
      const date = '2025-01-20T10:30:00';
      expect(formatDate(date, 'short')).toBe('20/01/2025');
    });

    test('formats date correctly in long format', () => {
      const date = '2025-01-20T10:30:00';
      const result = formatDate(date, 'long');
      expect(result).toContain('20');
      expect(result).toContain('janvier');
      expect(result).toContain('2025');
    });

    test('returns empty string for invalid date', () => {
      expect(formatDate('invalid-date')).toBe('');
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('formatGrade', () => {
    test('formats grade correctly', () => {
      expect(formatGrade(15.5)).toBe('15.50/20');
      expect(formatGrade(12)).toBe('12.00/20');
      expect(formatGrade(20)).toBe('20.00/20');
    });

    test('handles invalid grades', () => {
      expect(formatGrade(null)).toBe('N/A');
      expect(formatGrade(undefined)).toBe('N/A');
      expect(formatGrade('')).toBe('N/A');
      expect(formatGrade('invalid')).toBe('N/A');
    });

    test('formats with custom precision', () => {
      expect(formatGrade(15.555, 1)).toBe('15.6/20');
      expect(formatGrade(15.555, 0)).toBe('16/20');
    });
  });

  describe('getMention', () => {
    test('returns correct mention for different grades', () => {
      expect(getMention(18).text).toBe('Très Bien');
      expect(getMention(15).text).toBe('Bien');
      expect(getMention(13).text).toBe('Assez Bien');
      expect(getMention(11).text).toBe('Passable');
      expect(getMention(8).text).toBe('Insuffisant');
    });

    test('includes color classes', () => {
      const mention = getMention(16);
      expect(mention.color).toContain('text-');
      expect(mention.bg).toContain('bg-');
    });

    test('handles invalid input', () => {
      expect(getMention('invalid').text).toBe('N/A');
      expect(getMention(null).text).toBe('N/A');
    });
  });

  describe('formatFileSize', () => {
    test('formats file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1500)).toBe('1.5 KB');
    });

    test('handles edge cases', () => {
      expect(formatFileSize(null)).toBe('0 B');
      expect(formatFileSize(undefined)).toBe('0 B');
    });
  });

  describe('formatPhone', () => {
    test('formats Senegalese phone numbers', () => {
      expect(formatPhone('771234567')).toBe('77 123 45 67');
      expect(formatPhone('221771234567')).toBe('+221 77 123 45 67');
    });

    test('handles invalid phone numbers', () => {
      expect(formatPhone('')).toBe('');
      expect(formatPhone(null)).toBe('');
      expect(formatPhone('123')).toBe('123');
    });
  });

  describe('getInitials', () => {
    test('generates initials correctly', () => {
      expect(getInitials('John', 'Doe')).toBe('JD');
      expect(getInitials('marie', 'dupont')).toBe('MD');
    });

    test('handles missing names', () => {
      expect(getInitials('John', '')).toBe('J');
      expect(getInitials('', 'Doe')).toBe('D');
      expect(getInitials('', '')).toBe('');
    });
  });

  describe('isValidEmail', () => {
    test('validates correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.org')).toBe(true);
      expect(isValidEmail('admin@ecole.com')).toBe(true);
    });

    test('rejects invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('calculateAge', () => {
    test('calculates age correctly', () => {
      const today = new Date();
      const birthYear = today.getFullYear() - 25;
      const birthDate = `${birthYear}-01-15`;
      
      const age = calculateAge(birthDate);
      expect(age).toBeGreaterThanOrEqual(24);
      expect(age).toBeLessThanOrEqual(25);
    });

    test('handles invalid birth dates', () => {
      expect(calculateAge('invalid-date')).toBe(null);
      expect(calculateAge(null)).toBe(null);
      expect(calculateAge('')).toBe(null);
    });
  });

  describe('capitalize', () => {
    test('capitalizes strings correctly', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
      expect(capitalize('tESt')).toBe('Test');
    });

    test('handles edge cases', () => {
      expect(capitalize('')).toBe('');
      expect(capitalize(null)).toBe('');
      expect(capitalize(undefined)).toBe('');
    });
  });

  describe('formatFullName', () => {
    test('formats names in different styles', () => {
      expect(formatFullName('John', 'Doe')).toBe('John DOE');
      expect(formatFullName('john', 'doe', 'lastFirst')).toBe('DOE John');
      expect(formatFullName('Marie', 'Dupont', 'initialsLast')).toBe('M. DUPONT');
    });

    test('handles missing names', () => {
      expect(formatFullName('John', '')).toBe('John');
      expect(formatFullName('', 'Doe')).toBe('DOE');
      expect(formatFullName('', '')).toBe('');
    });
  });

  describe('gradeToPercentage', () => {
    test('converts grades to percentage', () => {
      expect(gradeToPercentage(15, 20)).toBe(75);
      expect(gradeToPercentage(10, 20)).toBe(50);
      expect(gradeToPercentage(20, 20)).toBe(100);
    });

    test('handles edge cases', () => {
      expect(gradeToPercentage(0, 20)).toBe(0);
      expect(gradeToPercentage(null, 20)).toBe(0);
      expect(gradeToPercentage(15, 0)).toBe(0);
    });
  });

  describe('calculateStats', () => {
    test('calculates statistics correctly', () => {
      const numbers = [10, 15, 20, 12, 18];
      const stats = calculateStats(numbers);
      
      expect(stats.count).toBe(5);
      expect(stats.sum).toBe(75);
      expect(stats.average).toBe(15);
      expect(stats.min).toBe(10);
      expect(stats.max).toBe(20);
    });

    test('handles empty arrays', () => {
      const stats = calculateStats([]);
      expect(stats.count).toBe(0);
      expect(stats.average).toBe(0);
    });

    test('filters out invalid numbers', () => {
      const numbers = [10, 'invalid', 15, null, 20, undefined];
      const stats = calculateStats(numbers);
      
      expect(stats.count).toBe(3);
      expect(stats.average).toBe(15);
    });
  });
});

describe('Grade Calculations Integration', () => {
  test('complete grade processing workflow', () => {
    const rawGrade = 15.5;
    
    // Format the grade
    const formattedGrade = formatGrade(rawGrade);
    expect(formattedGrade).toBe('15.50/20');
    
    // Get the mention
    const mention = getMention(rawGrade);
    expect(mention.text).toBe('Bien');
    
    // Convert to percentage
    const percentage = gradeToPercentage(rawGrade);
    expect(percentage).toBe(78);
  });
});
