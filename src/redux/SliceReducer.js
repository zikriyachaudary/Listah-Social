import {
  SET_ALL_USER_FCM,
  SET_PUSH_NOTI,
  SET_UPDATE_FB_TOKEN,
} from "./action/types";

const initialState = {
  allUserFCMToken: [],
  updateToken: true,
  push_Noti: null,
};
const SliceReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_USER_FCM:
      return {
        ...state,
        allUserFCMToken: action.data,
      };

    case SET_UPDATE_FB_TOKEN:
      return {
        ...state,
        updateToken: action.data,
      };
    case SET_PUSH_NOTI:
      return {
        ...state,
        push_Noti: action.data,
      };
    default:
      return state;
  }
};
export default SliceReducer;
