import { useEffect } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import PropTypes from 'prop-types';

import {
  DEFAULT_REDIRECT_URL,
} from '../data/constants';

/**
 * This wrapper redirects the requester to our default redirect url if they are
 * already authenticated.
 */
const UnAuthOnlyRoute = ({ children }) => {
  // App initialization has already fetched and validated the current user before
  // rendering the route. Re-fetching here can leave the login page blank when a
  // local auth request is blocked or fails.
  const authUser = getAuthenticatedUser();

  useEffect(() => {
    if (authUser && authUser.username) {
      global.location.replace(getConfig().LMS_BASE_URL.concat(DEFAULT_REDIRECT_URL));
    }
  }, [authUser]);

  if (authUser && authUser.username) {
    return null;
  }

  return children;
};

UnAuthOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UnAuthOnlyRoute;
