import { getConfig } from "@edx/frontend-platform";
import {
  getAuthenticatedHttpClient,
  getHttpClient,
} from "@edx/frontend-platform/auth";

export async function authenticationAndRandomTextRequest(userId) {
  const requestConfig = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    nafath_id: userId,
  };

  const { data } = await getHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/nafath/api/v1/initiate_request`,
      requestConfig
    )
    .catch((e) => {
      const data = e.response;
      return data;
    });
  if ("error" in data) {
    return data;
  }
  return {
    transId: data.trans_id,
    random: data.random,
  };
}

export async function checkUserRequestStatusRequest(payload) {
  const requestConfig = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    nafath_id: payload.nafath_id,
    trans_id: payload.trans_id,
    user_data: payload.user_data,
  };
  const { data } = await getAuthenticatedHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/nafath/api/v1/check_status`,
      requestConfig
    )
    .catch((e) => {
      throw e;
    });

  return data;
}

export async function verifyBackendValidationsAndSendUserActivationCode(userRegistrationPayload) {
  const requestConfig = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    nafath_id: userRegistrationPayload.nafath_id,
    trans_id: userRegistrationPayload.trans_id,
    user_data: userRegistrationPayload.user_data,
  };

  const { data } = await getHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/nafath/api/v1/register_user`,
      requestConfig
    )
    .catch((e) => {
      return e.response;
    });

  return data;
}
