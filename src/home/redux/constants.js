import { actionGenerator } from "../../util/reduxHelpers";
import { LOADER_START } from "./reducer";

export const GET_HOME_POSTS = actionGenerator("GET_HOME_POSTS");

export const startLoader = (isLoaderStart) => ({
  type: LOADER_START,
  data: isLoaderStart,
});

export const REFRESH_HOME_POSTS = actionGenerator("REFRESH_HOME_POSTS");

export const CREATE_POST = actionGenerator("CREATE_POST");

export const UPDATED_POST = actionGenerator("UPDATED_POST");

export const DELETE_POST = actionGenerator("DELETE_POST");

export const POST_LIKE = actionGenerator("POST_LIKE");

export const POST_DISLIKE = actionGenerator("POST_DISLIKE");

export const COMMENT_POST = actionGenerator("COMMENT_POST");
