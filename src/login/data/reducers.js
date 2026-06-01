import {
  BACKUP_LOGIN_DATA,
  DISMISS_PASSWORD_RESET_BANNER,
  LOGIN_REQUEST,
  TWO_FACTOR_AUTH_REQUIRED_ACTION,
  TWO_FACTOR_AUTH_RESEND,
  TWO_FACTOR_AUTH_VERIFY,
} from './actions';
import { DEFAULT_STATE, PENDING_STATE } from '../../data/constants';
import { RESET_PASSWORD } from '../../reset-password';

export const defaultState = {
  loginErrorCode: '',
  loginErrorContext: {},
  loginResult: {},
  loginFormData: {
    formFields: {
      emailOrUsername: '', password: '',
    },
    errors: {
      emailOrUsername: '', password: '',
    },
  },
  shouldBackupState: false,
  showResetPasswordSuccessBanner: false,
  submitState: DEFAULT_STATE,
  twoFactorAuthRequired: false,
  twoFactorAuthMaskedEmail: '',
  twoFactorAuthSubmitState: DEFAULT_STATE,
  twoFactorAuthErrorCode: '',
  twoFactorAuthResendState: DEFAULT_STATE,
  twoFactorAuthResendSuccess: false,
};

const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case BACKUP_LOGIN_DATA.BASE:
      return {
        ...state,
        shouldBackupState: true,
      };
    case BACKUP_LOGIN_DATA.BEGIN:
      return {
        ...defaultState,
        loginFormData: { ...action.payload },
      };
    case LOGIN_REQUEST.BEGIN:
      return {
        ...state,
        showResetPasswordSuccessBanner: false,
        submitState: PENDING_STATE,
        twoFactorAuthRequired: false,
        twoFactorAuthMaskedEmail: '',
        twoFactorAuthSubmitState: DEFAULT_STATE,
        twoFactorAuthErrorCode: '',
        twoFactorAuthResendState: DEFAULT_STATE,
        twoFactorAuthResendSuccess: false,
      };
    case LOGIN_REQUEST.SUCCESS:
      return {
        ...state,
        loginResult: action.payload,
        twoFactorAuthRequired: false,
        twoFactorAuthMaskedEmail: '',
        twoFactorAuthSubmitState: DEFAULT_STATE,
        twoFactorAuthErrorCode: '',
        twoFactorAuthResendState: DEFAULT_STATE,
        twoFactorAuthResendSuccess: false,
      };
    case LOGIN_REQUEST.FAILURE: {
      const { email, loginError, redirectUrl } = action.payload;
      return {
        ...state,
        loginErrorCode: loginError.errorCode,
        loginErrorContext: { ...loginError.context, email, redirectUrl },
        submitState: DEFAULT_STATE,
        twoFactorAuthRequired: false,
        twoFactorAuthMaskedEmail: '',
        twoFactorAuthSubmitState: DEFAULT_STATE,
        twoFactorAuthErrorCode: '',
        twoFactorAuthResendState: DEFAULT_STATE,
        twoFactorAuthResendSuccess: false,
      };
    }
    case TWO_FACTOR_AUTH_REQUIRED_ACTION:
      return {
        ...state,
        submitState: DEFAULT_STATE,
        twoFactorAuthRequired: true,
        twoFactorAuthMaskedEmail: action.payload.maskedEmail || '',
        twoFactorAuthErrorCode: '',
        twoFactorAuthResendState: DEFAULT_STATE,
        twoFactorAuthResendSuccess: false,
      };
    case TWO_FACTOR_AUTH_VERIFY.BEGIN:
      return {
        ...state,
        twoFactorAuthSubmitState: PENDING_STATE,
        twoFactorAuthErrorCode: '',
      };
    case TWO_FACTOR_AUTH_VERIFY.SUCCESS:
      return {
        ...state,
        twoFactorAuthSubmitState: DEFAULT_STATE,
        loginResult: { redirectUrl: action.payload.redirectUrl, success: true },
      };
    case TWO_FACTOR_AUTH_VERIFY.FAILURE:
      return {
        ...state,
        twoFactorAuthSubmitState: DEFAULT_STATE,
        twoFactorAuthErrorCode: action.payload.errorCode,
      };
    case TWO_FACTOR_AUTH_RESEND.BEGIN:
      return {
        ...state,
        twoFactorAuthResendState: PENDING_STATE,
        twoFactorAuthResendSuccess: false,
        twoFactorAuthErrorCode: '',
      };
    case TWO_FACTOR_AUTH_RESEND.SUCCESS:
      return {
        ...state,
        twoFactorAuthResendState: DEFAULT_STATE,
        twoFactorAuthResendSuccess: true,
      };
    case TWO_FACTOR_AUTH_RESEND.FAILURE:
      return {
        ...state,
        twoFactorAuthResendState: DEFAULT_STATE,
        twoFactorAuthErrorCode: action.payload.errorCode,
      };
    case RESET_PASSWORD.SUCCESS:
      return {
        ...state,
        showResetPasswordSuccessBanner: true,
      };
    case DISMISS_PASSWORD_RESET_BANNER: {
      return {
        ...state,
        showResetPasswordSuccessBanner: false,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export default reducer;
