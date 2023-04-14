import * as constants from './constants';

const INITIAL_STATE = {
  error: null,
  loading: false,
};

export default function reducer(state = INITIAL_STATE, action) {
  const { type, error } = action;

  switch (type) {
    // POST_SUGGEST
    case constants.POST_SUGGEST.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.POST_SUGGEST.SUCCESS:
      return state;
    case constants.POST_SUGGEST.FAIL:
      return {
        ...state,
        error,
      };
    case constants.POST_SUGGEST.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    // APPROVE_SUGGESTION
    case constants.APPROVE_SUGGESTION.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case constants.APPROVE_SUGGESTION.SUCCESS:
      return state;
    case constants.APPROVE_SUGGESTION.FAIL:
      return {
        ...state,
        error,
      };
    case constants.APPROVE_SUGGESTION.COMPLETE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
