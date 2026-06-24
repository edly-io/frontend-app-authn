import { Provider } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import {
  fireEvent, render, screen,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { COMPLETE_STATE, LOGIN_PAGE, RESET_PAGE } from '../../data/constants';
import { FORGOT_PASSWORD } from '../../forgot-password/data/actions';
import ChangePasswordPrompt from '../ChangePasswordPrompt';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')),
  useNavigate: () => mockedNavigator,
}));

const mockStore = configureStore();

describe('ChangePasswordPromptTests', () => {
  let props = {};
  let store = {};

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <MemoryRouter>
        <Provider store={store}>{children}</Provider>
      </MemoryRouter>
    </IntlProvider>
  );

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
  });

  it('[nudge modal] should redirect to next url when user clicks close button', () => {
    const dashboardUrl = getConfig().BASE_URL.concat('/dashboard');
    props = {
      variant: 'nudge',
      redirectUrl: dashboardUrl,
    };

    delete window.location;
    window.location = { href: getConfig().BASE_URL };

    render(reduxWrapper(<ChangePasswordPrompt {...props} />));

    fireEvent.click(screen.getByText('Close'));
    expect(window.location.href).toBe(dashboardUrl);
  });

  it('[block modal, no verifiedEmail] should redirect to reset password page when user clicks outside modal', async () => {
    props = {
      variant: 'block',
    };

    render(reduxWrapper(<ChangePasswordPrompt {...props} />));

    await act(async () => {
      await fireEvent.click(screen.getByText(
        '',
        { selector: '.pgn__modal-backdrop' },
      ));
    });

    expect(mockedNavigator).toHaveBeenCalledWith(RESET_PAGE);
  });

  it('[block modal, no verifiedEmail] "Update Password" should link to the reset password page', () => {
    props = {
      variant: 'block',
    };

    render(reduxWrapper(<ChangePasswordPrompt {...props} />));

    const updatePasswordLink = screen.getByText('Update Password');
    expect(updatePasswordLink.getAttribute('href')).toBe(RESET_PAGE);
  });

  it(
    '[block modal, verifiedEmail] clicking "Update Password" dispatches the existing '
      + 'forgot-password action instead of navigating away',
    () => {
      props = {
        variant: 'block',
        verifiedEmail: 'learner@example.com',
      };

      render(reduxWrapper(<ChangePasswordPrompt {...props} />));

      fireEvent.click(screen.getByText('Update Password'));

      expect(store.getActions()).toEqual([
        { type: FORGOT_PASSWORD.BASE, payload: { email: 'learner@example.com' } },
      ]);
      expect(mockedNavigator).not.toHaveBeenCalled();
    },
  );

  it(
    '[block modal, verifiedEmail] clicking outside the modal does not redirect to the '
      + 'reset password page - the user already has a verified email on file',
    async () => {
      props = {
        variant: 'block',
        verifiedEmail: 'learner@example.com',
      };

      render(reduxWrapper(<ChangePasswordPrompt {...props} />));

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
    '[block modal, verifiedEmail] shows the "email sent" confirmation and a way back to '
      + 'sign in once the reset request resolves',
    () => {
      store = mockStore({ forgotPassword: { status: COMPLETE_STATE, submitState: '' } });
      props = {
        variant: 'block',
        verifiedEmail: 'learner@example.com',
      };

      render(reduxWrapper(<ChangePasswordPrompt {...props} />));

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
