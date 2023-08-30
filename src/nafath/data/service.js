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
    .post(`${getConfig().LMS_BASE_URL}/nafath/initiate_request`, requestConfig)
    .catch((e) => {
      throw e;
    });
  return {
    transId: data.trans_id,
    random: data.random,
  };
}

export async function checkUserRequestStatusRequest(transId) {
  const requestConfig = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    trans_id: transId,
  };

  const { data } = await getAuthenticatedHttpClient()
    .post(`${getConfig().LMS_BASE_URL}/nafath/check_status`, requestConfig)
    .catch((e) => {
      throw e;
    });

  return data;
}

export async function completeNafathUserRegistration(userRegistrationPayload) {
  const requestConfig = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    trans_id: userRegistrationPayload.trans_id,
    user_data: userRegistrationPayload.user_data,
  };

  const { data } = await getHttpClient()
    .post(`${getConfig().LMS_BASE_URL}/nafath/register_user`, requestConfig)
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return data;
}
