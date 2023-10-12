import {
  SET_NAFATH_AUTHN_DATA,
  SET_USER_REQUEST_DATA,
  SET_NAFATH_USER_REGISTRATION_SUCCESS,
  SET_NAFATH_USER_REGISTRATION_ERROR,
  SET_CHECK_REQUEST_STATUS_INTERVAL_TIME,
  SET_USER_REQUEST_STATUS,
  SET_NAFATH_USER_ID_AUTHENTICATION_ERROR,
  SET_NAFATH_USER_LOGIN_ERROR,
  EMPTY_STATE,
  SET_FORM_NAME,
  SET_FORM_NAME_ERROR,
  SET_FORM_NUMBER,
  SET_FORM_EMAIL,
  SET_FORM_EMAIL_ERROR,
  SET_FORM_USERNAME,
  SET_FORM_USERNAME_ERROR,
  SET_FORM_ACTIVATION_CODE,
  SET_FORM_ACTIVATION_CODE_ERROR,
  SET_FORM_PHONE_NUMBER,
  SET_FORM_PHONE_NUMBER_ERROR,
  SET_FORM_LINKEDIN_ACCOUNT,
  SET_FORM_GENDER,
  SET_FORM_GENDER_ERROR,
  SET_FORM_DATE_OF_BIRTH,
  SET_FORM_DATE_OF_BIRTH_ERROR,
  SET_FORM_REGION,
  SET_FORM_REGION_ERROR,
  SET_FORM_CITY,
  SET_FORM_CITY_ERROR,
  SET_FORM_ADDRESS_LINE,
  SET_FORM_LEVEL_OF_EDUCATION,
  SET_FORM_LEVEL_OF_EDUCATION_ERROR,
  SET_FORM_ENGLISH_LANGUAGE_LEVEL,
  SET_FORM_ENGLISH_LANGUAGE_LEVEL_ERROR,
  SET_FORM_EMPLOYMENT_STATUS,
  SET_FORM_EMPLOYMENT_STATUS_ERROR,
  SET_FORM_WORK_EXPERIENCE_LEVEL,
  SET_FORM_WORK_EXPERIENCE_LEVEL_ERROR,
  SET_FORM_JOB_TITLE,
  SET_FORM_JOB_TITLE_ERROR,
} from "./actions";

export const defaultState = {
  userId: "",
  transId: "",
  randomText: "",
  person: {},
  status: "",
  success: false,
  redirectUrl: "/",
  interval: 1000,
  form: 1,
  registrationError: "",
  authenticationError: "",
  loginError: "",
  name: "",
  username: "",
  phone_number: "",
  email: "",
  gender: "",
  linkedin_account: "",
  date_of_birth: "",
  region: "",
  city: "",
  address_line: "",
  level_of_education: "",
  english_language_level: "",
  employment_status: "",
  work_experience_level: "",
  job_title: "",
  activation_code: "",
  nameError: "",
  usernameError: "",
  phone_numberError: "",
  emailError: "",
  genderError: "",
  date_of_birthError: "",
  regionError: "",
  cityError: "",
  level_of_educationError: "",
  english_language_levelError: "",
  employment_statusError: "",
  work_experience_levelError: "",
  job_titleError: "",
  activation_codeError: "",
};

