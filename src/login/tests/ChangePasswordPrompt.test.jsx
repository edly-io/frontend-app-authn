import { getConfig } from '@edx/frontend-platform';
import {
  fireEvent, render, screen,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import configureStore from 'redux-mock-store';

import { RESET_PAGE } from '../../data/constants';
import reduxWrapper from '../../testUtils';
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

    render(reduxWrapper(store, <ChangePasswordPrompt {...props} />));

    fireEvent.click(screen.getByText('Close'));
    expect(window.location.href).toBe(dashboardUrl);
  });

  it('[block modal, no verifiedEmail] should redirect to reset password page when user clicks outside modal', async () => {
    props = {
      variant: 'block',
    };

    render(reduxWrapper(store, <ChangePasswordPrompt {...props} />));

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

    render(reduxWrapper(store, <ChangePasswordPrompt {...props} />));

    const updatePasswordLink = screen.getByText('Update Password');
    expect(updatePasswordLink.getAttribute('href')).toBe(RESET_PAGE);
  });
});
