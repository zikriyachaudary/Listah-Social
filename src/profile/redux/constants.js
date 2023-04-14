import { actionGenerator } from '../../util/reduxHelpers';

export const SET_PROFILE = "SET_PROFILE"

export const GET_PROFILE = actionGenerator(
  'GET_PROFILE',
);

export const GET_PROFILE_BY_ID = actionGenerator(
  'GET_PROFILE_BY_ID',
);

export const PROFILE_UPDATE = actionGenerator(
  'PROFILE_UPDATE',
);
