import React, { useEffect, useMemo } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { getCountryList, getLocale, useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

import { FormFieldRenderer } from '../../field-renderer';
import {
  ACCOUNT_STEP_FIELDS, FIELDS, PARISH_REGIONS, PROFILE_STEP_ROWS, TWO_STEP_FIELD_UI,
} from '../data/constants';
import {
  caretAfterFormat, formatDate, formatTelephone, formatTrn, unformatTelephone,
} from '../data/inputMasks';
import { getProfileFieldError } from '../data/profileRules';
import { getFieldErrorMessage } from '../data/utils';
import messages from '../messages';
import { CountryField, HonorCode, TermsOfService } from '../RegistrationFields';

/**
 * Fields on registration page that are not the default required fields (name, email, username, password).
 * These configurable required fields are defined on the backend using REGISTRATION_EXTRA_FIELDS setting.
 *
 * Country and Honor Code/Terms of Services (if enabled) will appear at the bottom of the form, even if they
 * appear higher in order returned by backend. This is to make the user experience better.
 *
 * For edX only:
 *  Country and honor code fields are required by default, and we will continue to show them on
 *  frontend even if the API doesn't return it. The `SHOW_CONFIGURABLE_EDX_FIELDS` flag will enable
 *  it for edX.
 * */
const PROFILE_STEP_FIELDS = PROFILE_STEP_ROWS.flat();
// Digits-only fields shown as ### ### ####.
const PHONE_MASKED = ['telephone', 'other_numbers'];

const ConfigurableRegistrationForm = (props) => {
  const { formatMessage } = useIntl();
  const {
    email,
    password,
    fieldDescriptions,
    fieldErrors,
    formFields,
    setFieldErrors,
    setFormFields,
    autoSubmitRegistrationForm,
    step,
  } = props;

  /** The reason for adding the entry 'United States' is that Chrome browser aut-fill the form with the 'Unites
  States' instead of 'United States of America' which does not exist in country dropdown list and gets the user
  confused and unable to create an account. So we added the United States entry in the dropdown list.
 */
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

  /**
   * If auto submitting register form, we will check tos and honor code fields if they exist for feature parity.
   */
  useEffect(() => {
    if (autoSubmitRegistrationForm) {
      if (Object.keys(fieldDescriptions).includes(FIELDS.HONOR_CODE)) {
        setFormFields(prevState => ({
          ...prevState,
          [FIELDS.HONOR_CODE]: true,
        }));
      }
      if (Object.keys(fieldDescriptions).includes(FIELDS.TERMS_OF_SERVICE)) {
        setFormFields(prevState => ({
          ...prevState,
          [FIELDS.TERMS_OF_SERVICE]: true,
        }));
      }
    }
  }, [autoSubmitRegistrationForm]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (step === 2 && name === 'id_expiration_date') {
      setFormFields(prevState => ({ ...prevState, [name]: formatDate(value) }));
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
    if ((!value || !value.trim()) && getFieldErrorMessage(fieldDescriptions[name]?.error_message)) {
      error = getFieldErrorMessage(fieldDescriptions[name].error_message);
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
    // Two-step registration shows the label above the input, with the Figma copy for known fields.
    const ui = step ? TWO_STEP_FIELD_UI[backendFieldData.name] : null;
    const required = !!getFieldErrorMessage(backendFieldData.error_message);
    const fieldData = ui
      ? { ...backendFieldData, type: ui.type || backendFieldData.type, label: `${ui.label}${required ? '*' : ''}` }
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
          readOnly={!!step && fieldData.name === 'region'}
          labelAbove={!!ui}
          placeholder={ui?.placeholder}
        />
      </span>
    );
  };

  // Two-step registration: step 1 only shows ACCOUNT_STEP_FIELDS, step 2 everything else.
  const isOnStep = (fieldName) => !step || (step === 1) === ACCOUNT_STEP_FIELDS.includes(fieldName);
  const showExtraFields = step !== 1;

  if (flags.showConfigurableRegistrationFields) {
    Object.keys(fieldDescriptions).forEach(fieldName => {
      const fieldData = fieldDescriptions[fieldName];
      if (!isOnStep(fieldData.name)) {
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
      <div key={row.join('-')} className="tpdco-reg__row">
        {row.map(name => (
          <div key={name}>
            {renderConfigurableField(fieldDescriptions[name])}
          </div>
        ))}
      </div>
    )) : [];

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

ConfigurableRegistrationForm.propTypes = {
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
  autoSubmitRegistrationForm: PropTypes.bool,
  step: PropTypes.number,
};

ConfigurableRegistrationForm.defaultProps = {
  fieldDescriptions: {},
  autoSubmitRegistrationForm: false,
  step: null,
};

export default ConfigurableRegistrationForm;
