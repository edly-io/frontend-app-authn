import { runSaga } from 'redux-saga';

import initializeMockLogging from '../../../setupTest';
import * as actions from '../actions';
import { OTP_EXPIRED, OTP_INVALID_REQUEST } from '../constants';
import { handleResendOtp, handleVerifyOtp } from '../sagas';
import * as api from '../service';

const { loggingService } = initializeMockLogging();

describe('handleVerifyOtp', () => {
  const params = {
    payload: { sessionId: 'session-123', otpCode: '123456' },
  };

  beforeEach(() => {
    loggingService.logError.mockReset();
  });

  it('should dispatch verifyOtpSuccess on a successful verify', async () => {
    const verifyOtpRequest = jest.spyOn(api, 'verifyOtpRequest').mockImplementation(
      () => Promise.resolve({ success: true, redirectUrl: '/dashboard', passwordExpiryNudge: false }),
    );

    const dispatched = [];
    await runSaga({ dispatch: (action) => dispatched.push(action) }, handleVerifyOtp, params);

    expect(dispatched).toEqual([
      actions.verifyOtpBegin(),
      actions.verifyOtpSuccess('/dashboard', false),
    ]);
    verifyOtpRequest.mockClear();
  });

  it('should dispatch the generic invalid-request failure on a 200 success:false response', async () => {
    // A 200 with success:false is defensive/unexpected - the backend's specific OTP failure
    // codes (expired, attempts-exceeded, etc.) come back as 400s via the catch branch instead.
    const verifyOtpRequest = jest.spyOn(api, 'verifyOtpRequest').mockImplementation(
      () => Promise.resolve({ success: false }),
    );

    const dispatched = [];
    await runSaga({ dispatch: (action) => dispatched.push(action) }, handleVerifyOtp, params);

    expect(dispatched).toEqual([
      actions.verifyOtpBegin(),
      actions.verifyOtpFailure(OTP_INVALID_REQUEST),
    ]);
    verifyOtpRequest.mockClear();
  });

  it('should dispatch the backend error_code on a rejected request', async () => {
    const otpExpiredErrorResponse = { response: { data: { error_code: OTP_EXPIRED } } };
    const verifyOtpRequest = jest.spyOn(api, 'verifyOtpRequest').mockImplementation(
      () => Promise.reject(otpExpiredErrorResponse),
    );

    const dispatched = [];
    await runSaga({ dispatch: (action) => dispatched.push(action) }, handleVerifyOtp, params);

    expect(dispatched).toEqual([
      actions.verifyOtpBegin(),
      actions.verifyOtpFailure(OTP_EXPIRED),
    ]);
    verifyOtpRequest.mockClear();
  });

  it('should fall back to the generic invalid-request code when the error has no error_code', async () => {
    const verifyOtpRequest = jest.spyOn(api, 'verifyOtpRequest').mockImplementation(
      () => Promise.reject(new Error('network error')),
    );

    const dispatched = [];
    await runSaga({ dispatch: (action) => dispatched.push(action) }, handleVerifyOtp, params);

    expect(dispatched).toEqual([
      actions.verifyOtpBegin(),
      actions.verifyOtpFailure(OTP_INVALID_REQUEST),
    ]);
    verifyOtpRequest.mockClear();
  });
});

describe('handleResendOtp', () => {
  const params = {
    payload: { sessionId: 'session-123' },
  };

  it('should dispatch resendOtpSuccess on a successful resend', async () => {
    const resendOtpRequest = jest.spyOn(api, 'resendOtpRequest').mockImplementation(
      () => Promise.resolve({ success: true }),
    );

    const dispatched = [];
    await runSaga({ dispatch: (action) => dispatched.push(action) }, handleResendOtp, params);

    expect(dispatched).toEqual([
      actions.resendOtpBegin(),
      actions.resendOtpSuccess(),
    ]);
    resendOtpRequest.mockClear();
  });

  it('should dispatch the backend error_code on a rejected resend', async () => {
    const otpExpiredErrorResponse = { response: { data: { error_code: OTP_EXPIRED } } };
    const resendOtpRequest = jest.spyOn(api, 'resendOtpRequest').mockImplementation(
      () => Promise.reject(otpExpiredErrorResponse),
    );

    const dispatched = [];
    await runSaga({ dispatch: (action) => dispatched.push(action) }, handleResendOtp, params);

    expect(dispatched).toEqual([
      actions.resendOtpBegin(),
      actions.resendOtpFailure(OTP_EXPIRED),
    ]);
    resendOtpRequest.mockClear();
  });
});
