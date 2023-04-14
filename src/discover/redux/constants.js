import { actionGenerator } from '../../util/reduxHelpers';

export const UPDATE_POST = 'UPDATE_POST';

export const DELETE_POST = 'DELETE_POST';

export const GET_LIKED_POSTS = actionGenerator(
  'GET_LIKED_POSTS',
);

export const REFRESH_LIKED_POSTS = actionGenerator(
  'REFRESH_LIKED_POSTS',
);