import { Provider } from 'react-redux';

import { mergeConfig } from '@edx/frontend-platform';
import { getLocale, IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import { PROFILE_STEP_ROWS } from '../../data/twoStepConstants';
import TwoStepProfileFields from '../TwoStepProfileFields';

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  getLocale: jest.fn(),
}));

const mockStore = configureStore();

describe('TwoStepProfileFields', () => {
  const fieldDescriptions = {
    confirm_password: {
      name: 'confirm_password', type: 'password', label: 'Confirm Password*', error_message: 'Match',
    },
    parish: {
      name: 'parish',
      type: 'select',
      label: 'Parish',
      options: [['St Ann', 'St Ann']],
      error_message: { required: 'Please select your parish.' },
    },
    region: {
      name: 'region', type: 'text', label: 'Region', error_message: { required: 'Please select your parish.' },
    },
  };
  beforeEach(() => {
    getLocale.mockReturnValue('en');
    mergeConfig({
      ENABLE_DYNAMIC_REGISTRATION_FIELDS: true, SHOW_CONFIGURABLE_EDX_FIELDS: false, MARKETING_EMAILS_OPT_IN: false,
    });
  });

  const renderForm = (step, extra = {}) => render(
    <IntlProvider locale="en">
      <Provider store={mockStore({ register: { validationApiRateLimited: false } })}>
        <TwoStepProfileFields
          email="a@b.com"
          password="x"
          fieldErrors={{}}
          formFields={{}}
          setFieldErrors={jest.fn()}
          setFormFields={jest.fn()}
          fieldDescriptions={fieldDescriptions}
          step={step}
          {...extra}
        />
      </Provider>
    </IntlProvider>,
  );

  it('shows only the account-step fields on step 1', () => {
    const { container } = renderForm(1);
    expect(container.querySelector('input[name="confirm_password"]')).not.toBeNull();
    expect(container.querySelector('select[name="parish"]')).toBeNull();
  });

  it('shows profile fields with a read-only region on step 2 and fills region from parish', () => {
    const setFormFields = jest.fn();
    const { container } = renderForm(2, { setFormFields });
    expect(container.querySelector('input[name="confirm_password"]')).toBeNull();
    expect(container.querySelector('input[name="region"]').readOnly).toBe(true);

    fireEvent.change(container.querySelector('select[name="parish"]'), { target: { value: 'St Ann' } });
    const update = setFormFields.mock.calls[0][0];
    expect(update({})).toEqual({ parish: 'St Ann', region: 'Ocho Rios' });
  });

  it('renders every profile-step field in the Figma layout, pairing fields per row', () => {
    // One description per hardcoded name, as the backend sends them; a name missing here fails the test.
    const selects = ['gender', 'photo_id_type', 'parish'];
    const descriptions = Object.fromEntries(PROFILE_STEP_ROWS.flat().map(name => [name, {
      name,
      label: name,
      type: selects.includes(name) ? 'select' : 'text',
      options: [['a', 'A']],
      error_message: '',
    }]));
    const { container } = renderForm(2, { fieldDescriptions: descriptions });

    PROFILE_STEP_ROWS.forEach(row => {
      const rowNode = container.querySelector(`[name="${row[0]}"]`).closest('.two-step-reg__row');
      row.forEach(name => {
        expect(rowNode.querySelector(`[name="${name}"]`)).not.toBeNull();
      });
      expect(rowNode.querySelectorAll('input, select')).toHaveLength(row.length);
    });
    const order = [...container.querySelectorAll('input, select')].map(node => node.name);
    expect(order).toEqual(PROFILE_STEP_ROWS.flat());
  });

  it('does not mark a blurred empty field with a dict error as an object', () => {
    const setFieldErrors = jest.fn();
    const { container } = renderForm(2, { setFieldErrors });
    fireEvent.blur(container.querySelector('input[name="region"]'), { target: { value: '' } });
    const update = setFieldErrors.mock.calls[0][0];
    expect(update({}).region).toEqual('Please select your parish.');
  });
});
