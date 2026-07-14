import { configure, IntlProvider } from '@edx/frontend-platform/i18n';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ResetPasswordSuccess from '../ResetPasswordSuccess';

describe('ResetPasswordSuccess', () => {
  const reduxWrapper = (initialEntries) => (
    <IntlProvider locale="en">
      <MemoryRouter initialEntries={initialEntries}>
        <ResetPasswordSuccess />
      </MemoryRouter>
    </IntlProvider>
  );

  beforeEach(() => {
    configure({
      loggingService: { logError: jest.fn() },
      config: {
        ENVIRONMENT: 'production',
        LANGUAGE_PREFERENCE_COOKIE_NAME: 'yum',
      },
      messages: { 'es-419': {}, de: {}, 'en-us': {} },
    });
  });

  it('shows the panel first-time-set welcome banner when track=edly_panel is present', () => {
    render(reduxWrapper(['/login?track=edly_panel']));

    expect(screen.queryByText('You\'re All Set!')).toBeTruthy();
    expect(screen.queryByText('Password reset complete.')).toBeNull();
  });

  it('shows the generic reset-password success banner when track is absent', () => {
    render(reduxWrapper(['/login']));

    expect(screen.queryByText('Password reset complete.')).toBeTruthy();
    expect(screen.queryByText('You\'re All Set!')).toBeNull();
  });

  it('shows the generic reset-password success banner when track has an unrelated value', () => {
    render(reduxWrapper(['/login?track=pwreset']));

    expect(screen.queryByText('Password reset complete.')).toBeTruthy();
    expect(screen.queryByText('You\'re All Set!')).toBeNull();
  });
});
