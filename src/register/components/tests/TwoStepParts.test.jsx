import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { PasswordStrength, TermsFooter, TwoStepHeader } from '../TwoStepParts';

describe('TwoStepParts', () => {
  let consoleError;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Missing/misspelt message keys surface as intl errors; none may be logged.
    expect(consoleError.mock.calls.filter(args => /intl|message/i.test(String(args[0])))).toEqual([]);
    consoleError.mockRestore();
  });

  const renderWithIntl = (ui) => render(
    <IntlProvider locale="en"><MemoryRouter>{ui}</MemoryRouter></IntlProvider>,
  );

  it('renders the step 1 header', () => {
    const { container, getByText } = renderWithIntl(<TwoStepHeader step={1} onBack={() => {}} />);
    expect(getByText('Step 1 of 2')).toBeTruthy();
    expect(getByText('Create Account')).toBeTruthy();
    expect(getByText('Sign in')).toBeTruthy();
    expect(container.querySelectorAll('.two-step-reg__progress-item--active')).toHaveLength(1);
    expect(container.querySelector('.two-step-reg__back')).toBeNull();
  });

  it('renders the step 2 header with a back link and both segments filled', () => {
    const onBack = jest.fn();
    const { container, getByText } = renderWithIntl(<TwoStepHeader step={2} onBack={onBack} />);
    expect(getByText('Step 2 of 2')).toBeTruthy();
    expect(getByText('Profile & ID')).toBeTruthy();
    expect(container.querySelectorAll('.two-step-reg__progress-item--active')).toHaveLength(2);
    container.querySelector('.two-step-reg__back').click();
    expect(onBack).toHaveBeenCalled();
  });

  it('renders the password strength bar and hint', () => {
    const { container, getByText } = renderWithIntl(<PasswordStrength value="Abcdefghij1!" />);
    expect(container.querySelectorAll('.is-filled')).toHaveLength(4);
    expect(getByText(/Use 12\+ characters/)).toBeTruthy();
    // Below the real minimum length the first segment stays empty.
    expect(renderWithIntl(<PasswordStrength value="Abcdefg1!" />).container.querySelectorAll('.is-filled')).toHaveLength(3);
  });

  it('renders the terms footer with both links', () => {
    const { container } = renderWithIntl(<TermsFooter />);
    expect(container.textContent).toContain('By creating an account you agree to our Terms and Privacy Policy.');
    expect(container.querySelectorAll('a')).toHaveLength(2);
  });
});
