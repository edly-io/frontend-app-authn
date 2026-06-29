import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { cancelOtpRequest, resendOtpRequest, verifyOtpRequest } from '../service';

jest.mock('@edx/frontend-platform/auth');

describe('two factor auth service', () => {
  let postMock;

  beforeEach(() => {
    postMock = jest.fn();
    getAuthenticatedHttpClient.mockReturnValue({ post: postMock });
  });

  describe('verifyOtpRequest', () => {
    it('posts the session id and otp code, and returns the parsed response', async () => {
      postMock.mockReturnValue({
        catch: () => ({
          data: { success: true, redirect_url: '/dashboard', password_expiry_nudge: true },
        }),
      });

      const result = await verifyOtpRequest('session-123', '654321');

      expect(postMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/otp/verify/'),
        { session_id: 'session-123', otp_code: '654321' },
        expect.objectContaining({ isPublic: true }),
      );
      expect(result).toEqual({
        success: true,
        redirectUrl: '/dashboard',
        passwordExpiryNudge: true,
      });
    });

    it('defaults success, redirectUrl and passwordExpiryNudge when missing from the response', async () => {
      postMock.mockReturnValue({ catch: () => ({ data: {} }) });

      const result = await verifyOtpRequest('session-123', '654321');

      expect(result.success).toBe(false);
      expect(result.passwordExpiryNudge).toBe(false);
      expect(result.redirectUrl).toContain('/dashboard');
    });
  });

  describe('resendOtpRequest', () => {
    it('posts the session id and returns the parsed response', async () => {
      postMock.mockReturnValue({ catch: () => ({ data: { success: true } }) });

      const result = await resendOtpRequest('session-123');

      expect(postMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/otp/resend/'),
        { session_id: 'session-123' },
        expect.objectContaining({ isPublic: true }),
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('cancelOtpRequest', () => {
    it('posts the session id and resolves even if the request fails', async () => {
      postMock.mockReturnValue({ catch: (handler) => handler(new Error('network error')) });

      await expect(cancelOtpRequest('session-123')).resolves.toBeUndefined();
      expect(postMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/otp/cancel/'),
        { session_id: 'session-123' },
        expect.objectContaining({ isPublic: true }),
      );
    });
  });
});
