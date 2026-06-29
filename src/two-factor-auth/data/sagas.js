import { call, put, takeEvery } from 'redux-saga/effects';

import {
  RESEND_OTP,
  resendOtpBegin,
  resendOtpFailure,
  resendOtpSuccess,
  VERIFY_OTP,
  verifyOtpBegin,
  verifyOtpFailure,
  verifyOtpSuccess,
} from './actions';
import { OTP_INVALID_REQUEST } from './constants';
import { resendOtpRequest, verifyOtpRequest } from './service';

export function* handleVerifyOtp(action) {
  try {
    yield put(verifyOtpBegin());
    const { sessionId, otpCode } = action.payload;
    const { success, redirectUrl, passwordExpiryNudge } = yield call(verifyOtpRequest, sessionId, otpCode);
    if (!success) {
      // The backend returns its specific failure codes (otp-expired, otp-attempts-exceeded,
      // otp-session-not-found, …) as 400s, handled in the catch below. A 200 with success:false
      // is an unexpected/defensive case, so fall back to the generic code instead of asserting
      // "incorrect code".
      yield put(verifyOtpFailure(OTP_INVALID_REQUEST));
      return;
    }
    yield put(verifyOtpSuccess(redirectUrl, passwordExpiryNudge));
  } catch (e) {
    const errorCode = e.response?.data?.error_code || OTP_INVALID_REQUEST;
    yield put(verifyOtpFailure(errorCode));
  }
}

export function* handleResendOtp(action) {
  try {
    yield put(resendOtpBegin());
    const { sessionId } = action.payload;
    yield call(resendOtpRequest, sessionId);
    yield put(resendOtpSuccess());
  } catch (e) {
    const errorCode = e.response?.data?.error_code || OTP_INVALID_REQUEST;
    yield put(resendOtpFailure(errorCode));
  }
}

export default function* saga() {
  yield takeEvery(VERIFY_OTP.BASE, handleVerifyOtp);
  yield takeEvery(RESEND_OTP.BASE, handleResendOtp);
}
