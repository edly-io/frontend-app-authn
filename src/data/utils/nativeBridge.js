import { fetchAuthenticatedUser, getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import {
  NATIVE_BRIDGE_LOGIN_SUCCESS, NATIVE_BRIDGE_LOGOUT_SUCCESS, NATIVE_WEBVIEW_CLASS,
} from '../constants';

export const isNativeWebView = () => typeof window !== 'undefined' && !!window.ReactNativeWebView;

// Called once at start-up rather than from `isNativeWebView()`: a page that
// never posts a message would otherwise never be marked, and the class has to
// be on <html> before the first paint or web-only furniture flashes up and
// then disappears.
export const markNativeWebView = () => {
  if (!isNativeWebView() || typeof document === 'undefined') {
    return false;
  }
  document.documentElement.classList.add(NATIVE_WEBVIEW_CLASS);
  return true;
};

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
