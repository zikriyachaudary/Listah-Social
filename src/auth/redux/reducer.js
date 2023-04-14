import * as constants from './constants';

const INITIAL_STATE = {
  user: null,
  error: null,
  loading: false,
};

export default function reducer(state = INITIAL_STATE, action) {
  const { type, payload, error } = action;

  switch (type) {
    case constants.AUTH_STATE_CHANGE:
      return {
        ...state,
        user: payload,
      };

    // LOGIN
    case constants.LOGIN.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.LOGIN.SUCCESS:
      return {
        ...state,
        user: payload,
      };
    case constants.LOGIN.FAIL:
      return {
        ...state,
        error,
      };
    case constants.LOGIN.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // FORGOT_PASSWORD
    case constants.FORGOT_PASSWORD.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.FORGOT_PASSWORD.SUCCESS:
      return {
        ...state,
      };
    case constants.FORGOT_PASSWORD.FAIL:
      return {
        ...state,
        error,
      };
    case constants.FORGOT_PASSWORD.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // Register
    case constants.REGISTER.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.REGISTER.SUCCESS:
      return {
        ...state,
        user: payload,
      };

    case constants.REGISTER.FAIL:
      return {
        ...state,
        error,
      };
    case constants.REGISTER.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // Logout
    case constants.LOGOUT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.LOGOUT.SUCCESS:
      return {
        ...state,
        user: null,
      };
    case constants.LOGOUT.FAIL:
      return {
        ...state,
        error,
      };
    case constants.LOGOUT.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
