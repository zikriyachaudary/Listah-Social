import * as constants from "./constants";

const INITIAL_STATE = {
  notifications: [],
  error: null,
  loading: false,
};

export default function reducer(state = INITIAL_STATE, action) {
  const { type, payload, error } = action;

  switch (type) {
    // GET_NOTIFICATIONS
    case constants.GET_NOTIFICATIONS.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.GET_NOTIFICATIONS.SUCCESS:
      return {
        ...state,
        notifications: payload,
      };
    case constants.GET_NOTIFICATIONS.FAIL:
      return {
        ...state,
        error,
      };
    case constants.GET_NOTIFICATIONS.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // DELETE_NOTIFICATION
    case constants.DELETE_NOTIFICATION.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.DELETE_NOTIFICATION.SUCCESS:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== payload
        ),
      };
    case constants.DELETE_NOTIFICATION.FAIL:
      return {
        ...state,
        error,
      };
    case constants.DELETE_NOTIFICATION.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
