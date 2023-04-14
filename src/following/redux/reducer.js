import * as constants from './constants';

const INITIAL_STATE = {
  allUsers: [],
  userFollowings: [],
  error: null,
  loading: false,
};

export default function reducer(state = INITIAL_STATE, action) {
  const { type, payload, error } = action;

  switch (type) {
    // GET_ALL_USERS
    case constants.GET_ALL_USERS.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.GET_ALL_USERS.SUCCESS:
      return {
        ...state,
        allUsers: payload,
      };
    case constants.GET_ALL_USERS.FAIL:
      return {
        ...state,
        error,
      };
    case constants.GET_ALL_USERS.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // REFRESH_ALL_USERS
    case constants.REFRESH_ALL_USERS.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.REFRESH_ALL_USERS.SUCCESS:
      return {
        ...state,
        allUsers: payload.length ? [...state.allUsers, payload] : state.allUsers,
      };
    case constants.REFRESH_ALL_USERS.FAIL:
      return {
        ...state,
        error,
      };
    case constants.REFRESH_ALL_USERS.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // GET_USER_FOLLOWINGS
    case constants.GET_USER_FOLLOWINGS.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.GET_USER_FOLLOWINGS.SUCCESS:
      return {
        ...state,
        userFollowings: payload
      };
    case constants.GET_USER_FOLLOWINGS.FAIL:
      return {
        ...state,
        error,
      };
    case constants.GET_USER_FOLLOWINGS.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // USER_FOLLOW
    case constants.USER_FOLLOW.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.USER_FOLLOW.SUCCESS:
      return {
        ...state,
        userFollowings: [payload, ...state.userFollowings],
      };
    case constants.USER_FOLLOW.FAIL:
      return {
        ...state,
        error,
      };
    case constants.USER_FOLLOW.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // USER_UN_FOLLOW
    case constants.USER_UN_FOLLOW.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.USER_UN_FOLLOW.SUCCESS:
      return {
        ...state,
        userFollowings: state.userFollowings.filter((item) => item?.userId !== payload),
      };
    case constants.USER_UN_FOLLOW.FAIL:
      return {
        ...state,
        error,
      };
    case constants.USER_UN_FOLLOW.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // USER_SEARCH
    case constants.USER_SEARCH.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.USER_SEARCH.SUCCESS:
      return {
        ...state,
        allUsers: payload,
      };
    case constants.USER_SEARCH.FAIL:
      return {
        ...state,
        error,
      };
    case constants.USER_SEARCH.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
