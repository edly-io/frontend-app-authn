import { camelCaseObject } from "@edx/frontend-platform";
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
  setNafathUserLoginError,
  setFormNumber,
} from "./actions";
import {
  authenticationAndRandomTextRequest,
  checkUserRequestStatusRequest,
  verifyBackendValidationsAndSendUserActivationCode,
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
    const { redirect_url, redirectUrl, success, status, person } = yield call(
      checkUserRequestStatusRequest,
      action.payload
    );
    if (success && (redirectUrl || redirect_url)) {
      yield put(
        setNafathUserRegistrationSuccess({
          redirectUrl: (redirectUrl || redirect_url),
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
          person: person,
        };
        yield put(setUserRequestData(data));
      }
    } else {
      yield put(setCheckRequestStatusIntervelTime(3000));
    }
  } catch (e) {
    const statusCodes = [400];
    if (e.response) {
      const { status } = e.response.request;
      if (statusCodes.includes(status)) {
        yield put(setNafathUserLoginError(camelCaseObject(e.response.data)));
      } else if (status === 403) {
        yield put(setNafathUserLoginError({ errorCode: FORBIDDEN_REQUEST }));
      } else {
        yield put(
          setNafathUserLoginError({ errorCode: "internal-server-error" })
        );
        logError(e);
      }
    }
  }
}

var cont = 0;
export function* handleNafathUserRegistrationSaga(action) {
  try {
    cont = cont + 1;
    if (cont == 1) {
      if (action.payload.user_data.activation_code){
        const { redirectUrl, redirect_url, success, error } = yield call(
          checkUserRequestStatusRequest,
          action.payload
        );
        cont = 0;
        if (success && (redirectUrl || redirect_url)) {
          yield put(
            setNafathUserRegistrationSuccess({
              redirectUrl: (redirectUrl || redirect_url),
              success: success,
            })
          );
        }
        else if (error) {
          yield put(
            setNafathUserRegistrationError(error)
          );
        }
      } else {
        const { error, successMessage } = yield call(
          verifyBackendValidationsAndSendUserActivationCode,
          action.payload
        );
        cont = 0;
        if (successMessage) {
          yield put(setFormNumber(action.payload.user_data.form + 1));
        }
        if (error) {
          yield put(
            setNafathUserRegistrationError(error)
          );
        }
      }
    }
  } catch (e) {
    cont = 0;
    const statusCodes = [400, 403, 409];
    if (e.response && statusCodes.includes(e.response.status)) {
      const { error } = e.response.data
      if (error == "activation-code-do-not-match") {
        yield put(setNafathUserRegistrationError(camelCaseObject(error)));
      } else {
        yield put(setNafathUserLoginError(camelCaseObject(e.response.data)));
      }
      logError(e);
    } else {
      yield put(setNafathUserLoginError({ errorCode: "internal-server-error" }));
      logError(e);
    }
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
