import getFieldErrorMessage from './fieldError';
import { ALWAYS_REQUIRED_PROFILE_FIELDS } from './twoStepConstants';
import messages from '../twoStepMessages';

// Rules for the step-2 profile fields. They mirror the backend (RegistrationProfileForm in edly-features-app and core's
// UserProfile.phone_regex) and must never be stricter than it. Required-ness comes from the backend's field
// descriptions (see isFormValid), so only format/length/choice rules live here.

// Same pattern as core's UserProfile.phone_regex.
export const PHONE_REGEX = /^\+?1?\d*$/;
export const TRN_REGEX = /^\d{9}$/;

// The native date input yields YYYY-MM-DD (or '' while incomplete).
const isValidIsoDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) { return false; }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

// Today as YYYY-MM-DD in the user's local timezone (the format of the native date input).
export const getToday = () => {
  const now = new Date();
  const pad = number => String(number).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

// The backend's required message, or the UI's own for the always-required fields; '' when not required.
export const getRequiredMessage = (name, description, formatMessage) => (
  getFieldErrorMessage(description?.error_message)
  || (ALWAYS_REQUIRED_PROFILE_FIELDS.includes(name) ? formatMessage(messages[`registration.profile.${name}.required`]) : '')
);

export const PROFILE_FIELD_RULES = {
  trn: { maxLength: 20, validate: value => TRN_REGEX.test(value.replace(/[\s-]/g, '')), invalidMessage: 'registration.profile.trn.invalid' },
  physical_address: { maxLength: 255 },
  other_numbers: { maxLength: 50, validate: value => PHONE_REGEX.test(value), invalidMessage: 'registration.profile.phone.invalid' },
  job_title: { maxLength: 100 },
  photo_id_number: { maxLength: 100 },
  telephone: { maxLength: 50, validate: value => PHONE_REGEX.test(value), invalidMessage: 'registration.profile.phone.invalid' },
  photo_id_type: { oneOf: true },
  parish: { oneOf: true },
  id_expiration_date: { validate: value => isValidIsoDate(value), invalidMessage: 'registration.profile.date.invalid', notPast: true },
};

/**
 * Returns the error message for one profile field, or '' when the value is acceptable (or empty:
 * required-ness is checked separately). Like the backend, values are trimmed first.
 * @param name
 * @param rawValue
 * @param description backend field description ({ options, error_message })
 * @param formatMessage
 * @returns {string}
 */
export const getProfileFieldError = (name, rawValue, description, formatMessage) => {
  const rule = PROFILE_FIELD_RULES[name];
  if (!rule || typeof rawValue !== 'string') { return ''; }
  const value = rawValue.trim();
  if (!value) {
    // Whitespace-only counts as empty for the backend, so required fields must reject it.
    const requiredMessage = getFieldErrorMessage(description?.error_message);
    return rawValue && requiredMessage ? requiredMessage : '';
  }
  if (rule.maxLength && value.length > rule.maxLength) {
    return formatMessage(messages['registration.profile.max.length'], { max: rule.maxLength, count: value.length });
  }
  if (rule.oneOf && !(description?.options || []).some(option => option[0] === value)) {
    return formatMessage(messages['registration.profile.choice.invalid']);
  }
  if (rule.validate && !rule.validate(value)) {
    return formatMessage(messages[rule.invalidMessage]);
  }
  if (rule.notPast && value < getToday()) {
    return formatMessage(messages['registration.profile.date.past']);
  }
  return '';
};

/**
 * Validates every profile field present in the descriptions (and the always-required ones) and returns
 * { fieldName: message } for the invalid ones.
 */
export const validateProfileFields = (formFields, fieldDescriptions, formatMessage) => {
  const errors = {};
  const names = new Set([...Object.keys(PROFILE_FIELD_RULES), ...ALWAYS_REQUIRED_PROFILE_FIELDS]);
  names.forEach(name => {
    if (!fieldDescriptions[name]) { return; }
    let error = getProfileFieldError(name, formFields[name], fieldDescriptions[name], formatMessage);
    if (!error && ALWAYS_REQUIRED_PROFILE_FIELDS.includes(name) && !(formFields[name] || '').trim()) {
      error = getRequiredMessage(name, fieldDescriptions[name], formatMessage);
    }
    if (error) { errors[name] = error; }
  });
  return errors;
};
