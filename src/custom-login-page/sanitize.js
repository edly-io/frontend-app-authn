const MAX_PALETTE_VALUE_LENGTH = 400;
const UNSAFE_PALETTE_VALUE_PATTERN = /[;{}]/;
const CTA_URL_ALLOWED_PREFIXES = ['https://', 'http://', 'mailto:'];

export const sanitizePalette = (palette, defaultPalette) => {
  const safePalette = {};

  Object.entries(palette || {}).forEach(([key, value]) => {
    if (!Object.prototype.hasOwnProperty.call(defaultPalette, key)) {
      return;
    }
    if (typeof value !== 'string' || value.length === 0 || value.length > MAX_PALETTE_VALUE_LENGTH) {
      return;
    }
    if (UNSAFE_PALETTE_VALUE_PATTERN.test(value)) {
      return;
    }
    safePalette[key] = value;
  });

  return safePalette;
};

export const sanitizeCtaUrl = (url) => {
  const value = typeof url === 'string' ? url.trim() : '';
  if (!value) {
    return null;
  }
  if (value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')) {
    return value;
  }
  if (CTA_URL_ALLOWED_PREFIXES.some((prefix) => value.startsWith(prefix))) {
    return value;
  }
  return null;
};
