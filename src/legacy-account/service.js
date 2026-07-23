import { getConfig } from '@edx/frontend-platform';
import { getHttpClient } from '@edx/frontend-platform/auth';

// eslint-disable-next-line import/prefer-default-export
export async function requestLegacySetPassword(email) {
  const { data } = await getHttpClient()
    .post(
      `${getConfig().LMS_BASE_URL}/rwaq/api/legacy-account/request-set-password/`,
      { email },
      { isPublic: true },
    )
    .catch((e) => {
      throw (e);
    });

  return data;
}
