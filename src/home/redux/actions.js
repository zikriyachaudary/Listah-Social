import { Alert } from "react-native";
import FireStore from "@react-native-firebase/firestore";
import FireAuth from "@react-native-firebase/auth";
import FireStorage from "@react-native-firebase/storage";
import ImageResizer from "react-native-image-resizer";
import firestore from "@react-native-firebase/firestore";

import { setProfile } from "../../profile/redux/actions";
import {
  updateDiscoveryPost,
  deleteDiscoveryPost,
} from "../../discover/redux/actions";
import * as constants from "./constants";
import { useDispatch } from "react-redux";
import { CHALLENGE_REQUEST } from "../../suggestion/redux/constants";
import { setCreatePostFailError } from "../../redux/action/AppLogics";
import moment from "moment";
import ThreadManager from "../../ChatModule/ThreadManger";

const PostsCollection = FireStore().collection("posts");
const AnnouncementCollection = FireStore().collection("announcements");
const ProfilesCollection = FireStore().collection("profiles");
const ReportPostCollection = FireStore().collection("reports");
const BlockUsersCollection = FireStore().collection("blockUsers");

const getHomePostsQuery = PostsCollection.orderBy("createdAt", "desc").limit(
  100
);

const getAnnouncementQuery = AnnouncementCollection.orderBy(
  "createdAt",
  "desc"
).limit(50);

/**
 * GET_HOME_POSTS
 */
export const getHomePosts = () => async (dispatch) => {
  try {
    console.log("enter ooo ");
    dispatch({ type: constants.GET_HOME_POSTS.SUCCESS, payload: [] });

    dispatch({ type: constants.GET_HOME_POSTS.REQUEST });
    const currentUserUid = FireAuth().currentUser.uid;
    const currentUserProfile = await (
      await ProfilesCollection.doc(currentUserUid).get()
    ).data();
    const followingUsers = currentUserProfile.followings;

    // GET ALL POSTS
    const postSnapshot = await getHomePostsQuery.get();
    const allPosts = [];
    if (!postSnapshot.empty) {
      postSnapshot.forEach((snapshot) => {
        allPosts.push({
          ...snapshot.data(),
          id: snapshot.id,
        });
      });
    } else {
      dispatch({ type: constants.GET_HOME_POSTS.SUCCESS, payload: [] });
    }

    // FILTERING FOLLOWING USERS POSTS FROM ALL POSTS
    const followedUserPost = [];
    for (let i = 0; i < allPosts.length; i++) {
      for (let j = 0; j < followingUsers.length; j++) {
        if (followingUsers[j] === allPosts[i].author) {
          followedUserPost.push(allPosts[i]);
        }
      }
      if (allPosts[i].author === currentUserUid) {
        followedUserPost.push(allPosts[i]);
      }
    }

    // POPULATE AUTHOR
    const populatedPosts = await Promise.all(
      followedUserPost.map(async (post) => {
        const author = await (
          await ProfilesCollection.doc(post?.author).get()
        ).data();
        return {
          ...post,
          author: {
            userId: author?.userId,
            username: author?.username,
            profileImage: author?.profileImage,
          },
        };
      })
    );
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
      populatedPosts.forEach((item) => {
        blockedUsersId.forEach((blockData) => {
          blockData.blockUserId.forEach((mdata) => {
            if (item.author.userId != mdata) {
              finalPopularPosts.push(item);
            }
          });
        });
      });
    } else {
      finalPopularPosts = populatedPosts;
    }

    dispatch({
      type: constants.GET_HOME_POSTS.SUCCESS,
      payload: finalPopularPosts,
    });
  } catch (error) {
    dispatch({ type: constants.GET_HOME_POSTS.FAIL, error });
  } finally {
    dispatch({ type: constants.GET_HOME_POSTS.COMPLETE });
  }
};

export const getAnnouncementPosts = async () => {
  const postSnapshot = await getAnnouncementQuery.get();

  const allPosts = [];
  if (!postSnapshot.empty) {
    postSnapshot.forEach((snapshot) => {
      allPosts.push({
        ...snapshot.data(),
        id: snapshot.id,
      });
    });
  } else {
    return [];
  }

  // POPULATE AUTHOR
  const populatedPosts = await Promise.all(
    allPosts.map(async (post) => {
      const author = await (
        await ProfilesCollection.doc(post?.author).get()
      ).data();
      return {
        ...post,
        author: {
          userId: author?.userId,
          username: author?.username,
          profileImage: author?.profileImage,
        },
      };
    })
  );

  return populatedPosts;
};

