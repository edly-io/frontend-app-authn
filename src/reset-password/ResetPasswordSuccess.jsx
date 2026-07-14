import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import { useLocation } from 'react-router-dom';

import messages from './messages';

const ResetPasswordSuccess = () => {
  const { formatMessage } = useIntl();
  const location = useLocation();

  // EDLYCUSTOM: a new user (created from edly panel) setting their password for the first
  // time gets a distinct "You're All Set!" welcome banner instead of the reset-password one.
  // Derived from the URL (rather than taken as a prop) because this component is also rendered
  // by the external EmailCheckWidget (@anas_hameed/edly-saas-widget), which invokes it with no props.
  const isNewUser = new URLSearchParams(location.search).get('track') === 'edly_panel';

  if (isNewUser) {
    return (
      <Alert id="reset-password-success" variant="success" className="mb-5">
        <Alert.Heading>
          {formatMessage(messages['set.password.success.heading'])}
        </Alert.Heading>
        <p>
          <FormattedMessage
            {...messages['set.password.success']}
            values={{
              signInLink: (
                <Alert.Link href={getConfig().LMS_BASE_URL}>
                  {formatMessage(messages['set.password.success.sign.in.link'])}
                </Alert.Link>
              ),
            }}
          />
        </p>
      </Alert>
    );
  }

  return (
    <Alert id="reset-password-success" variant="success" className="mb-5">
      <Alert.Heading>
        {formatMessage(messages['reset.password.success.heading'])}
      </Alert.Heading>
      <p>{formatMessage(messages['reset.password.success'])}</p>
    </Alert>
  );
};

export default ResetPasswordSuccess;
