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
    defaultMessage: 'Full name',
    description: 'Label that appears above fullname field',
  },
  'registration.email.label': {
    id: 'registration.email.label',
    defaultMessage: 'Email',
    description: 'Label that appears above email field on register page',
  },
  'registration.username.label': {
    id: 'registration.username.label',
    defaultMessage: 'Public username',
    description: 'Label that appears above username field',
  },
  'registration.national_id.label': {
    id: 'registration.national_id.label',
    defaultMessage: 'Saudi National Id (Optional)',
    description: 'Label that appears above username field',
  },
  'registration.phone_number.label': {
    id: 'registration.phone_number.label',
    defaultMessage: 'Phone',
    description: 'Label that appears above phone field',
  },
  'registration.date_of_birth.label': {
    id: 'registration.date_of_birth.label',
    defaultMessage: 'Date of birth',
    description: 'Label that appears above date of birth field',
  },
  'registration.linkedin_account.label': {
    id: 'registration.linkedin_account.label',
    defaultMessage: 'LinkedIn Account (Optional)',
    description: 'Label that appears above linkedin account field',
  },
  'registration.password.label': {
    id: 'registration.password.label',
    defaultMessage: 'Password',
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
  'help.text.national_id': {
    id: 'help.text.national_id',
    defaultMessage: 'Saudi National Id',
    description: 'Part of help text for username field on registration page',
  },
  'help.text.linkedin_account': {
    id: 'help.text.linkedin_account',
    defaultMessage: 'Enter you linkedin profile link',
    description: 'Part of help text for username field on registration page',
  },
  'help.text.phone_number': {
    id: 'help.text.phone_number',
    defaultMessage: 'It can only be a number',
    description: 'Part of help text for username field on registration page',
  },
  'help.text.email': {
    id: 'help.text.email',
    defaultMessage: 'For account activation and important updates',
    description: 'Help text for email field on registration page',
  },
  'help.text.date_of_birth': {
    id: 'help.text.date_of_birth',
    defaultMessage: 'Enter your date of birth',
    description: 'Please Select your date of birth',
  },
  // Form buttons
  'create.account.for.free.button': {
    id: 'create.account.for.free.button',
    defaultMessage: 'Create an account for free',
    description: 'Label text for registration form submission button',
  },
  'proceed.account.creation.free.button': {
    id: 'proceed.account.creation.free.button',
    defaultMessage: 'Proceed account creation for free',
    description: 'Label text for registration form submission button',
  },
  'registration.other.options.heading': {
    id: 'registration.other.options.heading',
    defaultMessage: 'Or register with:',
    description: 'A message that appears above third party auth providers i.e saml, google, facebook etc',
  },
  // Institution login
  'register.institution.login.button': {
    id: 'register.institution.login.button',
    defaultMessage: 'Institution/campus credentials',
    description: 'shows institutions list',
  },
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
  'empty.phone_number.field.error': {
    id: 'empty.phone_number.field.error',
    defaultMessage: 'Enter your phone number',
    description: 'Error message for empty phone_number field',
  },
  'empty.date_of_birth.field.error': {
    id: 'empty.date_of_birth.field.error',
    defaultMessage: 'Enter your date of birth',
    description: 'Error message for empty date of birth field',
  },
  'empty.gender.field.error': {
    id: 'empty.gender.field.error',
    defaultMessage: 'Please select your gender',
    description: 'Error message for not selecting gender field',
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
  'phone_number.validation.message': {
    id: 'phone_number.validation.message',
    defaultMessage: 'Enter a valid phone number',
    description: 'Validation message that appears when fullname contain URL',
  },
  'password.validation.message': {
    id: 'password.validation.message',
    defaultMessage: 'Password criteria has not been met',
    description: 'Error message for empty or invalid password',
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
  // nafath sign up form headings and options
  'personal.information.text': {
    id: 'personal.information.text',
    defaultMessage: 'Personal Information',
    description: 'Nafath Sign Up Form Heading',
  },
  'gender.heading.text': {
    id: 'gender.heading.text',
    defaultMessage: 'Gender: ',
    description: 'Nafath Sign Up Form Gender Heading',
  },
  'gender.option.male.text': {
    id: 'gender.option.male.text',
    defaultMessage: 'Male',
    description: 'Nafath Sign Up Form Gender option male',
  },
  'gender.option.female.text': {
    id: 'gender.option.female.text',
    defaultMessage: 'Female',
    description: 'Nafath Sign Up Form Gender option female',
  },
  'gender.option.other.text': {
    id: 'gender.option.other.text',
    defaultMessage: 'Other/Prefer Not to Say',
    description: 'Nafath Sign Up Form Gender option other',
  },
});

export default messages;
