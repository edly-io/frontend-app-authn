import { logError, logInfo } from "@edx/frontend-platform/logging";
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

import {
  AUTHENTICATE_USER_ID_FROM_NAFATH,
  setNafathAuthnData,
  CHECK_USER_REQUEST_STATUS,
  setUserRequestData,
  HANDLE_NAFATH_USER_REGISTRATION,
  setNafathUserRegistrationSuccess,
  setCheckRequestStatusIntervelTime,
} from "./actions";
import { registerRequest } from "../../register/data/service";
import {
  authenticationAndRandomTextRequest,
  checkUserRequestStatusRequest,
} from "./service";

export function* handleAuthenticateUserIdFromNafathSaga(action) {
  debugger;
  try {
    // const { data } = yield call(
    //   authenticationAndRandomTextRequest,
    //   action.payload
    // );
    const data = { random: "abc", transId: "ahba" };
    data.status = "WAITING";
    data.userId = action.payload;
    yield put(setNafathAuthnData(data));
  } catch (e) {
    logError(e);
    throw e;
  }
}

export function* checkUserRequestStatusSaga(action) {
  debugger;
  try {
    // const { data } = yield call(
    //   checkUserRequestStatusRequest,
    //   action.payload
    // );
    const data = {
      status: "COMPLETED",
      person: { id: action.payload.Parameters.id, enFullName: "nafath" },
    };
    if (!("person" in data)) {
      data.person = {};
    }
    if (data?.status != "WAITING") {
      if (data?.status != "COMPLETED") {
        const userData = { random: "", transId: "" };
        userData.status = data?.status;
        userData.userId = action.payload.Parameters.id;
        yield put(setNafathAuthnData(userData));
      } else {
        debugger;
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

//this counter is only used in dev mode, after build it will not be required after confirmation, as this App is built in strict-mode which runs useEffects sagas twice.
var cont = 0;
export function* handleNafathUserRegistrationSaga(action) {
  debugger;
  try {
    cont = cont + 1;
    if (cont == 1) {
      const { redirectUrl, success } = yield call(
        registerRequest,
        action.payload
      );
      cont = 0;
      yield put(
        setNafathUserRegistrationSuccess({
          redirectUrl,
          success,
        })
      );
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
