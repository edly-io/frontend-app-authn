import { logError } from "@edx/frontend-platform/logging";
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

import {
  AUTHENTICATE_USER_ID_FROM_NAFATH,
  setNafathAuthnData,
  CHECK_USER_REQUEST_STATUS,
  setUserRequestData,
  HANDLE_NAFATH_USER_REGISTRATION,
  setNafathUserRegistrationSuccess,
  setNafathUserRegistrationError,
  setCheckRequestStatusIntervelTime,
  setUserRequestStatus,
  setNafathUserIdAuthenticationError,
} from "./actions";
import {
  authenticationAndRandomTextRequest,
  checkUserRequestStatusRequest,
  completeNafathUserRegistration,
} from "./service";

export function* handleAuthenticateUserIdFromNafathSaga(action) {
  try {
    yield put(
      setNafathUserIdAuthenticationError({
        authenticationError: "",
      })
    );
    const { transId, random, error } = yield call(
      authenticationAndRandomTextRequest,
      action.payload
    );
    if (error) {
      yield put(
        setNafathUserIdAuthenticationError({
          authenticationError: error,
        })
      );
    } else {
      let data = {};
      data.transId = transId;
      data.random = random;
      data.status = "WAITING";
      data.userId = action.payload;
      data.form = 1;
      yield put(setNafathAuthnData(data));
    }
  } catch (e) {
    logError(e);
    throw e;
  }
}

export function* checkUserRequestStatusSaga(action) {
  try {
    const { redirect_url, success, status } = yield call(
      checkUserRequestStatusRequest,
      action.payload
    );
    if (success && redirect_url) {
      yield put(
        setNafathUserRegistrationSuccess({
          redirectUrl: redirect_url,
          success: success,
        })
      );
    }
    if (status != "WAITING") {
      if (status != "COMPLETED") {
        yield put(setUserRequestStatus(status));
      } else {
        const data = {
          form: 2,
          status: status,
        };
        yield put(setUserRequestData(data));
      }
    } else {
      yield put(setCheckRequestStatusIntervelTime(3000));
    }
  } catch (e) {
    logError(e);
    throw e;
  }
}

var cont = 0;
export function* handleNafathUserRegistrationSaga(action) {
  try {
    yield put(
      setNafathUserRegistrationError({
        registrationError: "",
      })
    );
    cont = cont + 1;
    if (cont == 1) {
      // will require error handling here
      const { error, success } = yield call(
        completeNafathUserRegistration,
        action.payload
      );
      cont = 0;
      if (success) {
        const { redirect_url, success } = yield call(
          checkUserRequestStatusRequest,
          action.payload
        );
        if (success && redirect_url) {
          yield put(
            setNafathUserRegistrationSuccess({
              redirectUrl: redirect_url,
              success: success,
            })
          );
        }
      }
      if (error) {
        yield put(
          setNafathUserRegistrationError({
            registrationError: error,
          })
        );
      }
    }
  } catch (e) {
    logError(e);
    throw e;
  }
}

export default function* saga() {
  yield takeEvery(
    AUTHENTICATE_USER_ID_FROM_NAFATH,
    handleAuthenticateUserIdFromNafathSaga
  );
  yield takeEvery(CHECK_USER_REQUEST_STATUS, checkUserRequestStatusSaga);
  yield takeLatest(
    HANDLE_NAFATH_USER_REGISTRATION,
    handleNafathUserRegistrationSaga
  );
}
