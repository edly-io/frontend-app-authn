import { DEFAULT_STATE, PENDING_STATE } from '../../../data/constants';
import {
  RESEND_OTP,
  RESET_OTP_ERROR,
  VERIFY_OTP,
} from '../actions';
import { OTP_EXPIRED, OTP_INVALID_REQUEST } from '../constants';
import reducer, { defaultState } from '../reducers';

describe('two factor auth reducer', () => {
  it('should return the default state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState);
  });

  it('should set submitState to pending and clear errorCode on VERIFY_OTP.BEGIN', () => {
    const state = { ...defaultState, errorCode: OTP_EXPIRED };

    expect(reducer(state, { type: VERIFY_OTP.BEGIN })).toEqual({
      ...state,
      submitState: PENDING_STATE,
      errorCode: '',
    });
  });

  it('should set success, redirectUrl and passwordExpiryNudge on VERIFY_OTP.SUCCESS', () => {
    const action = {
      type: VERIFY_OTP.SUCCESS,
      payload: { redirectUrl: '/dashboard', passwordExpiryNudge: true },
    };

    expect(reducer(defaultState, action)).toEqual({
      ...defaultState,
      submitState: DEFAULT_STATE,
      success: true,
      redirectUrl: '/dashboard',
      passwordExpiryNudge: true,
    });
  });

  it('should default passwordExpiryNudge to false on VERIFY_OTP.SUCCESS when omitted', () => {
    const action = {
      type: VERIFY_OTP.SUCCESS,
      payload: { redirectUrl: '/dashboard' },
    };

    expect(reducer(defaultState, action).passwordExpiryNudge).toBe(false);
  });

  it('should set submitState back to default and set errorCode on VERIFY_OTP.FAILURE', () => {
    const state = { ...defaultState, submitState: PENDING_STATE };
    const action = { type: VERIFY_OTP.FAILURE, payload: { errorCode: OTP_INVALID_REQUEST } };

    expect(reducer(state, action)).toEqual({
      ...state,
      submitState: DEFAULT_STATE,
      errorCode: OTP_INVALID_REQUEST,
    });
  });

  it('should set resendState to pending and clear errorCode on RESEND_OTP.BEGIN', () => {
    const state = { ...defaultState, errorCode: OTP_EXPIRED };

    expect(reducer(state, { type: RESEND_OTP.BEGIN })).toEqual({
      ...state,
      resendState: PENDING_STATE,
      errorCode: '',
    });
  });

  it('should reset resendState and set resendCooldownDeadline on RESEND_OTP.SUCCESS', () => {
    const state = { ...defaultState, resendState: PENDING_STATE };
    const action = { type: RESEND_OTP.SUCCESS, payload: { resendCooldownDeadline: 1700000045000 } };

    expect(reducer(state, action)).toEqual({
      ...state,
      resendState: DEFAULT_STATE,
      resendCooldownDeadline: 1700000045000,
    });
  });

  it('should reset resendState to default and set errorCode on RESEND_OTP.FAILURE', () => {
    const state = { ...defaultState, resendState: PENDING_STATE };
    const action = { type: RESEND_OTP.FAILURE, payload: { errorCode: OTP_INVALID_REQUEST } };

    expect(reducer(state, action)).toEqual({
      ...state,
      resendState: DEFAULT_STATE,
      errorCode: OTP_INVALID_REQUEST,
    });
  });

  it('should clear errorCode on RESET_OTP_ERROR', () => {
    const state = { ...defaultState, errorCode: OTP_EXPIRED };

    expect(reducer(state, { type: RESET_OTP_ERROR })).toEqual({
      ...state,
      errorCode: '',
    });
  });
});
