import validateName from './validator';

describe('validateName', () => {
  const formatMessage = jest.fn(msg => msg.id);

  it.each([
    ['digits and symbols', '54545%%%'],
    ['trailing digit', 'John2'],
    ['only digits', '12345'],
    ['only symbols', '!!!'],
    ['at sign', 'a@b'],
    ['html', '<b>'],
    ['url', 'http://example.com'],
    ['leading space then symbol', ' $name'],
  ])('rejects %s', (_label, value) => {
    expect(validateName(value, formatMessage)).toBe('name.validation.message');
  });

  it.each([
    ['plain name', 'Ali Khan'],
    ['apostrophe', "O'Brien"],
    ['hyphen', 'Jean-Luc'],
    ['period', 'Dr. Ali'],
    ['accented letters', 'José Müller'],
    ['arabic', 'محمد علي'],
    ['arabic with diacritics', 'مُحَمَّد'],
    ['surrounding spaces', '  Ali  '],
  ])('accepts %s', (_label, value) => {
    expect(validateName(value, formatMessage)).toBe('');
  });

  it('asks for a name when empty', () => {
    expect(validateName('  ', formatMessage)).toBe('empty.name.field.error');
  });
});
