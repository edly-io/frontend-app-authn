import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';
import { ActionRow, StatefulButton } from '@openedx/paragon';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import messages from './messages';
import {
  COMPLETE_STATE, DEFAULT_STATE, LOGIN_PAGE, PENDING_STATE,
} from '../data/constants';
import { updatePathWithQueryParams } from '../data/utils';
import { forgotPassword } from '../forgot-password/data/actions';
import ForgotPasswordAlert from '../forgot-password/ForgotPasswordAlert';

/**
 * The "block" variant of ChangePasswordPrompt, for the case where the user's
 * email has already been verified (they proved ownership by entering a correct,
 * if expired, password). Triggers the existing forgot-password reset email
 * server-side rather than making the user re-type an email they've already
 * verified, then shows a confirmation and a way back to sign in.
 */
const VerifiedPasswordReset = ({ verifiedEmail, isMobileView }) => {
  const dispatch = useDispatch();
  // state.forgotPassword is a shared, app-wide redux slice (also used by the
  // standalone /reset page) - `requestedReset` (local, below) guards against treating
  // any stale leftover status from an unrelated earlier action as if it came from a
  // click in *this* modal.
  const { status, submitState } = useSelector((state) => state.forgotPassword);
  const [requestedReset, setRequestedReset] = useState(false);
  const { formatMessage } = useIntl();

  const handleUpdatePasswordClick = () => {
    setRequestedReset(true);
    dispatch(forgotPassword(verifiedEmail));
  };

  const emailRequestInFlight = requestedReset && submitState === PENDING_STATE;

  return (
    <>
      {requestedReset && (
        <ForgotPasswordAlert status={status} email={verifiedEmail} />
      )}
      <ActionRow className={classNames(
        { 'd-flex flex-column': isMobileView },
      )}
      >
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
      </ActionRow>
    </>
  );
};

VerifiedPasswordReset.propTypes = {
  verifiedEmail: PropTypes.string.isRequired,
  isMobileView: PropTypes.bool,
};

VerifiedPasswordReset.defaultProps = {
  isMobileView: false,
};

export default VerifiedPasswordReset;
