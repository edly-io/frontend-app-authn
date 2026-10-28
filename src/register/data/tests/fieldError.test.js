import getFieldErrorMessage from '../fieldError';

describe('getFieldErrorMessage', () => {
  it('returns strings unchanged and unwraps Django error_messages dicts', () => {
    expect(getFieldErrorMessage('Required')).toEqual('Required');
    expect(getFieldErrorMessage({ required: 'Please enter your TRN.' })).toEqual('Please enter your TRN.');
    expect(getFieldErrorMessage(undefined)).toEqual('');
  });
});
