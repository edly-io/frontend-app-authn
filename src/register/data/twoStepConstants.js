// Mirrors PARISH_REGIONS in edly_features_app/constants.py; used only to pre-fill the read-only region.
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

// Step-2 fields that are always required, whether or not the backend marks them so (see getRequiredMessage).
export const ALWAYS_REQUIRED_PROFILE_FIELDS = ['mailing_address'];

// Backend field type overrides for the two-step registration. Labels and placeholders are the
// `registration.profile.<field>.label|placeholder` messages in twoStepMessages.
export const TWO_STEP_FIELD_TYPES = { mailing_address: 'text' };
