import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'legacy.account.page.title': {
    id: 'legacy.account.page.title',
    defaultMessage: 'Legacy account | {siteName}',
    description: 'Title tag for the legacy account set-password page.',
  },
  'legacy.account.page.heading': {
    id: 'legacy.account.page.heading',
    defaultMessage: 'Already have an account on legacy Rwaq?',
    description: 'Heading of the legacy account set-password page.',
  },
  'legacy.account.page.instructions': {
    id: 'legacy.account.page.instructions',
    defaultMessage: 'Had an account on the <link>old Rwaq platform</link>? Enter that email and we will send you a link to set your password — no need to register again.',
    description: 'Instructions shown on the legacy account set-password page. <link> wraps the text linking to the old platform.',
  },
  'legacy.account.forgot.hint.prefix': {
    id: 'legacy.account.forgot.hint.prefix',
    defaultMessage: 'Already set a password?',
    description: 'Prefix of the hint that points users who already have a password to the forgot-password flow.',
  },
  'legacy.account.forgot.password.link': {
    id: 'legacy.account.forgot.password.link',
    defaultMessage: 'Reset it here',
    description: 'Link text that takes the user to the forgot-password page.',
  },
  'legacy.account.email.field.label': {
    id: 'legacy.account.email.field.label',
    defaultMessage: 'Email',
    description: 'Email field label on the legacy account page.',
  },
  'legacy.account.email.help.text': {
    id: 'legacy.account.email.help.text',
    defaultMessage: 'The email address you used to sign in to {platformName} on the legacy platform.',
    description: 'Help text for the email field on the legacy account page.',
  },
  'legacy.account.submit.button': {
    id: 'legacy.account.submit.button',
    defaultMessage: 'Send set-password link',
    description: 'Submit button label on the legacy account page.',
  },
  'legacy.account.sign.in.text': {
    id: 'legacy.account.sign.in.text',
    defaultMessage: 'Sign in',
    description: 'Label of the tab that navigates back to the sign-in page.',
  },
  'legacy.account.empty.email.error': {
    id: 'legacy.account.empty.email.error',
    defaultMessage: 'Enter your email address',
    description: 'Validation error shown when the email field is left empty.',
  },
  'legacy.account.invalid.email.error': {
    id: 'legacy.account.invalid.email.error',
    defaultMessage: 'Enter a valid email address',
    description: 'Validation error shown when the email address is not valid.',
  },
  'legacy.account.success.heading': {
    id: 'legacy.account.success.heading',
    defaultMessage: 'Check your email',
    description: 'Heading of the success alert after submitting the legacy account form.',
  },
  'legacy.account.success.message': {
    id: 'legacy.account.success.message',
    defaultMessage: 'If this email is registered on the <link>old Rwaq platform</link>, we will send you an email to set your password. If you have already set one, use Forgot password to sign in instead.',
    description: 'Generic success message shown regardless of whether the email belongs to a legacy account; also points users who already have a password to the forgot-password flow.',
  },
  'legacy.account.error.message': {
    id: 'legacy.account.error.message',
    defaultMessage: 'Something went wrong. Please try again in a little while.',
    description: 'Error message shown when the set-password request fails.',
  },
});

export default messages;
