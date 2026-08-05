import { mergeConfig } from '@edx/frontend-platform';
import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import reduxWrapper from '../../testUtils';
import { resetEmailCheck } from '../../data/actions';
import { resendOtp, resetTwoFactorAuth, verifyOtp } from '../data/actions';
import { clearLoginError } from '../../login/data/actions';
import { cancelOtpRequest } from '../data/service';
import TwoFactorAuthPage from '../TwoFactorAuthPage';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: () => mockedNavigate,
}));

jest.mock('../data/service', () => ({
  cancelOtpRequest: jest.fn(),
}));

const mockStore = configureStore();

const defaultTwoFactorAuthState = {
  submitState: 'default',
  resendState: 'default',
  errorCode: '',
  redirectUrl: '',
  success: false,
  passwordExpiryNudge: false,
  resendCooldownDeadline: 0,
};

describe('TwoFactorAuthPage', () => {
  let store = {};
  let dispatchSpy;

  beforeEach(() => {
    mergeConfig({ SITE_NAME: 'Edly' });
    mockedNavigate.mockClear();
    cancelOtpRequest.mockClear();
    // Each test starts with a clean slate - the resend cooldown deadline is persisted
    // here keyed by sessionId, and would otherwise leak between tests.
    sessionStorage.clear();
    useLocation.mockReturnValue({
      state: { sessionId: 'session-123', otpEmail: 'learner@example.com' },
    });
    store = mockStore({ twoFactorAuth: defaultTwoFactorAuthState });
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  it('redirects to the login page when there is no sessionId in router state', () => {
    useLocation.mockReturnValue({ state: {} });
    const { container } = render(reduxWrapper(store, <TwoFactorAuthPage />));

    // <Navigate> renders nothing - the OTP form should not be present.
    expect(container.querySelector('#two-factor-auth-form')).toBeNull();
  });

  it('renders the OTP form when a sessionId is present', () => {
    render(reduxWrapper(store, <TwoFactorAuthPage />));

    expect(screen.getByLabelText('Verification code')).toBeDefined();
    expect(screen.getByText('learner@example.com', { exact: false })).toBeDefined();
  });

  it('strips non-digit characters and caps the OTP input at 6 digits', () => {
    render(reduxWrapper(store, <TwoFactorAuthPage />));
    const input = screen.getByLabelText('Verification code');

    fireEvent.change(input, { target: { value: 'a1b2c3d4e5f6g7' } });

    expect(input.value).toBe('123456');
  });

  it('dispatches verifyOtp with the sessionId and entered code on submit', () => {
    render(reduxWrapper(store, <TwoFactorAuthPage />));
    const input = screen.getByLabelText('Verification code');

    fireEvent.change(input, { target: { value: '654321' } });
    fireEvent.click(screen.getByText('Verify'));

    expect(dispatchSpy).toHaveBeenCalledWith(verifyOtp('session-123', '654321', undefined));
  });

  it('dispatches verifyOtp with the next param read from the URL query string', () => {
    delete window.location;
    window.location = { search: '?next=%2Fauthoring%2Fcourse%2Fabc' };
    render(reduxWrapper(store, <TwoFactorAuthPage />));
    const input = screen.getByLabelText('Verification code');

    fireEvent.change(input, { target: { value: '654321' } });
    fireEvent.click(screen.getByText('Verify'));

    expect(dispatchSpy).toHaveBeenCalledWith(verifyOtp('session-123', '654321', '/authoring/course/abc'));

    window.location.search = '';
  });

  it('dispatches resendOtp when "Resend code" is clicked', () => {
    render(reduxWrapper(store, <TwoFactorAuthPage />));

    fireEvent.click(screen.getByText('Resend code'));

    expect(dispatchSpy).toHaveBeenCalledWith(resendOtp('session-123'));
    // The cooldown no longer starts optimistically from a build-time default - it only
    // re-arms once the resend API's response lands; see the test below.
    expect(screen.getByText('Resend code')).toBeDefined();
  });

  it('shows the live resend cooldown once the resend response carries a cooldown deadline', () => {
    const now = 1700000000000;
    jest.spyOn(Date, 'now').mockReturnValue(now);
    store = mockStore({
      twoFactorAuth: { ...defaultTwoFactorAuthState, resendCooldownDeadline: now + 45000 },
    });

    render(reduxWrapper(store, <TwoFactorAuthPage />));

    expect(screen.getByText('Resend code (45s)', { exact: false })).toBeDefined();

    Date.now.mockRestore();
  });

  it('computes remaining cooldown from a persisted deadline instead of restarting it on remount', () => {
    // Simulates a page refresh: the component unmounts and a fresh instance mounts with
    // the same (now stale) location.state, some time after the first mount.
    const now = 1700000000000;
    jest.spyOn(Date, 'now').mockReturnValue(now);
    useLocation.mockReturnValue({
      state: { sessionId: 'session-123', otpEmail: 'learner@example.com', resendCooldownSeconds: 150 },
    });

    const { unmount } = render(reduxWrapper(store, <TwoFactorAuthPage />));
    expect(screen.getByText('Resend code (150s)', { exact: false })).toBeDefined();
    unmount();

    // 100 seconds elapse while the page is reloaded.
    Date.now.mockReturnValue(now + 100000);
    render(reduxWrapper(store, <TwoFactorAuthPage />));

    expect(screen.getByText('Resend code (50s)', { exact: false })).toBeDefined();

    Date.now.mockRestore();
  });

  it('shows a live resend cooldown immediately when the initial send included one', () => {
    // The backend computes this from the OTP session's last-send time and hands it
    // over on the same response that carries sessionId/otpEmail - the countdown must
    // render from that on first paint, not only after a resend attempt is rejected
    // with 'otp-resend-cooldown'.
    useLocation.mockReturnValue({
      state: { sessionId: 'session-123', otpEmail: 'learner@example.com', resendCooldownSeconds: 150 },
    });
    render(reduxWrapper(store, <TwoFactorAuthPage />));

    const resendLink = screen.getByText('Resend code (150s)', { exact: false });
    expect(resendLink).toBeDefined();

    // Clicking during the cooldown must not fire a resend request.
    fireEvent.click(resendLink);
    expect(dispatchSpy).not.toHaveBeenCalledWith(resendOtp('session-123'));
  });

  it('does not show a cooldown when the initial send response carried none', () => {
    // Backward-compatible default: no resendCooldownSeconds in state (e.g. an older
    // backend response) must not crash and must leave the resend button enabled.
    render(reduxWrapper(store, <TwoFactorAuthPage />));

    expect(screen.getByText('Resend code')).toBeDefined();
    fireEvent.click(screen.getByText('Resend code'));
    expect(dispatchSpy).toHaveBeenCalledWith(resendOtp('session-123'));
  });

  it('cancels the OTP session and navigates back to login with query params preserved', () => {
    render(reduxWrapper(store, <TwoFactorAuthPage />));

    fireEvent.click(screen.getByText('Use a different account'));

    expect(cancelOtpRequest).toHaveBeenCalledWith('session-123');
    expect(dispatchSpy).toHaveBeenCalledWith(resetTwoFactorAuth());
    expect(dispatchSpy).toHaveBeenCalledWith(resetEmailCheck());
    expect(dispatchSpy).toHaveBeenCalledWith(clearLoginError());
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  it('shows the mapped error message for a known error code', () => {
    store = mockStore({
      twoFactorAuth: { ...defaultTwoFactorAuthState, errorCode: 'otp-expired' },
    });

    render(reduxWrapper(store, <TwoFactorAuthPage />));

    expect(screen.getByText('This code has expired. Please request a new one.')).toBeDefined();
  });

  it('falls back to the generic error message for an unmapped error code', () => {
    store = mockStore({
      twoFactorAuth: { ...defaultTwoFactorAuthState, errorCode: 'some-unmapped-code' },
    });

    render(reduxWrapper(store, <TwoFactorAuthPage />));

    expect(screen.getByText('Something went wrong. Please try again.')).toBeDefined();
  });

  it('shows the delivery-failed message and the resend heading for otp-delivery-failed', () => {
    store = mockStore({
      twoFactorAuth: { ...defaultTwoFactorAuthState, errorCode: 'otp-delivery-failed' },
    });

    render(reduxWrapper(store, <TwoFactorAuthPage />));

    expect(screen.getByText("We couldn't send a new code.")).toBeDefined();
    expect(
      screen.getByText("We couldn't send your verification code. Please try again in a moment."),
    ).toBeDefined();
  });

  it('shows the correct error message for an incorrect OTP code', () => {
    store = mockStore({
      twoFactorAuth: { ...defaultTwoFactorAuthState, errorCode: 'otp-incorrect' },
    });

    render(reduxWrapper(store, <TwoFactorAuthPage />));

    expect(screen.getByText('The code is incorrect. Please try again or request a new one.')).toBeDefined();
  });

  it('navigates to the redirectUrl via window.location.href on successful verify', () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    store = mockStore({
      twoFactorAuth: {
        ...defaultTwoFactorAuthState,
        success: true,
        redirectUrl: 'http://local.openedx.io:8000/dashboard',
        passwordExpiryNudge: false,
      },
    });

    act(() => {
      render(reduxWrapper(store, <TwoFactorAuthPage />));
    });

    expect(window.location.href).toBe('http://local.openedx.io:8000/dashboard');

    window.location = originalLocation;
  });

  it('does not navigate when success is true but passwordExpiryNudge is also true', () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    store = mockStore({
      twoFactorAuth: {
        ...defaultTwoFactorAuthState,
        success: true,
        redirectUrl: 'http://local.openedx.io:8000/dashboard',
        passwordExpiryNudge: true,
      },
    });

    act(() => {
      render(reduxWrapper(store, <TwoFactorAuthPage />));
    });

    expect(window.location.href).toBe('');

    window.location = originalLocation;
  });
});
