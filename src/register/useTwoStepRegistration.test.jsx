import { Provider } from 'react-redux';

import { mergeConfig } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { renderHook } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import useTwoStepRegistration from './useTwoStepRegistration';

const mockStore = configureStore();

const renderTwoStepHook = () => renderHook(() => useTwoStepRegistration({
  fieldDescriptions: { trn: { name: 'trn', error_message: '' } },
  optionalFields: { fields: {} },
  formFields: { password: '' },
  configurableFormFields: {},
  errors: {},
  temporaryErrors: {},
  setErrors: jest.fn(),
  setErrorCode: jest.fn(),
  backendValidations: null,
  registrationEmbedded: false,
  currentProvider: null,
}), {
  wrapper: ({ children }) => (
    <IntlProvider locale="en"><Provider store={mockStore({})}>{children}</Provider></IntlProvider>
  ),
});

describe('useTwoStepRegistration', () => {
  afterEach(() => mergeConfig({ TWO_STEP_REGISTRATION: false }));

  it('is inert when the tenant has two-step registration off', () => {
    mergeConfig({ TWO_STEP_REGISTRATION: false });
    const { result } = renderTwoStepHook();
    const fields = [() => 'name'];
    expect(result.current.enabled).toBe(false);
    expect(result.current.accountFields(fields)).toBe(fields);
    expect(result.current.fieldProps('name')).toEqual({});
    expect(result.current.formProps).toEqual({});
    expect(result.current.submitLabel).toBeNull();
    const submit = jest.fn();
    result.current.submit(submit);
    expect(submit).toHaveBeenCalled();
    expect(result.current.validateProfile({}, true)).toBe(true);
  });

  it('does not register on the first submit (it only moves to the profile step)', () => {
    mergeConfig({ TWO_STEP_REGISTRATION: true });
    const { result } = renderTwoStepHook();
    const submit = jest.fn();
    expect(result.current.enabled).toBe(true);
    expect(result.current.formProps.step).toBe(1);
    result.current.submit(submit);
    expect(submit).not.toHaveBeenCalled();
  });
});
