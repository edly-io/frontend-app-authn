import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import * as QueryString from 'query-string';

export async function loginRequest(creds) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    isPublic: true,
  };

  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/api/user/v2/account/login_session/`,
      QueryString.stringify(creds),
      requestConfig,
    )
    .catch((e) => {
      throw (e);
    });

  return {
    redirectUrl: data.redirect_url || `${getConfig().LMS_BASE_URL}/dashboard`,
    success: data.success || false,
    errorCode: data.error_code || null,
    maskedEmail: data.masked_email || null,
  };
}

export async function verifyOtp(otp) {
  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/api/2fa/v1/verify-login/`,
      QueryString.stringify({ otp }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, isPublic: true },
    )
    .catch((e) => {
      throw (e);
    });

  return {
    redirectUrl: data.redirect_url || `${getConfig().LMS_BASE_URL}/dashboard`,
    success: data.success || false,
  };
}

export async function resendOtp() {
  await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/api/2fa/v1/resend/`,
      {},
      { isPublic: true },
    )
    .catch((e) => {
      throw (e);
    });
}
