import { Provider } from 'react-redux';

import { mergeConfig } from '@edx/frontend-platform';
import { configure, getLocale, IntlProvider } from '@edx/frontend-platform/i18n';
import { act, fireEvent, render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { registerNewUser } from './data/actions';
import { PROFILE_STEP_ROWS } from './data/twoStepConstants';
import RegistrationPage from './RegistrationPage';
import twoStepMessages from './twoStepMessages';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendPageEvent: jest.fn(),
  sendTrackEvent: jest.fn(),
}));
jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  getLocale: jest.fn(),
}));

const mockStore = configureStore();

const REQUIRED = ['gender', 'trn', 'physical_address', 'mailing_address', 'telephone', 'job_title',
  'photo_id_type', 'photo_id_number', 'id_expiration_date', 'parish', 'region'];
const SELECTS = { gender: ['m', 'f'], photo_id_type: ['Passport'], parish: ['Kingston'] };

const descriptions = Object.fromEntries(PROFILE_STEP_ROWS.flat().map(name => [name, {
  name,
  label: name,
  type: SELECTS[name] ? 'select' : 'text',
  options: (SELECTS[name] || []).map(value => [value, value]),
  error_message: REQUIRED.includes(name) ? { required: `${name} is required.` } : '',
}]));

describe('two-step registration submit', () => {
  let store;
  let state;

  beforeEach(() => {
    getLocale.mockReturnValue('en-us');
    configure({
      loggingService: { logError: jest.fn() },
      config: { ENVIRONMENT: 'production', LANGUAGE_PREFERENCE_COOKIE_NAME: 'yum' },
      messages: { 'es-419': {}, de: {}, 'en-us': {} },
    });
    mergeConfig({
      TWO_STEP_REGISTRATION: true,
      SHOW_CONFIGURABLE_EDX_FIELDS: false,
      MARKETING_EMAILS_OPT_IN: false,
      ENABLE_DYNAMIC_REGISTRATION_FIELDS: true,
      USER_RETENTION_COOKIE_NAME: 'authn-returning-user',
    });
    window.location = { search: '' };
    state = {
      register: {
        registrationResult: { success: false, redirectUrl: '' },
        registrationError: {},
        registrationFormData: {
          configurableFormFields: {},
          formFields: {
            name: '', email: '', username: '', password: '',
          },
          emailSuggestion: { suggestion: '', type: '' },
          errors: {
            name: '', email: '', username: '', password: '',
          },
        },
        usernameSuggestions: [],
      },
      commonComponents: {
        thirdPartyAuthApiStatus: null,
        thirdPartyAuthContext: {
          currentProvider: null, finishAuthUrl: null, providers: [], pipelineUserDetails: null, countryCode: null,
        },
        fieldDescriptions: descriptions,
        optionalFields: { fields: {}, extended_profile: [] },
      },
    };
    store = mockStore(() => state);
    store.dispatch = jest.fn(store.dispatch);
  });

  afterAll(() => {
    mergeConfig({ TWO_STEP_REGISTRATION: false });
  });

  it('shows every required error on an empty step 2 and does not register', () => {
    const { container } = render(
      <Router><IntlProvider locale="en"><Provider store={store}><RegistrationPage /></Provider></IntlProvider></Router>,
    );
    const type = (name, value) => fireEvent.change(container.querySelector(`[name="${name}"]`), { target: { value } });
    type('name', 'John Doe');
    type('email', 'john.doe@example.com');
    type('username', 'john_doe');
    type('password', 'Abcdefghij1!x');
    fireEvent.click(container.querySelector('button.btn-brand'));
    expect(container.querySelector('[name="trn"]')).not.toBeNull();

    fireEvent.click(container.querySelector('button.btn-brand'));

    REQUIRED.filter(name => name !== 'region').forEach(name => {
      expect(container.querySelector(`#${name}-error`).textContent).toEqual(`${name} is required.`);
    });
    expect(document.activeElement.name).toEqual('gender');
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: registerNewUser({}).type }));
  });

  it('masks TRN and telephone while typing and submits the formatted TRN and digits-only telephone', () => {
    const { container } = render(
      <Router><IntlProvider locale="en"><Provider store={store}><RegistrationPage /></Provider></IntlProvider></Router>,
    );
    const type = (name, value) => fireEvent.change(container.querySelector(`[name="${name}"]`), { target: { value } });
    type('name', 'John Doe');
    type('email', 'john.doe@example.com');
    type('username', 'john_doe');
    type('password', 'Abcdefghij1!x');
    fireEvent.click(container.querySelector('button.btn-brand'));

    type('trn', '123456789');
    type('telephone', '8765550100');
    expect(container.querySelector('[name="trn"]').value).toBe('123-456-789');
    expect(container.querySelector('[name="telephone"]').value).toBe('876 555 0100');

    type('gender', 'm');
    type('physical_address', '1 Hope Road');
    type('mailing_address', 'PO Box 1');
    type('job_title', 'Guide');
    type('photo_id_type', 'Passport');
    type('photo_id_number', 'A1234567');
    type('id_expiration_date', '2030-01-31');
    type('parish', 'Kingston');
    fireEvent.click(container.querySelector('button.btn-brand'));

    const registerCall = store.dispatch.mock.calls.map(([action]) => action)
      .find(action => action.type === registerNewUser({}).type);
    expect(registerCall.payload.registrationInfo).toEqual(
      expect.objectContaining({
        trn: '123-456-789', telephone: '8765550100', region: 'Kingston', id_expiration_date: '2030-01-31',
      }),
    );
  });

  const renderPage = () => render(
    <Router><IntlProvider locale="en"><Provider store={store}><RegistrationPage /></Provider></IntlProvider></Router>,
  );
  const fillAccountStep = (container) => {
    const type = (name, value) => fireEvent.change(container.querySelector(`[name="${name}"]`), { target: { value } });
    type('name', 'John Doe');
    type('email', 'john.doe@example.com');
    type('username', 'john_doe');
    type('password', 'Abcdefghij1!x');
    fireEvent.click(container.querySelector('button.btn-brand'));
  };

  it('returns to step 1 when the backend rejects an account-step field', () => {
    const { container } = renderPage();
    fillAccountStep(container);
    expect(container.querySelector('[name="trn"]')).not.toBeNull();

    state = {
      ...state,
      register: {
        ...state.register,
        registrationError: { email: [{ userMessage: 'An account with this email already exists.' }], errorCode: 'duplicate-email' },
      },
    };
    act(() => { store.dispatch({ type: 'noop' }); });

    expect(container.querySelector('[name="trn"]')).toBeNull();
    expect(container.querySelector('[name="email"]')).not.toBeNull();
  });

  it('stays on step 2 for a profile-field backend error', () => {
    const { container } = renderPage();
    fillAccountStep(container);
    state = {
      ...state,
      register: {
        ...state.register,
        registrationError: { trn: [{ userMessage: 'This TRN is already registered.' }], errorCode: 'duplicate-trn' },
      },
    };
    act(() => { store.dispatch({ type: 'noop' }); });
    expect(container.querySelector('[name="trn"]')).not.toBeNull();
  });

  it('does not auto-submit an SSO registration in two-step mode', () => {
    state = {
      ...state,
      register: { ...state.register, userPipelineDataLoaded: true },
      commonComponents: {
        ...state.commonComponents,
        thirdPartyAuthContext: { ...state.commonComponents.thirdPartyAuthContext, autoSubmitRegForm: true },
      },
    };
    const { container } = renderPage();
    expect(container.querySelector('[name="email"]')).not.toBeNull();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: registerNewUser({}).type }));
  });

  it('shows the username suggestions on step 1 and fills the username on click', () => {
    state = { ...state, register: { ...state.register, usernameSuggestions: ['john_doe1', 'john_doe2'] } };
    const { container } = renderPage();
    const chips = container.querySelectorAll('button.username-suggestions--chip');
    expect(chips).toHaveLength(2);
    expect(container.querySelector('.two-step-reg .username-suggestions')).not.toBeNull();

    fireEvent.click(chips[1]);
    expect(container.querySelector('[name="username"]').value).toBe('john_doe2');
  });

  it('blocks submit on step 2 when the mailing address is empty even if the backend does not require it', () => {
    state = {
      ...state,
      commonComponents: {
        ...state.commonComponents,
        fieldDescriptions: {
          ...descriptions, mailing_address: { ...descriptions.mailing_address, error_message: '' },
        },
      },
    };
    const { container } = renderPage();
    fillAccountStep(container);
    expect(container.querySelector('label[for="mailing_address"]').textContent).toBe('Mailing address*');
    fireEvent.click(container.querySelector('button.btn-brand'));
    expect(container.querySelector('#mailing_address-error').textContent).toBe('Please enter your mailing address.');
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: registerNewUser({}).type }));
  });

  it('takes step 2 labels and placeholders from the intl messages', () => {
    const { container } = render(
      <Router>
        <IntlProvider locale="en" messages={{ 'registration.profile.gender.label': 'Genre' }}>
          <Provider store={store}><RegistrationPage /></Provider>
        </IntlProvider>
      </Router>,
    );
    fillAccountStep(container);
    expect(container.querySelector('label[for="gender"]').textContent).toBe('Genre*');
    expect(container.querySelector('label[for="trn"]').textContent).toBe('TRN*');
  });

  it('has label and placeholder messages for every step 2 field', () => {
    PROFILE_STEP_ROWS.flat().forEach(name => {
      expect(twoStepMessages[`registration.profile.${name}.label`]).toBeDefined();
      if (name !== 'id_expiration_date') {
        expect(twoStepMessages[`registration.profile.${name}.placeholder`]).toBeDefined();
      }
    });
  });

  it('moves focus to the step heading on Continue and Back, but not on first render', () => {
    const { container } = renderPage();
    expect(document.activeElement).toBe(document.body);
    fillAccountStep(container);
    expect(document.activeElement).toBe(container.querySelector('h1'));
    expect(document.activeElement.textContent).toBe('Profile & ID');
    fireEvent.click(container.querySelector('.two-step-reg__back'));
    expect(document.activeElement).toBe(container.querySelector('h1'));
    expect(document.activeElement.textContent).toBe('Create Account');
  });
});