export const getMyHomePosts = async () => {
  try {
    const currentUserUid = FireAuth().currentUser.uid;
    const currentUserProfile = await (
      await ProfilesCollection.doc(currentUserUid).get()
    ).data();
    const followingUsers = currentUserProfile.followings;

    // GET ALL POSTS
    const postSnapshot = await getHomePostsQuery.get();

    const allPosts = [];
    if (!postSnapshot.empty) {
      postSnapshot.forEach((snapshot) => {
        allPosts.push({
          ...snapshot.data(),
          id: snapshot.id,
        });
      });
    } else {
      return [];
    }

    // FILTERING FOLLOWING USERS POSTS FROM ALL POSTS
    const followedUserPost = [];
    for (let i = 0; i < allPosts.length; i++) {
      for (let j = 0; j < followingUsers.length; j++) {
        if (typeof allPosts[i].author == "string") {
          if (followingUsers[j] === allPosts[i].author) {
            followedUserPost.push(allPosts[i]);
          }
        } else {
          const obj = allPosts[i];
          obj["author"] = allPosts[i].author.userIds
            ? allPosts[i].author.userIds
            : allPosts[i].author.userId;
          if (
            followingUsers[j] === allPosts[i].author.userIds
              ? allPosts[i].author.userIds
              : allPosts[i].author.userId
          ) {
            followedUserPost.push(obj);
          }
        }
      }
      if (typeof allPosts[i].author == "string") {
        if (allPosts[i].author === currentUserUid) {
          followedUserPost.push(allPosts[i]);
        }
      } else {
        const obj = allPosts[i];
        obj["author"] = allPosts[i].author.userIds
          ? allPosts[i].author.userIds
          : allPosts[i].author.userId;
        if (
          allPosts[i].author.userIds
            ? allPosts[i].author.userIds
            : allPosts[i].author.userId === currentUserUid
        ) {
          followedUserPost.push(obj);
        }
      }
    }

    // POPULATE AUTHOR
    const populatedPosts = await Promise.all(
      followedUserPost.map(async (post) => {
        const author = await (
          await ProfilesCollection.doc(post?.author).get()
        ).data();
        return {
          ...post,
          author: {
            userId: author?.userId,
            username: author?.username,
            profileImage: author?.profileImage,
            verified: author?.verified ? true : false,
          },
        };
      })
    );

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
      populatedPosts.forEach((item) => {
        blockedUsersId.forEach((blockData) => {
          blockData.blockUserId.forEach((mdata) => {
            if (item.author.userId != mdata) {
              finalPopularPosts.push(item);
            }
          });
        });
      });
    } else {
      finalPopularPosts = populatedPosts;
    }

    return finalPopularPosts;
    // dispatch({ type: constants.GET_HOME_POSTS.SUCCESS, payload: populatedPosts });
  } catch (error) {
    console.log("error - > ", error);

    return [];
    // dispatch({ type: constants.GET_HOME_POSTS.FAIL, error });
  }
};

export const getUserProfilesById = async (likedUserList) => {
  let userDataList = [];
  for (let index = 0; index < likedUserList.length; index++) {
    const item = likedUserList[index];
    const userProfileOfPost = await (
      await ProfilesCollection.doc(item).get()
    ).data();
    if (userProfileOfPost) {
      userDataList.push(userProfileOfPost);
    }
  }
  return userDataList;
};

//get user post
export const getPostsByID = async (userId) => {
  const userPosts = await PostsCollection.where("author", "==", userId).get();
  const userProfileOfPost = await (
    await ProfilesCollection.doc(userId).get()
  ).data();
  const authorObj = {
    profileImage: userProfileOfPost.profileImage,
    userId: userProfileOfPost.userId,
    username: userProfileOfPost.username,
    verified: userProfileOfPost?.verified ? true : false,
  };
  let totalUserPost = [];
  userPosts.forEach((doc) => {
    if (doc.exists) {
      const mObj = { ...doc.data(), author: authorObj };
      totalUserPost.push(mObj);
    }
  });
  return totalUserPost;
};

export const getPostInfoById = async (postId) => {
  try {
    const postInfo = await (await PostsCollection.doc(postId).get()).data();
    // console.log("printPostInfo - > " , postInfo)
    return postInfo;
  } catch (error) {
    return null;
  }
};

/**
 * REFRESH_HOME_POSTS
 */
