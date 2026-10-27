import { getProfileFieldError, getToday, validateProfileFields } from '../profileRules';

// Echoes the message id so assertions do not depend on copy.
const formatMessage = (message, values) => `${message.id}${values ? JSON.stringify(values) : ''}`;
const required = { required: 'Required.' };
const error = (name, value, description = {}) => getProfileFieldError(name, value, description, formatMessage);

describe('Registration profile field rules', () => {
  it('trn: accepts 9 digits with or without separators', () => {
    ['123456789', '123-456-789', '123 456 789', ' 123456789 '].forEach(value => expect(error('trn', value)).toBe(''));
  });

  it('trn: rejects wrong digit counts and non-digits with the format message', () => {
    ['12345678', '1234567890', '12a456789'].forEach(value => expect(error('trn', value)).toBe('registration.profile.trn.invalid'));
  });

  it('trn: allows up to 20 typed characters and flags more', () => {
    expect(error('trn', '123 - 456 - 789')).toBe('');
    expect(error('trn', '1'.repeat(21))).toContain('registration.profile.max.length');
  });

  it.each([
    ['physical_address', 255],
    ['other_numbers', 50],
    ['job_title', 100],
    ['photo_id_number', 100],
    ['telephone', 50],
  ])('%s: allows %i characters and flags one more', (name, max) => {
    expect(error(name, '1'.repeat(max))).not.toContain('registration.profile.max.length');
    expect(error(name, '1'.repeat(max + 1))).toContain('registration.profile.max.length');
  });

  it('mailing_address has no length rule', () => {
    expect(error('mailing_address', 'x'.repeat(5000))).toBe('');
  });

  it.each(['telephone', 'other_numbers'])('%s: mirrors core phone_regex (digits, optional leading +)', (name) => {
    ['+18765550100', '8765550100', '+1', ''].forEach(value => expect(error(name, value)).toBe(''));
    ['876-555-0100', '+1 876', 'abc', '8+76', '87a65b50100'].forEach(value => expect(error(name, value)).toBe('registration.profile.phone.invalid'));
  });

  it('photo_id_type and parish must be one of the backend options', () => {
    const description = { options: [['Passport', 'Passport'], ['School ID', 'School ID']] };
    expect(error('photo_id_type', 'Passport', description)).toBe('');
    expect(error('photo_id_type', 'National ID', description)).toBe('registration.profile.choice.invalid');
    expect(error('parish', 'Kingston', { options: [['Kingston', 'Kingston']] })).toBe('');
    expect(error('parish', 'Mars', { options: [['Kingston', 'Kingston']] })).toBe('registration.profile.choice.invalid');
  });

  describe('id_expiration_date', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date(2026, 5, 15, 23, 30));
    });
    afterEach(() => jest.useRealTimers());

    it('getToday is the local date as YYYY-MM-DD', () => {
      expect(getToday()).toBe('2026-06-15');
    });

    it('must be a real ISO date', () => {
      ['2030-01-31', '2028-02-29'].forEach(value => expect(error('id_expiration_date', value)).toBe(''));
      ['2030-02-30', '2030-13-01', '01/31/30', '2030-1-31', 'tomorrow'].forEach(
        value => expect(error('id_expiration_date', value)).toBe('registration.profile.date.invalid'),
      );
    });

    it('may be today or later but not earlier', () => {
      ['2026-06-15', '2026-06-16', '2030-01-31'].forEach(value => expect(error('id_expiration_date', value)).toBe(''));
      ['2026-06-14', '1999-12-31'].forEach(
        value => expect(error('id_expiration_date', value)).toBe('registration.profile.date.past'),
      );
    });
  });

  it('mailing_address is always required, with the backend message when there is one', () => {
    const errorsFor = (value, description) => validateProfileFields(
      { mailing_address: value }, { mailing_address: description }, formatMessage,
    );
    expect(errorsFor('', {})).toEqual({ mailing_address: 'registration.profile.mailing_address.required' });
    expect(errorsFor('  ', { error_message: '' })).toEqual({ mailing_address: 'registration.profile.mailing_address.required' });
    expect(errorsFor('', { error_message: required })).toEqual({ mailing_address: 'Required.' });
    expect(errorsFor('PO Box 1', {})).toEqual({});
  });

  it('whitespace-only values are errors for required fields only', () => {
    expect(error('job_title', '   ', { error_message: required })).toBe('Required.');
    expect(error('other_numbers', '   ', { error_message: '' })).toBe('');
    expect(error('job_title', '', { error_message: required })).toBe('');
  });

  it('validateProfileFields returns only the invalid fields present in the descriptions', () => {
    const descriptions = { trn: { error_message: required }, telephone: { error_message: required } };
    expect(validateProfileFields({ trn: '1', telephone: '+18765550100', job_title: 'x'.repeat(500) }, descriptions, formatMessage))
      .toEqual({ trn: 'registration.profile.trn.invalid' });
  });
});
