import { AsyncActionType } from '../../data/utils';

export const VERIFY_OTP = new AsyncActionType('TWO_FACTOR_AUTH', 'VERIFY_OTP');
export const RESEND_OTP = new AsyncActionType('TWO_FACTOR_AUTH', 'RESEND_OTP');
export const RESET_OTP_ERROR = 'TWO_FACTOR_AUTH__RESET_OTP_ERROR';
export const RESET_TWO_FACTOR_AUTH = 'TWO_FACTOR_AUTH__RESET_TWO_FACTOR_AUTH';

export const verifyOtp = (sessionId, otpCode, next) => ({
  type: VERIFY_OTP.BASE,
  payload: { sessionId, otpCode, next },
});

export const verifyOtpBegin = () => ({
  type: VERIFY_OTP.BEGIN,
});

export const verifyOtpSuccess = (redirectUrl, passwordExpiryNudge) => ({
  type: VERIFY_OTP.SUCCESS,
  payload: { redirectUrl, passwordExpiryNudge },
});

export const verifyOtpFailure = (errorCode) => ({
  type: VERIFY_OTP.FAILURE,
  payload: { errorCode },
});

export const resendOtp = (sessionId) => ({
  type: RESEND_OTP.BASE,
  payload: { sessionId },
});

export const resendOtpBegin = () => ({
  type: RESEND_OTP.BEGIN,
});

export const resendOtpSuccess = () => ({
  type: RESEND_OTP.SUCCESS,
});

export const resendOtpFailure = (errorCode) => ({
  type: RESEND_OTP.FAILURE,
  payload: { errorCode },
});

export const resetOtpError = () => ({
  type: RESET_OTP_ERROR,
});

export const resetTwoFactorAuth = () => ({
  type: RESET_TWO_FACTOR_AUTH,
});
