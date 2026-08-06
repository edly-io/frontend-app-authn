// Todo: need to change imports when package is published to edly-io
import { emailCheckReducer, emailCheckStoreName } from '@edly-io/edly-saas-widget';
import { combineReducers } from 'redux';

import {
  reducer as commonComponentsReducer,
  storeName as commonComponentsStoreName,
} from '../common-components';
import {
  reducer as forgotPasswordReducer,
  storeName as forgotPasswordStoreName,
} from '../forgot-password';
import {
  reducer as loginReducer,
  storeName as loginStoreName,
} from '../login';
import {
  reducer as authnProgressiveProfilingReducers,
  storeName as authnProgressiveProfilingStoreName,
} from '../progressive-profiling';
import {
  reducer as registerReducer,
  storeName as registerStoreName,
} from '../register';
import {
  reducer as resetPasswordReducer,
  storeName as resetPasswordStoreName,
} from '../reset-password';
import {
  reducer as twoFactorAuthReducer,
  storeName as twoFactorAuthStoreName,
} from '../two-factor-auth';
import { RESET_EMAIL_CHECK } from './constants';

const resettableEmailCheckReducer = (state, action) => (
  action.type === RESET_EMAIL_CHECK ? emailCheckReducer(undefined, action) : emailCheckReducer(state, action)
);

const createRootReducer = () => combineReducers({
  [loginStoreName]: loginReducer,
  [registerStoreName]: registerReducer,
  [commonComponentsStoreName]: commonComponentsReducer,
  [emailCheckStoreName]: resettableEmailCheckReducer,
  [forgotPasswordStoreName]: forgotPasswordReducer,
  [resetPasswordStoreName]: resetPasswordReducer,
  [authnProgressiveProfilingStoreName]: authnProgressiveProfilingReducers,
  [twoFactorAuthStoreName]: twoFactorAuthReducer,
});
export default createRootReducer;
