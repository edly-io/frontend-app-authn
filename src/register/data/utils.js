import { snakeCaseObject } from '@edx/frontend-platform';

import { LETTER_REGEX, NUMBER_REGEX, SYMBOL_REGEX } from '../../data/constants';
import messages from '../messages';
import validateEmail from '../RegistrationFields/EmailField/validator';
import validateName from '../RegistrationFields/NameField/validator';
import validateUsername from '../RegistrationFields/UsernameField/validator';

/**
 * It validates the password field value
 * @param value
 * @param formatMessage
 * @returns {string}
 */
export const validatePasswordField = (value, formatMessage, confirmPasswordValue) => {
  let fieldError = '';
  let confirmPasswordError = '';
  if (
    !value
    || !LETTER_REGEX.test(value)
    || !NUMBER_REGEX.test(value)
    || value.length < 8
    || !SYMBOL_REGEX.test(value)
  ) {
    fieldError = formatMessage(messages['password.validation.message']);
  }
  if (confirmPasswordValue && value !== confirmPasswordValue) {
    confirmPasswordError = formatMessage(messages['password.do.not.match']);
  }
  return { fieldError, confirmPasswordError };
};

/**
 * It accepts complete registration data as payload and checks if the form is valid.
 * @param payload
 * @param errors
 * @param configurableFormFields
 * @param fieldDescriptions
 * @param formatMessage
 * @returns {{fieldErrors, isValid: boolean}}
 */
export const isFormValid = (
  payload,
  errors,
  configurableFormFields,
  fieldDescriptions,
  formatMessage,
) => {
  const fieldErrors = { ...errors };
  let isValid = true;
  let emailSuggestion = { suggestion: '', type: '' };

  Object.keys(payload).forEach(key => {
    switch (key) {
    case 'name':
      if (!fieldErrors.name) {
        fieldErrors.name = validateName(payload.name, formatMessage);
      }
      if (fieldErrors.name) { isValid = false; }
      break;
    case 'email': {
      if (!fieldErrors.email) {
        const {
          fieldError, confirmEmailError, suggestion,
        } = validateEmail(payload.email, configurableFormFields?.confirm_email, formatMessage);
        if (fieldError) {
          fieldErrors.email = fieldError;
          isValid = false;
        }
        if (confirmEmailError) {
          fieldErrors.confirm_email = confirmEmailError;
          isValid = false;
        }
        emailSuggestion = suggestion;
      }
      if (fieldErrors.email) { isValid = false; }
      break;
    }
    case 'username':
      if (!fieldErrors.username) {
        fieldErrors.username = validateUsername(payload.username, formatMessage);
      }
      if (fieldErrors.username) { isValid = false; }
      break;
    case 'password':
      if (!fieldErrors.password) {
        const { fieldError, confirmPasswordError } = validatePasswordField(
          payload.password,
          formatMessage,
          configurableFormFields?.confirm_password,
        );
        if (fieldError) {
          fieldErrors.password = fieldError;
          isValid = false;
        }
        if (confirmPasswordError) {
          fieldErrors.confirm_password = confirmPasswordError;
          isValid = false;
        }
      }
      if (fieldErrors.password) { isValid = false; }
      break;
    default:
      break;
    }
  });

  // Don't validate when country field is optional or hidden and not present on registration form
  if (configurableFormFields?.country && !configurableFormFields.country?.displayValue) {
    fieldErrors.country = formatMessage(messages['empty.country.field.error']);
    isValid = false;
  } else if (configurableFormFields?.country && !configurableFormFields.country?.countryCode) {
    fieldErrors.country = formatMessage(messages['invalid.country.field.error']);
    isValid = false;
  }

  Object.keys(fieldDescriptions).forEach(key => {
    if (key === 'country' && !configurableFormFields?.country?.displayValue) {
      fieldErrors[key] = formatMessage(messages['empty.country.field.error']);
    } else if (!configurableFormFields[key]) {
      fieldErrors[key] = fieldDescriptions[key].error_message;
    }
    if (fieldErrors[key]) { isValid = false; }
  });

  return { isValid, fieldErrors, emailSuggestion };
};

/**
 * It prepares a payload for registration data that can be passed to registration API endpoint.
 * @param initPayload
 * @param configurableFormFields
 * @param showMarketingEmailOptInCheckbox
 * @param totalRegistrationTime
 * @param queryParams
 * @returns {*}
 */
export const prepareRegistrationPayload = (
  initPayload,
  configurableFormFields,
  showMarketingEmailOptInCheckbox,
  totalRegistrationTime,
  queryParams,
) => {
  let payload = { ...initPayload };
  Object.keys(configurableFormFields).forEach((fieldName) => {
    if (fieldName === 'country') {
      payload[fieldName] = configurableFormFields[fieldName].countryCode;
    } else {
      payload[fieldName] = configurableFormFields[fieldName];
    }
  });

  // Don't send the marketing email opt-in value if the flag is turned off
  if (!showMarketingEmailOptInCheckbox) {
    delete payload.marketingEmailsOptIn;
  }

  payload.totalRegistrationTime = totalRegistrationTime;
  payload = snakeCaseObject(payload);

  // add query params to the payload
  payload = { ...payload, ...queryParams };
  return payload;
};