export const refreshHomePosts = (lastDocId) => async (dispatch) => {
  try {
    dispatch({ type: constants.REFRESH_HOME_POSTS.REQUEST });
    const currentUserUid = FireAuth().currentUser.uid;
    const prevDoc = await PostsCollection.doc(lastDocId).get();
    const currentUserProfile = await (
      await ProfilesCollection.doc(currentUserUid).get()
    ).data();
    const followingUsers = currentUserProfile.followings;

    const postSnapshot = await getHomePostsQuery.startAfter(prevDoc).get();
    const allPosts = [];
    if (!postSnapshot.empty) {
      postSnapshot.forEach((snapshot) => {
        allPosts.push({
          ...snapshot.data(),
          id: snapshot.id,
        });
      });
    }

    // FILTERING FOLLOWING USERS POSTS FROM ALL POSTS AND ADDING USERS OWN POSTS
    const followedUserPost = [];
    for (let i = 0; i < allPosts.length; i++) {
      for (let j = 0; j < followingUsers.length; j++) {
        if (followingUsers[j] === allPosts[i].author) {
          followedUserPost.push(allPosts[i]);
        }
      }
      if (allPosts[i].author === currentUserUid) {
        followedUserPost.push(allPosts[i]);
      }
    }

    // POPULATE AUTHOR
    const populatedPosts = await Promise.all(
      followedUserPost.map(async (post) => {
        const author = await (
          await ProfilesCollection.doc(post?.author).get()
        ).data();
        return {
          ...post,
          author: {
            userId: author?.userId,
            username: author?.username,
            profileImage: author?.profileImage,
            verified: author?.verified ? true : false,
          },
        };
      })
    );

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
      populatedPosts.forEach((item) => {
        blockedUsersId.forEach((blockData) => {
          blockData.blockUserId.forEach((mdata) => {
            if (item.author.userId != mdata) {
              finalPopularPosts.push(item);
            }
          });
        });
      });
    } else {
      finalPopularPosts = populatedPosts;
    }

    dispatch({
      type: constants.REFRESH_HOME_POSTS.SUCCESS,
      payload: finalPopularPosts,
    });
  } catch (error) {
    dispatch({ type: constants.REFRESH_HOME_POSTS.FAIL, error });
  } finally {
    dispatch({ type: constants.REFRESH_HOME_POSTS.COMPLETE });
  }
};

export const createAnnouncementPost =
  (postContent, onComplete) => async (dispatch) => {
    try {
      dispatch({ type: constants.CREATE_POST.REQUEST });
      const {
        title,
        description,
        items,
        order,
        isNumberShowInItems,
        category,
      } = postContent;
      const postId = Date.now();
      const authorId = FireAuth().currentUser.uid;

      const post = {
        id: postId,
        title,
        order,
        isNumberShowInItems,
        description,
        likes: 0,
        shares: 0,
        comments: [],
        likedUsers: [],
        author: authorId,
        category,
        announcement: true,
        createdAt: FireStore.FieldValue.serverTimestamp(),
      };

      if (items) {
        post.items = await Promise.all(
          items.map(async (item, index) => {
            let uploadImgUrl = "";

            if (item.image && item.image.uri != "") {
              const compressedImage = await ImageResizer.createResizedImage(
                item.image.uri,
                1000,
                1000,
                "PNG",
                100,
                0
              );
              const storageRef = FireStorage()
                .ref("post_media")
                .child(item.image.fileName);
              await storageRef.putFile(compressedImage.uri);
              uploadImgUrl = await storageRef.getDownloadURL();
            }

            return {
              id: index,
              name: item.name,
              image: uploadImgUrl,
              description: item.description,
            };
          })
        );
      }

      await AnnouncementCollection.doc(`${postId}`).set(post);
      onComplete({ status: true, message: postId });

      const createdPost = await (
        await AnnouncementCollection.doc(postId).get()
      ).data();
      const postAuthor = await (
        await ProfilesCollection.doc(createdPost?.author).get()
      ).data();
      const populatedPost = {
        ...createPost,
        author: {
          userId: postAuthor?.userId,
          username: postAuthor?.username,
          profileImage: postAuthor?.profileImage,
          verified: postAuthor?.verified ? true : false,
        },
      };
      dispatch({ type: constants.CREATE_POST.SUCCESS, payload: populatedPost });
    } catch (error) {
      dispatch({ type: constants.CREATE_POST.FAIL, error });
      dispatch(setCreatePostFailError(error));
    } finally {
      dispatch({ type: constants.CREATE_POST.COMPLETE });
    }
  };

/**
 * CREATE POST
 */
