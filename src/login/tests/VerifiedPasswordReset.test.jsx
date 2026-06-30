import {
  fireEvent, render, screen,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import configureStore from 'redux-mock-store';

import { COMPLETE_STATE, LOGIN_PAGE, RESET_PAGE } from '../../data/constants';
import { FORGOT_PASSWORD } from '../../forgot-password/data/actions';
import reduxWrapper from '../../testUtils';
import ChangePasswordPrompt from '../ChangePasswordPrompt';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')),
  useNavigate: () => mockedNavigator,
}));

const mockStore = configureStore();

describe('VerifiedPasswordReset (ChangePasswordPrompt, block modal, verifiedEmail)', () => {
  let props = {};
  let store = {};

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query,
      })),
    });
  });

  beforeEach(() => {
    mockedNavigator.mockClear();
    store = mockStore({ forgotPassword: { status: '', submitState: '' } });
    props = {
      variant: 'block',
      verifiedEmail: 'learner@example.com',
    };
  });

  it(
    'clicking "Update Password" dispatches the existing forgot-password action instead of navigating away',
    () => {
      render(reduxWrapper(store, <ChangePasswordPrompt {...props} />));

      fireEvent.click(screen.getByText('Update Password'));

      expect(store.getActions()).toEqual([
        { type: FORGOT_PASSWORD.BASE, payload: { email: 'learner@example.com' } },
      ]);
      expect(mockedNavigator).not.toHaveBeenCalled();
    },
  );

  it(
    'clicking outside the modal does not redirect to the reset password page - the user already '
      + 'has a verified email on file',
    async () => {
      render(reduxWrapper(store, <ChangePasswordPrompt {...props} />));

      await act(async () => {
        await fireEvent.click(screen.getByText(
          '',
          { selector: '.pgn__modal-backdrop' },
        ));
      });

      expect(mockedNavigator).not.toHaveBeenCalledWith(RESET_PAGE);
    },
  );

  it(
    'shows the "email sent" confirmation and a way back to sign in once the reset request resolves',
    () => {
      store = mockStore({ forgotPassword: { status: COMPLETE_STATE, submitState: '' } });

      render(reduxWrapper(store, <ChangePasswordPrompt {...props} />));

      fireEvent.click(screen.getByText('Update Password'));

      // The modal body (including this alert) renders into a Paragon portal,
      // which lives outside the render()-returned container - query via
      // `screen` (document.body) rather than `container` to find it.
      const confirmationAlert = document.getElementById('validation-errors');
      expect(confirmationAlert).not.toBeNull();
      expect(confirmationAlert.textContent).toEqual(expect.stringContaining('learner@example.com'));

      const backToSignIn = screen.getByText('Back to Sign In');
      expect(backToSignIn.getAttribute('href')).toBe(LOGIN_PAGE);
    },
  );
});
