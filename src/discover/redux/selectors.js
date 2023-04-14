
/**
 * Get posts
 */
export const getLikedPosts = (state) => state.Discover.allIds;

/**
 * Get ById
 */
export const getById = (state) => state.Discover.byId;

// Get Posts by Id
export const getPostsById = (state, { id }) => {
  const byId = getById(state);
  return byId[id]
};

/**
* Get Loading
*/
export const getLoading = (state) => state.Discover.loading;

/**
* Get Loading
*/
export const getError = (state) => state.Discover.error;
