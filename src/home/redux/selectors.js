import FireAuth from '@react-native-firebase/auth';

/**
 * Get posts
 */
export const getPosts = (state) => state.Home.allIds;

/**
 * Get ById
 */
export const getById = (state) => state.Home.byId;

// Get Posts by Id
export const getPostsById = (state, { id }) => {
  const byId = getById(state);
  return byId[id]
};

// Get My Posts 
export const getMyPosts = (state) => {
  const currentUser = FireAuth().currentUser.uid;
  const byId = Object.values(getById(state));
  const myPosts = [];

  byId.forEach((post) => {
    if (post?.author?.userId === currentUser) {
      myPosts.push(post?.id)
    };
  });

  return myPosts;
};

/**
* Get Loading
*/
export const getLoading = (state) => state.Home.loading;

/**
* Get Loading
*/
export const getError = (state) => state.Home.error;
