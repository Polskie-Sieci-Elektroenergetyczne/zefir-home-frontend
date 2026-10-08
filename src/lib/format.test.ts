import { describe, expect, it } from 'vitest';
import { formatDate } from './format';

describe('formatDate', () => {
  it('formats a date with the default options', () => {
    expect(formatDate('2024-01-15T12:00:00.000Z', { timeZone: 'UTC' })).toBe('January 15, 2024');
  });

  it('uses the provided date format options', () => {
    expect(
      formatDate('2024-01-15T12:00:00.000Z', {
        month: 'short',
        day: '2-digit',
        year: '2-digit',
        timeZone: 'UTC'
      })
    ).toBe('Jan 15, 24');
  });

  it('returns an empty string for missing or invalid dates', () => {
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('')).toBe('');
    expect(formatDate('not-a-date')).toBe('');
  });
});
