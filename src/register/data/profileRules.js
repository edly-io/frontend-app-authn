import getFieldErrorMessage from './fieldError';
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

export const PROFILE_FIELD_RULES = {
  trn: { maxLength: 20, validate: value => TRN_REGEX.test(value.replace(/[\s-]/g, '')), invalidMessage: 'registration.profile.trn.invalid' },
  physical_address: { maxLength: 255 },
  other_numbers: { maxLength: 50, validate: value => PHONE_REGEX.test(value), invalidMessage: 'registration.profile.phone.invalid' },
  job_title: { maxLength: 100 },
  photo_id_number: { maxLength: 100 },
  telephone: { maxLength: 50, validate: value => PHONE_REGEX.test(value), invalidMessage: 'registration.profile.phone.invalid' },
  photo_id_type: { oneOf: true },
  parish: { oneOf: true },
  id_expiration_date: { validate: value => isValidIsoDate(value), invalidMessage: 'registration.profile.date.invalid' },
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
  return '';
};

/**
 * Validates every profile field present in the descriptions and returns { fieldName: message } for the invalid ones.
 */
export const validateProfileFields = (formFields, fieldDescriptions, formatMessage) => {
  const errors = {};
  Object.keys(PROFILE_FIELD_RULES).forEach(name => {
    if (!fieldDescriptions[name]) { return; }
    const error = getProfileFieldError(name, formFields[name], fieldDescriptions[name], formatMessage);
    if (error) { errors[name] = error; }
  });
  return errors;
};
