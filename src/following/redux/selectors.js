/**
 * GET_ALL_USERS
 */
export const getAllUsers = (state) => state.Following.allUsers;

/**
 * GET_USER_FOLLOWING
 */
export const getUserFollowings = (state) => state.Following.userFollowings;

/**
* Get Loading
*/
export const getLoading = (state) => state.Following.loading;

/**
* Get Loading
*/
export const getError = (state) => state.Following.error;
