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

export const setNafathUserRegistrationError = (error) => ({
  type: SET_NAFATH_USER_REGISTRATION_ERROR,
  payload: error.registrationError,
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