export const createPost = (postContent) => async (dispatch) => {
  try {
    dispatch({ type: constants.CREATE_POST.REQUEST });
    const { title, description, items, order, isNumberShowInItems, category } =
      postContent;
    const postId = String(Date.now());
    const authorId = FireAuth().currentUser.uid;

    const post = {
      id: postId,
      title,
      order,
      isNumberShowInItems,
      description,
      likes: 0,
      shares: 0,
      comments: [],
      likedUsers: [],
      author: authorId,
      category,
      createdAt: FireStore.FieldValue.serverTimestamp(),
    };

    if (items) {
      post.items = await Promise.all(
        items.map(async (item, index) => {
          let uploadImgUrl = "";

          if (item.image && item.image.uri != "") {
            const compressedImage = await ImageResizer.createResizedImage(
              item.image.uri,
              1000,
              1000,
              "PNG",
              100,
              0
            );
            const storageRef = FireStorage()
              .ref("post_media")
              .child(item.image.fileName);
            await storageRef.putFile(compressedImage.uri);
            uploadImgUrl = await storageRef.getDownloadURL();
          }

          return {
            id: index,
            name: item.name,
            image: uploadImgUrl,
            description: item.description,
          };
        })
      );
    }

    await PostsCollection.doc(`${postId}`).set(post);
    const createdPost = await (await PostsCollection.doc(postId).get()).data();
    const postAuthor = await (
      await ProfilesCollection.doc(createdPost?.author).get()
    ).data();
    const populatedPost = {
      ...createPost,
      author: {
        userId: postAuthor?.userId,
        username: postAuthor?.username,
        profileImage: postAuthor?.profileImage,
        verified: postAuthor?.verified ? true : false,
      },
    };

    dispatch({ type: constants.CREATE_POST.SUCCESS, payload: populatedPost });
  } catch (error) {
    dispatch(setCreatePostFailError(error));
    dispatch({ type: constants.CREATE_POST.FAIL, error });
  } finally {
    dispatch({ type: constants.CREATE_POST.COMPLETE });
  }
};

export const challengePost =
  (postContent, previousPost, onComplete) => async (dispatch) => {
    try {
      dispatch({ type: constants.UPDATED_POST.REQUEST });
      const { items, order, isNumberShowInItems } = postContent;
      const postId = Date.now();
      const authorId = FireAuth().currentUser.uid;

      const challengePostAuthor = await (
        await ProfilesCollection.doc(authorId).get()
      ).data();

      const challengePost = {
        id: postId?.toString(),
        order,
        isNumberShowInItems,
        likes: 0,
        likedUsers: [],
        author: {
          userId: challengePostAuthor?.userId,
          username: challengePostAuthor?.username,
          profileImage: challengePostAuthor?.profileImage,
          verified: challengePostAuthor?.verified ? true : false,
        },

        createdAt: FireStore.FieldValue.serverTimestamp(),
      };

      if (items) {
        challengePost.items = await Promise.all(
          items.map(async (item, index) => {
            let uploadImgUrl = "";

            if (item.image && item.image.uri != "") {
              const compressedImage = await ImageResizer.createResizedImage(
                item.image.uri,
                1000,
                1000,
                "PNG",
                100,
                0
              );
              const storageRef = FireStorage()
                .ref("post_media")
                .child(item.image.fileName);
              await storageRef.putFile(compressedImage.uri);
              uploadImgUrl = await storageRef.getDownloadURL();
            }

            return {
              id: index,
              name: item.name,
              image: uploadImgUrl,
              description: item.description,
            };
          })
        );
      }

      const postObj = previousPost;
      postObj["author"] =
        previousPost.author && previousPost.author.userId
          ? previousPost.author.userId
          : previousPost.author;
      const uploadedChallengePost = {
        ...postObj,
        createdAt: FireStore.FieldValue.serverTimestamp(),
        likeOne: 0,
        likeOneUsers: [],
        challenge: challengePost,
        challengeRequest: CHALLENGE_REQUEST.REQUEST,
      };

      await PostsCollection.doc(previousPost?.id?.toString()).update(
        uploadedChallengePost
      );

      const updatedPost = await (
        await PostsCollection.doc(previousPost?.id?.toString()).get()
      ).data();
      const postAuthorId =
        updatedPost?.author?.userId || updatedPost?.author?.userIds;
      const postAuthor = await (
        await ProfilesCollection.doc(postAuthorId?.toString()).get()
      ).data();
      //start from there
      const populatedPost = {
        ...updatedPost,
        author: {
          userId: postAuthor?.userId,
          username: postAuthor?.username,
          profileImage: postAuthor?.profileImage,
          verified: postAuthor?.verified ? true : false,
        },
      };
      onComplete({ status: true, message: "success" });
      console.log("postAuthor --- > ", JSON.stringify(populatedPost));
      dispatch({
        type: constants.UPDATED_POST.SUCCESS,
        payload: populatedPost,
      });
    } catch (error) {
      console.log("errorCatch ", JSON.stringify(error));
      Alert.alert(error.message);
      dispatch({ type: constants.UPDATED_POST.FAIL, error });
      onComplete({ status: false, message: "fail" });
    } finally {
      console.log("errorCatchfinally ");
      dispatch({ type: constants.UPDATED_POST.COMPLETE });
    }
  };

