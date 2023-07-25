import { actionGenerator } from '../../util/reduxHelpers';

export const POST_SUGGEST = actionGenerator(
  'POST_SUGGEST',
);

export const APPROVE_SUGGESTION = actionGenerator(
  'APPROVE_SUGGESTION',
);

export const UPDATE_CHALLENGE_FEATURE = {
  isUpdate: false
}

export const CHALLENGE_REQUEST = {
  REQUEST : 0,
  ACCEPT: 1,
  REJECT: 2
}
