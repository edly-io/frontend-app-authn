// Input masks for the TPDCO two-step registration (two-step mode only).

/** TRN: digits only, capped at 9, shown as ###-###-###. The formatted value is what gets submitted. */
export const formatTrn = (raw) => {
  const digits = (raw || '').replace(/\D/g, '').slice(0, 9);
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6)].filter(Boolean).join('-');
};

/**
 * Telephone as stored/submitted: whitespace removed, nothing else touched, so the backend's digits-only
 * (optional leading +) rule sees exactly what the user typed.
 */
export const unformatTelephone = (raw) => (raw || '').replace(/\s/g, '');

/**
 * Telephone as displayed: ### ### #### for plain digit input. A leading '+' (country code) or any non-digit
 * character switches the mask off, and digits beyond the 10th are appended unformatted.
 */
export const formatTelephone = (stored) => {
  const value = unformatTelephone(stored);
  if (!/^\d*$/.test(value)) { return value; }
  return [value.slice(0, 3), value.slice(3, 6), value.slice(6)].filter(Boolean).join(' ');
};

/**
 * Where the caret should go after reformatting: just after the same number of digits it followed in the raw input.
 */
export const caretAfterFormat = (rawValue, rawCaret, formattedValue) => {
  const digitsBefore = (rawValue || '').slice(0, rawCaret).replace(/\D/g, '').length;
  if (digitsBefore === 0) { return 0; }
  let seen = 0;
  for (let index = 0; index < formattedValue.length; index += 1) {
    if (/\d/.test(formattedValue[index])) { seen += 1; }
    if (seen === digitsBefore) { return index + 1; }
  }
  return formattedValue.length;
};

/** Expiry date as typed: digits only, shown as mm/dd/yy (the Figma format). */
export const formatDate = (raw) => {
  const digits = (raw || '').replace(/\D/g, '').slice(0, 6);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('/');
};

/** mm/dd/yy -> YYYY-MM-DD (20yy, ID expiry dates are never in the 1900s), or '' when it is not a real date. */
export const toIsoDate = (value) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{2})$/.exec(value || '');
  if (!match) { return ''; }
  const iso = `20${match[3]}-${match[1]}-${match[2]}`;
  const date = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === iso ? iso : '';
};
