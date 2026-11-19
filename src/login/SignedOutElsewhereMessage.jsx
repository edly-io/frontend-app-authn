import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import { Info } from '@openedx/paragon/icons';
import Cookies from 'universal-cookie';

import messages from './messages';

// Set by the LMS when a newer login on another device ended this browser's
// session (single-session enforcement). The LMS clears it on the next sign-in.
const SIGNED_OUT_REASON_COOKIE = 'fbr-signed-out-reason';
const CONCURRENT_LOGIN_REASON = 'concurrent-login';

const SignedOutElsewhereMessage = () => {
  const { formatMessage } = useIntl();

  if (new Cookies().get(SIGNED_OUT_REASON_COOKIE) !== CONCURRENT_LOGIN_REASON) {
    return null;
  }

  return (
    <Alert id="signed-out-elsewhere-message" className="mb-4" variant="warning" icon={Info}>
      <Alert.Heading>{formatMessage(messages['signed.out.elsewhere.title'])}</Alert.Heading>
      <p>{formatMessage(messages['signed.out.elsewhere.message'])}</p>
    </Alert>
  );
};

export default SignedOutElsewhereMessage;
