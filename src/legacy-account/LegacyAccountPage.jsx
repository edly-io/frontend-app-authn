import React, { useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { sendPageEvent, sendTrackEvent } from '@edx/frontend-platform/analytics';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert, Form, Hyperlink, Icon, StatefulButton, Tab, Tabs,
} from '@openedx/paragon';
import { CheckCircle, ChevronLeft, Error } from '@openedx/paragon/icons';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';

import messages from './messages';
import { requestLegacySetPassword } from './service';
import BaseContainer from '../base-container';
import { FormGroup } from '../common-components';
import {
  COMPLETE_STATE, DEFAULT_STATE, LOGIN_PAGE, PENDING_STATE, RESET_PAGE, VALID_EMAIL_REGEX,
} from '../data/constants';
import { updatePathWithQueryParams, windowScrollTo } from '../data/utils';

const LEGACY_PLATFORM_URL = 'https://old.rwaq.org';

const LegacyAccountPage = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const platformName = getConfig().SITE_NAME;
  const emailRegex = new RegExp(VALID_EMAIL_REGEX, 'i');

  // Renders the <link> tag inside translated messages as a link to the old platform.
  const oldPlatformLink = (chunks) => (
    <Hyperlink destination={LEGACY_PLATFORM_URL} target="_blank" isInline>
      {chunks}
    </Hyperlink>
  );

  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submitState, setSubmitState] = useState(DEFAULT_STATE);
  const [status, setStatus] = useState(null); // 'complete' | 'error' | null

  useEffect(() => {
    sendPageEvent('login_and_registration', 'legacy-account');
    sendTrackEvent('edx.bi.legacy_account_form.viewed', { category: 'user-engagement' });
  }, []);

  const getValidationMessage = (value) => {
    if (value === '') {
      return formatMessage(messages['legacy.account.empty.email.error']);
    }
    if (!emailRegex.test(value)) {
      return formatMessage(messages['legacy.account.invalid.email.error']);
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = getValidationMessage(email);
    if (error) {
      setValidationError(error);
      windowScrollTo({ left: 0, top: 0, behavior: 'smooth' });
      return;
    }

    setValidationError('');
    setSubmitState(PENDING_STATE);
    try {
      await requestLegacySetPassword(email);
      setStatus('complete');
      setEmail('');
      sendTrackEvent('edx.bi.legacy_account_form.submitted', { category: 'user-engagement' });
    } catch (err) {
      setStatus('error');
    } finally {
      setSubmitState(COMPLETE_STATE);
      windowScrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  };

  const tabTitle = (
    <div className="d-inline-flex flex-wrap align-items-center">
      <Icon src={ChevronLeft} />
      <span className="ml-2">{formatMessage(messages['legacy.account.sign.in.text'])}</span>
    </div>
  );

  return (
    <BaseContainer>
      <Helmet>
        <title>{formatMessage(messages['legacy.account.page.title'], { siteName: platformName })}</title>
      </Helmet>
      <div>
        <Tabs activeKey="" id="controlled-tab" onSelect={(key) => navigate(updatePathWithQueryParams(key))}>
          <Tab title={tabTitle} eventKey={LOGIN_PAGE} />
        </Tabs>
        <div id="main-content" className="main-content">
          <Form id="legacy-account-form" name="legacy-account-form" className="mw-xs">
            {status === 'complete' && (
              <Alert variant="success" icon={CheckCircle}>
                <Alert.Heading>{formatMessage(messages['legacy.account.success.heading'])}</Alert.Heading>
                <p className="mb-0">{formatMessage(messages['legacy.account.success.message'], { link: oldPlatformLink })}</p>
              </Alert>
            )}
            {status === 'error' && (
              <Alert variant="danger" icon={Error}>
                <p className="mb-0">{formatMessage(messages['legacy.account.error.message'])}</p>
              </Alert>
            )}
            <h2 className="h4">
              {formatMessage(messages['legacy.account.page.heading'])}
            </h2>
            <p className="mb-2">
              {formatMessage(messages['legacy.account.page.instructions'], { link: oldPlatformLink })}
            </p>
            <p className="small mb-4 text-gray-700">
              {formatMessage(messages['legacy.account.forgot.hint.prefix'])}
              {' '}
              <Link to={updatePathWithQueryParams(RESET_PAGE)}>
                {formatMessage(messages['legacy.account.forgot.password.link'])}
              </Link>
            </p>
            <FormGroup
              floatingLabel={formatMessage(messages['legacy.account.email.field.label'])}
              name="email"
              value={email}
              autoComplete="on"
              errorMessage={validationError}
              handleChange={(e) => setEmail(e.target.value)}
              handleBlur={() => setValidationError(getValidationMessage(email))}
              handleFocus={() => setValidationError('')}
              helpText={[formatMessage(messages['legacy.account.email.help.text'], { platformName })]}
            />
            <StatefulButton
              id="submit-legacy-account"
              name="submit-legacy-account"
              type="submit"
              variant="brand"
              className="legacy-account--button"
              state={submitState}
              labels={{
                default: formatMessage(messages['legacy.account.submit.button']),
                pending: '',
              }}
              onClick={handleSubmit}
              onMouseDown={(e) => e.preventDefault()}
            />
          </Form>
        </div>
      </div>
    </BaseContainer>
  );
};

export default LegacyAccountPage;