export const acceptRejectChallenge = async (post, request) => {
  const postObj = post;
  postObj["author"] =
    post.author && post.author.userId ? post.author.userId : post.author;
  const uploadedChallengePost = {
    ...postObj,
    createdAt: FireStore.FieldValue.serverTimestamp(),
    challengeRequest: request,
  };
  console.log("postCreateRequest - ? ", uploadedChallengePost);
  await PostsCollection.doc(post.id).update(uploadedChallengePost);
};

/**
 * UPDATED_POST
 */
export const updatePost = (changes) => async (dispatch) => {
  try {
    dispatch({ type: constants.UPDATED_POST.REQUEST });
    const post = {
      ...changes,
      author: changes?.author?.userId,
    };
    if (post?.items) {
      post.items = await Promise.all(
        post?.items.map(async (item, index) => {
          if (typeof item.image === "object") {
            const storageRef = FireStorage()
              .ref("post_media")
              .child(item.image.fileName);
            await storageRef.putFile(item.image.uri);
            const uploadImgUrl = await storageRef.getDownloadURL();

            return {
              id: index,
              name: item.name,
              image: uploadImgUrl,
              description: item.description,
            };
          } else {
            return {
              id: index,
              name: item.name,
              image: item?.image,
              description: item.description,
            };
          }
        })
      );
    }
    await PostsCollection.doc(changes?.id.toString()).update(post);
    const updatedPost = await (
      await PostsCollection.doc(changes?.id.toString()).get()
    ).data();

    const postAuthor = await (
      await ProfilesCollection.doc(updatedPost?.author).get()
    ).data();
    const populatedPost = {
      ...updatedPost,
      author: {
        userId: postAuthor?.userId,
        username: postAuthor?.username,
        profileImage: postAuthor?.profileImage,
        verified: postAuthor?.verified ? true : false,
      },
    };
    if (populatedPost?.likes >= 2) {
      dispatch(updateDiscoveryPost(populatedPost));
    }
    dispatch({ type: constants.UPDATED_POST.SUCCESS, payload: populatedPost });
  } catch (error) {
    Alert.alert(error.message);
    dispatch({ type: constants.UPDATED_POST.FAIL, error });
  } finally {
    dispatch({ type: constants.UPDATED_POST.COMPLETE });
  }
};

/**
 * DELETE_POST
 */
export const deletePost = (postId) => async (dispatch) => {
  try {
    dispatch({ type: constants.DELETE_POST.REQUEST });
    const currentUserUid = FireAuth().currentUser.uid;
    const currentUserProfile = await (
      await ProfilesCollection.doc(currentUserUid).get()
    ).data();
    const isLiked = currentUserProfile.likedPosts?.find((id) => id === postId);

    await PostsCollection.doc(`${postId}`).delete();
    if (isLiked) {
      await ProfilesCollection.doc(currentUserUid).update({
        likedPosts: currentUserProfile.likedPosts.filter((id) => id !== postId),
      });
      dispatch(deleteDiscoveryPost(postId));
    }

    dispatch({
      type: constants.DELETE_POST.SUCCESS,
      payload: postId,
    });
  } catch (error) {
    Alert.alert(error.message);
    dispatch({ type: constants.DELETE_POST.FAIL, error });
  } finally {
    dispatch({ type: constants.DELETE_POST.COMPLETE });
  }
};

export const deletePostComment = async (postId, commentId) => {
  const currentUserUid = FireAuth().currentUser.uid;
  const filterPost = await (await PostsCollection.doc(postId).get()).data();
  if (filterPost.comments.length > 0) {
    let commentsList = filterPost.comments.filter(
      (item) => item.id !== commentId
    );
    await PostsCollection.doc(postId).update({
      comments: [...commentsList],
    });
  }
};

export const reportAgainstThisPost = async (postID, reportTxt, reportCount) => {
  const currentUserUid = FireAuth().currentUser.uid;
  const reportPostData = {
    reportUserId: currentUserUid,
    reportMessage: reportTxt,
  };
  if (reportCount == 1) reportPostData["reprtPostAuthorID"] = postID;
  else reportPostData["reportPostId"] = postID;

  const reportPostDoc = await ReportPostCollection.doc().set(reportPostData);
  console.log("reportPostDoc -- > ", reportPostDoc);
};

