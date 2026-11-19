import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render, screen } from '@testing-library/react';
import Cookies from 'universal-cookie';

import SignedOutElsewhereMessage from '../SignedOutElsewhereMessage';

const REASON_COOKIE = 'fbr-signed-out-reason';

const renderMessage = () => render(
  <IntlProvider locale="en">
    <SignedOutElsewhereMessage />
  </IntlProvider>,
);

describe('SignedOutElsewhereMessage', () => {
  afterEach(() => {
    new Cookies().remove(REASON_COOKIE, { path: '/' });
  });

  it('explains a sign-out caused by a login on another device', () => {
    new Cookies().set(REASON_COOKIE, 'concurrent-login', { path: '/' });
    renderMessage();

    expect(screen.getByText('You were signed out')).toBeDefined();
    expect(screen.getByText(
      'Your account was signed in on another device or browser, so this session was ended. '
      + 'Sign in again to continue here.',
    )).toBeDefined();
  });

  it('renders nothing without the sign-out reason', () => {
    const { container } = renderMessage();

    expect(container.innerHTML).toBe('');
  });

  it('renders nothing for an unknown sign-out reason', () => {
    new Cookies().set(REASON_COOKIE, 'something-else', { path: '/' });
    const { container } = renderMessage();

    expect(container.innerHTML).toBe('');
  });
});
