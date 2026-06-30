// Mirrors the backend's SpecialCharacterValidator character set (edly_features_app.validators)
// so the displayed password requirements agree with what the server will actually accept.
// Kept separate from data/constants.js so this stronger policy's diff doesn't touch the
// shared constants file.
export const UPPERCASE_REGEX = /[A-Z]/;
export const LOWERCASE_REGEX = /[a-z]/;
export const SYMBOL_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/;
export const MIN_PASSWORD_LENGTH = 12;
