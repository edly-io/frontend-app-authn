import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const requestConfig = {
  headers: { 'Content-Type': 'application/json' },
  isPublic: true,
};

export async function verifyOtpRequest(sessionId, otpCode, next) {
  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/api/v1/otp/verify/`,
      { session_id: sessionId, otp_code: otpCode, next },
      requestConfig,
    )
    .catch((e) => { throw (e); });

  return {
    redirectUrl: data.redirect_url || `${getConfig().LMS_BASE_URL}/dashboard`,
    success: data.success || false,
    passwordExpiryNudge: data.password_expiry_nudge || false,
  };
}

export async function resendOtpRequest(sessionId) {
  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/api/v1/otp/resend/`,
      { session_id: sessionId },
      requestConfig,
    )
    .catch((e) => { throw (e); });

  return { success: data.success || false };
}

export async function cancelOtpRequest(sessionId) {
  await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/api/v1/otp/cancel/`,
      { session_id: sessionId },
      requestConfig,
    )
    .catch(() => {
      // Cancellation is best-effort: the user is navigating away from this flow
      // regardless of whether the server-side session cleanup succeeds.
    });
}
