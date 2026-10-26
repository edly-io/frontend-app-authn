import {
  caretAfterFormat, formatTelephone, formatTrn, unformatTelephone,
} from '../inputMasks';

describe('formatTrn', () => {
  it('inserts hyphens after digit 3 and 6 while typing', () => {
    expect(['1', '12', '123', '1234', '123456', '1234567', '123456789'].map(formatTrn))
      .toEqual(['1', '12', '123', '123-4', '123-456', '123-456-7', '123-456-789']);
  });

  it('reformats pasted values and strips non-digits', () => {
    expect(formatTrn('123 456 789')).toBe('123-456-789');
    expect(formatTrn('123456789')).toBe('123-456-789');
    expect(formatTrn('12a3-456-789')).toBe('123-456-789');
  });

  it('caps at 9 digits and handles empty input', () => {
    expect(formatTrn('1234567890123')).toBe('123-456-789');
    expect(formatTrn('')).toBe('');
    expect(formatTrn(undefined)).toBe('');
  });

  it('backspacing over a separator leaves the same masked value (the digit is kept)', () => {
    // "123-456" with the hyphen deleted by the browser becomes "123456", which re-masks to the same value.
    expect(formatTrn('123456')).toBe('123-456');
  });
});

describe('formatTelephone / unformatTelephone', () => {
  it('masks plain digits as ### ### ####', () => {
    expect(['8', '876', '8765', '876555', '8765550', '8765550100'].map(formatTelephone))
      .toEqual(['8', '876', '876 5', '876 555', '876 555 0', '876 555 0100']);
  });

  it('appends digits beyond the 10th unformatted', () => {
    expect(formatTelephone('876555010012')).toBe('876 555 010012');
  });

  it('does not mask numbers with a leading + or other characters', () => {
    expect(formatTelephone('+18765550100')).toBe('+18765550100');
    expect(formatTelephone('876-555-0100')).toBe('876-555-0100');
    expect(formatTelephone('abc')).toBe('abc');
  });

  it('unformat removes whitespace only, so the backend rule sees what was typed', () => {
    expect(unformatTelephone('876 555 0100')).toBe('8765550100');
    expect(unformatTelephone('+1 876 555 0100')).toBe('+18765550100');
    expect(unformatTelephone('876-555 0100')).toBe('876-5550100');
  });

  it('handles empty input and a pasted spaced value', () => {
    expect(formatTelephone('')).toBe('');
    expect(unformatTelephone(undefined)).toBe('');
    expect(formatTelephone(unformatTelephone('876 555 0100'))).toBe('876 555 0100');
  });
});

describe('caretAfterFormat', () => {
  it('keeps the caret after the same digit when a separator is inserted', () => {
    // Typing the 4th digit at the end of "123" gives raw "1234", caret 4, formatted "123-4".
    expect(caretAfterFormat('1234', 4, '123-4')).toBe(5);
    // Editing in the middle: raw "1239456" (a 9 typed after digit 3), caret 4, formatted "123-945-6".
    expect(caretAfterFormat('1239456', 4, '123-945-6')).toBe(5);
  });

  it('returns 0 before any digit and the end past the last digit', () => {
    expect(caretAfterFormat('abc', 3, '')).toBe(0);
    expect(caretAfterFormat('123', 3, '123')).toBe(3);
  });
});
