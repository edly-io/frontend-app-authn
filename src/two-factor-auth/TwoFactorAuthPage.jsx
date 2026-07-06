import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { getAuthService } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert, Form, Hyperlink, StatefulButton,
} from '@openedx/paragon';
import { Helmet } from 'react-helmet';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { resendOtp, resetTwoFactorAuth, verifyOtp } from './data/actions';
import messages from './messages';
import BaseContainer from '../base-container';
import { LOGIN_PAGE, PENDING_STATE } from '../data/constants';
import { resetEmailCheck } from '../data/actions';
import { getAllPossibleQueryParams, updatePathWithQueryParams } from '../data/utils';
import ChangePasswordPrompt from '../login/ChangePasswordPrompt';
import { clearLoginError } from '../login/data/actions';
import { cancelOtpRequest } from './data/service';

const TwoFactorAuthPage = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Read at component-render time (rather than module-eval time) so an async/runtime
  // config load is picked up; defaults to 180s if the key isn't wired into this site's config.
  const resendCooldownSeconds = getConfig().TWO_FA_RESEND_COOLDOWN_SECONDS || 180;

  const sessionId = location.state?.sessionId;
  const email = location.state?.otpEmail || location.state?.email;
  const { next } = getAllPossibleQueryParams();

  const {
    submitState,
    resendState,
    errorCode,
    redirectUrl,
    success,
    passwordExpiryNudge,
  } = useSelector((state) => state.twoFactorAuth);

  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendConfirmation, setResendConfirmation] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return undefined;
    }
    const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    // The login CSRF token rotates once OTP verification completes the login, so
    // clear the cache before the nudge sends the user on to the reset-password page.
    if (success && passwordExpiryNudge) {
      const authService = getAuthService();
      if (authService) {
        authService.getCsrfTokenService().clearCsrfTokenCache();
      }
    }
  }, [success, passwordExpiryNudge]);

  // Navigate after a successful OTP verify in an effect (not during render) so the
  // assignment is guaranteed to fire exactly once after React commits the update,
  // regardless of concurrent-mode render scheduling or the resendCooldown timer
  // triggering interleaved state updates.
  useEffect(() => {
    if (success && !passwordExpiryNudge && redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [success, passwordExpiryNudge, redirectUrl]);

  if (!sessionId) {
    return <Navigate to={LOGIN_PAGE} replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setResendConfirmation(false);
    dispatch(verifyOtp(sessionId, otpCode, next));
  };

  const handleResend = (event) => {
    event.preventDefault();
    dispatch(resendOtp(sessionId));
    setResendCooldown(resendCooldownSeconds);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    cancelOtpRequest(sessionId);
    dispatch(resetTwoFactorAuth());
    dispatch(resetEmailCheck());
    dispatch(clearLoginError());
    navigate(updatePathWithQueryParams(LOGIN_PAGE));
  };

  const handleOtpChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 6);
    setOtpCode(digitsOnly);
  };

  return (
    <BaseContainer>
      <Helmet>
        <title>{formatMessage(messages['two.factor.auth.page.title'], { siteName: getConfig().SITE_NAME })}</title>
      </Helmet>
      {success && passwordExpiryNudge && (
        <ChangePasswordPrompt variant="nudge" redirectUrl={redirectUrl} />
      )}
      <div className="mw-xs mt-3 mb-2">
        <h2 className="text-primary">{formatMessage(messages['two.factor.auth.page.heading'])}</h2>
        <p>{formatMessage(messages['two.factor.auth.page.description'], { email })}</p>
        {errorCode && (
          <Alert id="two-factor-auth-errors" className="mb-3" variant="danger">
            {formatMessage(
              messages[`two.factor.auth.error.${errorCode}`] || messages['two.factor.auth.error.invalid-request'],
            )}
          </Alert>
        )}
        {resendState !== PENDING_STATE && resendConfirmation && !errorCode && (
          <Alert id="two-factor-auth-resend-success" className="mb-3" variant="info">
            {formatMessage(messages['two.factor.auth.resend.success'])}
          </Alert>
        )}
        <Form id="two-factor-auth-form" name="two-factor-auth-form" onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="otp-code">{formatMessage(messages['two.factor.auth.code.label'])}</Form.Label>
            <Form.Control
              id="otp-code"
              name="otp-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otpCode}
              onChange={handleOtpChange}
            />
          </Form.Group>
          <StatefulButton
            name="verify-otp"
            id="verify-otp"
            type="submit"
            variant="brand"
            className="login-button-width"
            state={submitState}
            disabled={otpCode.length !== 6}
            labels={{
              default: formatMessage(messages['two.factor.auth.submit.button']),
              pending: '',
            }}
            onMouseDown={(event) => event.preventDefault()}
          />
          <div className="mt-3">
            <Hyperlink
              isInline
              variant="muted"
              destination="#"
              onClick={(event) => {
                if (resendCooldown > 0) {
                  event.preventDefault();
                  return;
                }
                setResendConfirmation(true);
                handleResend(event);
              }}
            >
              {resendCooldown > 0
                ? `${formatMessage(messages['two.factor.auth.resend.button'])} (${resendCooldown}s)`
                : formatMessage(messages['two.factor.auth.resend.button'])}
            </Hyperlink>
          </div>
          <div className="mt-2">
            <Hyperlink isInline variant="muted" destination="#" onClick={handleCancel}>
              {formatMessage(messages['two.factor.auth.cancel.link'])}
            </Hyperlink>
          </div>
        </Form>
      </div>
    </BaseContainer>
  );
};

export default TwoFactorAuthPage;
