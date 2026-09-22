import { fetchAuthenticatedUser, getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { NATIVE_BRIDGE_LOGIN_SUCCESS, NATIVE_BRIDGE_LOGOUT_SUCCESS } from '../constants';

export const isNativeWebView = () => typeof window !== 'undefined' && !!window.ReactNativeWebView;

export const postNativeMessage = (payload) => {
  if (!isNativeWebView()) {
    return false;
  }
  try {
    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
};

// Identity only. The JWT's signature sits in an HttpOnly cookie this page
// cannot read, so no usable token can be passed across the bridge.
const identity = (user) => (user ? {
  id: user.userId,
  email: user.email,
  username: user.username,
  name: user.name,
} : null);

// StrictMode renders twice in development, and the redirect component can
// render again before the browser leaves the page.
let loginAnnounced = false;

export const announceLoginToNativeApp = async () => {
  if (!isNativeWebView() || loginAnnounced) {
    return false;
  }
  loginAnnounced = true;

  // The page loads anonymous, so the user decoded at bootstrap is null; only a
  // fresh read sees the JWT cookie the sign-in response just set.
  let user = getAuthenticatedUser();
  if (!user) {
    try {
      user = await fetchAuthenticatedUser();
    } catch (error) {
      logError(error);
      user = null;
    }
  }

  return postNativeMessage({ type: NATIVE_BRIDGE_LOGIN_SUCCESS, user: identity(user) });
};

export const announceLogoutToNativeApp = () => postNativeMessage({ type: NATIVE_BRIDGE_LOGOUT_SUCCESS });
