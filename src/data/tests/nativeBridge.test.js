import { fetchAuthenticatedUser, getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

jest.mock('@edx/frontend-platform/auth', () => ({
  fetchAuthenticatedUser: jest.fn(),
  getAuthenticatedUser: jest.fn(),
}));
jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const USER = {
  userId: 22,
  email: 'rali@example.com',
  username: 'rali',
  name: 'R Ali',
  roles: [],
  administrator: false,
};

// The module remembers whether it already announced a login.
const loadBridge = () => {
  let bridge;
  jest.isolateModules(() => {
    // eslint-disable-next-line global-require
    bridge = require('../utils/nativeBridge');
  });
  return bridge;
};

describe('nativeBridge', () => {
  let postMessage;

  beforeEach(() => {
    jest.clearAllMocks();
    postMessage = jest.fn();
    window.ReactNativeWebView = { postMessage };
  });

  afterEach(() => {
    delete window.ReactNativeWebView;
    document.documentElement.classList.remove('is-native-webview');
  });

  describe('outside the mobile app', () => {
    beforeEach(() => { delete window.ReactNativeWebView; });

    it('reports that there is no WebView', () => {
      expect(loadBridge().isNativeWebView()).toBe(false);
    });

    it('does not announce a login, and does not read the user', async () => {
      await expect(loadBridge().announceLoginToNativeApp()).resolves.toBe(false);

      expect(getAuthenticatedUser).not.toHaveBeenCalled();
      expect(fetchAuthenticatedUser).not.toHaveBeenCalled();
    });

    it('does not announce a logout', () => {
      expect(loadBridge().announceLogoutToNativeApp()).toBe(false);
    });

    it('leaves the document unmarked', () => {
      expect(loadBridge().markNativeWebView()).toBe(false);
      expect(document.documentElement.classList.contains('is-native-webview')).toBe(false);
    });
  });

  describe('inside the mobile app', () => {
    it('announces a login with the identity already in hand', async () => {
      getAuthenticatedUser.mockReturnValue(USER);

      await loadBridge().announceLoginToNativeApp();

      expect(fetchAuthenticatedUser).not.toHaveBeenCalled();
      expect(JSON.parse(postMessage.mock.calls[0][0])).toEqual({
        type: 'LOGIN_SUCCESS',
        user: {
          id: 22, email: 'rali@example.com', username: 'rali', name: 'R Ali',
        },
      });
    });

    it('re-reads the cookie the sign-in request just set', async () => {
      getAuthenticatedUser.mockReturnValue(null);
      fetchAuthenticatedUser.mockResolvedValue(USER);

      await loadBridge().announceLoginToNativeApp();

      expect(fetchAuthenticatedUser).toHaveBeenCalledTimes(1);
      expect(JSON.parse(postMessage.mock.calls[0][0]).user.id).toBe(22);
    });

    it('never carries a token, only identity', async () => {
      getAuthenticatedUser.mockReturnValue(USER);

      await loadBridge().announceLoginToNativeApp();

      expect(postMessage.mock.calls[0][0]).not.toContain('token');
    });

    it('announces a login once per page load', async () => {
      getAuthenticatedUser.mockReturnValue(USER);
      const bridge = loadBridge();

      await bridge.announceLoginToNativeApp();
      await bridge.announceLoginToNativeApp();

      expect(postMessage).toHaveBeenCalledTimes(1);
    });

    it('still announces the login when the user cannot be read', async () => {
      getAuthenticatedUser.mockReturnValue(null);
      fetchAuthenticatedUser.mockRejectedValue(new Error('no jwt cookie'));

      await loadBridge().announceLoginToNativeApp();

      expect(logError).toHaveBeenCalled();
      expect(JSON.parse(postMessage.mock.calls[0][0])).toEqual({ type: 'LOGIN_SUCCESS', user: null });
    });

    it('marks the document so web-only furniture can be styled away', () => {
      expect(loadBridge().markNativeWebView()).toBe(true);
      expect(document.documentElement.classList.contains('is-native-webview')).toBe(true);
    });

    it('marks the document without needing a message to have been sent', () => {
      loadBridge().markNativeWebView();

      expect(postMessage).not.toHaveBeenCalled();
      expect(document.documentElement.classList.contains('is-native-webview')).toBe(true);
    });

    it('announces a logout', () => {
      expect(loadBridge().announceLogoutToNativeApp()).toBe(true);
      expect(JSON.parse(postMessage.mock.calls[0][0])).toEqual({ type: 'LOGOUT_SUCCESS' });
    });

    it('swallows a bridge that rejects the message', () => {
      postMessage.mockImplementation(() => { throw new Error('no listener'); });

      expect(loadBridge().announceLogoutToNativeApp()).toBe(false);
      expect(logError).toHaveBeenCalled();
    });
  });
});
