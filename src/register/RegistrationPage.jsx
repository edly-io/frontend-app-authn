import React, {
  useEffect, useMemo, useState,
} from 'react';
import { connect } from 'react-redux';

import { getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { sendPageEvent } from '@edx/frontend-platform/analytics';
import {
  getCountryList, getLocale, useIntl,
} from '@edx/frontend-platform/i18n';
import { Form, Spinner, StatefulButton, Input, InputSelect } from '@edx/paragon';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Skeleton from 'react-loading-skeleton';

import {
  FormGroup, InstitutionLogistration, PasswordField, RedirectLogistration, ThirdPartyAuthAlert,
} from '../common-components';
import { getThirdPartyAuthContext } from '../common-components/data/actions';
import {
  fieldDescriptionSelector, optionalFieldsSelector, thirdPartyAuthContextSelector,
} from '../common-components/data/selectors';
import EnterpriseSSO from '../common-components/EnterpriseSSO';
import {
  COMPLETE_STATE,
  DEFAULT_STATE, INVALID_NAME_REGEX, LETTER_REGEX, NUMBER_REGEX, PENDING_STATE, REGISTER_PAGE, VALID_EMAIL_REGEX,
} from '../data/constants';
import {
  getAllPossibleQueryParams, getTpaHint, getTpaProvider, setCookie, setSurveyCookie,
} from '../data/utils';
import ConfigurableRegistrationForm from './ConfigurableRegistrationForm';
import {
  backupRegistrationFormBegin,
  clearRegistertionBackendError,
  clearUsernameSuggestions,
  fetchRealtimeValidations,
  registerNewUser,
  setUserPipelineDataLoaded,
  setForm,
} from './data/actions';
import {
  COUNTRY_CODE_KEY,
  COUNTRY_DISPLAY_KEY,
  FIELDS,
  FORM_SUBMISSION_ERROR,
  TPA_AUTHENTICATION_FAILURE,
} from './data/constants';
import { registrationErrorSelector, validationsSelector } from './data/selectors';
import {
  getSuggestionForInvalidEmail, validateCountryField, validateEmailAddress,
} from './data/utils';
import messages from './messages';
import RegistrationFailure from './RegistrationFailure';
import { EmailField, UsernameField } from './registrationFields';
import ThirdPartyAuth from './ThirdPartyAuth';

const emailRegex = new RegExp(VALID_EMAIL_REGEX, 'i');
const urlRegex = new RegExp(INVALID_NAME_REGEX);

const RegistrationPage = (props) => {
  const {
    backedUpFormData,
    backendCountryCode,
    backendValidations,
    fieldDescriptions,
    handleInstitutionLogin,
    institutionLogin,
    optionalFields,
    registrationError,
    registrationErrorCode,
    registrationResult,
    shouldBackupState,
    submitState,
    thirdPartyAuthApiStatus,
    thirdPartyAuthContext,
    usernameSuggestions,
    validationApiRateLimited,
    // Actions
    backupFormState,
    setUserPipelineDetailsLoaded,
    getRegistrationDataFromBackend,
    userPipelineDataLoaded,
    validateFromBackend,
    clearBackendError,
    signupFormSectionNumber,
  } = props;

  const { formatMessage } = useIntl();
  const countryList = useMemo(() => getCountryList(getLocale()), []);
  const queryParams = useMemo(() => getAllPossibleQueryParams(), []);
  const tpaHint = useMemo(() => getTpaHint(), []);
  const flags = {
    showConfigurableEdxFields: getConfig().SHOW_CONFIGURABLE_EDX_FIELDS,
    showConfigurableRegistrationFields: getConfig().ENABLE_DYNAMIC_REGISTRATION_FIELDS,
    showMarketingEmailOptInCheckbox: getConfig().MARKETING_EMAILS_OPT_IN,
  };

  const [formFields, setFormFields] = useState({ ...backedUpFormData.formFields });
  const [configurableFormFields, setConfigurableFormFields] = useState({ ...backedUpFormData.configurableFormFields });
  const [errors, setErrors] = useState({ ...backedUpFormData.errors });
  const [emailSuggestion, setEmailSuggestion] = useState({ ...backedUpFormData.emailSuggestion });
  const [autoSubmitRegisterForm, setAutoSubmitRegisterForm] = useState(false);
  const [errorCode, setErrorCode] = useState({ type: '', count: 0 });
  const [formStartTime, setFormStartTime] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [datePickerClicked, setDatePickerClicked] = useState(false);
  const [regionClicked, setRegionClicked] = useState(false);
  const [levelOfEducationClicked, setLevelOfEducationClicked] = useState(false);
  const [englishLanguageLevelClicked, setEnglishLanguageLevelClicked] = useState(false);
  const [employmentStatusClicked, setEmploymentStatusClicked] = useState(false);
  const [workExperienceLevelClicked, setWorkExperienceLevelClicked] = useState(false);

  const {
    providers, currentProvider, secondaryProviders, finishAuthUrl,
  } = thirdPartyAuthContext;
  const platformName = getConfig().SITE_NAME;

  /**
   * If auto submitting register form, we will check tos and honor code fields if they exist for feature parity.
   */
  const checkTOSandHonorCodeFields = () => {
    if (Object.keys(fieldDescriptions).includes(FIELDS.HONOR_CODE)) {
      setConfigurableFormFields(prevState => ({
        ...prevState,
        [FIELDS.HONOR_CODE]: true,
      }));
    }
    if (Object.keys(fieldDescriptions).includes(FIELDS.TERMS_OF_SERVICE)) {
      setConfigurableFormFields(prevState => ({
        ...prevState,
        [FIELDS.TERMS_OF_SERVICE]: true,
      }));
    }
  };

  /**
   * Set the userPipelineDetails data in formFields for only first time
   */
  useEffect(() => {
    if (!userPipelineDataLoaded && thirdPartyAuthApiStatus === COMPLETE_STATE) {
      const { autoSubmitRegForm, pipelineUserDetails, errorMessage } = thirdPartyAuthContext;
      if (errorMessage) {
        setErrorCode(prevState => ({ type: TPA_AUTHENTICATION_FAILURE, count: prevState.count + 1 }));
      } else if (autoSubmitRegForm) {
        checkTOSandHonorCodeFields();
        setAutoSubmitRegisterForm(true);
      }
      if (pipelineUserDetails && Object.keys(pipelineUserDetails).length !== 0) {
        const { name = '', username = '', email = '' } = pipelineUserDetails;
        setFormFields(prevState => ({
          ...prevState, name, username, email,
        }));
        setUserPipelineDetailsLoaded(true);
      }
    }
  }, [ // eslint-disable-line react-hooks/exhaustive-deps
    thirdPartyAuthContext,
    userPipelineDataLoaded,
    setUserPipelineDetailsLoaded,
  ]);

  useEffect(() => {
    if (!formStartTime) {
      sendPageEvent('login_and_registration', 'register');
      const payload = { ...queryParams, is_register_page: true };
      if (tpaHint) {
        payload.tpa_hint = tpaHint;
      }
      getRegistrationDataFromBackend(payload);
      setFormStartTime(Date.now());
    }
  }, [formStartTime, getRegistrationDataFromBackend, queryParams, tpaHint]);

  /**
   * Backup the registration form in redux when register page is toggled.
   */
  useEffect(() => {
    if (shouldBackupState) {
      backupFormState({
        configurableFormFields: { ...configurableFormFields },
        formFields: { ...formFields },
        emailSuggestion: { ...emailSuggestion },
        errors: { ...errors },
      });
    }
  }, [shouldBackupState, configurableFormFields, formFields, errors, emailSuggestion, backupFormState]);

  useEffect(() => {
    if (backendValidations) {
      setErrors(prevErrors => ({ ...prevErrors, ...backendValidations }));
    }
  }, [backendValidations]);

  useEffect(() => {
    if (registrationErrorCode) {
      setErrorCode(prevState => ({ type: registrationErrorCode, count: prevState.count + 1 }));
    }
  }, [registrationErrorCode]);

  useEffect(() => {
    let countryCode = '';
    let countryDisplayValue = '';

    const selectedCountry = countryList.find(
      (country) => (country[COUNTRY_CODE_KEY].toLowerCase() === backendCountryCode.toLowerCase()),
    );
    if (selectedCountry) {
      countryCode = selectedCountry[COUNTRY_CODE_KEY];
      countryDisplayValue = selectedCountry[COUNTRY_DISPLAY_KEY];
    }
    setConfigurableFormFields(prevState => (
      {
        ...prevState,
        country: {
          countryCode, displayValue: countryDisplayValue,
        },
      }
    ));
  }, [backendCountryCode, countryList]);

  /**
   * We need to remove the placeholder from the field, adding a space will do that.
   * This is needed because we are placing the username suggestions on top of the field.
   */
  useEffect(() => {
    if (usernameSuggestions.length && !formFields.username) {
      setFormFields(prevState => ({ ...prevState, username: ' ' }));
    }
  }, [usernameSuggestions, formFields]);

  useEffect(() => {
    if (registrationResult.success) {
      // TODO: Do we still need this cookie?
      setSurveyCookie('register');
      setCookie(getConfig().REGISTER_CONVERSION_COOKIE_NAME, true);
      setCookie('authn-returning-user');

      // Fire optimizely events
      window.optimizely = window.optimizely || [];
      window.optimizely.push({
        type: 'event',
        eventName: 'authn-register-conversion',
      });

      // Fire GTM event used for integration with impact.com
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'ImpactRegistrationEvent',
      });
    }
  }, [registrationResult]);

  const validateInput = (fieldName, value, payload, shouldValidateFromBackend, setError = true) => {
    let fieldError = '';
    let confirmEmailError = ''; // This is to handle the use case where the form contains "confirm email" field
    let countryFieldCode = '';

    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          fieldError = formatMessage(messages['empty.name.field.error']);
        } else if (value && value.match(urlRegex)) {
          fieldError = formatMessage(messages['name.validation.message']);
        } else if (value && !payload.username.trim() && shouldValidateFromBackend) {
          validateFromBackend(payload);
        }
        break;
      case 'phone_number':
        if (!value.trim()) {
          fieldError = formatMessage(messages['empty.phone_number.field.error']);
        } else if (!value.match(/^[0-9+]+$/)) {
          fieldError = formatMessage(messages['phone_number.validation.message']);
        }
        break;
      case 'date_of_birth':
        if (!value.trim()) {
          fieldError = formatMessage(messages['empty.date_of_birth.field.error']);
        }
        break;
      case 'region':
        if (!value.trim()) {
          fieldError = formatMessage(messages['empty.region.field.error']);
        }
        break;
      case 'level_of_education':
        if (!value.trim()) {
          fieldError = formatMessage(messages['empty.level_of_education.field.error']);
        }
        break;
      case 'employment_status':
        if (!value.trim()) {
          fieldError = formatMessage(messages['empty.employment_status.field.error']);
        }
        break;
      case 'work_experience_level':
        if (!value.trim()) {
          fieldError = formatMessage(messages['empty.work_experience_level.field.error']);
        }
        break;
      case 'job_title':
        if (!value.trim()) {
          fieldError = formatMessage(messages['empty.job_title.field.error']);
        }
        break;
      case 'city':
        if (!value.trim()) {
          fieldError = formatMessage(messages['empty.city.field.error']);
        }
        break;
      case 'gender':
        if (!value.trim()) {
          fieldError = formatMessage(messages['empty.gender.field.error']);
        }
        break;
      case 'email':
        if (!value) {
          fieldError = formatMessage(messages['empty.email.field.error']);
        } else if (value.length <= 2) {
          fieldError = formatMessage(messages['email.invalid.format.error']);
        } else {
          const [username, domainName] = value.split('@');
          // Check if email address is invalid. If we have a suggestion for invalid email
          // provide that along with the error message.
          if (!emailRegex.test(value)) {
            fieldError = formatMessage(messages['email.invalid.format.error']);
            setEmailSuggestion({
              suggestion: getSuggestionForInvalidEmail(domainName, username),
              type: 'error',
            });
          } else {
            const response = validateEmailAddress(value, username, domainName);
            if (response.hasError) {
              fieldError = formatMessage(messages['email.invalid.format.error']);
              delete response.hasError;
            } else if (shouldValidateFromBackend) {
              validateFromBackend(payload);
            }
            setEmailSuggestion({ ...response });

            if (configurableFormFields.confirm_email && value !== configurableFormFields.confirm_email) {
              confirmEmailError = formatMessage(messages['email.do.not.match']);
            }
          }
        }
        break;
      case 'username':
        if (!value || value.length <= 1 || value.length > 30) {
          fieldError = formatMessage(messages['username.validation.message']);
        } else if (!value.match(/^[a-zA-Z0-9_-]*$/i)) {
          fieldError = formatMessage(messages['username.format.validation.message']);
        } else if (shouldValidateFromBackend) {
          validateFromBackend(payload);
        }
        break;
      case 'password':
        if (!value || !LETTER_REGEX.test(value) || !NUMBER_REGEX.test(value) || value.length < 8) {
          fieldError = formatMessage(messages['password.validation.message']);
        } else if (shouldValidateFromBackend) {
          validateFromBackend(payload);
        }
        break;
      case 'country':
        if (flags.showConfigurableEdxFields || flags.showConfigurableRegistrationFields) {
          const {
            countryCode, displayValue, error,
          } = validateCountryField(value.displayValue.trim(), countryList, formatMessage(messages['empty.country.field.error']));
          fieldError = error;
          countryFieldCode = countryCode;
          setConfigurableFormFields(prevState => ({ ...prevState, country: { countryCode, displayValue } }));
        }
        break;
      default:
        if (flags.showConfigurableRegistrationFields) {
          if (!value && fieldDescriptions[fieldName].error_message) {
            fieldError = fieldDescriptions[fieldName].error_message;
          } else if (fieldName === 'confirm_email' && formFields.email && value !== formFields.email) {
            fieldError = formatMessage(messages['email.do.not.match']);
          }
        }
        break;
    }
    if (setError) {
      setErrors(prevErrors => ({
        ...prevErrors,
        confirm_email: flags.showConfigurableRegistrationFields ? confirmEmailError : '',
        [fieldName]: fieldError,
      }));
    }
    return { fieldError, countryFieldCode };
  };

  const isFormValid = (payload, focusedFieldError) => {
    const fieldErrors = { ...errors };
    let isValid = !focusedFieldError;
    Object.keys(payload).forEach(key => {
      const optional_fields = ["linkedin_account", "address_line", "english_language_level"];
      const ignoreForm2RequiredFieldsInPreviousForms = ["date_of_birth", "gender"];
      const ignoreForm3RequiredFieldsInPreviousForms = ["region", "city"];
      const ignoreForm4RequiredFieldsInPreviousForms = ["level_of_education"];
      const ignoreForm5RequiredFieldsInPreviousForms = ["employment_status", "work_experience_level", "job_title"];
      if (optional_fields.includes(key) && payload[key]==''){
        // passing optional empty fields
      } else if (signupFormSectionNumber == 1 && ignoreForm2RequiredFieldsInPreviousForms.includes(key) && payload[key]=='') {
        // ignoring required fields in previous forms
      } else if ((signupFormSectionNumber == 1 || signupFormSectionNumber == 2) && ignoreForm3RequiredFieldsInPreviousForms.includes(key) && payload[key]=='') {
        // ignoring required fields in previous forms
      } else if ((signupFormSectionNumber == 1 || signupFormSectionNumber == 2 || signupFormSectionNumber == 3) && ignoreForm4RequiredFieldsInPreviousForms.includes(key) && payload[key]=='') {
        // ignoring required fields in previous forms
      } else if ((signupFormSectionNumber == 1 || signupFormSectionNumber == 2 || signupFormSectionNumber == 3 || signupFormSectionNumber == 4) && ignoreForm5RequiredFieldsInPreviousForms.includes(key) && payload[key]=='') {
        // ignoring required fields in previous forms
      } else {
        if (!payload[key]) {
          fieldErrors[key] = formatMessage(messages[`empty.${key}.field.error`]);
        }
        if (fieldErrors[key]) {
          isValid = false;
        }
      }
    });

    if (flags.showConfigurableEdxFields) {
      if (!configurableFormFields.country.displayValue) {
        fieldErrors.country = formatMessage(messages['empty.country.field.error']);
      }
      if (fieldErrors.country) {
        isValid = false;
      }
    }

    if (flags.showConfigurableRegistrationFields) {
      Object.keys(fieldDescriptions).forEach(key => {
        if (key === 'country' && !configurableFormFields.country.displayValue) {
          fieldErrors[key] = formatMessage(messages['empty.country.field.error']);
        } else if (!configurableFormFields[key]) {
          fieldErrors[key] = fieldDescriptions[key].error_message;
        }
        if (fieldErrors[key]) {
          isValid = false;
        }
      });
    }

    if (focusedField) {
      fieldErrors[focusedField] = focusedFieldError;
    }
    setErrors({ ...fieldErrors });
    return isValid;
  };

  const handleSuggestionClick = (event, fieldName, suggestion = '') => {
    event.preventDefault();
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'email':
        setFormFields(prevState => ({ ...prevState, email: emailSuggestion.suggestion }));
        setEmailSuggestion({ suggestion: '', type: '' });
        break;
      case 'username':
        setFormFields(prevState => ({ ...prevState, username: suggestion }));
        props.resetUsernameSuggestions();
        break;
      default:
        break;
    }
  };

  const handleEmailSuggestionClosed = () => setEmailSuggestion({ suggestion: '', type: '' });

  const handleUsernameSuggestionClosed = () => props.resetUsernameSuggestions();

  const handleOnChange = (event) => {
    const { name } = event.target;
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    if (registrationError[name]) {
      clearBackendError(name);
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
    if (name === 'phone_number') {
      if (value.length > 50 || !value.match(/^[0-9+]+$/)) {
        value = value.substring(0, value.length - 1);
      }
      if (value.startsWith(' ')) {
        value = value.trim();
      }
    }
    if (name === 'job_title') {
      if (value.length > 63) {
        value = value.substring(0, value.length - 1);
      }
      if (value.startsWith(' ')) {
        value = value.trim();
      }
    }
    if (name === 'username') {
      if (value.length > 30) {
        return;
      }
      if (value.startsWith(' ')) {
        value = value.trim();
      }
    }

    setFormFields(prevState => ({ ...prevState, [name]: value }));
  };

  const handleOnBlur = (event) => {
    const { name, value } = event.target;
    const payload = {
      name: formFields.name,
      email: formFields.email,
      username: formFields.username,
      password: formFields.password,
      form_field_key: name,
    };
    if (event.target.name == "date_of_birth") {
      setDatePickerClicked(false)
    }
    if (event.target.name == "region") {
      setRegionClicked(false)
    }
    if (event.target.name == "level_of_education") {
      setLevelOfEducationClicked(false)
    }
    if (event.target.name == "english_language_level") {
      setEnglishLanguageLevelClicked(false)
    }
    if (event.target.name == "employment_status") {
      setEmploymentStatusClicked(false)
    }
    if (event.target.name == "work_experience_level") {
      setWorkExperienceLevelClicked(false)
    }

    setFocusedField(null);
    validateInput(name, name === 'password' ? formFields.password : value, payload, !validationApiRateLimited);
  };

  const handleOnFocus = (event) => {
    const { name, value } = event.target;
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    clearBackendError(name);
    // Since we are removing the form errors from the focused field, we will
    // need to rerun the validation for focused field on form submission.
    setFocusedField(name);
    if (name == "date_of_birth") {
      setDatePickerClicked(true)
    }
    if (name == "region") {
      setRegionClicked(true)
    }
    if (name == "level_of_education") {
      setLevelOfEducationClicked(true)
    }
    if (name == "english_language_level") {
      setEnglishLanguageLevelClicked(true)
    }
    if (name == "employment_status") {
      setEmploymentStatusClicked(true)
    }
    if (name == "work_experience_level") {
      setWorkExperienceLevelClicked(true)
    }
    if (name === 'username') {
      props.resetUsernameSuggestions();
      // If we added a space character to username field to display the suggestion
      // remove it before user enters the input. This is to ensure user doesn't
      // have a space prefixed to the username.
      if (value === ' ') {
        setFormFields(prevState => ({ ...prevState, [name]: '' }));
      }
    }
  };

  const registerUser = () => {
    const totalRegistrationTime = (Date.now() - formStartTime) / 1000;
    let payload = { ...formFields };

    if (currentProvider) {
      delete payload.password;
      payload.social_auth_provider = currentProvider;
    }

    const { fieldError: focusedFieldError, countryFieldCode } = focusedField ? (
      validateInput(
        focusedField,
        (focusedField in fieldDescriptions || focusedField === 'country') ? (
          configurableFormFields[focusedField]
        ) : formFields[focusedField],
        payload,
        false,
        false,
      )
    ) : '';

    if (!isFormValid(payload, focusedFieldError)) {
      setErrorCode(prevState => ({ type: FORM_SUBMISSION_ERROR, count: prevState.count + 1 }));
      return;
    }

    Object.keys(configurableFormFields).forEach((fieldName) => {
      if (fieldName === 'country') {
        payload[fieldName] = focusedField === 'country' ? countryFieldCode : configurableFormFields[fieldName].countryCode;
      } else {
        payload[fieldName] = configurableFormFields[fieldName];
      }
    });

    // Don't send the marketing email opt-in value if the flag is turned off
    if (!flags.showMarketingEmailOptInCheckbox) {
      delete payload.marketingEmailsOptIn;
    }

    payload = snakeCaseObject(payload);
    payload.totalRegistrationTime = totalRegistrationTime;

    // add query params to the payload
    payload = { ...payload, ...queryParams };
    if (signupFormSectionNumber == 5) {
      props.registerNewUser(payload);
    }
    else {
      props.setForm(signupFormSectionNumber + 1)
      setErrorCode(prevState => ({ type: "", count: 0 }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser();
  };

  useEffect(() => {
    if (autoSubmitRegisterForm && userPipelineDataLoaded) {
      registerUser();
    }
  }, [autoSubmitRegisterForm, userPipelineDataLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderForm = () => {
    if (institutionLogin) {
      return (
        <InstitutionLogistration
          secondaryProviders={secondaryProviders}
          headingTitle={formatMessage(messages['register.institution.login.page.title'])}
        />
      );
    }
    return (
      <>
        <Helmet>
          <title>{formatMessage(messages['register.page.title'], { siteName: getConfig().SITE_NAME })}</title>
        </Helmet>
        <RedirectLogistration
          success={registrationResult.success}
          redirectUrl={registrationResult.redirectUrl}
          finishAuthUrl={finishAuthUrl}
          optionalFields={optionalFields}
          redirectToProgressiveProfilingPage={
            getConfig().ENABLE_PROGRESSIVE_PROFILING_ON_AUTHN && Object.keys(optionalFields).includes('fields')
          }
        />
        <h2 style={{ marginBottom: "1.5rem", "text-decoration": "underline" }}>
          {(signupFormSectionNumber==1 || signupFormSectionNumber==2) &&
            formatMessage(messages["personal.information.text"]) ||
            (signupFormSectionNumber==3) &&
            formatMessage(messages["address.information.text"]) ||
            (signupFormSectionNumber==4) &&
            formatMessage(messages["education.information.text"]) ||
            (signupFormSectionNumber==5) &&
            formatMessage(messages["Career.information.text"])}
        </h2>
        {autoSubmitRegisterForm && !errorCode.type ? (
          <div className="mw-xs mt-5 text-center">
            <Spinner animation="border" variant="primary" id="tpa-spinner" />
          </div>
        ) : (
          <div className="mw-xs mt-3">
            <ThirdPartyAuthAlert
              currentProvider={currentProvider}
              platformName={platformName}
              referrer={REGISTER_PAGE}
            />
            <RegistrationFailure
              errorCode={errorCode.type}
              failureCount={errorCode.count}
              context={{ provider: currentProvider, errorMessage: thirdPartyAuthContext.errorMessage }}
            />
            <Form id="registration-form" name="registration-form">
              {signupFormSectionNumber == 1 && (
                <>
                  <FormGroup
                    name="name"
                    value={formFields.name}
                    handleChange={handleOnChange}
                    handleBlur={handleOnBlur}
                    handleFocus={handleOnFocus}
                    errorMessage={errors.name}
                    helpText={[formatMessage(messages['help.text.name'])]}
                    floatingLabel={formatMessage(messages['registration.fullname.label'])}
                  />
                  <UsernameField
                    name="username"
                    spellCheck="false"
                    value={formFields.username}
                    handleBlur={handleOnBlur}
                    handleChange={handleOnChange}
                    handleFocus={handleOnFocus}
                    handleSuggestionClick={handleSuggestionClick}
                    handleUsernameSuggestionClose={
                      handleUsernameSuggestionClosed
                    }
                    usernameSuggestions={usernameSuggestions}
                    errorMessage={errors.username}
                    helpText={[
                      formatMessage(messages['help.text.username.1']),
                      formatMessage(messages['help.text.username.2']),
                    ]}
                    floatingLabel={formatMessage(
                      messages['registration.username.label']
                    )}
                  />
                  <FormGroup
                    name="phone_number"
                    value={formFields.phone_number}
                    handleBlur={handleOnBlur}
                    handleChange={handleOnChange}
                    handleFocus={handleOnFocus}
                    errorMessage={errors.phone_number}
                    helpText={[
                      formatMessage(messages['help.text.phone_number']),
                    ]}
                    floatingLabel={formatMessage(
                      messages['registration.phone_number.label']
                    )}
                  />
                  <EmailField
                    name="email"
                    value={formFields.email}
                    handleChange={handleOnChange}
                    handleBlur={handleOnBlur}
                    handleFocus={handleOnFocus}
                    handleSuggestionClick={(e) =>
                      handleSuggestionClick(e, "email")
                    }
                    handleOnClose={handleEmailSuggestionClosed}
                    emailSuggestion={emailSuggestion}
                    errorMessage={errors.email}
                    helpText={[formatMessage(messages['help.text.email'])]}
                    floatingLabel={formatMessage(
                      messages['registration.email.label']
                    )}
                  />
                  {!currentProvider && (
                    <PasswordField
                      name="password"
                      value={formFields.password}
                      handleChange={handleOnChange}
                      handleBlur={handleOnBlur}
                      handleFocus={handleOnFocus}
                      errorMessage={errors.password}
                      floatingLabel={formatMessage(messages['registration.password.label'])}
                    />
                  )}
                </>
              )}
              {signupFormSectionNumber == 2 && (
                <>
                  <FormGroup
                    name="linkedin_account"
                    value={formFields.linkedin_account}
                    handleBlur={handleOnBlur}
                    handleChange={handleOnChange}
                    handleFocus={handleOnFocus}
                    errorMessage={errors.linkedin_account}
                    helpText={[
                      formatMessage(messages['help.text.linkedin_account']),
                    ]}
                    floatingLabel={formatMessage(
                      messages['registration.linkedin_account.label']
                    )}
                  />
                  <h6>
                    {formatMessage(
                      messages['registration.date_of_birth.label']
                    )}:
                  </h6>
                  <Input
                    type="date"
                    name="date_of_birth"
                    style={{
                      "font-weight": 400,
                      color: formFields.date_of_birth == "" && "#707070" || "#101820",
                      padding: "0.5625rem 1rem",
                      display: "block",
                      width: "98.1%",
                      "font-size": "0.875rem",
                      "line-height": "1.5rem",
                      height: "2.75rem",
                      "background-clip": "padding-box",
                      border: !errors.date_of_birth?"1px solid #707070":"1px solid #C32D3A",
                      "border-radius": "0.375rem",
                      transition:
                        "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                      overflow: "visible",
                      "font-family": "inherit",
                      "box-sizing": "border-box",
                      "margin-bottom": "1.75rem",
                    }}
                    value={formFields.date_of_birth}
                    onBlur={handleOnBlur}
                    onChange={handleOnChange}
                    onFocus={handleOnFocus}
                  />
                  <p
                    style={{
                      "font-size": "0.75rem",
                      "margin-top": (datePickerClicked && "-1.4rem") || "",
                      "margin-bottom": "2rem",
                      color: "#707070",
                    }}
                  >
                    {datePickerClicked &&
                      formatMessage(messages['help.text.date_of_birth'])}
                  </p>
                  <p
                    style={{
                      "font-size": "0.75rem",
                      "margin-top": (errors.date_of_birth && "-1.4rem") || "",
                      "margin-bottom": "2rem",
                      color: "#C32D3A",
                    }}
                  >
                    {!datePickerClicked &&
                      errors.date_of_birth}
                  </p>
                  <Form.Group
                    style={{ "margin-bottom": "1.75rem" }}
                    className="d-flex align-items-center"
                  >
                    <Form.Label>
                      <h3>{formatMessage(messages['gender.heading.text'])}</h3>
                      <Form.RadioSet
                        value={formFields.gender}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                        onFocus={handleOnFocus}
                        name="gender"
                      >
                        <Form.Radio value="m">
                          {formatMessage(messages['gender.option.male.text'])}
                        </Form.Radio>
                        <Form.Radio value="f">
                          {formatMessage(messages['gender.option.female.text'])}
                        </Form.Radio>
                        <Form.Radio value="o">
                          {formatMessage(messages['gender.option.other.text'])}
                        </Form.Radio>
                      </Form.RadioSet>
                    </Form.Label>
                  </Form.Group>
                  <p
                    style={{
                      "font-size": "0.75rem",
                      "margin-top": (errors.gender && "-1.4rem") || "",
                      "margin-bottom": "2rem",
                      color: "#C32D3A",
                    }}
                  >
                    {errors.gender}
                  </p>
                </>
              )}
              {signupFormSectionNumber == 3 && (
                <>
                  <h6>
                    {formatMessage(messages["registration.region.label"])}:
                  </h6>
                  <InputSelect
                    style={{
                      "margin-top": "-1.75rem",
                      "margin-bottom": "1.75rem",
                      width: "98.1%",
                      border: !errors.region
                        ? "1px solid #707070"
                        : "1px solid #C32D3A",
                    }}
                    name="region"
                    onBlur={(value) => {
                      handleOnBlur({
                        target: { name: "region", value: value },
                      });
                    }}
                    onChange={(value) => {
                      handleOnChange({
                        target: { name: "region", value: value },
                      });
                    }}
                    onFocus={(value) => {
                      handleOnFocus({
                        target: { name: "region", value: value },
                      });
                    }}
                    options={[
                      { label: [formatMessage(messages['help.text.region'])], value: "", disabled: true },
                      { label: "Riyadh", value: "RD" },
                      { label: "Eastern", value: "ER" },
                      { label: "Asir", value: "AI" },
                      { label: "Jazan", value: "JA" },
                      { label: "Medina", value: "MN" },
                      { label: "Al-Qassim", value: "AS" },
                      { label: "Tabuk", value: "TU" },
                      { label: "Ha'il", value: "HI" },
                      { label: "Najran", value: "NA" },
                      { label: "Al-Jawf", value: "AW" },
                      { label: "Al-Bahah", value: "AA" },
                      { label: "Northern Borders", value: "NB" },
                    ]}
                  />
                  <p
                    style={{
                      "font-size": "0.75rem",
                      "margin-top": (errors.region && "-1.4rem") || "",
                      "margin-bottom": "2rem",
                      color: "#C32D3A",
                    }}
                  >
                    {!regionClicked && errors.region}
                  </p>
                  <FormGroup
                    name="city"
                    value={formFields.city}
                    handleChange={handleOnChange}
                    handleBlur={handleOnBlur}
                    handleFocus={handleOnFocus}
                    errorMessage={errors.city}
                    helpText={[formatMessage(messages['help.text.city'])]}
                    floatingLabel={formatMessage(messages['registration.city.label'])}
                  />
                  <FormGroup
                    name="address_line"
                    value={formFields.address_line}
                    handleChange={handleOnChange}
                    handleBlur={handleOnBlur}
                    handleFocus={handleOnFocus}
                    errorMessage={errors.address_line}
                    helpText={[formatMessage(messages['help.text.address_line'])]}
                    floatingLabel={formatMessage(messages['registration.address_line.label'])}
                  />
                </>
              )}
              {signupFormSectionNumber == 4 && (
                <>
                  <h6>
                    {formatMessage(messages["registration.level_of_education.label"])}:
                  </h6>
                  <InputSelect
                    style={{
                      "margin-top": "-1.75rem",
                      "margin-bottom": "1.75rem",
                      width: "98.1%",
                      border: !errors.level_of_education
                        ? "1px solid #707070"
                        : "1px solid #C32D3A",
                    }}
                    name="level_of_education"
                    onBlur={(value) => {
                      handleOnBlur({
                        target: { name: "level_of_education", value: value },
                      });
                    }}
                    onChange={(value) => {
                      handleOnChange({
                        target: { name: "level_of_education", value: value },
                      });
                    }}
                    onFocus={(value) => {
                      handleOnFocus({
                        target: { name: "level_of_education", value: value },
                      });
                    }}
                    options={[
                      { label: [formatMessage(messages['help.text.level_of_education'])], value: "", disabled: true },
                      { label: 'Middle School', value: 'MS' },
                      { label: 'High School', value: 'HS' },
                      { label: 'Diploma', value: 'DM' },
                      { label: 'Bachelor', value: 'BS' },
                      { label: 'Master', value: 'MR' },
                      { label: 'Ph.D.', value: 'PH' }
                    ]}
                  />
                  <p
                    style={{
                      "font-size": "0.75rem",
                      "margin-top": (errors.level_of_education && "-1.4rem") || "",
                      "margin-bottom": "2rem",
                      color: "#C32D3A",
                    }}
                  >
                    {!levelOfEducationClicked && errors.level_of_education}
                  </p>
                  <h6>
                    {formatMessage(messages["registration.english_language_level.label"])}:
                  </h6>
                  <InputSelect
                    style={{
                      "margin-top": "-1.75rem",
                      "margin-bottom": "1.75rem",
                      width: "98.1%",
                      border: !errors.english_language_level
                        ? "1px solid #707070"
                        : "1px solid #C32D3A",
                    }}
                    name="english_language_level"
                    onBlur={(value) => {
                      handleOnBlur({
                        target: { name: "english_language_level", value: value },
                      });
                    }}
                    onChange={(value) => {
                      handleOnChange({
                        target: { name: "english_language_level", value: value },
                      });
                    }}
                    onFocus={(value) => {
                      handleOnFocus({
                        target: { name: "english_language_level", value: value },
                      });
                    }}
                    options={[
                      { label: [formatMessage(messages['help.text.english_language_level'])], value: "", disabled: true },
                      { label: '0', value: '0' },
                      { label: '1', value: '1' },
                      { label: '2', value: '2' },
                      { label: '3', value: '3' },
                      { label: '4', value: '4' },
                      { label: '5', value: '5' },
                      { label: '6', value: '6' },
                      { label: '7', value: '7' },
                      { label: '8', value: '8' },
                      { label: '9', value: '9' }
                    ]}
                  />
                  <p
                    style={{
                      "font-size": "0.75rem",
                      "margin-top": (errors.english_language_level && "-1.4rem") || "",
                      "margin-bottom": "2rem",
                      color: "#C32D3A",
                    }}
                  >
                    {!englishLanguageLevelClicked && errors.english_language_level}
                  </p>
                </>
              )}
              {signupFormSectionNumber == 5 && (
                <>
                  <h6>
                    {formatMessage(messages["registration.employment_status.label"])}:
                  </h6>
                  <InputSelect
                    style={{
                      "margin-top": "-1.75rem",
                      "margin-bottom": "1.75rem",
                      width: "98.1%",
                      border: !errors.employment_status
                        ? "1px solid #707070"
                        : "1px solid #C32D3A",
                    }}
                    name="employment_status"
                    onBlur={(value) => {
                      handleOnBlur({
                        target: { name: "employment_status", value: value },
                      });
                    }}
                    onChange={(value) => {
                      handleOnChange({
                        target: { name: "employment_status", value: value },
                      });
                    }}
                    onFocus={(value) => {
                      handleOnFocus({
                        target: { name: "employment_status", value: value },
                      });
                    }}
                    options={[
                      { label: [formatMessage(messages['help.text.employment_status'])], value: "", disabled: true },
                      { label: 'Public industry', value: 'PU' },
                      { label: 'Private industry', value: 'PR' },
                      { label: 'Job seeker', value: 'JS' },
                      { label: 'Student', value: 'ST' }
                    ]}
                  />
                  <p
                    style={{
                      "font-size": "0.75rem",
                      "margin-top": (errors.employment_status && "-1.4rem") || "",
                      "margin-bottom": "2rem",
                      color: "#C32D3A",
                    }}
                  >
                    {!employmentStatusClicked && errors.employment_status}
                  </p>
                  <h6>
                    {formatMessage(messages["registration.work_experience_level.label"])}:
                  </h6>
                  <InputSelect
                    style={{
                      "margin-top": "-1.75rem",
                      "margin-bottom": "1.75rem",
                      width: "98.1%",
                      border: !errors.work_experience_level
                        ? "1px solid #707070"
                        : "1px solid #C32D3A",
                    }}
                    name="work_experience_level"
                    onBlur={(value) => {
                      handleOnBlur({
                        target: { name: "work_experience_level", value: value },
                      });
                    }}
                    onChange={(value) => {
                      handleOnChange({
                        target: { name: "work_experience_level", value: value },
                      });
                    }}
                    onFocus={(value) => {
                      handleOnFocus({
                        target: { name: "work_experience_level", value: value },
                      });
                    }}
                    options={[
                      { label: [formatMessage(messages['help.text.work_experience_level'])], value: "", disabled: true },
                      { label: 'Junior level (0-2) years', value: 'JL' },
                      { label: 'Middle level (3-4) years', value: 'ML' },
                      { label: 'Senior level (5-10) years', value: 'SL' },
                      { label: 'Expert (+ 10 years)', value: 'EL' }
                    ]}
                  />
                  <p
                    style={{
                      "font-size": "0.75rem",
                      "margin-top": (errors.work_experience_level && "-1.4rem") || "",
                      "margin-bottom": "2rem",
                      color: "#C32D3A",
                    }}
                  >
                    {!workExperienceLevelClicked && errors.work_experience_level}
                  </p>
                  <FormGroup
                    name="job_title"
                    value={formFields.job_title}
                    handleChange={handleOnChange}
                    handleBlur={handleOnBlur}
                    handleFocus={handleOnFocus}
                    errorMessage={errors.job_title}
                    helpText={[formatMessage(messages['help.text.job_title'])]}
                    floatingLabel={formatMessage(messages['registration.job_title.label'])}
                  />
                </>
              )}
              <ConfigurableRegistrationForm
                countryList={countryList}
                email={formFields.email}
                fieldErrors={errors}
                formFields={configurableFormFields}
                setFieldErrors={setErrors}
                setFormFields={setConfigurableFormFields}
                setFocusedField={setFocusedField}
                fieldDescriptions={fieldDescriptions}
              />
               {(signupFormSectionNumber == 2 ||
                signupFormSectionNumber == 3 ||
                signupFormSectionNumber == 4 ||
                signupFormSectionNumber == 5) && (
                <StatefulButton
                  id="back-register-user"
                  name="back-register-user"
                  type="submit"
                  variant="brand"
                  className="mr-4 mt-4 mb-4"
                  labels={{
                    default: formatMessage(
                      messages["back.account.creation.free.button"]
                    ),
                    pending: "",
                  }}
                  onClick={() => props.setForm(signupFormSectionNumber - 1)}
                  onMouseDown={(e) => e.preventDefault()}
                />
              )}
              <StatefulButton
                id="register-user"
                name="register-user"
                type="submit"
                variant="brand"
                className="register-stateful-button-width mt-4 mb-4"
                state={submitState}
                labels={{
                  default:
                    (signupFormSectionNumber == 5 &&
                      formatMessage(
                        messages['create.account.for.free.button']
                      )) ||
                    formatMessage(
                      messages['proceed.account.creation.free.button']
                    ),
                  pending: "",
                }}
                onClick={handleSubmit}
                onMouseDown={(e) => e.preventDefault()}
              />
              <ThirdPartyAuth
                currentProvider={currentProvider}
                providers={providers}
                secondaryProviders={secondaryProviders}
                handleInstitutionLogin={handleInstitutionLogin}
                thirdPartyAuthApiStatus={thirdPartyAuthApiStatus}
              />
            </Form>
          </div>
        )}

      </>
    );
  };

  if (tpaHint) {
    if (thirdPartyAuthApiStatus === PENDING_STATE) {
      return <Skeleton height={36} />;
    }
    const { provider, skipHintedLogin } = getTpaProvider(tpaHint, providers, secondaryProviders);
    if (skipHintedLogin) {
      window.location.href = getConfig().LMS_BASE_URL + provider.registerUrl;
      return null;
    }
    return provider ? <EnterpriseSSO provider={provider} /> : renderForm();
  }
  return (
    renderForm()
  );
};

const mapStateToProps = state => {
  const registerPageState = state.register;
  return {
    backedUpFormData: registerPageState.registrationFormData,
    backendCountryCode: registerPageState.backendCountryCode,
    backendValidations: validationsSelector(state),
    fieldDescriptions: fieldDescriptionSelector(state),
    optionalFields: optionalFieldsSelector(state),
    registrationError: registerPageState.registrationError,
    registrationErrorCode: registrationErrorSelector(state),
    registrationResult: registerPageState.registrationResult,
    shouldBackupState: registerPageState.shouldBackupState,
    userPipelineDataLoaded: registerPageState.userPipelineDataLoaded,
    submitState: registerPageState.submitState,
    thirdPartyAuthApiStatus: state.commonComponents.thirdPartyAuthApiStatus,
    thirdPartyAuthContext: thirdPartyAuthContextSelector(state),
    validationApiRateLimited: registerPageState.validationApiRateLimited,
    usernameSuggestions: registerPageState.usernameSuggestions,
    signupFormSectionNumber: registerPageState.signupFormSectionNumber,
  };
};

RegistrationPage.propTypes = {
  backedUpFormData: PropTypes.shape({
    configurableFormFields: PropTypes.shape({}),
    formFields: PropTypes.shape({}),
    errors: PropTypes.shape({}),
    emailSuggestion: PropTypes.shape({}),
  }),
  backendCountryCode: PropTypes.string,
  backendValidations: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
  }),
  fieldDescriptions: PropTypes.shape({}),
  institutionLogin: PropTypes.bool.isRequired,
  optionalFields: PropTypes.shape({}),
  registrationError: PropTypes.shape({}),
  registrationErrorCode: PropTypes.string,
  registrationResult: PropTypes.shape({
    redirectUrl: PropTypes.string,
    success: PropTypes.bool,
  }),
  shouldBackupState: PropTypes.bool,
  submitState: PropTypes.string,
  thirdPartyAuthApiStatus: PropTypes.string,
  thirdPartyAuthContext: PropTypes.shape({
    autoSubmitRegForm: PropTypes.bool,
    countryCode: PropTypes.string,
    currentProvider: PropTypes.string,
    errorMessage: PropTypes.string,
    finishAuthUrl: PropTypes.string,
    pipelineUserDetails: PropTypes.shape({
      email: PropTypes.string,
      name: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      username: PropTypes.string,
    }),
    platformName: PropTypes.string,
    providers: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
    secondaryProviders: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
  }),
  usernameSuggestions: PropTypes.arrayOf(PropTypes.string),
  userPipelineDataLoaded: PropTypes.bool,
  validationApiRateLimited: PropTypes.bool,
  signupFormSectionNumber: PropTypes.number,
  // Actions
  backupFormState: PropTypes.func.isRequired,
  clearBackendError: PropTypes.func.isRequired,
  getRegistrationDataFromBackend: PropTypes.func.isRequired,
  handleInstitutionLogin: PropTypes.func.isRequired,
  registerNewUser: PropTypes.func.isRequired,
  resetUsernameSuggestions: PropTypes.func.isRequired,
  setUserPipelineDetailsLoaded: PropTypes.func.isRequired,
  validateFromBackend: PropTypes.func.isRequired,
  setForm: PropTypes.func.isRequired,
};

RegistrationPage.defaultProps = {
  backedUpFormData: {
    configurableFormFields: {
      marketingEmailsOptIn: true,
    },
    formFields: {
      name: '',
      email: '',
      username: '',
      password: '',
      phone_number: '',
      linkedin_account: '',
      date_of_birth: '',
      gender: '',
      region: '',
      city: '',
      address_line: '',
      level_of_education: '',
      english_language_level: '',
      employment_status: '',
      work_experience_level: '',
      job_title: '',
    },
    errors: {
      name: '',
      email: '',
      username: '',
      password: '',
      phone_number: '',
      date_of_birth: '',
      gender: '',
      region: '',
      city: '',
      level_of_education: '',
      employment_status: '',
      work_experience_level: '',
      job_title: '',
    },
    emailSuggestion: {
      suggestion: '', type: '',
    },
  },
  backendCountryCode: '',
  backendValidations: null,
  fieldDescriptions: {},
  optionalFields: {},
  registrationError: {},
  registrationErrorCode: '',
  registrationResult: null,
  shouldBackupState: false,
  submitState: DEFAULT_STATE,
  thirdPartyAuthApiStatus: PENDING_STATE,
  thirdPartyAuthContext: {
    autoSubmitRegForm: false,
    countryCode: null,
    currentProvider: null,
    errorMessage: null,
    finishAuthUrl: null,
    pipelineUserDetails: null,
    providers: [],
    secondaryProviders: [],
  },
  usernameSuggestions: [],
  userPipelineDataLoaded: false,
  validationApiRateLimited: false,
  signupFormSectionNumber: 1,
};

export default connect(
  mapStateToProps,
  {
    backupFormState: backupRegistrationFormBegin,
    clearBackendError: clearRegistertionBackendError,
    getRegistrationDataFromBackend: getThirdPartyAuthContext,
    resetUsernameSuggestions: clearUsernameSuggestions,
    validateFromBackend: fetchRealtimeValidations,
    registerNewUser,
    setUserPipelineDetailsLoaded: setUserPipelineDataLoaded,
    setForm: setForm,
  },
)(RegistrationPage);
