import FireStore from '@react-native-firebase/firestore';
import * as constants from './constants';

const ProfileCollection = FireStore().collection('profiles');
const PostsCollection = FireStore().collection('posts');

const getPostsQuery = PostsCollection.orderBy('likes', 'desc').where('likes', '>=', 2).limit(5);

/**
 * UPDATE_POST
 */
export const updateDiscoveryPost = (payload) => ({
  type: constants.UPDATE_POST,
  payload,
});

/**
 * DELETE_POST
 */
export const deleteDiscoveryPost = (payload) => ({
  type: constants.DELETE_POST,
  payload,
});

/**
 * GET_LIKED_POSTS
 */
export const getLikedPosts = () => async (dispatch) => {
  try {
    dispatch({ type: constants.GET_LIKED_POSTS.REQUEST });

    const postsSnap = await getPostsQuery.get();

    const posts = [];

   
    if (!postsSnap.empty) {
      postsSnap.forEach((post) => {
        posts.push({
          ...post.data(),
          id: post?.id,
        })
      })
    } else {
      dispatch({ type: constants.GET_LIKED_POSTS.SUCCESS, payload: [] });
    }

    // POPULATE AUTHOR
    const populatedPosts = await Promise.all(posts.map(async (post) => {
     
      const author = await (await ProfileCollection.doc(post?.author).get()).data();
      return {
        ...post,
        author: {
          userId: author?.userId,
          username: author?.username,
          profileImage: author?.profileImage,
        },
      }
    }))
    const compList = populatedPosts.map((item) => {
      let itemsTitleAndDescription = "";
      item.items.forEach((element) => {
        itemsTitleAndDescription += element.name + element.description;
      });
      const mSearchTxts =
        item.title + item.description + itemsTitleAndDescription;
      const obj = { ...item, searchTxt: mSearchTxts };
      return obj;
    });

    dispatch({ type: constants.GET_LIKED_POSTS.SUCCESS, payload: compList });
  } catch (error) {
    dispatch({ type: constants.GET_LIKED_POSTS.FAIL, error });
  } finally {
    dispatch({ type: constants.GET_LIKED_POSTS.COMPLETE });
  }
};

/**
 * REFRESH_LIKED_POSTS
 */
export const refreshLikedPosts = (prevDocId) => async (dispatch) => {
  try {
    dispatch({ type: constants.REFRESH_LIKED_POSTS.REQUEST });
    const prevDoc = await PostsCollection.doc(prevDocId).get();

    const postsSnap = await getPostsQuery.startAfter(prevDoc).get();

    const posts = [];

    if (!postsSnap.empty) {
      postsSnap.forEach((post) => {
        posts.push({
          ...post.data(),
          id: post?.id,
        })
      })
    } else {
      dispatch({ type: constants.REFRESH_LIKED_POSTS.SUCCESS, payload: [] });
    }

    // POPULATE AUTHOR
    const populatedPosts = await Promise.all(posts.map(async (post) => {
      const author = await (await ProfileCollection.doc(post?.author).get()).data();
      return {
        ...post,
        author: {
          userId: author?.userId,
          username: author?.username,
          profileImage: author?.profileImage,
        },
      }
    }))

    const compList = populatedPosts.map((item) => {
      let itemsTitleAndDescription = "";
      item.items.forEach((element) => {
        itemsTitleAndDescription += element.name + element.description;
      });
      const mSearchTxts =
        item.title + item.description + itemsTitleAndDescription;
      const obj = { ...item, searchTxt: mSearchTxts };
      return obj;
    });

    dispatch({ type: constants.REFRESH_LIKED_POSTS.SUCCESS, payload: compList });
  } catch (error) {
    dispatch({ type: constants.REFRESH_LIKED_POSTS.FAIL, error });
  } finally {
    dispatch({ type: constants.REFRESH_LIKED_POSTS.COMPLETE });
  }
};
