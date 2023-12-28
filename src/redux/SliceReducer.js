import {
  SET_ALL_USER_FCM,
  SET_CATEGORIES_LIST,
  SET_IS_UN_READED,
  SET_PUSH_NOTI,
  SET_SHOW_SPLASH,
  SET_UPDATE_FB_TOKEN,
  SET_APP_LOADER,
} from "./action/types";

const initialState = {
  allUserFCMToken: [],
  updateToken: true,
  push_Noti: null,
  isShowSplash: true,
  isUnReaded: false,
  categoriesList: [],
  isLoaderStart: false,
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
    case SET_SHOW_SPLASH:
      return {
        ...state,
        isShowSplash: action.data,
      };
    case SET_IS_UN_READED:
      return {
        ...state,
        isUnReaded: action.data,
      };
    case SET_CATEGORIES_LIST:
      return {
        ...state,
        categoriesList: action.data,
      };
    case SET_APP_LOADER:
      return {
        ...state,
        isLoaderStart: action.data,
      };
    default:
      return state;
  }
};
export default SliceReducer;