export const blockUsers = async (blockUserId) => {
  const currentUserUid = FireAuth().currentUser.uid;
  const alreadyBlockUsersCollection = await BlockUsersCollection.where(
    "blockedBy",
    "==",
    currentUserUid
  ).get();

  const alreadyBlockUsersId = alreadyBlockUsersCollection?.docs[0]?._data;
  let mBlockUserIds = [];
  if (alreadyBlockUsersId?.blockUserId?.length > 0) {
    mBlockUserIds = alreadyBlockUsersId?.blockUserId;
    let findedIndexValue = mBlockUserIds.findIndex(
      (value) => value == blockUserId
    );
    if (findedIndexValue == -1) {
      mBlockUserIds.push(blockUserId);
      await BlockUsersCollection.doc(currentUserUid).update({
        blockUserId: mBlockUserIds,
      });
    }
    // else {
    //   mBlockUserIds.splice(findedIndexValue, 1);
    // }
    // await BlockUsersCollection.doc(currentUserUid).update({
    //   blockUserId: mBlockUserIds,
    // });
  } else {
    mBlockUserIds.push(blockUserId);
    const blockUsersData = {
      blockedBy: currentUserUid,
      blockUserId: mBlockUserIds,
    };
    await BlockUsersCollection.doc(currentUserUid).set(blockUsersData);
  }
};

export const likeUnlikePostComments = async (postId, commentId) => {
  const currentUserUid = FireAuth().currentUser.uid;
  const filterPost = await (await PostsCollection.doc(postId).get()).data();
  if (filterPost.comments.length > 0) {
    let commentsList = filterPost.comments;
    const commentForUpdate = commentsList.find((item) => item.id == commentId);
    let commentListIndex = commentsList.indexOf(commentForUpdate);
    if (commentForUpdate.likedUsers.find((id) => id == currentUserUid)) {
      const likeUserList = commentForUpdate.likedUsers.filter(
        (item) => item !== currentUserUid
      );
      commentForUpdate.likedUsers = likeUserList;
      commentsList[commentListIndex] = commentForUpdate;

      await PostsCollection.doc(postId).update({
        comments: [...commentsList],
      });
    } else {
      const likeUserList = commentForUpdate.likedUsers;
      likeUserList.push(currentUserUid);
      commentForUpdate.likedUsers = likeUserList;
      commentsList[commentListIndex] = commentForUpdate;

      await PostsCollection.doc(postId).update({
        comments: [...commentsList],
      });
    }
  }
};

//Edit Comment

export const editCommentOfMine = async (commentData, postId) => {
  const currentUserUid = FireAuth().currentUser.uid;
  try {
    const filterPost = await (await PostsCollection.doc(postId).get()).data();
    let commentsList = filterPost.comments;
    const updatedObj = filterPost.comments.find(
      (obj) => obj.id == commentData.id
    );
    let commentListIndex = filterPost.comments.indexOf(updatedObj);
    commentsList[commentListIndex] = commentData;
    await PostsCollection.doc(postId).update({
      comments: [...commentsList],
    });
    console.log("updatedObj Successfully - > ");
    // if (filterPost.comments.find((obj) => obj.id == commentData.id)) {
    //   const likeUserList = filterPost.likedUsers.filter((item) => item !== currentUserUid)
    //   const likeCount = filterPost.likes - 1
    //   await PostsCollection.doc(postId).update({
    //     likedUsers: [
    //       ...likeUserList
    //     ],
    //     likes: likeCount
    //   })
    // } else {
    //   console.log("Added 000 > ")
    //   const likeUserList = filterPost.likedUsers
    //   likeUserList.push(currentUserUid)
    //   const likeCount = filterPost.likes + 1
    //   await PostsCollection.doc(postId).update({
    //     likedUsers: [
    //       ...likeUserList
    //     ],
    //     likes: likeCount
    //   })
    // }
  } catch (error) {
    console.log("printError - > ", error, error.message);
  }
};

export const addReplyInComment = async (commentData, postId) => {
  const currentUserUid = FireAuth().currentUser.uid;
  try {
    const filterPost = await (await PostsCollection.doc(postId).get()).data();
    let commentsList = filterPost.comments;
    const updatedObj = filterPost.comments.find(
      (obj) => obj.id == commentData.id
    );
    let commentListIndex = filterPost.comments.indexOf(updatedObj);
    commentsList[commentListIndex] = commentData;
    await PostsCollection.doc(postId).update({
      comments: [...commentsList],
    });
    console.log("updatedObj Successfully - > ");
    // if (filterPost.comments.find((obj) => obj.id == commentData.id)) {
    //   const likeUserList = filterPost.likedUsers.filter((item) => item !== currentUserUid)
    //   const likeCount = filterPost.likes - 1
    //   await PostsCollection.doc(postId).update({
    //     likedUsers: [
    //       ...likeUserList
    //     ],
    //     likes: likeCount
    //   })
    // } else {
    //   console.log("Added 000 > ")
    //   const likeUserList = filterPost.likedUsers
    //   likeUserList.push(currentUserUid)
    //   const likeCount = filterPost.likes + 1
    //   await PostsCollection.doc(postId).update({
    //     likedUsers: [
    //       ...likeUserList
    //     ],
    //     likes: likeCount
    //   })
    // }
  } catch (error) {
    console.log("printError - > ", error, error.message);
  }
};

