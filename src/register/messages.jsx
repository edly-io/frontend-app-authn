import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'register.page.title': {
    id: 'register.page.title',
    defaultMessage: 'Register | {siteName}',
    description: 'register page title',
  },
  // Field labels
  'registration.fullname.label': {
    id: 'registration.fullname.label',
    defaultMessage: 'Full name*',
    description: 'Label that appears above fullname field',
  },
  'registration.email.label': {
    id: 'registration.email.label',
    defaultMessage: 'Email*',
    description: 'Label that appears above email field on register page',
  },
  'registration.username.label': {
    id: 'registration.username.label',
    defaultMessage: 'Public username*',
    description: 'Label that appears above username field',
  },
  'registration.password.label': {
    id: 'registration.password.label',
    defaultMessage: 'Password*',
    description: 'Label that appears above password field',
  },
  'registration.country.label': {
    id: 'registration.country.label',
    defaultMessage: 'Country/Region',
    description: 'Placeholder for the country options dropdown.',
  },
  'registration.opt.in.label': {
    id: 'registration.opt.in.label',
    defaultMessage: 'I agree that {siteName} may send me marketing messages.',
    description: 'Text for opt in option on register page.',
  },
  // Help text
  'help.text.name': {
    id: 'help.text.name',
    defaultMessage: 'This name will be used by any certificates that you earn.',
    description: 'Help text for fullname field on registration page',
  },
  'help.text.username.1': {
    id: 'help.text.username.1',
    defaultMessage: 'The name that will identify you in your courses.',
    description: 'Part of help text for username field on registration page',
  },
  'help.text.username.2': {
    id: 'help.text.username.2',
    defaultMessage: 'This can not be changed later.',
    description: 'Part of help text for username field on registration page',
  },
  'help.text.email': {
    id: 'help.text.email',
    defaultMessage: 'For account activation and important updates',
    description: 'Help text for email field on registration page',
  },
  // Form buttons
  'create.account.for.free.button': {
    id: 'create.account.for.free.button',
    defaultMessage: 'Create an account for free',
    description: 'Label text for registration form submission button',
  },
  'register.step.continue.button': {
    id: 'register.step.continue.button',
    defaultMessage: 'Continue to profile & ID',
    description: 'Button on step 1 of the two-step registration that moves to the profile step',
  },
  'register.step.back.link': {
    id: 'register.step.back.link',
    defaultMessage: 'Back',
    description: 'Link on step 2 of the two-step registration that returns to the account step',
  },
  'register.step.indicator': {
    id: 'register.step.indicator',
    defaultMessage: 'Step {step} of 2',
    description: 'Indicator above the two-step registration form',
  },
  'register.step.heading.account': {
    id: 'register.step.heading.account',
    defaultMessage: 'Create Account',
    description: 'Heading of step 1 of the two-step registration',
  },
  'register.step.already.registered': {
    id: 'register.step.already.registered',
    defaultMessage: 'Already registered?',
    description: 'Text before the sign in link on step 1 of the two-step registration',
  },
  'register.step.heading.profile': {
    id: 'register.step.heading.profile',
    defaultMessage: 'Profile & ID',
    description: 'Heading of step 2 of the two-step registration',
  },
  'register.step.profile.subtitle': {
    id: 'register.step.profile.subtitle',
    defaultMessage: 'We use this to verify your identity. It\'s never shown publicly.',
    description: 'Subtitle of step 2 of the two-step registration',
  },
  'register.step.create.account.button': {
    id: 'register.step.create.account.button',
    defaultMessage: 'Create account',
    description: 'Submit button on step 2 of the two-step registration',
  },
  'register.step.terms.footer': {
    id: 'register.step.terms.footer',
    defaultMessage: 'By creating an account you agree to our {terms} and {privacyPolicy}.',
    description: 'Footer text under the submit button of the two-step registration',
  },
  'register.step.terms': {
    id: 'register.step.terms',
    defaultMessage: 'Terms',
    description: 'Link text for the terms in the two-step registration footer',
  },
  'register.step.username.hint': {
    id: 'register.step.username.hint',
    defaultMessage: '3–30 characters. Shown on your public profile.',
    description: 'Hint under the username field of the two-step registration',
  },
  'register.step.password.hint': {
    id: 'register.step.password.hint',
    defaultMessage: 'Use 8+ characters with a mix of letters, numbers and symbols.',
    description: 'Hint under the password strength bar of the two-step registration',
  },
  'register.step.name.label': {
    id: 'register.step.name.label', defaultMessage: 'Full name', description: 'Two-step registration label',
  },
  'register.step.name.placeholder': {
    id: 'register.step.name.placeholder',
    defaultMessage: 'Enter your full name',
    description: 'Two-step registration placeholder',
  },
  'register.step.username.label': {
    id: 'register.step.username.label', defaultMessage: 'Public username', description: 'Two-step registration label',
  },
  'register.step.username.placeholder': {
    id: 'register.step.username.placeholder',
    defaultMessage: 'Choose a username',
    description: 'Two-step registration placeholder',
  },
  'register.step.email.label': {
    id: 'register.step.email.label', defaultMessage: 'Email address', description: 'Two-step registration label',
  },
  'register.step.email.placeholder': {
    id: 'register.step.email.placeholder',
    defaultMessage: 'name@example.com',
    description: 'Two-step registration placeholder',
  },
  'register.step.password.label': {
    id: 'register.step.password.label', defaultMessage: 'Password', description: 'Two-step registration label',
  },
  'register.step.password.placeholder': {
    id: 'register.step.password.placeholder',
    defaultMessage: 'Create a password',
    description: 'Two-step registration placeholder',
  },
  'tpdco.trn.invalid': {
    id: 'tpdco.trn.invalid',
    defaultMessage: 'TRN must be 9 digits in the format ###-###-###.',
    description: 'Error for an invalid TRN in the TPDCO registration',
  },
  'tpdco.phone.invalid': {
    id: 'tpdco.phone.invalid',
    defaultMessage: 'Phone number must start with \'+\' (optional) followed by digits (0-9) only.',
    description: 'Error for an invalid telephone number in the TPDCO registration',
  },
  'tpdco.max.length': {
    id: 'tpdco.max.length',
    defaultMessage: 'Ensure this value has at most {max} characters (it has {count}).',
    description: 'Error for a value that is too long in the TPDCO registration',
  },
  'tpdco.choice.invalid': {
    id: 'tpdco.choice.invalid',
    defaultMessage: 'Select a valid choice.',
    description: 'Error for a dropdown value that is not one of the options',
  },
  'tpdco.date.invalid': {
    id: 'tpdco.date.invalid',
    defaultMessage: 'Enter a valid date.',
    description: 'Error for an invalid date in the TPDCO registration',
  },
  'register.step.account.title': {
    id: 'register.step.account.title',
    defaultMessage: 'Account details',
    description: 'Title of step 1 of the two-step registration',
  },
  'register.step.profile.title': {
    id: 'register.step.profile.title',
    defaultMessage: 'Profile & ID verification',
    description: 'Title of step 2 of the two-step registration',
  },
  'create.account.cta.button': {
    id: 'create.account.cta.button',
    defaultMessage: '{label}',
    description: 'Label text for registration form submission button for those users who are landing through redirections',
  },
  // Institution login
  'register.institution.login.page.title': {
    id: 'register.institution.login.page.title',
    defaultMessage: 'Register with institution/campus credentials',
    description: 'Heading of institution page',
  },
  // Validation messages
  'empty.name.field.error': {
    id: 'empty.name.field.error',
    defaultMessage: 'Enter your full name',
    description: 'Error message for empty fullname field',
  },
  'empty.email.field.error': {
    id: 'empty.email.field.error',
    defaultMessage: 'Enter your email',
    description: 'Error message for empty email field',
  },
  'empty.username.field.error': {
    id: 'empty.username.field.error',
    defaultMessage: 'Username must be between 2 and 30 characters',
    description: 'Error message for empty username field',
  },
  'empty.password.field.error': {
    id: 'empty.password.field.error',
    defaultMessage: 'Password criteria has not been met',
    description: 'Error message for empty password field',
  },
  'empty.country.field.error': {
    id: 'empty.country.field.error',
    defaultMessage: 'Select your country or region of residence',
    description: 'Error message when no country/region is selected',
  },
  'invalid.country.field.error': {
    id: 'invalid.country.field.error',
    defaultMessage: 'Country must match with an option available in the dropdown.',
    description: 'Error message when country is invalid',
  },
  'email.do.not.match': {
    id: 'email.do.not.match',
    defaultMessage: 'The email addresses do not match.',
    description: 'Email not match to confirm email',
  },
  'email.invalid.format.error': {
    id: 'email.invalid.format.error',
    defaultMessage: 'Enter a valid email address',
    description: 'Validation error for invalid email address',
  },
  'username.validation.message': {
    id: 'username.validation.message',
    defaultMessage: 'Username must be between 2 and 30 characters',
    description: 'Error message for empty username field',
  },
  'name.validation.message': {
    id: 'name.validation.message',
    defaultMessage: 'Enter a valid name',
    description: 'Validation message that appears when fullname contain URL',
  },
  'password.validation.message': {
    id: 'password.validation.message',
    defaultMessage: 'Password criteria has not been met',
    description: 'Error message for empty or invalid password',
  },
  'password.do.not.match': {
    id: 'password.do.not.match',
    defaultMessage: 'The passwords do not match.',
    description: 'Password not match to confirm password',
  },
  'username.format.validation.message': {
    id: 'username.format.validation.message',
    defaultMessage: 'Usernames can only contain letters (A-Z, a-z), numerals (0-9), underscores (_), and hyphens (-). Usernames cannot contain spaces',
    description: 'Validation message that appears when username format is invalid',
  },
  // Error messages
  'registration.request.failure.header': {
    id: 'registration.request.failure.header',
    defaultMessage: 'We couldn\'t create your account.',
    description: 'error message when registration failure.',
  },
  'registration.empty.form.submission.error': {
    id: 'registration.empty.form.submission.error',
    defaultMessage: 'Please check your responses and try again.',
    description: 'Error message that appears on top of the form when empty form is submitted',
  },
  'registration.request.server.error': {
    id: 'registration.request.server.error',
    defaultMessage: 'An error has occurred. Try refreshing the page, or check your internet connection.',
    description: 'Error message for internal server error.',
  },
  'registration.rate.limit.error': {
    id: 'registration.rate.limit.error',
    defaultMessage: 'Too many failed registration attempts. Try again later.',
    description: 'Error message that appears when an anonymous user has made too many failed registration attempts',
  },
  'registration.tpa.session.expired': {
    id: 'registration.tpa.session.expired',
    defaultMessage: 'Registration using {provider} has timed out.',
    description: '',
  },
  'registration.forbidden.username': {
    id: 'registration.forbidden.username',
    defaultMessage: 'Usernames can\'t include words that could be mistaken for course roles. Please choose a different username.',
    description: '',
  },
  'registration.tpa.authentication.failure': {
    id: 'registration.tpa.authentication.failure',
    defaultMessage: 'We are sorry, you are not authorized to access {platform_name} via this channel. '
        + 'Please contact your learning administrator or manager in order to access {platform_name}.'
        + '{lineBreak}{lineBreak}Error Details:{lineBreak}{errorMessage}',
    description: 'Error message third party authentication pipeline fails',
  },
  // Terms of Service and Honor Code
  'terms.of.service.and.honor.code': {
    id: 'terms.of.service.and.honor.code',
    defaultMessage: 'Terms of Service and Honor Code',
    description: 'Text for the hyperlink that redirects user to terms of service and honor code',
  },
  'privacy.policy': {
    id: 'privacy.policy',
    defaultMessage: 'Privacy Policy',
    description: 'Text for the hyperlink that redirects user to privacy policy',
  },
  'honor.code': {
    id: 'honor.code',
    defaultMessage: 'Honor Code',
    description: 'Text for the hyperlink that redirects user to the honor code',
  },
  'terms.of.service': {
    id: 'terms.of.service',
    defaultMessage: 'Terms of Service',
    description: 'Text for the hyperlink that redirects user to the terms of service',
  },
  // miscellaneous strings
  'registration.username.suggestion.label': {
    id: 'registration.username.suggestion.label',
    defaultMessage: 'Suggested:',
    description: 'Suggested usernames label text.',
  },
  'did.you.mean.alert.text': {
    id: 'did.you.mean.alert.text',
    defaultMessage: 'Did you mean',
    description: 'Did you mean alert suggestion',
  },
});

export default messages;
