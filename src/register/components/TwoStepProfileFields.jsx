import React, { useMemo } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { getCountryList, getLocale, useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

import { FormFieldRenderer } from '../../field-renderer';
import { FIELDS } from '../data/constants';
import getFieldErrorMessage from '../data/fieldError';
import {
  caretAfterFormat, formatTelephone, formatTrn, unformatTelephone,
} from '../data/inputMasks';
import {
  getProfileFieldError, getRequiredMessage, getToday, PROFILE_FIELD_RULES,
} from '../data/profileRules';
import {
  ACCOUNT_STEP_FIELDS, ALWAYS_REQUIRED_PROFILE_FIELDS, PARISH_REGIONS, PROFILE_STEP_ROWS, TWO_STEP_FIELD_TYPES,
} from '../data/twoStepConstants';
import messages from '../messages';
import { CountryField, HonorCode, TermsOfService } from '../RegistrationFields';
import twoStepMessages from '../twoStepMessages';

const PROFILE_STEP_FIELDS = PROFILE_STEP_ROWS.flat();
// Digits-only fields shown as ### ### ####.
const PHONE_MASKED = ['telephone', 'other_numbers'];

/**
 * Configurable fields of the two-step registration: step 1 shows only ACCOUNT_STEP_FIELDS, step 2 shows the
 * profile rows in their fixed layout followed by the remaining configurable fields, country, marketing opt-in and
 * honor code.
 *
 * This is not folded into ConfigurableRegistrationForm because that component always renders country, marketing
 * opt-in and honor code according to the flags, with no way to hide them on step 1, and has no label-above,
 * masked-input or read-only support.
 */
const TwoStepProfileFields = (props) => {
  const { formatMessage } = useIntl();
  const {
    email,
    password,
    fieldDescriptions,
    fieldErrors,
    formFields,
    setFieldErrors,
    setFormFields,
    step,
  } = props;

  const countryList = useMemo(() => getCountryList(getLocale()).concat([{ code: 'US', name: 'United States' }]), []);

  let showTermsOfServiceAndHonorCode = false;
  let showCountryField = false;

  const formFieldDescriptions = [];
  const honorCode = [];
  const flags = {
    showConfigurableRegistrationFields: getConfig().ENABLE_DYNAMIC_REGISTRATION_FIELDS,
    showConfigurableEdxFields: getConfig().SHOW_CONFIGURABLE_EDX_FIELDS,
    showMarketingEmailOptInCheckbox: getConfig().MARKETING_EMAILS_OPT_IN,
  };

  const handleErrorChange = (fieldName, error) => {
    if (fieldName) {
      setFieldErrors(prevErrors => ({
        ...prevErrors,
        [fieldName]: error,
      }));
    }
  };

  const handleOnChange = (event, countryValue = null) => {
    const { name } = event.target;
    let value;
    if (countryValue) {
      value = { ...countryValue };
    } else {
      value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      if (event.target.type === 'checkbox') {
        setFieldErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
      }
    }
    if (step === 2 && (name === 'trn' || PHONE_MASKED.includes(name))) {
      // TRN is stored masked (###-###-###); phone-style fields are stored digits-only and masked only for display.
      const input = event.target;
      const maskedValue = name === 'trn' ? formatTrn(value) : formatTelephone(value);
      const caret = caretAfterFormat(value, input.selectionStart, maskedValue);
      setFormFields(prevState => ({
        ...prevState, [name]: name === 'trn' ? maskedValue : unformatTelephone(value),
      }));
      // Keep the caret where the user was typing instead of jumping to the end after the value is reformatted.
      window.requestAnimationFrame(() => input.setSelectionRange?.(caret, caret));
      return;
    }
    if (name === 'parish') {
      // Region is read-only and follows the parish; the server derives the real value.
      setFieldErrors(prevErrors => ({ ...prevErrors, region: '' }));
      setFormFields(prevState => ({ ...prevState, parish: value, region: PARISH_REGIONS[value] || '' }));
      return;
    }
    setFormFields(prevState => ({ ...prevState, [name]: value }));
  };

  const handleOnBlur = (event) => {
    const { name } = event.target;
    const isPhone = step === 2 && PHONE_MASKED.includes(name);
    const value = isPhone ? unformatTelephone(event.target.value) : event.target.value;
    let error = '';
    if ((!value || !value.trim()) && getRequiredMessage(name, fieldDescriptions[name], formatMessage)) {
      error = getRequiredMessage(name, fieldDescriptions[name], formatMessage);
    } else if (step === 2 && getProfileFieldError(name, value, fieldDescriptions[name], formatMessage)) {
      error = getProfileFieldError(name, value, fieldDescriptions[name], formatMessage);
    } else if (name === 'confirm_email' && value !== email) {
      error = formatMessage(messages['email.do.not.match']);
    } else if (name === 'confirm_password' && value !== password) {
      error = formatMessage(messages['password.do.not.match']);
    }
    setFieldErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const handleOnFocus = (event) => {
    const { name } = event.target;
    setFieldErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const renderConfigurableField = (backendFieldData) => {
    // Label above the input, with the Figma copy for known fields.
    const labelMessage = twoStepMessages[`registration.profile.${backendFieldData.name}.label`];
    const placeholderMessage = twoStepMessages[`registration.profile.${backendFieldData.name}.placeholder`];
    const required = !!getFieldErrorMessage(backendFieldData.error_message)
      || ALWAYS_REQUIRED_PROFILE_FIELDS.includes(backendFieldData.name);
    const fieldData = labelMessage
      ? {
        ...backendFieldData,
        type: TWO_STEP_FIELD_TYPES[backendFieldData.name] || backendFieldData.type,
        label: `${formatMessage(labelMessage)}${required ? '*' : ''}`,
        min: PROFILE_FIELD_RULES[backendFieldData.name]?.notPast ? getToday() : undefined,
      }
      : backendFieldData;
    return (
      <span key={fieldData.name}>
        <FormFieldRenderer
          fieldData={fieldData}
          value={step === 2 && PHONE_MASKED.includes(fieldData.name)
            ? formatTelephone(formFields[fieldData.name]) : formFields[fieldData.name]}
          onChangeHandler={handleOnChange}
          handleBlur={handleOnBlur}
          handleFocus={handleOnFocus}
          errorMessage={fieldErrors[fieldData.name]}
          isRequired
          readOnly={fieldData.name === 'region'}
          labelAbove={!!labelMessage}
          placeholder={placeholderMessage && formatMessage(placeholderMessage)}
        />
      </span>
    );
  };

  if (flags.showConfigurableRegistrationFields) {
    Object.keys(fieldDescriptions).forEach(fieldName => {
      const fieldData = fieldDescriptions[fieldName];
      if ((step === 1) !== ACCOUNT_STEP_FIELDS.includes(fieldData.name)) {
        return;
      }
      switch (fieldData.name) {
        case FIELDS.COUNTRY:
          showCountryField = true;
          break;
        case FIELDS.HONOR_CODE:
          if (fieldData.type === 'tos_and_honor_code') {
            showTermsOfServiceAndHonorCode = true;
          } else {
            honorCode.push(
              <span key={fieldData.name}>
                <HonorCode
                  fieldType={fieldData.type}
                  value={formFields[fieldData.name]}
                  onChangeHandler={handleOnChange}
                  errorMessage={fieldErrors[fieldData.name]}
                />
              </span>,
            );
          }
          break;
        case FIELDS.TERMS_OF_SERVICE:
          honorCode.push(
            <span key={fieldData.name}>
              <TermsOfService
                value={formFields[fieldData.name]}
                onChangeHandler={handleOnChange}
                errorMessage={fieldErrors[fieldData.name]}
              />
            </span>,
          );
          break;
        default:
          // Profile-step fields are rendered below in their fixed layout.
          if (!(step === 2 && PROFILE_STEP_FIELDS.includes(fieldData.name))) {
            formFieldDescriptions.push(renderConfigurableField(fieldData));
          }
      }
    });
  }

  const profileRows = step === 2 ? PROFILE_STEP_ROWS
    .map(row => row.filter(name => fieldDescriptions[name]))
    .filter(row => row.length)
    .map(row => (
      <div key={row.join('-')} className="two-step-reg__row">
        {row.map(name => (
          <div key={name}>
            {renderConfigurableField(fieldDescriptions[name])}
          </div>
        ))}
      </div>
    )) : [];

  const showExtraFields = step !== 1;

  if (showExtraFields && (flags.showConfigurableEdxFields || showCountryField)) {
    formFieldDescriptions.push(
      <span key="country">
        <CountryField
          countryList={countryList}
          selectedCountry={formFields.country}
          errorMessage={fieldErrors.country || ''}
          onChangeHandler={handleOnChange}
          handleErrorChange={handleErrorChange}
          onBlurHandler={handleOnBlur}
          onFocusHandler={handleOnFocus}
        />
      </span>,
    );
  }

  if (showExtraFields && flags.showMarketingEmailOptInCheckbox) {
    formFieldDescriptions.push(
      <span key="marketing_email_opt_in">
        <FormFieldRenderer
          fieldData={{
            type: 'checkbox',
            label: formatMessage(messages['registration.opt.in.label'], { siteName: getConfig().SITE_NAME }),
            name: 'marketingEmailsOptIn',
          }}
          value={formFields.marketingEmailsOptIn}
          className="form-field--checkbox"
          onChangeHandler={handleOnChange}
          handleBlur={handleOnBlur}
          handleFocus={handleOnFocus}
        />
      </span>,
    );
  }

  if (showExtraFields && (flags.showConfigurableEdxFields || showTermsOfServiceAndHonorCode)) {
    formFieldDescriptions.push(
      <span key="honor_code">
        <HonorCode fieldType="tos_and_honor_code" onChangeHandler={handleOnChange} value={formFields.honor_code} />
      </span>,
    );
  }

  return (
    <>
      {profileRows}
      {formFieldDescriptions}
      <div>
        {honorCode}
      </div>
    </>
  );
};

TwoStepProfileFields.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  fieldDescriptions: PropTypes.shape({}),
  fieldErrors: PropTypes.shape({
    country: PropTypes.string,
  }).isRequired,
  formFields: PropTypes.shape({
    country: PropTypes.shape({
      displayValue: PropTypes.string,
      countryCode: PropTypes.string,
    }),
    honor_code: PropTypes.bool,
    marketingEmailsOptIn: PropTypes.bool,
  }).isRequired,
  setFieldErrors: PropTypes.func.isRequired,
  setFormFields: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired,
};

TwoStepProfileFields.defaultProps = {
  fieldDescriptions: {},
};

export default TwoStepProfileFields;
