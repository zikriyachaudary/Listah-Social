import {
  CREATING_POST_FAIL,
  IS_ALERT_SHOW,
  SET_ALL_USER_FCM,
  SET_APP_LOADER,
  SET_CATEGORIES_LIST,
  SET_DRAFT_POST,
  SET_HIDE_TAB,
  SET_IS_ADMIN,
  SET_IS_UN_READED,
  SET_PUSH_NOTI,
  SET_SHOW_SPLASH,
  SET_SHOW_TOAST,
  SET_THREAD_LIST,
  SET_UPDATE_FB_TOKEN,
} from "./types";

export const setDraftPost = (data) => ({
  type: SET_DRAFT_POST,
  data: data,
});

export const setCreatePostFailError = (data) => ({
  type: CREATING_POST_FAIL,
  data: data,
});

export const setIsAlertShow = (data) => ({
  type: IS_ALERT_SHOW,
  data: data,
});

export const setIsAdmin = (data) => ({
  type: SET_IS_ADMIN,
  data: data,
});

export const setUpdateFBToken = (data) => ({
  type: SET_UPDATE_FB_TOKEN,
  data: data,
});

export const setAllUserFCMToken = (data) => ({
  type: SET_ALL_USER_FCM,
  data: data,
});

export const setPushNotifi = (data) => ({
  type: SET_PUSH_NOTI,
  data: data,
});

export const setIsShowSplash = (data) => ({
  type: SET_SHOW_SPLASH,
  data: data,
});

export const setIsUnReadMsg = (data) => ({
  type: SET_IS_UN_READED,
  data: data,
});

export const setCategoriesInRed = (data) => ({
  type: SET_CATEGORIES_LIST,
  data: data,
});

export const setIsAppLoader = (data) => ({
  type: SET_APP_LOADER,
  data: data,
});

export const setThreadList = (data) => ({
  type: SET_THREAD_LIST,
  data: data,
});

export const setIsHideTabBar = (data) => ({
  type: SET_HIDE_TAB,
  data: data,
});

export const setShowToast = (data) => ({
  type: SET_SHOW_TOAST,
  data: data,
});
