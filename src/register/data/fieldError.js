/**
 * Backend extension-form fields send ``error_message`` as a Django error_messages dict
 * ({ required: '...' }) instead of a string; normalise to a string.
 * @param message
 * @returns {string}
 */
const getFieldErrorMessage = (message) => (
  typeof message === 'string' ? message : message?.required || ''
);

export default getFieldErrorMessage;
