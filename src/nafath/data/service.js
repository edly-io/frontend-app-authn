import { getConfig } from "@edx/frontend-platform";
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";

export async function authenticationAndRandomTextRequest(userId) {
  const requestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${getConfig().OPENEDX_API_KEY}`,
    },
    body: {
      Action: "SpRequest",
      Parameters: {
        service: "AdvancedLogin",
        id: userId,
      },
    },
  };

  const { data } = await getAuthenticatedHttpClient()
    .post(`https://www.iam.gov.sa/nafath/`, requestConfig)
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return {
    transId: data.transId,
    transId: data.random,
  };
}

export async function checkUserRequestStatusRequest(data) {
  const requestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${getConfig().OPENEDX_API_KEY}`,
    },
    body: {
      Action: "CheckSpRequest",
      Parameters: {
        transId: data.transId,
        id: data.userId,
        random: data.randomText,
      },
    },
  };

  const { response } = await getAuthenticatedHttpClient()
    .post(`https://www.iam.gov.sa/nafath/`, requestConfig)
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return response;
}
