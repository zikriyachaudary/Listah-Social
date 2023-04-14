import * as constants from './constants';
import * as helpers from '../../util/reduxHelpers';

const INITIAL_STATE = {
  byId: {},
  allIds: [],
  error: null,
  loading: false,
};

export default function reducer(state = INITIAL_STATE, action) {
  const { type, payload, error } = action;
  switch (type) {
    // UPDATE_POST
    case constants.UPDATE_POST:
      return {
        ...helpers.update(state, payload)
      }

    // DELETE_POST
    case constants.DELETE_POST:
      return {
        ...helpers.remove(state, payload)
      }

    // GET_LIKED_POSTS
    case constants.GET_LIKED_POSTS.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.GET_LIKED_POSTS.SUCCESS:
      return {
        ...helpers.merge(state, payload),
      };
    case constants.GET_LIKED_POSTS.FAIL:
      return {
        ...state,
        error,
      };
    case constants.GET_LIKED_POSTS.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // REFRESH_LIKED_POSTS
    case constants.REFRESH_LIKED_POSTS.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.REFRESH_LIKED_POSTS.SUCCESS:
      return {
        ...helpers.merge(state, payload),
      };
    case constants.REFRESH_LIKED_POSTS.FAIL:
      return {
        ...state,
        error,
      };
    case constants.REFRESH_LIKED_POSTS.COMPLETE:
      return {
        ...state,
        loading: false,
      };


    default:
      return state;
  }
}