const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case EMPTY_STATE:
      state = {
        ...state,
        userId: "",
        transId: "",
        randomText: "",
        person: {},
        status: "",
        success: false,
        redirectUrl: "/",
        interval: 1000,
        form: 1,
        registrationError: "",
        authenticationError: "",
        name: "",
        username: "",
        phone_number: "",
        email: "",
        gender: "",
        linkedin_account: "",
        date_of_birth: "",
        region: "",
        city: "",
        address_line: "",
        level_of_education: "",
        english_language_level: "",
        employment_status: "",
        work_experience_level: "",
        job_title: "",
        activation_code: "",
        nameError: "",
        usernameError: "",
        phone_numberError: "",
        emailError: "",
        genderError: "",
        date_of_birthError: "",
        regionError: "",
        cityError: "",
        level_of_educationError: "",
        english_language_levelError: "",
        employment_statusError: "",
        work_experience_levelError: "",
        job_titleError: "",
        activation_codeError: "",
      };
      break;
    case SET_NAFATH_AUTHN_DATA:
      state = {
        ...state,
        transId: action.payload.transId,
        randomText: action.payload.random,
        userId: action.payload.userId,
        status: action.payload.status,
      };
      break;
    case SET_FORM_CITY:
      state = {
        ...state,
        city: action.payload,
      };
      break;
    case SET_FORM_CITY_ERROR:
      state = {
        ...state,
        cityError: action.payload,
      };
      break;
    case SET_FORM_JOB_TITLE:
      state = {
        ...state,
        job_title: action.payload,
      };
      break;
    case SET_FORM_JOB_TITLE_ERROR:
      state = {
        ...state,
        job_titleError: action.payload,
      };
      break;
    case SET_FORM_WORK_EXPERIENCE_LEVEL:
      state = {
        ...state,
        work_experience_level: action.payload,
      };
      break;
    case SET_FORM_WORK_EXPERIENCE_LEVEL_ERROR:
      state = {
        ...state,
        work_experience_levelError: action.payload,
      };
      break;
    case SET_FORM_EMPLOYMENT_STATUS:
      state = {
        ...state,
        employment_status: action.payload,
      };
      break;
    case SET_FORM_EMPLOYMENT_STATUS_ERROR:
      state = {
        ...state,
        employment_statusError: action.payload,
      };
      break;
    case SET_FORM_ENGLISH_LANGUAGE_LEVEL:
      state = {
        ...state,
        english_language_level: action.payload,
      };
      break;
    case SET_FORM_ENGLISH_LANGUAGE_LEVEL_ERROR:
      state = {
        ...state,
        english_language_levelError: action.payload,
      };
      break;
    case SET_FORM_LEVEL_OF_EDUCATION:
      state = {
        ...state,
        level_of_education: action.payload,
      };
      break;
    case SET_FORM_LEVEL_OF_EDUCATION_ERROR:
      state = {
        ...state,
        level_of_educationError: action.payload,
      };
      break;
    case SET_FORM_REGION:
      state = {
        ...state,
        region: action.payload,
      };
      break;
    case SET_FORM_REGION_ERROR:
      state = {
        ...state,
        regionError: action.payload,
      };
      break;
    case SET_FORM_ADDRESS_LINE:
      state = {
        ...state,
        address_line: action.payload,
      };
      break;
    case SET_FORM_DATE_OF_BIRTH:
      state = {
        ...state,
        date_of_birth: action.payload,
      };
      break;
    case SET_FORM_DATE_OF_BIRTH_ERROR:
      state = {
        ...state,
        date_of_birthError: action.payload,
      };
      break;
    case SET_FORM_PHONE_NUMBER:
      state = {
        ...state,
        phone_number: action.payload,
      };
      break;
    case SET_FORM_PHONE_NUMBER_ERROR:
      state = {
        ...state,
        phone_numberError: action.payload,
      };
      break;
    case SET_FORM_LINKEDIN_ACCOUNT:
      state = {
        ...state,
        linkedin_account: action.payload,
      };
      break;
    case SET_FORM_NAME:
      state = {
        ...state,
        name: action.payload,
      };
      break;
    case SET_FORM_NAME_ERROR:
      state = {
        ...state,
        nameError: action.payload,
      };
      break;
    case SET_FORM_GENDER:
      state = {
        ...state,
        gender: action.payload,
      };
      break;
    case SET_FORM_GENDER_ERROR:
      state = {
        ...state,
        genderError: action.payload,
      };
      break;
    case SET_FORM_USERNAME:
      state = {
        ...state,
        username: action.payload,
      };
      break;
    case SET_FORM_USERNAME_ERROR:
      state = {
        ...state,
        usernameError: action.payload,
      };
      break;
    case SET_FORM_ACTIVATION_CODE:
      state = {
        ...state,
        activation_code: action.payload,
      };
      break;
    case SET_FORM_ACTIVATION_CODE_ERROR:
      state = {
        ...state,
        activation_codeError: action.payload,
      };
      break;
    case SET_FORM_EMAIL:
      state = {
        ...state,
        email: action.payload,
      };
      break;
    case SET_FORM_EMAIL_ERROR:
      state = {
        ...state,
        emailError: action.payload,
      };
      break;
    case SET_FORM_NUMBER:
      state = {
        ...state,
        form: action.payload,
      };
      break;
    case SET_USER_REQUEST_DATA:
      state = {
        ...state,
        status: action.payload.status,
        form: action.payload.form,
        person: action.payload.person,
        name: action.payload.person.includes("full_name#en") && action.payload.person["full_name#en"] || "",
        gender:
          (action.payload.person.gender == "M" && "m") ||
          (action.payload.person.gender == "F" && "f") ||
          "",
        date_of_birth: action.payload.person.includes("dob#g") && action.payload.person["dob#g"] || "",
      };
      break;
    case SET_NAFATH_USER_REGISTRATION_SUCCESS:
      state = {
        ...state,
        success: action.payload.success,
        redirectUrl: action.payload.redirectUrl,
      };
      break;
    case SET_NAFATH_USER_REGISTRATION_ERROR:
      state = {
        ...state,
        registrationError: action.payload,
      };
      break;
    case SET_NAFATH_USER_ID_AUTHENTICATION_ERROR:
      state = {
        ...state,
        authenticationError: action.payload,
      };
      break;
    case SET_NAFATH_USER_LOGIN_ERROR:
      state = {
        ...state,
        loginError: action.payload,
      };
      break;
    case SET_CHECK_REQUEST_STATUS_INTERVAL_TIME:
      state = {
        ...state,
        interval: action.payload,
      };
      break;
    case SET_USER_REQUEST_STATUS:
      state = {
        ...state,
        status: action.payload,
      };
      break;
    default:
      state = {
        ...state,
      };
  }
  return state;
};

export default reducer;
