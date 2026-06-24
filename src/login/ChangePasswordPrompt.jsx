import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ActionRow, ModalDialog, StatefulButton, useToggle,
} from '@openedx/paragon';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';

import messages from './messages';
import {
  COMPLETE_STATE, DEFAULT_REDIRECT_URL, DEFAULT_STATE, LOGIN_PAGE, PENDING_STATE, RESET_PAGE,
} from '../data/constants';
import { updatePathWithQueryParams } from '../data/utils';
import useMobileResponsive from '../data/utils/useMobileResponsive';
import { forgotPassword } from '../forgot-password/data/actions';
import ForgotPasswordAlert from '../forgot-password/ForgotPasswordAlert';

const ChangePasswordPrompt = ({ variant, redirectUrl, verifiedEmail }) => {
  const isMobileView = useMobileResponsive();
  const dispatch = useDispatch();
  // state.forgotPassword is a shared, app-wide redux slice (also used by the
  // standalone /reset page) - `requestedReset` (local, below) guards against treating
  // any stale leftover status from an unrelated earlier action as if it came from a
  // click in *this* modal.
  const { status, submitState } = useSelector((state) => state.forgotPassword);
  const [requestedReset, setRequestedReset] = useState(false);
  const [redirectToResetPasswordPage, setRedirectToResetPasswordPage] = useState(false);
  const handlers = {
    handleToggleOff: () => {
      if (variant === 'block') {
        if (!verifiedEmail) {
          setRedirectToResetPasswordPage(true);
        }
      } else {
        window.location.href = redirectUrl || getConfig().LMS_BASE_URL.concat(DEFAULT_REDIRECT_URL);
      }
    },
  };
  // eslint-disable-next-line no-unused-vars
  const [isOpen, open, close] = useToggle(true, handlers);
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectToResetPasswordPage) {
      navigate(updatePathWithQueryParams(RESET_PAGE));
    }
  }, [redirectToResetPasswordPage, navigate]);

  /**
   * Send the password-reset email server-side, to the address the user already
   * proved they own (by entering the correct, if expired, password) - rather than
   * sending it eagerly on every blocked login_session attempt, and rather than making
   * the user re-type an email they've already verified. Reuses the existing
   * forgot-password redux action/saga/service (POST /account/password), so this isn't
   * a new backend call - just a different trigger for an existing one.
   */
  const handleUpdatePasswordClick = () => {
    if (verifiedEmail) {
      setRequestedReset(true);
      dispatch(forgotPassword(verifiedEmail));
    } else {
      // Defensive fallback for callers that don't have a verified email on hand
      // (e.g. an older cached error response without this context key).
      setRedirectToResetPasswordPage(true);
    }
  };

  const emailRequestInFlight = requestedReset && submitState === PENDING_STATE;

  return (
    <ModalDialog
      title="Password update required"
      isOpen={isOpen}
      onClose={close}
      size={isMobileView ? 'sm' : 'md'}
      hasCloseButton={false}
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          {formatMessage(messages[`password.security.${variant}.title`])}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        {requestedReset && (
          <ForgotPasswordAlert status={status} email={verifiedEmail} />
        )}
        {formatMessage(messages[`password.security.${variant}.body`])}
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow className={classNames(
          { 'd-flex flex-column': isMobileView },
        )}
        >
          {variant === 'nudge' ? (
            <ModalDialog.CloseButton id="password-security-close" variant="tertiary">
              {formatMessage(messages['password.security.close.button'])}
            </ModalDialog.CloseButton>
          ) : null}
          {variant === 'block' && verifiedEmail ? (
            <>
              <StatefulButton
                id="password-security-reset-password"
                name="password-security-reset-password"
                type="button"
                variant="primary"
                className={classNames(
                  { 'w-100': isMobileView },
                )}
                state={emailRequestInFlight ? PENDING_STATE : DEFAULT_STATE}
                labels={{
                  default: formatMessage(messages['password.security.redirect.to.reset.password.button']),
                  pending: '',
                }}
                onClick={handleUpdatePasswordClick}
                onMouseDown={(e) => e.preventDefault()}
              />
              {requestedReset && status === COMPLETE_STATE && (
                <Link
                  id="password-security-back-to-sign-in"
                  className="btn btn-tertiary"
                  to={updatePathWithQueryParams(LOGIN_PAGE)}
                >
                  {formatMessage(messages['password.security.back.to.sign.in.button'])}
                </Link>
              )}
            </>
          ) : (
            <Link
              id="password-security-reset-password"
              className={classNames(
                'btn btn-primary',
                { 'w-100': isMobileView },
              )}
              to={updatePathWithQueryParams(RESET_PAGE)}
            >
              {formatMessage(messages['password.security.redirect.to.reset.password.button'])}
            </Link>
          )}
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

ChangePasswordPrompt.defaultProps = {
  variant: 'block',
  redirectUrl: null,
  verifiedEmail: null,
};

ChangePasswordPrompt.propTypes = {
  variant: PropTypes.oneOf(['nudge', 'block']),
  redirectUrl: PropTypes.string,
  verifiedEmail: PropTypes.string,
};

export default ChangePasswordPrompt;
