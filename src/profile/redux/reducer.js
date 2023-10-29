import * as constants from "./constants";

const INITIAL_STATE = {
  profile: null,
  error: null,
  loading: false,
};

export default function reducer(state = INITIAL_STATE, action) {
  const { type, payload, error } = action;

  switch (type) {
    case constants.SET_PROFILE:
      return {
        ...state,
        profile: payload,
      };

    // GET_PROFILE
    case constants.GET_PROFILE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.GET_PROFILE.SUCCESS:
      return {
        ...state,
        profile: payload,
      };
    case constants.GET_PROFILE.FAIL:
      return {
        ...state,
        error,
      };
    case constants.GET_PROFILE.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // PROFILE_UPDATE
    case constants.PROFILE_UPDATE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.PROFILE_UPDATE.SUCCESS:
      return {
        ...state,
        profile: payload,
      };
    case constants.PROFILE_UPDATE.FAIL:
      return {
        ...state,
        error,
      };
    case constants.PROFILE_UPDATE.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // GET_PROFILE_BY_ID
    case constants.GET_PROFILE_BY_ID.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.GET_PROFILE_BY_ID.SUCCESS:
      return state;
    case constants.GET_PROFILE_BY_ID.FAIL:
      return {
        ...state,
        error,
      };
    case constants.GET_PROFILE_BY_ID.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
