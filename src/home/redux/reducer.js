import * as constants from './constants';
import * as helpers from '../../util/reduxHelpers';
import { NOTIFICATION_UNREAD, UPDATE_HOME_DATA } from './types';

export const LOADER_START = "FETCH"
const INITIAL_STATE = {
  byId: {},
  allIds: [],
  error: null,
  loading: false,
  updateHomeData: false,
  notificationUnread: 0
};

export default function reducer(state = INITIAL_STATE, action) {
  const { type, payload, error } = action;

  switch (type) {
    // GET_HOME_POSTS
    case constants.GET_HOME_POSTS.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case LOADER_START:
      return {
        ...state,
        loading: action.data
      };

    case UPDATE_HOME_DATA:
      return {
        ...state,
        updateHomeData: action.data
      }

    case NOTIFICATION_UNREAD:
      return {
        ...state,
        notificationUnread: action.data
      }
    case constants.GET_HOME_POSTS.SUCCESS:
      return {
        ...helpers.merge(state, payload),
      };
    case constants.GET_HOME_POSTS.FAIL:
      return {
        ...state,
        error,
      };
    case constants.GET_HOME_POSTS.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // REFRESH_HOME_POSTS
    case constants.REFRESH_HOME_POSTS.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.REFRESH_HOME_POSTS.SUCCESS:
      return {
        ...helpers.merge(state, payload),
      };
    case constants.REFRESH_HOME_POSTS.FAIL:
      return {
        ...state,
        error,
      };
    case constants.REFRESH_HOME_POSTS.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // CREATE_POST
    case constants.CREATE_POST.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.CREATE_POST.SUCCESS:
      return {
        ...helpers.add(state, payload)
      };
    case constants.CREATE_POST.FAIL:
      return {
        ...state,
        error,
      };
    case constants.CREATE_POST.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // UPDATED_POST
    case constants.UPDATED_POST.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.UPDATED_POST.SUCCESS:
      return {
        ...helpers.update(state, payload)
      };
    case constants.UPDATED_POST.FAIL:
      return {
        ...state,
        error,
      };
    case constants.UPDATED_POST.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // DELETE_POST
    case constants.DELETE_POST.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.DELETE_POST.SUCCESS:
      return {
        ...helpers.remove(state, payload)
      };
    case constants.DELETE_POST.FAIL:
      return {
        ...state,
        error,
      };
    case constants.DELETE_POST.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // POST_LIKE
    case constants.POST_LIKE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.POST_LIKE.SUCCESS:
      return {
        ...helpers.update(state, payload),
      };
    case constants.POST_LIKE.FAIL:
      return {
        ...state,
        error,
      };
    case constants.POST_LIKE.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // POST_DISLIKE
    case constants.POST_DISLIKE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.POST_DISLIKE.SUCCESS:
      return {
        ...helpers.update(state, payload),
      };
    case constants.POST_DISLIKE.FAIL:
      return {
        ...state,
        error,
      };
    case constants.POST_DISLIKE.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // COMMENT_POST
    case constants.COMMENT_POST.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.COMMENT_POST.SUCCESS:
      return {
        ...helpers.update(state, payload)
      };
    case constants.COMMENT_POST.FAIL:
      return {
        ...state,
        error,
      };
    case constants.COMMENT_POST.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
