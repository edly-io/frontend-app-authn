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
import twoStepMessages from '../twoStepMessages';

/**
 * Header of the two-step registration: step indicator, back link, two-segment progress bar and heading.
 */
export const TwoStepHeader = ({ step, onBack }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="two-step-reg__header">
      <div className="two-step-reg__step-row">
        {step === 2 && (
          <Button variant="link" size="inline" className="two-step-reg__back" onClick={onBack}>
            <Icon src={ChevronLeft} size="sm" />
            {formatMessage(twoStepMessages['register.step.back.link'])}
          </Button>
        )}
        <span className="two-step-reg__step">{formatMessage(twoStepMessages['register.step.indicator'], { step })}</span>
      </div>
      <div className="two-step-reg__progress">
        <div className="two-step-reg__progress-item two-step-reg__progress-item--active">
          <span className="two-step-reg__progress-bar" />
          <span className="two-step-reg__progress-label">{formatMessage(twoStepMessages['register.step.account.title'])}</span>
        </div>
        <div className={`two-step-reg__progress-item${step === 2 ? ' two-step-reg__progress-item--active' : ''}`}>
          <span className="two-step-reg__progress-bar" />
          <span className="two-step-reg__progress-label">{formatMessage(twoStepMessages['register.step.profile.title'])}</span>
        </div>
      </div>
      {step === 1 ? (
        <>
          <h1 className="two-step-reg__heading">{formatMessage(twoStepMessages['register.step.heading.account'])}</h1>
          <p className="two-step-reg__subtitle">
            {formatMessage(twoStepMessages['register.step.already.registered'])}{' '}
            <Link to={updatePathWithQueryParams(LOGIN_PAGE)}>{formatMessage(commonMessages['logistration.sign.in'])}</Link>
          </p>
        </>
      ) : (
        <>
          <h1 className="two-step-reg__heading">{formatMessage(twoStepMessages['register.step.heading.profile'])}</h1>
          <p className="two-step-reg__subtitle">{formatMessage(twoStepMessages['register.step.profile.subtitle'])}</p>
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
    <div className="two-step-reg__strength">
      <div className="two-step-reg__strength-bar" data-score={score}>
        {[1, 2, 3, 4].map(segment => (
          <span key={segment} className={segment <= score ? 'is-filled' : ''} />
        ))}
      </div>
      <p className="two-step-reg__hint">{formatMessage(twoStepMessages['register.step.password.hint'])}</p>
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
    <p className="two-step-reg__terms">
      <FormattedMessage
        {...twoStepMessages['register.step.terms.footer']}
        values={{
          terms: (
            <Hyperlink isInline destination={getConfig().TOS_AND_HONOR_CODE || '#'} target="_blank" showLaunchIcon={false}>
              {formatMessage(twoStepMessages['register.step.terms'])}
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
