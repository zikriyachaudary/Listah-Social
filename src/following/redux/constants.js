import { actionGenerator } from '../../util/reduxHelpers';

export const GET_ALL_USERS = actionGenerator(
  'GET_ALL_USERS',
);

export const REFRESH_ALL_USERS = actionGenerator(
  'REFRESH_ALL_USERS',
);

export const GET_USER_FOLLOWINGS = actionGenerator(
  'GET_USER_FOLLOWINGS',
);

export const USER_FOLLOW = actionGenerator(
  'USER_FOLLOW',
);

export const USER_UN_FOLLOW = actionGenerator(
  'USER_UN_FOLLOW',
);

export const USER_SEARCH = actionGenerator(
  'USER_SEARCH',
);
