// Login Error Codes
export const TWO_FACTOR_AUTH_REQUIRED = '2fa-required';
export const TWO_FACTOR_AUTH_INVALID_OTP = '2fa-invalid-otp';
export const TWO_FACTOR_AUTH_SESSION_EXPIRED = '2fa-session-expired';
export const TWO_FACTOR_AUTH_RESEND_RATE_LIMITED = '2fa-resend-rate-limited';
export const INACTIVE_USER = 'inactive-user';
export const INTERNAL_SERVER_ERROR = 'internal-server-error';
export const INVALID_FORM = 'invalid-form';
export const NON_COMPLIANT_PASSWORD_EXCEPTION = 'NonCompliantPasswordException';
export const FORBIDDEN_REQUEST = 'forbidden-request';
export const FAILED_LOGIN_ATTEMPT = 'failed-login-attempt';
export const ACCOUNT_LOCKED_OUT = 'account-locked-out';
export const INCORRECT_EMAIL_PASSWORD = 'incorrect-email-or-password';
export const NUDGE_PASSWORD_CHANGE = 'nudge-password-change';
export const REQUIRE_PASSWORD_CHANGE = 'require-password-change';
export const ALLOWED_DOMAIN_LOGIN_ERROR = 'allowed-domain-login-error';
export const TPA_AUTHENTICATION_FAILURE = 'tpa-authentication-failure';

// Account Activation Message
export const ACCOUNT_ACTIVATION_MESSAGE = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
};
