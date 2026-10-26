import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Button, Hyperlink, Icon } from '@openedx/paragon';
import { ChevronLeft } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import commonMessages from '../../common-components/messages';
import { LOGIN_PAGE } from '../../data/constants';
import { MIN_PASSWORD_LENGTH } from '../../data/passwordPolicy';
import { updatePathWithQueryParams } from '../../data/utils';
import messages from '../messages';

/**
 * Header of the TPDCO two-step registration: step indicator, back link, two-segment progress bar and heading.
 */
export const TwoStepHeader = ({ step, onBack }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="tpdco-reg__header">
      <div className="tpdco-reg__step-row">
        {step === 2 && (
          <Button variant="link" size="inline" className="tpdco-reg__back" onClick={onBack}>
            <Icon src={ChevronLeft} size="sm" />
            {formatMessage(messages['register.step.back.link'])}
          </Button>
        )}
        <span className="tpdco-reg__step">{formatMessage(messages['register.step.indicator'], { step })}</span>
      </div>
      <div className="tpdco-reg__progress">
        <div className="tpdco-reg__progress-item tpdco-reg__progress-item--active">
          <span className="tpdco-reg__progress-bar" />
          <span className="tpdco-reg__progress-label">{formatMessage(messages['register.step.account.title'])}</span>
        </div>
        <div className={`tpdco-reg__progress-item${step === 2 ? ' tpdco-reg__progress-item--active' : ''}`}>
          <span className="tpdco-reg__progress-bar" />
          <span className="tpdco-reg__progress-label">{formatMessage(messages['register.step.profile.title'])}</span>
        </div>
      </div>
      {step === 1 ? (
        <>
          <h1 className="tpdco-reg__heading">{formatMessage(messages['register.step.heading.account'])}</h1>
          <p className="tpdco-reg__subtitle">
            {formatMessage(messages['register.step.already.registered'])}{' '}
            <Link to={updatePathWithQueryParams(LOGIN_PAGE)}>{formatMessage(commonMessages['logistration.sign.in'])}</Link>
          </p>
        </>
      ) : (
        <>
          <h1 className="tpdco-reg__heading">{formatMessage(messages['register.step.heading.profile'])}</h1>
          <p className="tpdco-reg__subtitle">{formatMessage(messages['register.step.profile.subtitle'])}</p>
        </>
      )}
    </div>
  );
};

TwoStepHeader.propTypes = {
  step: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
};

/**
 * Four-segment password strength bar and hint shown under the password field.
 */
export const PasswordStrength = ({ value }) => {
  const { formatMessage } = useIntl();
  const score = [
    value.length >= MIN_PASSWORD_LENGTH,
    /[a-z]/.test(value) && /[A-Z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ].filter(Boolean).length;
  return (
    <div className="tpdco-reg__strength">
      <div className="tpdco-reg__strength-bar" data-score={score}>
        {[1, 2, 3, 4].map(segment => (
          <span key={segment} className={segment <= score ? 'is-filled' : ''} />
        ))}
      </div>
      <p className="tpdco-reg__hint">{formatMessage(messages['register.step.password.hint'])}</p>
    </div>
  );
};

PasswordStrength.propTypes = {
  value: PropTypes.string,
};

PasswordStrength.defaultProps = {
  value: '',
};

/**
 * Terms / privacy policy line under the submit button of step 2.
 */
export const TermsFooter = () => {
  const { formatMessage } = useIntl();
  return (
    <p className="tpdco-reg__terms">
      <FormattedMessage
        {...messages['register.step.terms.footer']}
        values={{
          terms: (
            <Hyperlink isInline destination={getConfig().TOS_AND_HONOR_CODE || '#'} target="_blank" showLaunchIcon={false}>
              {formatMessage(messages['register.step.terms'])}
            </Hyperlink>
          ),
          privacyPolicy: (
            <Hyperlink isInline destination={getConfig().PRIVACY_POLICY || '#'} target="_blank" showLaunchIcon={false}>
              {formatMessage(messages['privacy.policy'])}
            </Hyperlink>
          ),
        }}
      />
    </p>
  );
};
