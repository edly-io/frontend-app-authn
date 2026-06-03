import { camelCaseObject } from '@edx/frontend-platform';
import { logError, logInfo } from '@edx/frontend-platform/logging';
import {
  call, put, takeLeading,
} from 'redux-saga/effects';

import {
  LOGIN_REQUEST,
  loginRequestBegin,
  loginRequestFailure,
  loginRequestSuccess,
  TWO_FACTOR_AUTH_RESEND,
  TWO_FACTOR_AUTH_VERIFY,
  twoFactorAuthRequired,
  twoFactorAuthResendBegin,
  twoFactorAuthResendFailure,
  twoFactorAuthResendSuccess,
  twoFactorAuthVerifyBegin,
  twoFactorAuthVerifyFailure,
  twoFactorAuthVerifySuccess,
} from './actions';
import {
  FORBIDDEN_REQUEST,
  INTERNAL_SERVER_ERROR,
  TWO_FACTOR_AUTH_DISABLED,
  TWO_FACTOR_AUTH_INVALID_OTP,
  TWO_FACTOR_AUTH_REQUIRED as TWO_FACTOR_AUTH_REQUIRED_CODE,
  TWO_FACTOR_AUTH_RESEND_RATE_LIMITED,
  TWO_FACTOR_AUTH_SESSION_EXPIRED,
} from './constants';
import {
  loginRequest,
  resendOtp,
  verifyOtp,
} from './service';

export function* handleLoginRequest(action) {
  try {
    yield put(loginRequestBegin());

    const {
      redirectUrl, success, errorCode, maskedEmail,
    } = yield call(loginRequest, action.payload.creds);

    if (!success && errorCode === TWO_FACTOR_AUTH_REQUIRED_CODE) {
      yield put(twoFactorAuthRequired(maskedEmail));
      return;
    }

    yield put(loginRequestSuccess(redirectUrl, success));
  } catch (e) {
    const statusCodes = [400];
    if (e.response) {
      const { status } = e.response;
      if (statusCodes.includes(status)) {
        yield put(loginRequestFailure(camelCaseObject(e.response.data)));
        logInfo(e);
      } else if (status === 403) {
        yield put(loginRequestFailure({ errorCode: FORBIDDEN_REQUEST }));
        logInfo(e);
      } else {
        yield put(loginRequestFailure({ errorCode: INTERNAL_SERVER_ERROR }));
        logError(e);
      }
    }
  }
}

export function* handleTwoFactorAuthVerify(action) {
  try {
    yield put(twoFactorAuthVerifyBegin());
    const { redirectUrl, success } = yield call(verifyOtp, action.payload.otp);
    if (success) {
      yield put(twoFactorAuthVerifySuccess(redirectUrl));
    } else {
      yield put(twoFactorAuthVerifyFailure(TWO_FACTOR_AUTH_INVALID_OTP));
    }
  } catch (e) {
    if (e.response) {
      const { status, data } = e.response;
      if (status === 400) {
        yield put(twoFactorAuthVerifyFailure(TWO_FACTOR_AUTH_INVALID_OTP));
      } else if (status === 401) {
        yield put(twoFactorAuthVerifyFailure(TWO_FACTOR_AUTH_SESSION_EXPIRED));
      } else if (status === 403 && data?.error_code === TWO_FACTOR_AUTH_DISABLED) {
        yield put(loginRequestFailure({ errorCode: TWO_FACTOR_AUTH_DISABLED }));
      } else if (status === 429) {
        yield put(twoFactorAuthVerifyFailure(FORBIDDEN_REQUEST));
      } else {
        yield put(twoFactorAuthVerifyFailure(INTERNAL_SERVER_ERROR));
      }
      logInfo(e);
    } else {
      yield put(twoFactorAuthVerifyFailure(INTERNAL_SERVER_ERROR));
      logError(e);
    }
  }
}

export function* handleTwoFactorAuthResend() {
  try {
    yield put(twoFactorAuthResendBegin());
    yield call(resendOtp);
    yield put(twoFactorAuthResendSuccess());
  } catch (e) {
    if (e.response?.status === 403 && e.response?.data?.error_code === TWO_FACTOR_AUTH_DISABLED) {
      yield put(loginRequestFailure({ errorCode: TWO_FACTOR_AUTH_DISABLED }));
    } else if (e.response && e.response.status === 429) {
      yield put(twoFactorAuthResendFailure(TWO_FACTOR_AUTH_RESEND_RATE_LIMITED));
    } else {
      yield put(twoFactorAuthResendFailure(INTERNAL_SERVER_ERROR));
      logError(e);
    }
  }
}

export default function* saga() {
  yield takeLeading(LOGIN_REQUEST.BASE, handleLoginRequest);
  yield takeLeading(TWO_FACTOR_AUTH_VERIFY.BASE, handleTwoFactorAuthVerify);
  yield takeLeading(TWO_FACTOR_AUTH_RESEND.BASE, handleTwoFactorAuthResend);
}
