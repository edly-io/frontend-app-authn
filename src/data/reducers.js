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
  reducer as nafathReducer,
  storeName as nafathStoreName,
} from '../nafath';

const createRootReducer = () => combineReducers({
  [loginStoreName]: loginReducer,
  [registerStoreName]: registerReducer,
  [commonComponentsStoreName]: commonComponentsReducer,
  [forgotPasswordStoreName]: forgotPasswordReducer,
  [resetPasswordStoreName]: resetPasswordReducer,
  [authnProgressiveProfilingStoreName]: authnProgressiveProfilingReducers,
  [nafathStoreName]: nafathReducer,
});
export default createRootReducer;
