import {
  CREATING_POST_FAIL,
  IS_ALERT_SHOW,
  SET_DRAFT_POST,
  SET_IS_ADMIN,
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
