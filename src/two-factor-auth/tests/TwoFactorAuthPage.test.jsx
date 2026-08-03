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
};

describe('TwoFactorAuthPage', () => {
  let store = {};
  let dispatchSpy;

  beforeEach(() => {
    mergeConfig({ SITE_NAME: 'Edly' });
    mockedNavigate.mockClear();
    cancelOtpRequest.mockClear();
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

  it('dispatches resendOtp and starts the cooldown when "Resend code" is clicked', () => {
    render(reduxWrapper(store, <TwoFactorAuthPage />));

    fireEvent.click(screen.getByText('Resend code'));

    expect(dispatchSpy).toHaveBeenCalledWith(resendOtp('session-123'));
    expect(screen.getByText('Resend code (180s)', { exact: false })).toBeDefined();
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
