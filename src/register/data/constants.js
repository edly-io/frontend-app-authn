// Registration Fields
export const FIELDS = {
  COUNTRY: 'country',
  HONOR_CODE: 'honor_code',
  TERMS_OF_SERVICE: 'terms_of_service',
};

// Registration Error Codes
export const FORBIDDEN_REQUEST = 'forbidden-request';
export const FORM_SUBMISSION_ERROR = 'form-submission-error';
export const INTERNAL_SERVER_ERROR = 'internal-server-error';
export const TPA_AUTHENTICATION_FAILURE = 'tpa-authentication-failure';
export const TPA_SESSION_EXPIRED = 'tpa-session-expired';
export const FORBIDDEN_USERNAME = 'forbidden-username';

// Mirrors TPDCO_PARISH_REGIONS in edly_features_app/constants.py; used only to pre-fill the read-only region.
// The server re-derives the region from the parish and ignores the submitted value.
export const PARISH_REGIONS = {
  Kingston: 'Kingston',
  'St Andrew': 'Kingston',
  'St Catherine': 'Kingston',
  'St Thomas': 'Kingston',
  Portland: 'Portland',
  'St Mary': 'Ocho Rios',
  'St Ann': 'Ocho Rios',
  Trelawny: 'Falmouth',
  'St James': 'Montego Bay',
  Hanover: 'Negril',
  Westmoreland: 'Negril',
  Clarendon: 'South Coast',
  Manchester: 'South Coast',
  'St Elizabeth': 'South Coast',
};

// Fields shown on step 1 of the two-step registration; every other configurable field is on step 2.
// Fields rendered on step 1 of the two-step registration.
export const TWO_STEP_ACCOUNT_FIELDS = ['name', 'email', 'username', 'password'];
export const ACCOUNT_STEP_FIELDS = ['confirm_email', 'confirm_password'];

// Step 2 of the two-step registration, in Figma order; names in the same inner array share a row.
export const PROFILE_STEP_ROWS = [
  ['gender', 'trn'],
  ['physical_address'],
  ['mailing_address'],
  ['telephone', 'other_numbers'],
  ['job_title'],
  ['photo_id_type'],
  ['photo_id_number', 'id_expiration_date'],
  ['parish', 'region'],
];

// Step 1/2 field copy for the two-step registration (labels without the required asterisk, which is added when
// the backend marks the field required). `type` overrides the backend field type.
export const TWO_STEP_FIELD_UI = {
  confirm_password: { label: 'Confirm password', placeholder: 'Re-enter your password' },
  gender: { label: 'Gender', placeholder: 'Select' },
  trn: { label: 'TRN', placeholder: '###-###-###' },
  physical_address: { label: 'Address', placeholder: 'Street address' },
  mailing_address: { label: 'Mailing address', placeholder: 'Mailing address', type: 'text' },
  telephone: { label: 'Telephone number', placeholder: '123 555 0123' },
  other_numbers: { label: 'Other number (optional)', placeholder: 'Alternate phone' },
  job_title: { label: 'Job title', placeholder: 'e.g. Instructional designer' },
  photo_id_type: { label: 'Photo ID type', placeholder: 'Select ID type' },
  photo_id_number: { label: 'Photo ID number', placeholder: 'As printed on your ID' },
  id_expiration_date: { label: 'ID expiration date' },
  parish: { label: 'Parish', placeholder: 'Select parish' },
  region: { label: 'Region', placeholder: 'Auto-filled from parish' },
};
