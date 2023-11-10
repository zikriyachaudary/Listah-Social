import {
  CREATING_POST_FAIL,
  IS_ALERT_SHOW,
  SET_DRAFT_POST,
  SET_IS_ADMIN,
} from "./action/types";

const initialState = {
  draftPost: [],
  createPostAPIFail: "",
  isAlertShow: { value: false, message: "" },
  isAdmin: false,
};
const DraftPostReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DRAFT_POST:
      return {
        ...state,
        draftPost: action.data,
      };
    case CREATING_POST_FAIL:
      return {
        ...state,
        createPostAPIFail: action.data,
      };

    case IS_ALERT_SHOW:
      return {
        ...state,
        isAlertShow: action.data,
      };

    case SET_IS_ADMIN:
      return {
        ...state,
        isAdmin: action.data,
      };
    default:
      return state;
  }
};
export default DraftPostReducer;
