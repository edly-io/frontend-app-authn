export const AUTHENTICATE_USER_ID_FROM_NAFATH =
  "AUTHENTICATE_USER_ID_FROM_NAFATH";
export const SET_NAFATH_AUTHN_DATA = "SET_NAFATH_AUTHN_DATA;";
export const CHECK_USER_REQUEST_STATUS = "CHECK_USER_REQUEST_STATUS";
export const SET_USER_REQUEST_DATA = "SET_USER_REQUEST_DATA";
export const HANDLE_NAFATH_USER_REGISTRATION =
  "HANDLE_NAFATH_USER_REGISTRATION";
export const SET_NAFATH_USER_REGISTRATION_SUCCESS =
  "SET_NAFATH_USER_REGISTRATION_SUCCESS";
export const SET_CHECK_REQUEST_STATUS_INTERVAL_TIME =
  "SET_CHECK_REQUEST_STATUS_INTERVAL_TIME";
export const SET_USER_REQUEST_STATUS = "SET_USER_REQUEST_STATUS";
export const SET_NAFATH_USER_REGISTRATION_ERROR =
  "SET_NAFATH_USER_REGISTRATION_ERROR";
export const SET_NAFATH_USER_ID_AUTHENTICATION_ERROR =
  "SET_NAFATH_USER_ID_AUTHENTICATION_ERROR";
export const SET_NAFATH_USER_LOGIN_ERROR = "SET_NAFATH_USER_LOGIN_ERROR";
export const EMPTY_STATE = "EMPTY_STATE";
export const SET_FORM_NUMBER = "SET_FORM_NUMBER";
export const SET_FORM_NAME = "SET_FORM_NAME";
export const SET_FORM_NAME_ERROR = "SET_FORM_NAME_ERROR";
export const SET_FORM_EMAIL = "SET_FORM_EMAIL";
export const SET_FORM_EMAIL_ERROR = "SET_FORM_EMAIL_ERROR";
export const SET_FORM_USERNAME = "SET_FORM_USERNAME";
export const SET_FORM_USERNAME_ERROR = "SET_FORM_USERNAME_ERROR";
export const SET_FORM_ACTIVATION_CODE = "SET_FORM_ACTIVATION_CODE";
export const SET_FORM_ACTIVATION_CODE_ERROR = "SET_FORM_ACTIVATION_CODE_ERROR";
export const SET_FORM_PHONE_NUMBER = "SET_FORM_PHONE_NUMBER";
export const SET_FORM_PHONE_NUMBER_ERROR = "SET_FORM_PHONE_NUMBER_ERROR";
export const SET_FORM_LINKEDIN_ACCOUNT = "SET_FORM_LINKEDIN_ACCOUNT";
export const SET_FORM_GENDER = "SET_FORM_GENDER";
export const SET_FORM_GENDER_ERROR = "SET_FORM_GENDER_ERROR";
export const SET_FORM_DATE_OF_BIRTH = "SET_FORM_DATE_OF_BIRTH";
export const SET_FORM_DATE_OF_BIRTH_ERROR = "SET_FORM_DATE_OF_BIRTH_ERROR";
export const SET_FORM_REGION = "SET_FORM_REGION";
export const SET_FORM_REGION_ERROR = "SET_FORM_REGION_ERROR";
export const SET_FORM_ADDRESS_LINE = "SET_FORM_ADDRESS_LINE";
export const SET_FORM_CITY = "SET_FORM_CITY";
export const SET_FORM_CITY_ERROR = "SET_FORM_CITY_ERROR";
export const SET_FORM_LEVEL_OF_EDUCATION = "SET_FORM_LEVEL_OF_EDUCATION";
export const SET_FORM_LEVEL_OF_EDUCATION_ERROR =
  "SET_FORM_LEVEL_OF_EDUCATION_ERROR";
export const SET_FORM_ENGLISH_LANGUAGE_LEVEL =
  "SET_FORM_ENGLISH_LANGUAGE_LEVEL";
export const SET_FORM_ENGLISH_LANGUAGE_LEVEL_ERROR =
  "SET_FORM_ENGLISH_LANGUAGE_LEVEL_ERROR";
export const SET_FORM_EMPLOYMENT_STATUS = "SET_FORM_EMPLOYMENT_STATUS";
export const SET_FORM_EMPLOYMENT_STATUS_ERROR =
  "SET_FORM_EMPLOYMENT_STATUS_ERROR";
export const SET_FORM_WORK_EXPERIENCE_LEVEL = "SET_FORM_WORK_EXPERIENCE_LEVEL";
export const SET_FORM_WORK_EXPERIENCE_LEVEL_ERROR =
  "SET_FORM_WORK_EXPERIENCE_LEVEL_ERROR";
export const SET_FORM_JOB_TITLE = "SET_FORM_JOB_TITLE";
export const SET_FORM_JOB_TITLE_ERROR = "SET_FORM_JOB_TITLE_ERROR";

export const setFormJobTitle = (job_title) => ({
  type: SET_FORM_JOB_TITLE,
  payload: job_title,
});

export const setFormJobTitleError = (error) => ({
  type: SET_FORM_JOB_TITLE_ERROR,
  payload: error,
});

export const setFormWorkExperienceLevel = (work_experience_level) => ({
  type: SET_FORM_WORK_EXPERIENCE_LEVEL,
  payload: work_experience_level,
});

