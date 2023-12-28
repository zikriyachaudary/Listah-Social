import FireStore from "@react-native-firebase/firestore";
import FireAuth from "@react-native-firebase/auth";
import { setProfile } from "../../profile/redux/actions";
import * as constants from "./constants";

const ProfilesCollection = FireStore().collection("profiles");
const BlockUsersCollection = FireStore().collection("blockUsers");

/**
 * GET_ALL_USERS
 */
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: constants.GET_ALL_USERS.REQUEST });
    const currentUser = FireAuth().currentUser.uid;

    // GET_ALL_PROFILES
    const profileSnapshot = await ProfilesCollection.limit(10).get();
    const profiles = [];
    if (!profileSnapshot.empty) {
      profileSnapshot.forEach((snapshot) => {
        const profile = snapshot.data();
        if (profile.userId !== currentUser) {
          profiles.push({
            ...profile,
            id: snapshot.id,
          });
        }
      });
    }
    // const userProfiles = await removeBlockUser(profiles)
    // console.log("myUsers -- > " , userProfiles)
    dispatch({
      type: constants.GET_ALL_USERS.SUCCESS,
      payload: profiles,
    });
  } catch (error) {
    dispatch({ type: constants.GET_ALL_USERS.FAIL, error });
  } finally {
    dispatch({ type: constants.GET_ALL_USERS.COMPLETE });
  }
};

/**
 * REFRESH_ALL_USERS
 */
export const refreshAllUsers = (lastDocId) => async (dispatch) => {
  try {
    dispatch({ type: constants.REFRESH_ALL_USERS.REQUEST });
    const currentUser = FireAuth().currentUser.uid;
    const prevDoc = await ProfilesCollection.doc(lastDocId).get();

    // GET_ALL_PROFILES
    const profileSnapshot = await ProfilesCollection.startAfter(prevDoc)
      .limit(10)
      .get();
    const profiles = [];
    if (!profileSnapshot.empty) {
      profileSnapshot.forEach((snapshot) => {
        const profile = snapshot.data();
        if (profile.userId !== currentUser) {
          profiles.push({
            ...profile,
            id: snapshot.id,
          });
        }
      });
    }

    dispatch({
      type: constants.REFRESH_ALL_USERS.SUCCESS,
      payload: profiles,
    });
  } catch (error) {
    dispatch({ type: constants.REFRESH_ALL_USERS.FAIL, error });
  } finally {
    dispatch({ type: constants.REFRESH_ALL_USERS.COMPLETE });
  }
};

/**
 * GET_USER_FOLLOWINGS
 */
export const getUserFollowings = () => async (dispatch) => {
  try {
    dispatch({ type: constants.GET_USER_FOLLOWINGS.REQUEST });
    const currentUser = FireAuth().currentUser.uid;

    const userProfile = await ProfilesCollection.doc(currentUser).get();
    const userFollowingIds = await userProfile.data().followings;

    // POPULATE USER FOLLOWING IDS
    const userFollowings = await Promise.all(
      userFollowingIds.map(async (id) => {
        const author = await ProfilesCollection.doc(id).get();
        return author.data();
      })
    );

    dispatch({
      type: constants.GET_USER_FOLLOWINGS.SUCCESS,
      payload: userFollowings,
    });
  } catch (error) {
    dispatch({ type: constants.GET_USER_FOLLOWINGS.FAIL, error });
  } finally {
    dispatch({ type: constants.GET_USER_FOLLOWINGS.COMPLETE });
  }
};

/**
 * USER_FOLLOW
 */
export const followUser = (userId, onComplete) => async (dispatch) => {
  try {
    dispatch({ type: constants.USER_FOLLOW.REQUEST });
    // ADDING USER_ID TO CURRENT USERS FOLLOWING LIST
    const currentUser = FireAuth().currentUser.uid;
    const currentUserProfile = await ProfilesCollection.doc(currentUser).get();
    const currentUserFollowing = await currentUserProfile.data().followings;
    const currentUserFollowingUpdated = [...currentUserFollowing, userId];
    await ProfilesCollection.doc(currentUser).update({
      followings: currentUserFollowingUpdated,
    });
    onComplete({ status: true, message: "Follow Successflly!" });

    // SAVING UPDATED PROFILE DOC TO PROFILE REDUX AS WELL
    const updatedCurrentUserProfile = await (
      await ProfilesCollection.doc(currentUser).get()
    ).data();
    dispatch(setProfile(updatedCurrentUserProfile));

    // ADDING NOTIFICATION TO USER_ID ABOUT FOLLOW
    // & ADDING CURRENT USER TO FOLLOWED USER FOLLOWERS
    const followedUserProfile = await (
      await ProfilesCollection.doc(userId).get()
    ).data();
    await ProfilesCollection.doc(userId).update({
      followers: [...followedUserProfile.followers, currentUser],
      notifications: [
        {
          id: Date.now(),
          type: "follow",
          sender: currentUser,
          unread: true,
        },
        ...followedUserProfile.notifications,
      ],
    });
    dispatch({
      type: constants.USER_FOLLOW.SUCCESS,
      payload: followedUserProfile,
    });
  } catch (error) {
    onComplete({ status: false, message: "Something went wrong!" });

    dispatch({ type: constants.USER_FOLLOW.FAIL, error });
  } finally {
    dispatch({ type: constants.USER_FOLLOW.COMPLETE });
  }
};