export const likeUnlikeUserPosts = async (postId, onComplete) => {
  const currentUserUid = FireAuth().currentUser.uid;
  let filterPost;

  try {
    await firestore()
      .collection("posts")
      .doc(postId)
      .get()
      .then((snapDoc) => {
        if (snapDoc?._data) {
          filterPost = snapDoc?._data;
        }
      });
    if (filterPost.likedUsers.find((id) => id == currentUserUid)) {
      const likeUserList = filterPost.likedUsers.filter(
        (item) => item !== currentUserUid
      );
      const likeCount = filterPost.likes - 1;
      await PostsCollection.doc(postId).update({
        likedUsers: [...likeUserList],
        likes: likeCount,
      });
    } else {
      const likeUserList = filterPost.likedUsers;
      likeUserList.push(currentUserUid);
      const likeCount = filterPost.likes + 1;
      await PostsCollection.doc(postId).update({
        likedUsers: [...likeUserList],
        likes: likeCount,
      });
    }
    onComplete({ status: true, message: "success!" });
  } catch (error) {
    onComplete({ status: false, message: "Fail!" });

    console.log("printError - > ", error, error.message);
  }
};

export const challengePostLikeUnlike = async (postId, isChallengePost) => {
  const currentUserUid = FireAuth().currentUser.uid;
  try {
    const filterPost = await (
      await PostsCollection.doc(postId.toString()).get()
    ).data();

    console.log("shoePost - > ", postId);
    if (isChallengePost) {
      if (
        filterPost.challenge &&
        filterPost.challenge.likedUsers.find((id) => id == currentUserUid)
      ) {
        const likeUserList = filterPost.challenge.likedUsers.filter(
          (item) => item !== currentUserUid
        );
        const likeCount = filterPost.challenge.likes - 1;
        const challengeObj = filterPost.challenge;
        challengeObj["likedUsers"] = [...likeUserList];
        challengeObj["likes"] = likeCount;
        await PostsCollection.doc(postId.toString()).update({
          challenge: challengeObj,
        });
      } else {
        console.log("Added 000 > ");
        const likeUserList = filterPost.challenge.likedUsers;
        likeUserList.push(currentUserUid);
        const likeCount = filterPost.challenge.likes + 1;
        const challengeObj = filterPost.challenge;
        challengeObj["likedUsers"] = [...likeUserList];
        challengeObj["likes"] = likeCount;
        await PostsCollection.doc(postId.toString()).update({
          challenge: challengeObj,
        });
        console.log("DONE > ");
      }
    } else {
      if (filterPost.likeOneUsers.find((id) => id == currentUserUid)) {
        const likeUserList = filterPost.likeOneUsers.filter(
          (item) => item !== currentUserUid
        );
        const likeCount = filterPost.likeOne - 1;
        await PostsCollection.doc(postId.toString()).update({
          likeOneUsers: [...likeUserList],
          likeOne: likeCount,
        });
      } else {
        console.log("Added 000 > ");
        const likeUserList = filterPost.likeOneUsers;
        likeUserList.push(currentUserUid);
        const likeCount = filterPost.likeOne + 1;
        await PostsCollection.doc(postId.toString()).update({
          likeOneUsers: [...likeUserList],
          likeOne: likeCount,
        });
        console.log("DONE > ");
      }
    }
  } catch (error) {
    console.log("printError - > ", error, error.message);
  }
};

export const getProfileDataByID = async (userId) => {
  try {
    const usersProfile = await (
      await ProfilesCollection.doc(userId).get()
    ).data();
    return usersProfile;
  } catch (error) {
    console.log("printError - > ", error);
  }
};
/**
 * POST_LIKE
 */
export const likePost = (postId) => async (dispatch) => {
  try {
    dispatch({ type: constants.POST_LIKE.REQUEST });
    const currentUserUid = FireAuth().currentUser.uid;
    const userProfile = await (
      await ProfilesCollection.doc(currentUserUid).get()
    ).data();

    // CHECKING IF USER ALREADY LIKED THE POST AND UPDATING USER PROFILE DOCUMENT
    if (
      !userProfile.likedPosts.find(
        (id) => id?.toString() === postId?.toString()
      )
    ) {
      await ProfilesCollection.doc(currentUserUid).update({
        likedPosts: [...userProfile.likedPosts, postId?.toString()],
      });
    }

    const updatedUserProfile = await (
      await ProfilesCollection.doc(currentUserUid).get()
    ).data();

    // IF USER PROFILE LIKED POSTS ARRAY UPDATED THEN UPDATED POSTS LIKE COUNT
    if (
      updatedUserProfile.likedPosts.find(
        (id) => id?.toString() === postId?.toString()
      )
    ) {
      const likedPostDoc = await (
        await PostsCollection.doc(postId?.toString()).get()
      ).data();
      await PostsCollection.doc(postId?.toString()).update({
        likes: likedPostDoc.likes + 1,
      });
    }
    // Populate Author
    const updatedPostDoc = await (
      await PostsCollection.doc(postId?.toString()).get()
    ).data();
    const postAuthor = await (
      await ProfilesCollection.doc(updatedPostDoc?.author).get()
    ).data();
    const populatedPost = {
      ...updatedPostDoc,
      author: {
        userId: postAuthor?.userId,
        username: postAuthor?.username,
        profileImage: postAuthor?.profileImage,
        verified: postAuthor?.verified ? true : false,
      },
    };

    dispatch(setProfile(updatedUserProfile));

    if (populatedPost?.likes >= 2) {
      dispatch(updateDiscoveryPost(populatedPost));
    }

    dispatch({ type: constants.POST_LIKE.SUCCESS, payload: populatedPost });
  } catch (error) {
    dispatch({ type: constants.POST_LIKE.FAIL, error });
  } finally {
    dispatch({ type: constants.POST_LIKE.COMPLETE });
  }
};

