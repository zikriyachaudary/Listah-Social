import { actionGenerator } from '../../util/reduxHelpers';

export const AUTH_STATE_CHANGE = 'AUT_STATE_CHANGE';

export const LOGIN = actionGenerator(
  'LOGIN',
);

export const REGISTER = actionGenerator(
  'REGISTER',
);

export const FORGOT_PASSWORD = actionGenerator(
  'FORGOT_PASSWORD',
);

export const LOGOUT = actionGenerator(
  'LOGOUT',
);