/**
 * USER_UN_FOLLOW
 */
export const unFollowUser = (userId, onComplete) => async (dispatch) => {
  try {
    dispatch({ type: constants.USER_UN_FOLLOW.REQUEST });
    // FILTERING USER_ID TO CURRENT USERS FOLLOWING LIST
    const currentUser = FireAuth().currentUser.uid;
    const userProfile = await ProfilesCollection.doc(currentUser).get();
    const userFollowings = await userProfile.data().followings;
    const userFollowingsUpdated = userFollowings.filter(
      (item) => item !== userId
    );
    await ProfilesCollection.doc(currentUser).update({
      followings: userFollowingsUpdated,
    });
    onComplete({ status: true, message: "unFollow Successflly!" });
    // SAVING UPDATED PROFILE DOC TO PROFILE REDUX AS WELL
    const updatedCurrentUserProfile = await (
      await ProfilesCollection.doc(currentUser).get()
    ).data();
    dispatch(setProfile(updatedCurrentUserProfile));

    // & REMOVING CURRENT USER TO FOLLOWED USER FOLLOWERS
    const followedUserProfile = await (
      await ProfilesCollection.doc(userId).get()
    ).data();
    await ProfilesCollection.doc(userId).update({
      followers: followedUserProfile.followers?.filter(
        (id) => id !== currentUser
      ),
    });
    dispatch({ type: constants.USER_UN_FOLLOW.SUCCESS, payload: userId });
  } catch (error) {
    onComplete({ status: false, message: "Something went wrong!" });
    dispatch({ type: constants.USER_UN_FOLLOW.FAIL, error });
  } finally {
    dispatch({ type: constants.USER_UN_FOLLOW.COMPLETE });
  }
};

/**
 * USER_SEARCH
 */
export const searchUser = (searchTxt) => async (dispatch) => {
  try {
    dispatch({ type: constants.USER_SEARCH.REQUEST });

    // GET_ALL_PROFILES
    const profileSnapshot = await ProfilesCollection.get();
    const searchedProfiles = [];

    if (!profileSnapshot.empty) {
      profileSnapshot.forEach((snapshot) => {
        const profile = snapshot.data();
        if (profile.username.toLowerCase().includes(searchTxt.toLowerCase())) {
          if (FireAuth().currentUser.uid !== profile.userId) {
            searchedProfiles.push({
              ...profile,
              id: snapshot.id,
            });
          }
        }
      });
    }

    dispatch({
      type: constants.USER_SEARCH.SUCCESS,
      payload: searchedProfiles,
    });
  } catch (error) {
    dispatch({ type: constants.USER_SEARCH.FAIL, error });
  } finally {
    dispatch({ type: constants.USER_SEARCH.COMPLETE });
  }
};

const removeBlockUser = async (profileList) => {
  const alreadyBlockUsersCollection = await BlockUsersCollection.where(
    "blockedBy",
    "==",
    currentUserUid
  ).get();
  const alreadyBlockUsersId = alreadyBlockUsersCollection.docs;
  let blockedUsersId = [];
  alreadyBlockUsersId.forEach((item) => {
    blockedUsersId.push(item.data());
  });

  let finalPopularPosts = [];
  if (blockedUsersId.length > 0) {
    profileList.forEach((item) => {
      blockedUsersId.forEach((blockData) => {
        blockData.blockUserId.forEach((mdata) => {
          if (item.id != mdata) {
            finalPopularPosts.push(item);
          }
        });
      });
    });
  } else {
    finalPopularPosts = profileList;
  }

  return finalPopularPosts;
};
