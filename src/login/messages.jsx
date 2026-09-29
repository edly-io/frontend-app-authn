import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'login.page.title': {
    id: 'login.page.title',
    defaultMessage: 'Login | {siteName}',
    description: 'login page title',
  },
  // Login labels
  'login.user.identity.label': {
    id: 'login.user.identity.label',
    defaultMessage: 'Username or email',
    description: 'Label for user identity field to enter either username or email to login',
  },
  'login.password.label': {
    id: 'login.password.label',
    defaultMessage: 'Password',
    description: 'Label for password field',
  },
  'sign.in.button': {
    id: 'sign.in.button',
    defaultMessage: 'Sign in',
    description: 'Sign in button label that appears on login page',
  },
  'forgot.password': {
    id: 'forgot.password',
    defaultMessage: 'Forgot password',
    description: 'Button text for forgot password',
  },
  'institution.login.button': {
    id: 'institution.login.button',
    defaultMessage: 'Institution/campus credentials',
    description: 'shows institutions list',
  },
  'institution.login.page.title': {
    id: 'institution.login.page.title',
    defaultMessage: 'Sign in with institution/campus credentials',
    description: 'Heading of institution page',
  },
  'institution.login.page.sub.heading': {
    id: 'institution.login.page.sub.heading',
    defaultMessage: 'Choose your institution from the list below',
    description: 'Heading of the institutions list',
  },
  'non.compliant.password.title': {
    id: 'non.compliant.password.title',
    defaultMessage: 'We recently changed our password requirements',
    description: 'A title that appears in bold before error message for non-compliant password',
  },
  'non.compliant.password.message': {
    id: 'non.compliant.password.message',
    defaultMessage: 'Your current password does not meet the new security requirements. '
                    + 'We just sent a password-reset message to the email address associated with this account. '
                    + 'Thank you for helping us keep your data safe.',
    description: 'Error message for non-compliant password',
  },
  'account.locked.out.message.1': {
    id: 'account.locked.out.message.1',
    defaultMessage: 'To protect your account, it\'s been temporarily locked. Try again in 30 minutes.',
    description: 'Part of message for when user account has been locked out after multiple failed login attempts',
  },
  'username.or.email.format.validation.less.chars.message': {
    id: 'username.or.email.format.validation.less.chars.message',
    defaultMessage: 'Username or email must have at least 2 characters.',
    description: 'Validation message that appears when username or email address is less than 2 characters',
  },
  'email.validation.message': {
    id: 'email.validation.message',
    defaultMessage: 'Enter your username or email',
    description: 'Validation message that appears when email is empty',
  },
  'password.validation.message': {
    id: 'password.validation.message',
    defaultMessage: 'Enter your password',
    description: 'Validation message that appears when password is empty',
  },
  // Account Activation Strings
  'account.activation.success.message.title': {
    id: 'account.activation.success.message.title',
    defaultMessage: 'Success! You have activated your account.',
    description: 'Account Activation success message title',
  },
  'account.activation.success.message': {
    id: 'account.activation.success.message',
    defaultMessage: 'You will now receive email updates and alerts from us related to the courses you are enrolled in. Sign in to continue.',
    description: 'Message show to learners when their account has been activated successfully',
  },
  'account.activation.info.message': {
    id: 'account.activation.info.message',
    defaultMessage: 'This account has already been activated.',
    description: 'Message shown when learner account has already been activated',
  },
  'account.activation.error.message.title': {
    id: 'account.activation.error.message.title',
    defaultMessage: 'Your account could not be activated',
    description: 'Account Activation error message title',
  },
  'account.activation.support.link': {
    id: 'account.activation.support.link',
    defaultMessage: 'contact support',
    description: 'Link text used in account activation error message to go to learner help center',
  },
  // Email Confirmation Strings
  'account.confirmation.success.message.title': {
    id: 'account.confirmation.success.message.title',
    defaultMessage: 'Success! You have confirmed your email.',
    description: 'Account verification success message title',
  },
  'account.confirmation.success.message': {
    id: 'account.confirmation.success.message',
    defaultMessage: 'Sign in to continue.',
    description: 'Message show to learners when their account has been activated successfully',
  },
  'account.confirmation.info.message': {
    id: 'account.confirmation.info.message',
    defaultMessage: 'This email has already been confirmed.',
    description: 'Message shown when learner account has already been verified',
  },
  'account.confirmation.error.message.title': {
    id: 'account.confirmation.error.message.title',
    defaultMessage: 'Your email could not be confirmed',
    description: 'Account verification error message title',
  },
  'tpa.account.link': {
    id: 'tpa.account.link',
    defaultMessage: '{provider} account',
    description: 'Link text error message used to go to SSO when staff user try to login through password.',
  },
  'internal.server.error.message': {
    id: 'internal.server.error.message',
    defaultMessage: 'An error has occurred. Try refreshing the page, or check your internet connection.',
    description: 'Error message that appears when server responds with 500 error code',
  },
  'login.rate.limit.reached.message': {
    id: 'login.rate.limit.reached.message',
    defaultMessage: 'Too many failed login attempts. Try again later.',
    description: 'Error message that appears when an anonymous user has made too many failed login attempts',
  },
  'login.failure.header.title': {
    id: 'login.failure.header.title',
    defaultMessage: 'We couldn\'t sign you in.',
    description: 'Login failure header message.',
  },
  'contact.support.link': {
    id: 'contact.support.link',
    defaultMessage: 'contact {platformName} support',
    description: 'Link text used in inactive user error message to go to learner help center',
  },
  'login.incorrect.credentials.error': {
    id: 'login.incorrect.credentials.error',
    defaultMessage: 'The username, email, or password you entered is incorrect. Please try again.',
    description: 'Error message for incorrect email or password',
  },
  'login.form.invalid.error.message': {
    id: 'login.form.invalid.error.message',
    defaultMessage: 'Please fill in the fields below.',
    description: 'Login form empty input user message',
  },
  'login.incorrect.credentials.error.reset.link.text': {
    id: 'login.incorrect.credentials.error.reset.link.text',
    defaultMessage: 'reset your password',
    description: 'Reset password link text for incorrect email or password credentials',
  },
  'login.incorrect.credentials.error.before.account.blocked.text': {
    id: 'login.incorrect.credentials.error.before.account.blocked.text',
    defaultMessage: 'click here to reset it.',
    description: 'Reset password link text for incorrect email or password credentials before blocking account',
  },
  // Vulnerable password change prompt
  'password.security.nudge.title': {
    id: 'password.security.nudge.title',
    defaultMessage: 'Password security',
    description: 'Title for prompt that nudges user to change their vulnerable password',
  },
  'password.security.block.title': {
    id: 'password.security.block.title',
    defaultMessage: 'Password change required',
    description: 'Title for prompt that asks user to change their vulnerable password',
  },
  'password.security.nudge.body': {
    id: 'password.security.nudge.body',
    defaultMessage: 'Our system detected that your password is vulnerable. '
                    + 'We recommend you change it so that your account stays secure.',
    description: 'Message copy for prompt that nudges user to change their vulnerable password',
  },
  'password.security.block.body': {
    id: 'password.security.block.body',
    defaultMessage: 'Our system detected that your password is vulnerable. '
                    + 'Change your password so that your account stays secure.',
    description: 'Message copy for prompt that asks user to change their vulnerable password',
  },
  'password.security.close.button': {
    id: 'password.security.close.button',
    defaultMessage: 'Close',
    description: 'Button to close popup',
  },
  'password.security.redirect.to.reset.password.button': {
    id: 'password.security.redirect.to.reset.password.button',
    defaultMessage: 'Reset your password',
    description: 'Button to redirect users to Reset Password page',
  },
  'login.tpa.authentication.failure': {
    id: 'login.tpa.authentication.failure',
    defaultMessage: 'We are sorry, you are not authorized to access {platform_name} via this channel. '
        + 'Please contact your learning administrator or manager in order to access {platform_name}.'
        + '{lineBreak}{lineBreak}Error Details:{lineBreak}{errorMessage}',
    description: 'Error message third party authentication pipeline fails',
  },
  // Two Factor Auth
  '2fa.page.title': {
    id: '2fa.page.title',
    defaultMessage: 'Verify your identity',
    description: '2FA page heading',
  },
  '2fa.description': {
    id: '2fa.description',
    defaultMessage: 'We sent a 6-digit verification code to your email. Enter it below to continue.',
    description: '2FA description when masked email is unavailable',
  },
  '2fa.description.with.email': {
    id: '2fa.description.with.email',
    defaultMessage: 'We sent a 6-digit verification code to {maskedEmail}. Enter it below to continue.',
    description: '2FA description showing the masked email address',
  },
  '2fa.otp.label': {
    id: '2fa.otp.label',
    defaultMessage: 'Verification code',
    description: 'Label for the OTP input field',
  },
  '2fa.otp.validation.empty': {
    id: '2fa.otp.validation.empty',
    defaultMessage: 'Enter the verification code',
    description: 'Validation message when OTP field is empty',
  },
  '2fa.otp.validation.format': {
    id: '2fa.otp.validation.format',
    defaultMessage: 'Verification code must be 6 digits',
    description: 'Validation message when OTP format is invalid',
  },
  '2fa.verify.button': {
    id: '2fa.verify.button',
    defaultMessage: 'Verify',
    description: 'Submit button label for OTP verification form',
  },
  '2fa.resend.button': {
    id: '2fa.resend.button',
    defaultMessage: "Didn't receive a code? Resend",
    description: 'Button to resend the OTP',
  },
  '2fa.resend.button.pending': {
    id: '2fa.resend.button.pending',
    defaultMessage: 'Sending...',
    description: 'Resend button label while request is in flight',
  },
  '2fa.resend.success': {
    id: '2fa.resend.success',
    defaultMessage: 'A new verification code has been sent to your email.',
    description: 'Success message after OTP is resent',
  },
  '2fa.error.heading': {
    id: '2fa.error.heading',
    defaultMessage: 'Verification failed',
    description: 'Heading for 2FA error alert',
  },
  '2fa.error.invalid.otp': {
    id: '2fa.error.invalid.otp',
    defaultMessage: 'The verification code you entered is incorrect or has expired. Please try again.',
    description: 'Error when OTP is wrong or expired',
  },
  '2fa.error.session.expired': {
    id: '2fa.error.session.expired',
    defaultMessage: 'Your session has expired. Please sign in again.',
    description: 'Error when the 2FA session has expired',
  },
  '2fa.error.resend.rate.limited': {
    id: '2fa.error.resend.rate.limited',
    defaultMessage: 'Too many resend requests. Please wait a few minutes before trying again.',
    description: 'Error when resend OTP is rate limited',
  },
  '2fa.error.too.many.attempts': {
    id: '2fa.error.too.many.attempts',
    defaultMessage: 'Too many verification attempts. Please wait a few minutes before trying again.',
    description: 'Error when OTP verification is rate limited',
  },
  '2fa.error.internal': {
    id: '2fa.error.internal',
    defaultMessage: 'An error occurred. Please try again.',
    description: 'Generic 2FA error message',
  },
  '2fa.disabled.message': {
    id: '2fa.disabled.message',
    defaultMessage: 'Two-factor verification is disabled for this site. Please sign in again.',
    description: 'Error shown when 2FA is disabled while user is on the verification step',
  },
});

export default messages;
