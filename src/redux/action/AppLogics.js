import {
  CREATING_POST_FAIL,
  IS_ALERT_SHOW,
  SET_ALL_USER_FCM,
  SET_DRAFT_POST,
  SET_IS_ADMIN,
  SET_IS_SHOW_NOTI,
  SET_PUSH_NOTI,
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
