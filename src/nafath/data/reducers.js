import {
  SET_NAFATH_AUTHN_DATA,
  SET_USER_REQUEST_DATA,
  SET_NAFATH_USER_REGISTRATION_SUCCESS,
  SET_CHECK_REQUEST_STATUS_INTERVAL_TIME,
  SET_USER_REQUEST_STATUS,
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
};

const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case SET_NAFATH_AUTHN_DATA:
      state = {
        ...state,
        transId: action.payload.transId,
        randomText: action.payload.random,
        userId: action.payload.userId,
        status: action.payload.status,
      };
      break;
    case SET_USER_REQUEST_DATA:
      state = {
        ...state,
        status: action.payload.status,
        form: action.payload.form,
      };
      break;
    case SET_NAFATH_USER_REGISTRATION_SUCCESS:
      state = {
        ...state,
        success: action.payload.success,
        redirectUrl: action.payload.redirectUrl,
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
