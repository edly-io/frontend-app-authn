import { AsyncActionType } from '../../data/utils';

export const BACKUP_LOGIN_DATA = new AsyncActionType('LOGIN', 'BACKUP_LOGIN_DATA');
export const LOGIN_REQUEST = new AsyncActionType('LOGIN', 'REQUEST');
export const DISMISS_PASSWORD_RESET_BANNER = 'DISMISS_PASSWORD_RESET_BANNER';

// Backup login form data
export const backupLoginForm = () => ({
  type: BACKUP_LOGIN_DATA.BASE,
});

export const backupLoginFormBegin = (data) => ({
  type: BACKUP_LOGIN_DATA.BEGIN,
  payload: { ...data },
});

// Login
export const loginRequest = creds => ({
  type: LOGIN_REQUEST.BASE,
  payload: { creds },
});

export const loginRequestBegin = () => ({
  type: LOGIN_REQUEST.BEGIN,
});

export const loginRequestSuccess = (redirectUrl, success) => ({
  type: LOGIN_REQUEST.SUCCESS,
  payload: { redirectUrl, success },
});

export const loginRequestFailure = (loginError) => ({
  type: LOGIN_REQUEST.FAILURE,
  payload: { loginError },
});

export const dismissPasswordResetBanner = () => ({
  type: DISMISS_PASSWORD_RESET_BANNER,
});

// Two Factor Auth
export const TWO_FACTOR_AUTH_REQUIRED_ACTION = 'TWO_FACTOR_AUTH_REQUIRED';
export const TWO_FACTOR_AUTH_VERIFY = new AsyncActionType('LOGIN', 'TWO_FACTOR_AUTH_VERIFY');
export const TWO_FACTOR_AUTH_RESEND = new AsyncActionType('LOGIN', 'TWO_FACTOR_AUTH_RESEND');

export const twoFactorAuthRequired = (maskedEmail) => ({
  type: TWO_FACTOR_AUTH_REQUIRED_ACTION,
  payload: { maskedEmail },
});

export const twoFactorAuthVerifyRequest = (otp) => ({
  type: TWO_FACTOR_AUTH_VERIFY.BASE,
  payload: { otp },
});

export const twoFactorAuthVerifyBegin = () => ({ type: TWO_FACTOR_AUTH_VERIFY.BEGIN });

export const twoFactorAuthVerifySuccess = (redirectUrl) => ({
  type: TWO_FACTOR_AUTH_VERIFY.SUCCESS,
  payload: { redirectUrl },
});

export const twoFactorAuthVerifyFailure = (errorCode) => ({
  type: TWO_FACTOR_AUTH_VERIFY.FAILURE,
  payload: { errorCode },
});

export const twoFactorAuthResendRequest = () => ({ type: TWO_FACTOR_AUTH_RESEND.BASE });

export const twoFactorAuthResendBegin = () => ({ type: TWO_FACTOR_AUTH_RESEND.BEGIN });

export const twoFactorAuthResendSuccess = () => ({ type: TWO_FACTOR_AUTH_RESEND.SUCCESS });

export const twoFactorAuthResendFailure = (errorCode) => ({
  type: TWO_FACTOR_AUTH_RESEND.FAILURE,
  payload: { errorCode },
});
