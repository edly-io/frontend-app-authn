import { useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { fetchAuthenticatedUser, getAuthenticatedUser } from '@edx/frontend-platform/auth';
import PropTypes from 'prop-types';

import {
  DEFAULT_REDIRECT_URL,
} from '../data/constants';

const AUTH_VERIFY_TIMEOUT_MS = 2000;

const hasUsername = (user) => Boolean(user && user.username);

// App initialization only decodes the JWT cookie locally, and that cookie can
// outlive the LMS session (e.g. a newer login elsewhere under
// PREVENT_CONCURRENT_LOGINS). Redirecting on the cookie alone sends the browser
// to the LMS, which bounces it straight back here, forever. A forced refresh
// asks the LMS and drops a stale cookie. A failed or slow check shows the page
// rather than leaving it blank.
const verifyAuthenticatedUser = () => Promise.race([
  fetchAuthenticatedUser({ forceRefresh: true }).catch(() => null),
  new Promise((resolve) => { setTimeout(() => resolve(null), AUTH_VERIFY_TIMEOUT_MS); }),
]);

/**
 * This wrapper redirects the requester to our default redirect url if they are
 * already authenticated.
 */
const UnAuthOnlyRoute = ({ children }) => {
  const [isVerifying, setIsVerifying] = useState(() => hasUsername(getAuthenticatedUser()));

  useEffect(() => {
    if (!isVerifying) {
      return;
    }
    verifyAuthenticatedUser().then((authUser) => {
      if (hasUsername(authUser)) {
        global.location.replace(getConfig().LMS_BASE_URL.concat(DEFAULT_REDIRECT_URL));
        return;
      }
      setIsVerifying(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isVerifying) {
    return null;
  }

  return children;
};

UnAuthOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UnAuthOnlyRoute;
