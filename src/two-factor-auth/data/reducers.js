import {
  RESEND_OTP,
  RESET_OTP_ERROR,
  RESET_TWO_FACTOR_AUTH,
  VERIFY_OTP,
} from './actions';
import { DEFAULT_STATE, PENDING_STATE } from '../../data/constants';

export const defaultState = {
  submitState: DEFAULT_STATE,
  resendState: DEFAULT_STATE,
  errorCode: '',
  redirectUrl: '',
  success: false,
  passwordExpiryNudge: false,
  resendCooldownDeadline: 0,
};

const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case VERIFY_OTP.BEGIN:
      return {
        ...state,
        submitState: PENDING_STATE,
        errorCode: '',
      };
    case VERIFY_OTP.SUCCESS:
      return {
        ...state,
        submitState: DEFAULT_STATE,
        success: true,
        redirectUrl: action.payload.redirectUrl,
        passwordExpiryNudge: action.payload.passwordExpiryNudge || false,
      };
    case VERIFY_OTP.FAILURE:
      return {
        ...state,
        submitState: DEFAULT_STATE,
        errorCode: action.payload.errorCode,
      };
    case RESEND_OTP.BEGIN:
      return {
        ...state,
        resendState: PENDING_STATE,
        errorCode: '',
      };
    case RESEND_OTP.SUCCESS:
      return {
        ...state,
        resendState: DEFAULT_STATE,
        resendCooldownDeadline: action.payload.resendCooldownDeadline,
      };
    case RESEND_OTP.FAILURE:
      return {
        ...state,
        resendState: DEFAULT_STATE,
        errorCode: action.payload.errorCode,
      };
    case RESET_OTP_ERROR:
      return {
        ...state,
        errorCode: '',
      };
    case RESET_TWO_FACTOR_AUTH:
      return { ...defaultState };
    default:
      return state;
  }
};

export default reducer;
