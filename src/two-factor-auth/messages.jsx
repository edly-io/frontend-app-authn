import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'two.factor.auth.page.title': {
    id: 'two.factor.auth.page.title',
    defaultMessage: 'Verify your identity | {siteName}',
    description: 'Two-factor auth page title',
  },
  'two.factor.auth.page.heading': {
    id: 'two.factor.auth.page.heading',
    defaultMessage: 'Enter verification code',
    description: 'The page heading for the two-factor auth verification page.',
  },
  'two.factor.auth.page.description': {
    id: 'two.factor.auth.page.description',
    defaultMessage: 'We sent a 6-digit verification code to {email}. Enter it below to finish signing in.',
    description: 'Instructions shown on the two-factor auth verification page.',
  },
  'two.factor.auth.code.label': {
    id: 'two.factor.auth.code.label',
    defaultMessage: 'Verification code',
    description: 'Label for the OTP code input field.',
  },
  'two.factor.auth.submit.button': {
    id: 'two.factor.auth.submit.button',
    defaultMessage: 'Verify',
    description: 'Submit button text for the OTP form.',
  },
  'two.factor.auth.resend.button': {
    id: 'two.factor.auth.resend.button',
    defaultMessage: 'Resend code',
    description: 'Resend OTP code button text.',
  },
  'two.factor.auth.resend.success': {
    id: 'two.factor.auth.resend.success',
    defaultMessage: 'A new verification code has been sent.',
    description: 'Message shown after a successful OTP resend.',
  },
  'two.factor.auth.cancel.link': {
    id: 'two.factor.auth.cancel.link',
    defaultMessage: 'Use a different account',
    description: 'Link text to cancel the OTP flow and return to the login page.',
  },
  'two.factor.auth.error.otp-session-not-found': {
    id: 'two.factor.auth.error.otp-session-not-found',
    defaultMessage: 'Your verification session has expired. Please log in again.',
    description: 'Error shown when the OTP session is not found.',
  },
  'two.factor.auth.error.otp-expired': {
    id: 'two.factor.auth.error.otp-expired',
    defaultMessage: 'This code has expired. Please request a new one.',
    description: 'Error shown when the OTP code has expired.',
  },
  'two.factor.auth.error.otp-attempts-exceeded': {
    id: 'two.factor.auth.error.otp-attempts-exceeded',
    defaultMessage: 'Too many incorrect attempts. Please request a new code.',
    description: 'Error shown when the maximum OTP attempts have been exceeded.',
  },
  'two.factor.auth.error.otp-incorrect': {
    id: 'two.factor.auth.error.otp-incorrect',
    defaultMessage: 'That code is incorrect. Please try again.',
    description: 'Error shown when the submitted OTP code is incorrect.',
  },
  'two.factor.auth.error.otp-resend-cooldown': {
    id: 'two.factor.auth.error.otp-resend-cooldown',
    defaultMessage: 'Please wait a little longer before requesting another code.',
    description: 'Error shown when a resend is attempted during the cooldown period.',
  },
  'two.factor.auth.error.invalid-request': {
    id: 'two.factor.auth.error.invalid-request',
    defaultMessage: 'Something went wrong. Please try again.',
    description: 'Generic fallback error for the OTP flow.',
  },
});

export default messages;