export const setFormWorkExperienceLevelError = (error) => ({
  type: SET_FORM_WORK_EXPERIENCE_LEVEL_ERROR,
  payload: error,
});

export const setFormEmploymentStatus = (employment_status) => ({
  type: SET_FORM_EMPLOYMENT_STATUS,
  payload: employment_status,
});

export const setFormEmploymentStatusError = (error) => ({
  type: SET_FORM_EMPLOYMENT_STATUS_ERROR,
  payload: error,
});

export const setFormEnglishLanguageLevel = (english_language_level) => ({
  type: SET_FORM_ENGLISH_LANGUAGE_LEVEL,
  payload: english_language_level,
});

export const setFormEnglishLanguageLevelError = (error) => ({
  type: SET_FORM_ENGLISH_LANGUAGE_LEVEL_ERROR,
  payload: error,
});

export const setFormLevelOfEducation = (level_of_education) => ({
  type: SET_FORM_LEVEL_OF_EDUCATION,
  payload: level_of_education,
});

export const setFormLevelOfEducationError = (error) => ({
  type: SET_FORM_LEVEL_OF_EDUCATION_ERROR,
  payload: error,
});

export const setFormCity = (city) => ({
  type: SET_FORM_CITY,
  payload: city,
});

export const setFormCityError = (error) => ({
  type: SET_FORM_CITY_ERROR,
  payload: error,
});

export const setFormAddressLine = (city) => ({
  type: SET_FORM_ADDRESS_LINE,
  payload: city,
});

export const setFormRegion = (region) => ({
  type: SET_FORM_REGION,
  payload: region,
});

export const setFormRegionError = (error) => ({
  type: SET_FORM_REGION_ERROR,
  payload: error,
});

export const setFormDateOfBirth = (dob) => ({
  type: SET_FORM_DATE_OF_BIRTH,
  payload: dob,
});

export const setFormDateOfBirthError = (error) => ({
  type: SET_FORM_DATE_OF_BIRTH_ERROR,
  payload: error,
});

export const setFormGender = (gender) => ({
  type: SET_FORM_GENDER,
  payload: gender,
});

export const setFormGenderError = (error) => ({
  type: SET_FORM_GENDER_ERROR,
  payload: error,
});

export const setFormLinkedInAccount = (linkedin_account) => ({
  type: SET_FORM_LINKEDIN_ACCOUNT,
  payload: linkedin_account,
});

export const setFormPhoneNumber = (phone_number) => ({
  type: SET_FORM_PHONE_NUMBER,
  payload: phone_number,
});

export const setFormPhoneNumberError = (error) => ({
  type: SET_FORM_PHONE_NUMBER_ERROR,
  payload: error,
});

export const setFormActivationCode = (activation_code) => ({
  type: SET_FORM_ACTIVATION_CODE,
  payload: activation_code,
});

export const setFormActivationCodeError = (error) => ({
  type: SET_FORM_ACTIVATION_CODE_ERROR,
  payload: error,
});

export const setFormUsername = (username) => ({
  type: SET_FORM_USERNAME,
  payload: username,
});

export const setFormUsernameError = (error) => ({
  type: SET_FORM_USERNAME_ERROR,
  payload: error,
});

export const setFormEmail = (email) => ({
  type: SET_FORM_EMAIL,
  payload: email,
});

export const setFormEmailError = (error) => ({
  type: SET_FORM_EMAIL_ERROR,
  payload: error,
});

export const setFormName = (name) => ({
  type: SET_FORM_NAME,
  payload: name,
});

export const setFormNameError = (error) => ({
  type: SET_FORM_NAME_ERROR,
  payload: error,
});

export const setFormNumber = (number) => ({
  type: SET_FORM_NUMBER,
  payload: number,
});

export const emptyState = () => ({
  type: EMPTY_STATE,
});

export const authenticateUserIdFromNafath = (userId) => ({
  type: AUTHENTICATE_USER_ID_FROM_NAFATH,
  payload: userId,
});

export const setNafathAuthnData = (data) => ({
  type: SET_NAFATH_AUTHN_DATA,
  payload: data,
});

export const checkUserRequestStatus = (data) => ({
  type: CHECK_USER_REQUEST_STATUS,
  payload: data,
});

export const setUserRequestData = (data) => ({
  type: SET_USER_REQUEST_DATA,
  payload: data,
});

export const handleNafathUserRegistration = (data) => ({
  type: HANDLE_NAFATH_USER_REGISTRATION,
  payload: data,
});

export const setNafathUserRegistrationSuccess = (data) => ({
  type: SET_NAFATH_USER_REGISTRATION_SUCCESS,
  payload: data,
});

export const setNafathUserRegistrationError = (errors) => ({
  type: SET_NAFATH_USER_REGISTRATION_ERROR,
  payload: errors,
});

export const setNafathUserIdAuthenticationError = (error) => ({
  type: SET_NAFATH_USER_ID_AUTHENTICATION_ERROR,
  payload: error.authenticationError,
});

export const setNafathUserLoginError = (error) => ({
  type: SET_NAFATH_USER_LOGIN_ERROR,
  payload: error,
});

export const setCheckRequestStatusIntervelTime = (time) => ({
  type: SET_CHECK_REQUEST_STATUS_INTERVAL_TIME,
  payload: time,
});

export const setUserRequestStatus = (status) => ({
  type: SET_USER_REQUEST_STATUS,
  payload: status,
});
