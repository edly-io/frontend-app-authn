import { emailCheckSaga } from '@edly-io/edly-saas-widget';
import { all } from 'redux-saga/effects';

import { saga as commonComponentsSaga } from '../common-components';
import { saga as forgotPasswordSaga } from '../forgot-password';
import { saga as loginSaga } from '../login';
import { saga as authnProgressiveProfilingSaga } from '../progressive-profiling';
import { saga as registrationSaga } from '../register';
import { saga as resetPasswordSaga } from '../reset-password';
import { saga as twoFactorAuthSaga } from '../two-factor-auth';

export default function* rootSaga() {
  yield all([
    loginSaga(),
    registrationSaga(),
    commonComponentsSaga(),
    emailCheckSaga(),
    forgotPasswordSaga(),
    resetPasswordSaga(),
    authnProgressiveProfilingSaga(),
    twoFactorAuthSaga(),
  ]);
}
