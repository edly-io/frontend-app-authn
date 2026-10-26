import { getProfileFieldError, validateProfileFields } from '../profileRules';

// Echoes the message id so assertions do not depend on copy.
const formatMessage = (message, values) => `${message.id}${values ? JSON.stringify(values) : ''}`;
const required = { required: 'Required.' };
const error = (name, value, description = {}) => getProfileFieldError(name, value, description, formatMessage);

describe('TPDCO profile field rules', () => {
  it('trn: accepts 9 digits with or without separators', () => {
    ['123456789', '123-456-789', '123 456 789', ' 123456789 '].forEach(value => expect(error('trn', value)).toBe(''));
  });

  it('trn: rejects wrong digit counts and non-digits with the format message', () => {
    ['12345678', '1234567890', '12a456789'].forEach(value => expect(error('trn', value)).toBe('tpdco.trn.invalid'));
  });

  it('trn: allows up to 20 typed characters and flags more', () => {
    expect(error('trn', '123 - 456 - 789')).toBe('');
    expect(error('trn', '1'.repeat(21))).toContain('tpdco.max.length');
  });

  it.each([
    ['physical_address', 255],
    ['other_numbers', 50],
    ['job_title', 100],
    ['photo_id_number', 100],
    ['telephone', 50],
  ])('%s: allows %i characters and flags one more', (name, max) => {
    expect(error(name, '1'.repeat(max))).not.toContain('tpdco.max.length');
    expect(error(name, '1'.repeat(max + 1))).toContain('tpdco.max.length');
  });

  it('mailing_address has no length rule', () => {
    expect(error('mailing_address', 'x'.repeat(5000))).toBe('');
  });

  it('telephone: mirrors core phone_regex (digits, optional leading +)', () => {
    ['+18765550100', '8765550100', '+1', ''].forEach(value => expect(error('telephone', value)).toBe(''));
    ['876-555-0100', '+1 876', 'abc', '8+76'].forEach(value => expect(error('telephone', value)).toBe('tpdco.phone.invalid'));
  });

  it('photo_id_type and parish must be one of the backend options', () => {
    const description = { options: [['Passport', 'Passport'], ['School ID', 'School ID']] };
    expect(error('photo_id_type', 'Passport', description)).toBe('');
    expect(error('photo_id_type', 'National ID', description)).toBe('tpdco.choice.invalid');
    expect(error('parish', 'Kingston', { options: [['Kingston', 'Kingston']] })).toBe('');
    expect(error('parish', 'Mars', { options: [['Kingston', 'Kingston']] })).toBe('tpdco.choice.invalid');
  });

  it('id_expiration_date must be a real ISO date, with no future-date rule', () => {
    ['2030-01-31', '2028-02-29', '1999-12-31'].forEach(value => expect(error('id_expiration_date', value)).toBe(''));
    ['2030-02-30', '2030-13-01', '01/31/30', '2030-1-31', 'tomorrow'].forEach(
      value => expect(error('id_expiration_date', value)).toBe('tpdco.date.invalid'),
    );
  });

  it('whitespace-only values are errors for required fields only', () => {
    expect(error('job_title', '   ', { error_message: required })).toBe('Required.');
    expect(error('other_numbers', '   ', { error_message: '' })).toBe('');
    expect(error('job_title', '', { error_message: required })).toBe('');
  });

  it('validateProfileFields returns only the invalid fields present in the descriptions', () => {
    const descriptions = { trn: { error_message: required }, telephone: { error_message: required } };
    expect(validateProfileFields({ trn: '1', telephone: '+18765550100', job_title: 'x'.repeat(500) }, descriptions, formatMessage))
      .toEqual({ trn: 'tpdco.trn.invalid' });
  });
});
