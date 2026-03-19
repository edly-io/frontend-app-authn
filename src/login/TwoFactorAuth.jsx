import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert, Form, StatefulButton,
} from '@openedx/paragon';
import { CheckCircle, Error } from '@openedx/paragon/icons';

import { PENDING_STATE } from '../data/constants';
import { twoFactorAuthVerifyRequest, twoFactorAuthResendRequest } from './data/actions';
import messages from './messages';
import { windowScrollTo } from '../data/utils';

const TwoFactorAuth = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const {
    maskedEmail,
    submitState,
    errorCode,
    resendState,
    resendSuccess,
    loginResult,
  } = useSelector(state => ({
    maskedEmail: state.login.twoFactorAuthMaskedEmail,
    submitState: state.login.twoFactorAuthSubmitState,
    errorCode: state.login.twoFactorAuthErrorCode,
    resendState: state.login.twoFactorAuthResendState,
    resendSuccess: state.login.twoFactorAuthResendSuccess,
    loginResult: state.login.loginResult,
  }));

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const isSubmittingRef = useRef(false);
  const isResendingRef = useRef(false);

  useEffect(() => {
    if (errorCode) {
      isSubmittingRef.current = false;
      windowScrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  }, [errorCode]);

  useEffect(() => {
    if (submitState !== PENDING_STATE) {
      isSubmittingRef.current = false;
    }
  }, [submitState]);

  useEffect(() => {
    if (resendState !== PENDING_STATE) {
      isResendingRef.current = false;
    }
  }, [resendState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) {
      return;
    }
    if (!otp.trim()) {
      setOtpError(formatMessage(messages['2fa.otp.validation.empty']));
      return;
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      setOtpError(formatMessage(messages['2fa.otp.validation.format']));
      return;
    }
    setOtpError('');
    isSubmittingRef.current = true;
    dispatch(twoFactorAuthVerifyRequest(otp.trim()));
  };

  const handleResend = () => {
    if (isResendingRef.current || resendState === PENDING_STATE) {
      return;
    }
    isResendingRef.current = true;
    dispatch(twoFactorAuthResendRequest());
  };

  const getErrorMessage = () => {
    switch (errorCode) {
      case '2fa-invalid-otp':
        return formatMessage(messages['2fa.error.invalid.otp']);
      case '2fa-session-expired':
        return formatMessage(messages['2fa.error.session.expired']);
      case '2fa-resend-rate-limited':
        return formatMessage(messages['2fa.error.resend.rate.limited']);
      case 'forbidden-request':
        return formatMessage(messages['2fa.error.too.many.attempts']);
      default:
        return formatMessage(messages['2fa.error.internal']);
    }
  };

  if (loginResult && loginResult.success) {
    return null;
  }

  return (
    <div className="mw-xs mt-3 mb-2">
      {errorCode && (
        <Alert id="2fa-failure-alert" className="mb-5" variant="danger" icon={Error}>
          <Alert.Heading>{formatMessage(messages['2fa.error.heading'])}</Alert.Heading>
          <p>{getErrorMessage()}</p>
        </Alert>
      )}

      {resendSuccess && !errorCode && (
        <Alert id="2fa-resend-success-alert" className="mb-5" variant="success" icon={CheckCircle}>
          <p>{formatMessage(messages['2fa.resend.success'])}</p>
        </Alert>
      )}

      <p className="mb-4 small">
        {maskedEmail
          ? formatMessage(messages['2fa.description.with.email'], { maskedEmail })
          : formatMessage(messages['2fa.description'])}
      </p>

      <Form id="2fa-form" name="2fa-form">
        <Form.Group controlId="otp" isInvalid={!!otpError}>
          <Form.Control
            as="input"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            name="otp"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            floatingLabel={formatMessage(messages['2fa.otp.label'])}
            maxLength={6}
          />
          {otpError && (
            <Form.Control.Feedback type="invalid">
              {otpError}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <StatefulButton
          name="verify-otp"
          id="verify-otp"
          type="submit"
          variant="brand"
          className="login-button-width"
          state={submitState}
          labels={{
            default: formatMessage(messages['2fa.verify.button']),
            pending: '',
          }}
          disabledStates={[PENDING_STATE]}
          onClick={handleSubmit}
          onMouseDown={e => e.preventDefault()}
        />
      </Form>

      <div className="mt-3">
        <StatefulButton
          name="resend-otp"
          id="resend-otp"
          type="button"
          variant="tertiary"
          className="font-weight-500 text-body"
          state={resendState}
          labels={{
            default: formatMessage(messages['2fa.resend.button']),
            pending: formatMessage(messages['2fa.resend.button.pending']),
          }}
          disabledStates={[PENDING_STATE]}
          onClick={handleResend}
          onMouseDown={e => e.preventDefault()}
        />
      </div>
    </div>
  );
};

export default TwoFactorAuth;