/**
 * POST_DISLIKE
 */
export const dislikePost = (postId) => async (dispatch) => {
  try {
    dispatch({ type: constants.POST_DISLIKE.REQUEST });
    const currentUserUid = FireAuth().currentUser.uid;
    const userProfile = await (
      await ProfilesCollection.doc(currentUserUid).get()
    ).data();

    // CHECKING IF USER ALREADY LIKED THE POST AND UPDATING USER PROFILE DOCUMENT
    if (userProfile.likedPosts.find((id) => id === postId)) {
      await ProfilesCollection.doc(currentUserUid).update({
        likedPosts: userProfile?.likedPosts.filter((id) => id !== postId),
      });
    }
    const updatedUserProfile = await (
      await ProfilesCollection.doc(currentUserUid).get()
    ).data();

    // IF USER PROFILE LIKED POSTS ARRAY UPDATED THEN UPDATED POSTS LIKE COUNT
    if (!updatedUserProfile.likedPosts.find((id) => id === postId)) {
      const likedPostDoc = await (
        await PostsCollection.doc(postId).get()
      ).data();
      await PostsCollection.doc(postId).update({
        likes: likedPostDoc.likes > 0 ? likedPostDoc.likes - 1 : 0,
      });
    }
    // Populate Author
    const updatedPostDoc = await (
      await PostsCollection.doc(postId).get()
    ).data();
    const postAuthor = await (
      await ProfilesCollection.doc(updatedPostDoc.author).get()
    ).data();
    const populatedPost = {
      ...updatedPostDoc,
      author: {
        userId: postAuthor?.userId,
        username: postAuthor?.username,
        profileImage: postAuthor?.profileImage,
        verified: postAuthor?.verified ? true : false,
      },
    };

    dispatch(setProfile(updatedUserProfile));

    if (populatedPost?.likes >= 2) {
      dispatch(updateDiscoveryPost(populatedPost));
    } else {
      dispatch(deleteDiscoveryPost(postId));
    }

    dispatch({ type: constants.POST_DISLIKE.SUCCESS, payload: populatedPost });
  } catch (error) {
    dispatch({ type: constants.POST_DISLIKE.FAIL, error });
  } finally {
    dispatch({ type: constants.POST_DISLIKE.COMPLETE });
  }
};

/**
 * COMMENT_POST
 */
export const postComment = (commentData, onComplete) => async (dispatch) => {
  try {
    dispatch({ type: constants.COMMENT_POST.REQUEST });

    const post = await (
      await PostsCollection.doc(commentData.postId).get()
    ).data();

    await PostsCollection.doc(commentData.postId).update({
      comments: [...post?.comments, commentData],
    });

    // Populate Author
    const updatedPostDoc = await (
      await PostsCollection.doc(commentData.postId).get()
    ).data();
    const postAuthor = await (
      await ProfilesCollection.doc(updatedPostDoc.author).get()
    ).data();
    const populatedPost = {
      ...updatedPostDoc,
      author: {
        userId: postAuthor?.userId,
        username: postAuthor?.username,
        profileImage: postAuthor?.profileImage,
        verified: postAuthor?.verified ? true : false,
      },
    };

    if (populatedPost?.likes >= 2) {
      dispatch(updateDiscoveryPost(populatedPost));
    }
    onComplete({ status: true, message: "success" });
    dispatch({ type: constants.COMMENT_POST.SUCCESS, payload: populatedPost });
  } catch (error) {
    onComplete({ status: false, message: "fail" });
    dispatch({ type: constants.COMMENT_POST.FAIL, error });
  } finally {
    dispatch({ type: constants.COMMENT_POST.COMPLETE });
  }
};
