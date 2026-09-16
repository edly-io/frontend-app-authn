import { DEFAULT_PALETTE } from '../defaults';
import { sanitizeCtaUrl, sanitizePalette } from '../sanitize';

describe('sanitizeCtaUrl', () => {
  it.each([
    ['//evil.com', null],
    ['/\\evil.com', null],
    [['javascript', 'alert(1)'].join(':'), null],
    ['data:text/html,<script>alert(1)</script>', null],
    ['mailto:a@b.c', 'mailto:a@b.c'],
    ['https://x', 'https://x'],
    ['/dashboard', '/dashboard'],
    ['', null],
    [null, null],
    [undefined, null],
  ])('resolves %s to %s', (input, expected) => {
    expect(sanitizeCtaUrl(input)).toEqual(expected);
  });
});

describe('sanitizePalette', () => {
  it('keeps only allowlisted keys', () => {
    expect(sanitizePalette({ bg: '#000000', unknownKey: '#ffffff' }, DEFAULT_PALETTE)).toEqual({
      bg: '#000000',
    });
  });

  it('rejects values containing ; { or }', () => {
    expect(sanitizePalette({ bg: 'red; } body { background: url(evil)' }, DEFAULT_PALETTE)).toEqual({});
  });

  it('rejects non-string values', () => {
    expect(sanitizePalette({ bg: 123 }, DEFAULT_PALETTE)).toEqual({});
  });

  it('rejects oversized values', () => {
    expect(sanitizePalette({ bg: 'x'.repeat(500) }, DEFAULT_PALETTE)).toEqual({});
  });

  it('rejects an empty string value', () => {
    expect(sanitizePalette({ bg: '' }, DEFAULT_PALETTE)).toEqual({});
  });
});
