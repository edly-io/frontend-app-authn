import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
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
    defaultMessage: 'Use 12+ characters with a mix of letters, numbers and symbols.',
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
  'registration.profile.trn.invalid': {
    id: 'registration.profile.trn.invalid',
    defaultMessage: 'TRN must be 9 digits in the format ###-###-###.',
    description: 'Error for an invalid TRN in the registration profile',
  },
  'registration.profile.phone.invalid': {
    id: 'registration.profile.phone.invalid',
    defaultMessage: 'Phone number must start with \'+\' (optional) followed by digits (0-9) only.',
    description: 'Error for an invalid telephone number in the registration profile',
  },
  'registration.profile.max.length': {
    id: 'registration.profile.max.length',
    defaultMessage: 'Ensure this value has at most {max} characters (it has {count}).',
    description: 'Error for a value that is too long in the registration profile',
  },
  'registration.profile.choice.invalid': {
    id: 'registration.profile.choice.invalid',
    defaultMessage: 'Select a valid choice.',
    description: 'Error for a dropdown value that is not one of the options',
  },
  'registration.profile.date.invalid': {
    id: 'registration.profile.date.invalid',
    defaultMessage: 'Enter a valid date.',
    description: 'Error for an invalid date in the registration profile',
  },
  'registration.profile.date.past': {
    id: 'registration.profile.date.past',
    defaultMessage: 'ID expiration date can\'t be in the past.',
    description: 'Error for an expiration date earlier than today in the registration profile',
  },
  'registration.profile.mailing_address.required': {
    id: 'registration.profile.mailing_address.required',
    defaultMessage: 'Please enter your mailing address.',
    description: 'Error for an empty mailing address in the registration profile',
  },
  'registration.profile.confirm_password.label': {
    id: 'registration.profile.confirm_password.label',
    defaultMessage: 'Confirm password',
    description: 'Two-step registration label for the confirm password field',
  },
  'registration.profile.confirm_password.placeholder': {
    id: 'registration.profile.confirm_password.placeholder',
    defaultMessage: 'Re-enter your password',
    description: 'Two-step registration placeholder for the confirm password field',
  },
  'registration.profile.gender.label': {
    id: 'registration.profile.gender.label',
    defaultMessage: 'Gender',
    description: 'Two-step registration label for the gender field',
  },
  'registration.profile.gender.placeholder': {
    id: 'registration.profile.gender.placeholder',
    defaultMessage: 'Select',
    description: 'Two-step registration placeholder for the gender field',
  },
  'registration.profile.trn.label': {
    id: 'registration.profile.trn.label',
    defaultMessage: 'TRN',
    description: 'Two-step registration label for the trn field',
  },
  'registration.profile.trn.placeholder': {
    id: 'registration.profile.trn.placeholder',
    defaultMessage: 'Enter your unique TRN',
    description: 'Two-step registration placeholder for the trn field',
  },
  'registration.profile.physical_address.label': {
    id: 'registration.profile.physical_address.label',
    defaultMessage: 'Address',
    description: 'Two-step registration label for the physical address field',
  },
  'registration.profile.physical_address.placeholder': {
    id: 'registration.profile.physical_address.placeholder',
    defaultMessage: 'Street address',
    description: 'Two-step registration placeholder for the physical address field',
  },
  'registration.profile.mailing_address.label': {
    id: 'registration.profile.mailing_address.label',
    defaultMessage: 'Mailing address',
    description: 'Two-step registration label for the mailing address field',
  },
  'registration.profile.mailing_address.placeholder': {
    id: 'registration.profile.mailing_address.placeholder',
    defaultMessage: 'Mailing address',
    description: 'Two-step registration placeholder for the mailing address field',
  },
  'registration.profile.telephone.label': {
    id: 'registration.profile.telephone.label',
    defaultMessage: 'Telephone number',
    description: 'Two-step registration label for the telephone field',
  },
  'registration.profile.telephone.placeholder': {
    id: 'registration.profile.telephone.placeholder',
    defaultMessage: '123 555 0123',
    description: 'Two-step registration placeholder for the telephone field',
  },
  'registration.profile.other_numbers.label': {
    id: 'registration.profile.other_numbers.label',
    defaultMessage: 'Other number (optional)',
    description: 'Two-step registration label for the other numbers field',
  },
  'registration.profile.other_numbers.placeholder': {
    id: 'registration.profile.other_numbers.placeholder',
    defaultMessage: 'Alternate phone',
    description: 'Two-step registration placeholder for the other numbers field',
  },
  'registration.profile.job_title.label': {
    id: 'registration.profile.job_title.label',
    defaultMessage: 'Job title',
    description: 'Two-step registration label for the job title field',
  },
  'registration.profile.job_title.placeholder': {
    id: 'registration.profile.job_title.placeholder',
    defaultMessage: 'e.g. Instructional designer',
    description: 'Two-step registration placeholder for the job title field',
  },
  'registration.profile.photo_id_type.label': {
    id: 'registration.profile.photo_id_type.label',
    defaultMessage: 'Photo ID type',
    description: 'Two-step registration label for the photo id type field',
  },
  'registration.profile.photo_id_type.placeholder': {
    id: 'registration.profile.photo_id_type.placeholder',
    defaultMessage: 'Select ID type',
    description: 'Two-step registration placeholder for the photo id type field',
  },
  'registration.profile.photo_id_number.label': {
    id: 'registration.profile.photo_id_number.label',
    defaultMessage: 'Photo ID number',
    description: 'Two-step registration label for the photo id number field',
  },
  'registration.profile.photo_id_number.placeholder': {
    id: 'registration.profile.photo_id_number.placeholder',
    defaultMessage: 'As printed on your ID',
    description: 'Two-step registration placeholder for the photo id number field',
  },
  'registration.profile.id_expiration_date.label': {
    id: 'registration.profile.id_expiration_date.label',
    defaultMessage: 'ID expiration date',
    description: 'Two-step registration label for the id expiration date field',
  },
  'registration.profile.parish.label': {
    id: 'registration.profile.parish.label',
    defaultMessage: 'Parish',
    description: 'Two-step registration label for the parish field',
  },
  'registration.profile.parish.placeholder': {
    id: 'registration.profile.parish.placeholder',
    defaultMessage: 'Select parish',
    description: 'Two-step registration placeholder for the parish field',
  },
  'registration.profile.region.label': {
    id: 'registration.profile.region.label',
    defaultMessage: 'Region',
    description: 'Two-step registration label for the region field',
  },
  'registration.profile.region.placeholder': {
    id: 'registration.profile.region.placeholder',
    defaultMessage: 'Auto-filled from parish',
    description: 'Two-step registration placeholder for the region field',
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
});

export default messages;
