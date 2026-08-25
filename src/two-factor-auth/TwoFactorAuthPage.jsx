import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { getAuthService } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert, Form, Hyperlink, StatefulButton,
} from '@openedx/paragon';
import { CheckCircle, Error } from '@openedx/paragon/icons';
import { Helmet } from 'react-helmet';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { resendOtp, resetTwoFactorAuth, verifyOtp } from './data/actions';
import messages from './messages';
import BaseContainer from '../base-container';
import { resetEmailCheck } from '../data/actions';
import { LOGIN_PAGE, PENDING_STATE } from '../data/constants';
import { getAllPossibleQueryParams, updatePathWithQueryParams } from '../data/utils';
import ChangePasswordPrompt from '../login/ChangePasswordPrompt';
import { cancelOtpRequest } from './data/service';
import { clearLoginError } from '../login/data/actions';

const RESEND_DEADLINE_STORAGE_PREFIX = 'two-factor-auth-resend-deadline:';

// sessionStorage can throw (e.g. Safari private mode, storage disabled) - on this
// auth-critical page that must degrade to "no persisted deadline", not a crash.
const getStoredResendDeadline = (sessionId) => {
  try {
    const stored = Number(sessionStorage.getItem(`${RESEND_DEADLINE_STORAGE_PREFIX}${sessionId}`));
    return stored > 0 ? stored : null;
  } catch {
    return null;
  }
};

const setStoredResendDeadline = (sessionId, deadline) => {
  try {
    sessionStorage.setItem(`${RESEND_DEADLINE_STORAGE_PREFIX}${sessionId}`, String(deadline));
  } catch {
    // Best-effort persistence; a refresh will just re-arm the full cooldown instead.
  }
};

const secondsUntil = (deadline) => Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

const TwoFactorAuthPage = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const sessionId = location.state?.sessionId;
  const email = location.state?.otpEmail || location.state?.email;
  const { next } = getAllPossibleQueryParams();
  // The LMS computes this from the OTP session's last-send time and hands it over on the
  // same response that carries sessionId/otpEmail - it only seeds the very first cooldown,
  // before any resend has happened on this page.
  const initialCooldownSeconds = Number(location.state?.resendCooldownSeconds) || 0;

  const {
    submitState,
    resendState,
    errorCode,
    redirectUrl,
    success,
    passwordExpiryNudge,
    resendCooldownDeadline,
  } = useSelector((state) => state.twoFactorAuth);

  const [otpCode, setOtpCode] = useState('');
  // Seeded from a persisted absolute deadline (sessionStorage, keyed by sessionId) when
  // one exists - e.g. a page refresh mid-countdown - falling back to initialCooldownSeconds
  // on a genuinely fresh mount. Read-only: the initializer must not itself write storage,
  // since React may invoke it more than once per mount.
  const [cooldownSeconds, setCooldownSeconds] = useState(() => {
    const storedDeadline = getStoredResendDeadline(sessionId);
    return storedDeadline ? secondsUntil(storedDeadline) : initialCooldownSeconds;
  });
  const [resendConfirmation, setResendConfirmation] = useState(false);

  // Persist the very first cooldown deadline once, on mount - skipped if a deadline is
  // already stored (a refresh, handled by the initializer above) or if there's no cooldown
  // to persist. This is what makes a refresh compute *remaining* time instead of restarting
  // the full duration on every mount.
  useEffect(() => {
    if (getStoredResendDeadline(sessionId) || initialCooldownSeconds <= 0) {
      return;
    }
    setStoredResendDeadline(sessionId, Date.now() + initialCooldownSeconds * 1000);
  }, [sessionId, initialCooldownSeconds]);

  // Re-arm the cooldown from the resend API's response (not a build-time default) every
  // time a resend succeeds. resendCooldownDeadline is an absolute timestamp computed in the
  // saga, so it changes on every successful resend even when the duration is identical -
  // that's what makes this effect fire again on a second resend.
  useEffect(() => {
    if (!resendCooldownDeadline) {
      return;
    }
    setStoredResendDeadline(sessionId, resendCooldownDeadline);
    setCooldownSeconds(secondsUntil(resendCooldownDeadline));
  }, [resendCooldownDeadline, sessionId]);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return undefined;
    }
    const timer = setTimeout(() => setCooldownSeconds((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldownSeconds]);

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
  // regardless of concurrent-mode render scheduling or the cooldownSeconds timer
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
      <div id="main-content" className="main-content">
        <div className="mw-xs mt-3 mb-2">
          <h2 className="text-primary">{formatMessage(messages['two.factor.auth.page.heading'])}</h2>
          <p>{formatMessage(messages['two.factor.auth.page.description'], { email })}</p>
          {errorCode && (
            <Alert id="two-factor-auth-errors" className="mb-3" variant="danger" icon={Error}>
              <Alert.Heading>
                {formatMessage(
                  errorCode === 'otp-resend-cooldown' || errorCode === 'otp-delivery-failed'
                    ? messages['two.factor.auth.error.resend.heading']
                    : messages['two.factor.auth.error.heading'],
                )}
              </Alert.Heading>
              <p>
                {formatMessage(
                  messages[`two.factor.auth.error.${errorCode}`] || messages['two.factor.auth.error.invalid-request'],
                )}
              </p>
            </Alert>
          )}
          {resendState !== PENDING_STATE && resendConfirmation && !errorCode && (
            <Alert id="two-factor-auth-resend-success" className="mb-3" variant="success" icon={CheckCircle}>
              <Alert.Heading>{formatMessage(messages['two.factor.auth.resend.success.heading'])}</Alert.Heading>
              <p>{formatMessage(messages['two.factor.auth.resend.success'])}</p>
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
                  if (cooldownSeconds > 0) {
                    event.preventDefault();
                    return;
                  }
                  setResendConfirmation(true);
                  handleResend(event);
                }}
              >
                {cooldownSeconds > 0
                  ? `${formatMessage(messages['two.factor.auth.resend.button'])} (${cooldownSeconds}s)`
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
      </div>
    </BaseContainer>
  );
};

export default TwoFactorAuthPage;
